import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const returns = await prisma.returnRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ returns });
}

export async function PATCH(req: NextRequest) {
  const { id, status, adminNote } = await req.json();
  const data: any = {};
  if (status) data.status = status;
  if (adminNote !== undefined) data.adminNote = adminNote;
  const updated = await prisma.returnRequest.update({ where: { id }, data });
  return NextResponse.json({ success: true, returnRequest: updated });
}
