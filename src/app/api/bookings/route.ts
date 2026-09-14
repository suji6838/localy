import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { appendRecord } from "@/lib/store";
import { matchPartners } from "@/lib/matching";
import type { BookingRequest } from "@/lib/bookings";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const {
    courseSlug,
    serviceType,
    neighborhood,
    preferredDate,
    preferredTime,
    guestName,
    phone,
    email,
    notes,
    agreeTerms,
    agreePrivacy,
  } = body;

  if (
    typeof serviceType !== "string" || !serviceType.trim() ||
    typeof neighborhood !== "string" || !neighborhood.trim() ||
    typeof preferredDate !== "string" || !preferredDate.trim() ||
    typeof preferredTime !== "string" || !preferredTime.trim() ||
    typeof guestName !== "string" || !guestName.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해 주세요." }, { status: 400 });
  }

  if (!agreeTerms || !agreePrivacy) {
    return NextResponse.json(
      { error: "이용약관과 개인정보 수집·이용에 동의해 주세요." },
      { status: 400 },
    );
  }

  const trimmedServiceType = serviceType.trim();
  const trimmedNeighborhood = neighborhood.trim();
  const matches = await matchPartners(trimmedServiceType, trimmedNeighborhood);

  const booking: BookingRequest = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    courseSlug: typeof courseSlug === "string" && courseSlug.trim() ? courseSlug.trim() : undefined,
    serviceType: trimmedServiceType,
    neighborhood: trimmedNeighborhood,
    preferredDate: preferredDate.trim(),
    preferredTime: preferredTime.trim(),
    guestName: guestName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
    matchedPartnerIds: matches.map((m) => m.id),
  };

  await appendRecord("bookings", booking);

  return NextResponse.json({ ok: true, id: booking.id, matches });
}
