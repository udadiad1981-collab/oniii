import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, nameEn, slug } = await req.json();
    if (!name || !nameEn) {
      return NextResponse.json({ error: "分类名称为必填" }, { status: 400 });
    }
    const category = await prisma.category.create({
      data: { name, nameEn, slug: slug || nameEn.toLowerCase().replace(/\s+/g, "-") },
    });
    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
