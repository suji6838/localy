import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "locy_admin";

function expectedToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHash("sha256").update(secret).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  return Boolean(secret) && password === secret;
}

export function sessionToken(): string | null {
  return expectedToken();
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === token;
}
