import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function GET() {
  const session = await verifyAdminToken();
  return NextResponse.json({ authenticated: !!session, user: session || null });
}
