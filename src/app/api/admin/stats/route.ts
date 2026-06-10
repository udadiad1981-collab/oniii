import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [products, orders, users] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
    ]);

    const revenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["cancelled", "refunded"] } },
    });

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      stats: {
        products,
        orders,
        users,
        revenue: revenueResult._sum.total || 0,
      },
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
