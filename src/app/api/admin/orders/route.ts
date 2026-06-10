import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, trackingNumber, trackingCarrier } = await req.json();
    const data: any = { status };
    if (trackingNumber) data.trackingNumber = trackingNumber;
    if (trackingCarrier) data.trackingCarrier = trackingCarrier;
    if (status === "paid") data.paidAt = new Date();
    if (status === "shipped") data.shippedAt = new Date();
    if (status === "delivered") data.deliveredAt = new Date();
    if (status === "cancelled") data.cancelledAt = new Date();

    const order = await prisma.order.update({ where: { id }, data });
    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
