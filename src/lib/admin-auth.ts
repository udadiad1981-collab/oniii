import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "oniii-admin-jwt-secret-key-2024");
const COOKIE_NAME = "oniii_admin_token";

export async function createAdminToken(email: string, role: string): Promise<string> {
  return new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyAdminToken(): Promise<{ email: string; role: string } | null> {
  try {
    const ck = await cookies();
    const token = ck.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24h
  };
}
