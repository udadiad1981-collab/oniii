import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/utils";

// Dynamically import Stripe to avoid build issues when key is placeholder
async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") {
    throw new Error("Stripe not configured");
  }
  const { default: Stripe } = await import("stripe");
  return new Stripe(key, { apiVersion: "2025-06-30.acacia" as any });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
      successUrl,
      cancelUrl,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    let totalWeight = 0;
    const lineItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: true },
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

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.nameEn || product.name,
            images: product.images?.[0]?.url
              ? [product.images[0].url]
              : undefined,
          },
          unit_amount: Math.round(price * 100), // cents
        },
        quantity: item.quantity,
      });
    }

    const shippingCost = calculateShipping(totalWeight, shipToCountry || "US");
    const tax = Math.round(subtotal * 0.08 * 100) / 100;

    // Create order in DB first (status: pending_payment)
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
        paymentMethod: "stripe",
        paymentStatus: "pending",
        status: "pending",
        subtotal,
        shippingCost,
        tax,
        total: Math.round((subtotal + shippingCost + tax) * 100) / 100,
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

    // Create Stripe Checkout Session
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shippingCost * 100), currency: "usd" },
            display_name: `International Shipping to ${shipToCountry}`,
            delivery_estimate: {
              minimum: { unit: "business_day", value: 7 },
              maximum: { unit: "business_day", value: 21 },
            },
          },
        },
      ],
      line_items: lineItems,
      success_url: successUrl || `${req.nextUrl.origin}/en/checkout/success?order=${order.orderNumber}`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/en/checkout/cancel`,
    });

    // Link Stripe session to order
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: session.id },
    });

    return NextResponse.json({ url: session.url, orderNumber: order.orderNumber });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    if (error.message === "Stripe not configured") {
      return NextResponse.json({ error: "Payment not configured yet" }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
