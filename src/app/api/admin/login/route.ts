import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, sessionToken, verifyPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const token = sessionToken();
  if (!token) {
    return NextResponse.json({ error: "관리자 설정이 완료되지 않았습니다." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
