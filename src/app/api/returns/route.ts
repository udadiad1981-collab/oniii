import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, email, reason, description } = await req.json();
    if (!orderNumber || !email || !reason) {
      return NextResponse.json({ error: "订单号、邮箱和退换原因为必填" }, { status: 400 });
    }
    // Verify order exists
    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      return NextResponse.json({ error: "未找到该订单，请检查订单号是否正确" }, { status: 404 });
    }
    const returnReq = await prisma.returnRequest.create({
      data: { orderNumber, email, reason, description: description || null },
    });
    return NextResponse.json({ success: true, returnRequest: returnReq });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
