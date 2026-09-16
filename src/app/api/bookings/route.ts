import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { insertBooking } from "@/lib/supabase/bookings";
import { categoryLabel, getCourseBySlug, isValidCourseDate, neighborhoodLabel } from "@/lib/courses";
import type { BookingRequest } from "@/lib/bookings";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { courseSlug, preferredDate, preferredTime, guestName, phone, email, notes, agreeTerms, agreePrivacy } = body;

  if (typeof courseSlug !== "string" || !courseSlug.trim()) {
    return NextResponse.json({ error: "코스를 선택해 주세요." }, { status: 400 });
  }
  const course = getCourseBySlug(courseSlug.trim());
  if (!course) {
    return NextResponse.json({ error: "존재하지 않는 코스예요." }, { status: 400 });
  }

  if (
    typeof preferredDate !== "string" || !preferredDate.trim() ||
    typeof preferredTime !== "string" || !preferredTime.trim() ||
    typeof guestName !== "string" || !guestName.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해 주세요." }, { status: 400 });
  }

  if (!isValidCourseDate(course.category, preferredDate.trim())) {
    return NextResponse.json({ error: "이 코스가 진행되지 않는 날짜예요. 다시 선택해 주세요." }, { status: 400 });
  }

  if (!agreeTerms || !agreePrivacy) {
    return NextResponse.json(
      { error: "이용약관과 개인정보 수집·이용에 동의해 주세요." },
      { status: 400 },
    );
  }

  const booking: BookingRequest = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    courseSlug: course.slug,
    serviceType: categoryLabel(course.category),
    neighborhood: neighborhoodLabel(course.neighborhood),
    preferredDate: preferredDate.trim(),
    preferredTime: preferredTime.trim(),
    guestName: guestName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
  };

  await insertBooking(booking);

  return NextResponse.json({ ok: true, id: booking.id });
}
