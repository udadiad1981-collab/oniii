import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

// GET - list all products (admin)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, nameEn, description, descriptionEn, price, priceUsd,
      compareAt, costPrice, sku, weight, stock, status, featured,
      material, dimensions, categoryId, images,
    } = body;

    if (!name || !nameEn || !price) {
      return NextResponse.json({ error: "商品名称和价格为必填" }, { status: 400 });
    }

    const slug = slugify(nameEn || name);

    const product = await prisma.product.create({
      data: {
        name,
        nameEn: nameEn || name,
        slug,
        description: description || "",
        descriptionEn: descriptionEn || description || "",
        price: parseFloat(price),
        priceUsd: priceUsd ? parseFloat(priceUsd) : null,
        compareAt: compareAt ? parseFloat(compareAt) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku: sku || null,
        weight: weight ? parseFloat(weight) : 500,
        stock: stock ? parseInt(stock) : 0,
        status: status || "draft",
        featured: featured || false,
        material: material || null,
        dimensions: dimensions || null,
        categoryId: categoryId || (await getDefaultCategoryId()),
        images: images?.length
          ? { create: images.map((img: any, i: number) => ({
              url: img.url,
              alt: img.alt || nameEn,
              sortOrder: i,
            })) }
          : undefined,
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - update product status
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getDefaultCategoryId(): Promise<string> {
  let cat = await prisma.category.findFirst();
  if (!cat) {
    cat = await prisma.category.create({
      data: { name: "综合", nameEn: "General", slug: "general" },
    });
  }
  return cat.id;
}
