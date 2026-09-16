// 기존 Vercel Blob(experts/bookings)에 있는 데이터를 Supabase의 locy_partners/locy_bookings로
// 옮긴다. 여러 번 실행해도 안전하도록(id 충돌 시 덮어쓰기) upsert로 처리한다.
// 실행: node --env-file=.env.local scripts/migrate-blob-to-locy.mjs

import { list } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function listCollection(prefix) {
  const { blobs } = await list({ prefix: `${prefix}/` });
  const records = await Promise.all(
    blobs.map(async (blob) => {
      const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    }),
  );
  return records.filter((r) => r !== null);
}

function toPartnerRow(e) {
  return {
    id: e.id,
    type: e.type,
    name: e.name,
    category: e.category,
    neighborhood: e.neighborhood,
    intro: e.intro,
    contact_name: e.contactName,
    phone: e.phone,
    email: e.email,
    links: e.links ?? null,
    status: e.status,
    created_at: e.createdAt,
  };
}

function toBookingRow(b) {
  return {
    id: b.id,
    course_slug: b.courseSlug ?? null,
    service_type: b.serviceType,
    neighborhood: b.neighborhood,
    preferred_date: b.preferredDate,
    preferred_time: b.preferredTime,
    guest_name: b.guestName,
    phone: b.phone,
    email: b.email,
    notes: b.notes ?? null,
    matched_partner_ids: b.matchedPartnerIds ?? null,
    selected_partner_id: b.selectedPartnerId ?? null,
    status: "requested",
    created_at: b.createdAt,
  };
}

async function main() {
  const experts = await listCollection("experts");
  const bookings = await listCollection("bookings");

  if (experts.length > 0) {
    const { error } = await supabase.from("locy_partners").upsert(experts.map(toPartnerRow));
    if (error) throw new Error(`locy_partners upsert 실패: ${error.message}`);
  }
  console.log(`partners: ${experts.length}건 이관`);

  if (bookings.length > 0) {
    const { error } = await supabase.from("locy_bookings").upsert(bookings.map(toBookingRow));
    if (error) throw new Error(`locy_bookings upsert 실패: ${error.message}`);
  }
  console.log(`bookings: ${bookings.length}건 이관`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
