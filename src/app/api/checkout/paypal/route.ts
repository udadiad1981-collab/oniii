import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/utils";

interface PayPalTokenResponse {
  access_token: string;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || "sandbox";

  if (!clientId || !clientSecret || clientId === "placeholder") {
    throw new Error("PayPal not configured");
  }

  const base = mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("PayPal auth failed");
  const data: PayPalTokenResponse = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...rest } = body;

    if (!action) {
      return NextResponse.json({ error: "action required" }, { status: 400 });
    }

    switch (action) {
      case "create_order":
        return createOrder(rest, req);
      case "capture_order":
        return captureOrder(rest);
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("PayPal error:", error);
    if (error.message === "PayPal not configured") {
      return NextResponse.json({ error: "Payment not configured yet" }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function createOrder(body: any, req: NextRequest) {
  const {
    email,
    shipToName,
    shipToStreet,
    shipToStreet2,
    shipToCity,
    shipToState,
    shipToZip,
    shipToCountry,
    shipToPhone,
    items,
  } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  // Create internal order
  let subtotal = 0;
  let totalWeight = 0;

  const paypalItems = [];
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} not found` },
        { status: 400 }
      );
    }
    const price = product.priceUsd || product.price * 0.14;
    subtotal += price * item.quantity;
    totalWeight += (product.weight || 0) * item.quantity;

    paypalItems.push({
      name: (product.nameEn || product.name).slice(0, 127),
      quantity: String(item.quantity),
      unit_amount: { currency_code: "USD", value: price.toFixed(2) },
    });
  }

  const shippingCost = calculateShipping(totalWeight, shipToCountry || "US");
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  // Create order in DB
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      email,
      shipToName,
      shipToStreet,
      shipToStreet2: shipToStreet2 || null,
      shipToCity,
      shipToState: shipToState || null,
      shipToZip,
      shipToCountry: shipToCountry || "US",
      shipToPhone: shipToPhone || null,
      paymentMethod: "paypal",
      paymentStatus: "pending",
      status: "pending",
      subtotal,
      shippingCost,
      tax,
      total,
      currency: "USD",
      items: {
        create: await Promise.all(
          items.map(async (item: any) => {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
            });
            const price = product!.priceUsd || product!.price * 0.14;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: price,
              totalPrice: price * item.quantity,
              variantName: item.variantName || null,
            };
          })
        ),
      },
    },
  });

  // Create PayPal order
  const accessToken = await getPayPalAccessToken();
  const mode = process.env.PAYPAL_MODE || "sandbox";
  const base = mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

  const paypalRes = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": order.id, // Idempotency key
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          custom_id: order.id,
          description: `Order ${order.orderNumber}`,
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: subtotal.toFixed(2) },
              shipping: { currency_code: "USD", value: shippingCost.toFixed(2) },
              tax_total: { currency_code: "USD", value: tax.toFixed(2) },
            },
          },
          items: paypalItems,
        },
      ],
    }),
  });

  if (!paypalRes.ok) {
    const err = await paypalRes.text();
    throw new Error(`PayPal order create failed: ${err}`);
  }

  const paypalOrder = await paypalRes.json();

  // Link PayPal order ID
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: paypalOrder.id },
  });

  return NextResponse.json({
    id: paypalOrder.id,
    orderNumber: order.orderNumber,
  });
}

async function captureOrder(body: any) {
  const { paypalOrderId } = body;
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
  }

  const accessToken = await getPayPalAccessToken();
  const mode = process.env.PAYPAL_MODE || "sandbox";
  const base = mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

  const res = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  const captureData = await res.json();

  // Update order status
  const order = await prisma.order.findFirst({
    where: { paymentId: paypalOrderId },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        paidAt: new Date(),
      },
    });

    // Decrement stock
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });
    if (fullOrder) {
      for (const item of fullOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }

  return NextResponse.json({
    status: captureData.status,
    orderNumber: order?.orderNumber,
  });
}
