import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email, shipToName, shipToStreet, shipToStreet2,
      shipToCity, shipToState, shipToZip, shipToCountry,
      shipToPhone, items,
    } = body;

    const payoneerApiKey = process.env.PAYONEER_API_KEY;
    const payoneerMerchantId = process.env.PAYONEER_MERCHANT_ID;
    const payoneerMode = process.env.PAYONEER_MODE || "sandbox";

    if (!payoneerApiKey || payoneerApiKey === "placeholder") {
      return NextResponse.json({ error: "Payoneer not configured" }, { status: 503 });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    let totalWeight = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = product.priceUsd || product.price * 0.14;
      subtotal += price * item.quantity;
      totalWeight += (product.weight || 0) * item.quantity;
    }

    const shippingCost = calculateShipping(totalWeight, shipToCountry || "US");
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        email, shipToName, shipToStreet,
        shipToStreet2: shipToStreet2 || null,
        shipToCity, shipToState: shipToState || null,
        shipToZip, shipToCountry: shipToCountry || "US",
        shipToPhone: shipToPhone || null,
        paymentMethod: "payoneer", paymentStatus: "pending",
        status: "pending", subtotal, shippingCost, tax, total, currency: "USD",
        items: {
          create: await Promise.all(items.map(async (item: any) => {
            const p = await prisma.product.findUnique({ where: { id: item.productId } });
            const price = p!.priceUsd || p!.price * 0.14;
            return {
              productId: item.productId, quantity: item.quantity,
              unitPrice: price, totalPrice: price * item.quantity,
              variantName: item.variantName || null,
            };
          })),
        },
      },
    });

    // Payoneer Checkout API
    const apiBase = payoneerMode === "live"
      ? "https://api.payoneer.com/v4/programs"
      : "https://api.sandbox.payoneer.com/v4/programs";

    const checkoutRes = await fetch(`${apiBase}/${payoneerMerchantId}/checkouts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${payoneerApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total.toFixed(2),
        currency: "USD",
        country: shipToCountry || "US",
        customer: {
          email,
          name: shipToName,
          address: {
            line1: shipToStreet,
            line2: shipToStreet2 || "",
            city: shipToCity,
            state: shipToState || "",
            zip: shipToZip,
            country: shipToCountry || "US",
          },
        },
        orderId: order.orderNumber,
        redirectUrl: `${req.nextUrl.origin}/en/checkout/success?order=${order.orderNumber}`,
        cancelUrl: `${req.nextUrl.origin}/en/checkout/cancel`,
      }),
    });

    if (!checkoutRes.ok) {
      const err = await checkoutRes.text();
      throw new Error(`Payoneer checkout failed: ${err}`);
    }

    const checkoutData = await checkoutRes.json();
    const redirectUrl = checkoutData.links?.find((l: any) => l.rel === "payment")?.href
      || checkoutData.redirectUrl;

    // Update order with Payoneer checkout ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: checkoutData.id },
    });

    return NextResponse.json({ url: redirectUrl, orderNumber: order.orderNumber });
  } catch (error: any) {
    console.error("Payoneer checkout error:", error);
    if (error.message === "Payoneer not configured") {
      return NextResponse.json({ error: "Payment not configured yet" }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
