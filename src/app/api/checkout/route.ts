import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      shipToName,
      shipToStreet,
      shipToStreet2,
      shipToCity,
      shipToState,
      shipToZip,
      shipToCountry,
      shipToPhone,
      paymentMethod,
      items,
      currency,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    let totalWeight = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      const price = product.priceUsd || product.price * 0.14;
      subtotal += price * item.quantity;
      totalWeight += product.weight * item.quantity;
    }

    const shippingCost = calculateShipping(totalWeight, shipToCountry || "US");
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // Simplified 8% tax
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        email,
        shipToName,
        shipToStreet,
        shipToStreet2: shipToStreet2 || null,
        shipToCity,
        shipToState: shipToState || null,
        shipToZip,
        shipToCountry: shipToCountry || "US",
        shipToPhone: shipToPhone || null,
        paymentMethod: paymentMethod || "card",
        paymentStatus: "pending",
        status: "pending",
        subtotal,
        shippingCost,
        tax,
        total,
        currency: currency || "USD",
        items: {
          create: await Promise.all(
            items.map(async (item: any) => {
              const product = await prisma.product.findUnique({
                where: { id: item.productId },
              });
              const price = product!.priceUsd || product!.price * 0.14;
              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: price,
                totalPrice: price * item.quantity,
                variantName: item.variantName || null,
              };
            })
          ),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
