import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listRecords, replaceRecords } from "@/lib/store";
import type { PartnerApplication, PartnerStatus } from "@/lib/partners";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const records = await listRecords<PartnerApplication>("experts");
  return NextResponse.json({ records: records.reverse() });
}

const VALID_STATUS: PartnerStatus[] = ["pending", "approved", "rejected"];

export async function PATCH(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { id, status } = body ?? {};
  if (typeof id !== "string" || typeof status !== "string" || !VALID_STATUS.includes(status as PartnerStatus)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const records = await listRecords<PartnerApplication>("experts");
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "대상을 찾을 수 없습니다." }, { status: 404 });
  }
  records[idx] = { ...records[idx], status: status as PartnerStatus };
  await replaceRecords("experts", records);

  return NextResponse.json({ ok: true });
}
