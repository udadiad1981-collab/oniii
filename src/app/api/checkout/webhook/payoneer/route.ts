import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.eventType || body.type;

    if (eventType === "CHECKOUT_COMPLETED" || eventType === "payment.completed") {
      const orderNumber = body.orderId || body.orderNumber;
      if (orderNumber) {
        await prisma.order.updateMany({
          where: { orderNumber },
          data: { paymentStatus: "paid", paidAt: new Date() },
        });
        const order = await prisma.order.findFirst({
          where: { orderNumber }, include: { items: true },
        });
        if (order) {
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      }
    }

    if (eventType === "CHECKOUT_FAILED" || eventType === "payment.failed") {
      const orderNumber = body.orderId || body.orderNumber;
      if (orderNumber) {
        await prisma.order.updateMany({
          where: { orderNumber },
          data: { paymentStatus: "failed" },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Payoneer webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
