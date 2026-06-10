import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, orderNumber } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "姓名、邮箱和留言内容为必填" }, { status: 400 });
    }
    const contact = await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message, orderNumber: orderNumber || null },
    });
    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
