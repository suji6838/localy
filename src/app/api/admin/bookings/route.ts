import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listBookings } from "@/lib/supabase/bookings";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const records = await listBookings();
  return NextResponse.json({ records });
}
