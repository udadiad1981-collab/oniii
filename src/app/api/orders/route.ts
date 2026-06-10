import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const orderNumber = url.searchParams.get("orderNumber");

    const where: any = {};
    if (email) where.email = email;
    if (orderNumber) where.orderNumber = orderNumber;

    if (!email && !orderNumber) {
      return NextResponse.json({ error: "请提供邮箱或订单号" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
