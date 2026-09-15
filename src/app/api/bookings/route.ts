import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { appendRecord } from "@/lib/store";
import { isApprovedPartner } from "@/lib/matching";
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
    selectedPartnerId,
    shownPartnerIds,
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

  // 후보 업체가 있었다면 반드시 그중 하나를 선택해야 하고, 그 선택은 서버에서 다시 검증한다.
  const hadCandidates = Array.isArray(shownPartnerIds) && shownPartnerIds.length > 0;
  let trimmedPartnerId: string | undefined;
  if (typeof selectedPartnerId === "string" && selectedPartnerId.trim()) {
    trimmedPartnerId = selectedPartnerId.trim();
    if (!(await isApprovedPartner(trimmedPartnerId))) {
      return NextResponse.json({ error: "선택한 업체를 연결할 수 없어요. 다시 선택해 주세요." }, { status: 400 });
    }
  } else if (hadCandidates) {
    return NextResponse.json({ error: "연결할 업체를 선택해 주세요." }, { status: 400 });
  }

  const booking: BookingRequest = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    courseSlug: typeof courseSlug === "string" && courseSlug.trim() ? courseSlug.trim() : undefined,
    serviceType: serviceType.trim(),
    neighborhood: neighborhood.trim(),
    preferredDate: preferredDate.trim(),
    preferredTime: preferredTime.trim(),
    guestName: guestName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
    matchedPartnerIds: Array.isArray(shownPartnerIds)
      ? shownPartnerIds.filter((id): id is string => typeof id === "string")
      : undefined,
    selectedPartnerId: trimmedPartnerId,
  };

  await appendRecord("bookings", booking);

  return NextResponse.json({ ok: true, id: booking.id });
}
