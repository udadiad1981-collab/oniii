import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ messages });
}

export async function PATCH(req: NextRequest) {
  const { id, isRead } = await req.json();
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  return NextResponse.json({ success: true });
}
