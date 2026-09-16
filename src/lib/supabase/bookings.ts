import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingRequest } from "@/lib/bookings";

type BookingRow = {
  id: string;
  course_slug: string | null;
  service_type: string;
  neighborhood: string;
  preferred_date: string;
  preferred_time: string;
  guest_name: string;
  phone: string;
  email: string;
  notes: string | null;
  matched_partner_ids: string[] | null;
  selected_partner_id: string | null;
  created_at: string;
};

function fromRow(row: BookingRow): BookingRequest {
  return {
    id: row.id,
    createdAt: row.created_at,
    courseSlug: row.course_slug ?? undefined,
    serviceType: row.service_type,
    neighborhood: row.neighborhood,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    guestName: row.guest_name,
    phone: row.phone,
    email: row.email,
    notes: row.notes ?? undefined,
    matchedPartnerIds: row.matched_partner_ids ?? undefined,
    selectedPartnerId: row.selected_partner_id ?? undefined,
  };
}

export async function insertBooking(booking: BookingRequest): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("locy_bookings").insert({
    id: booking.id,
    course_slug: booking.courseSlug ?? null,
    service_type: booking.serviceType,
    neighborhood: booking.neighborhood,
    preferred_date: booking.preferredDate,
    preferred_time: booking.preferredTime,
    guest_name: booking.guestName,
    phone: booking.phone,
    email: booking.email,
    notes: booking.notes ?? null,
    matched_partner_ids: booking.matchedPartnerIds ?? null,
    selected_partner_id: booking.selectedPartnerId ?? null,
    created_at: booking.createdAt,
  });
  if (error) throw new Error(error.message);
}

export async function listBookings(): Promise<BookingRequest[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("locy_bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BookingRow[]).map(fromRow);
}
