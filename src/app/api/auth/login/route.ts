import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check user exists and is customer role (not admin)
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email or password incorrect" },
        { status: 401 }
      );
    }

    if (user.role !== "customer") {
      return NextResponse.json(
        { error: "Please use admin login portal" },
        { status: 403 }
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Email or password incorrect" },
        { status: 401 }
      );
    }

    // Create customer session (simplified for now - can use jwt later)
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    // Simple session storage in cookie (base64 encoded for demo)
    const sessionData = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64');

    res.cookies.set("customer_session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
