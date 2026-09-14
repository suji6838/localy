import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listRecords } from "@/lib/store";
import type { BookingRequest } from "@/lib/bookings";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const records = await listRecords<BookingRequest>("bookings");
  records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ records });
}
