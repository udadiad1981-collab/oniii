import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createAdminToken, adminCookieOptions } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码必填" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }

    const token = await createAdminToken(user.email, user.role);
    const res = NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
    res.cookies.set(adminCookieOptions().name, token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
