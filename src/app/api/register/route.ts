import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { appendRecord } from "@/lib/store";
import { PARTNER_TYPES, type PartnerApplication, type PartnerType } from "@/lib/partners";

const VALID_TYPES = PARTNER_TYPES.map((t) => t.id) as PartnerType[];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { type, name, category, neighborhood, intro, contactName, phone, email, links } = body;

  if (
    typeof type !== "string" ||
    !VALID_TYPES.includes(type as PartnerType) ||
    typeof name !== "string" || !name.trim() ||
    typeof category !== "string" || !category.trim() ||
    typeof neighborhood !== "string" || !neighborhood.trim() ||
    typeof intro !== "string" || !intro.trim() ||
    typeof contactName !== "string" || !contactName.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해 주세요." }, { status: 400 });
  }

  const application: PartnerApplication = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    type: type as PartnerType,
    name: name.trim(),
    category: category.trim(),
    neighborhood: neighborhood.trim(),
    intro: intro.trim(),
    contactName: contactName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    links: typeof links === "string" && links.trim() ? links.trim() : undefined,
  };

  await appendRecord("experts", application);

  return NextResponse.json({ ok: true, id: application.id });
}
