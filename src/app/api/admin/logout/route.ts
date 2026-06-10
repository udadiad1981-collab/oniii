import { NextResponse } from "next/server";
import { adminCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(adminCookieOptions().name, "", { ...adminCookieOptions(), maxAge: 0 });
  return res;
}
