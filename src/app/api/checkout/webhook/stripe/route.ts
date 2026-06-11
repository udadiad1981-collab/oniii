import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!key || key === "sk_test_placeholder" || !webhookSecret) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(key, { apiVersion: "2025-06-30.acacia" as any });

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const rawBody = await req.text();
    let event: any;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "paid",
              paymentId: session.payment_intent as string,
              paidAt: new Date(),
            },
          });

          // Decrement stock
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
          });
          if (order) {
            for (const item of order.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }

          // TODO: Send confirmation email
        }
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "failed" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
