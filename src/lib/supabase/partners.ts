import { createAdminClient } from "@/lib/supabase/admin";
import type { PartnerApplication, PartnerStatus, PartnerType } from "@/lib/partners";

type PartnerRow = {
  id: string;
  type: string;
  name: string;
  category: string;
  neighborhood: string;
  intro: string;
  contact_name: string;
  phone: string;
  email: string;
  links: string | null;
  status: PartnerStatus;
  created_at: string;
};

function fromRow(row: PartnerRow): PartnerApplication {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    type: row.type as PartnerType,
    name: row.name,
    category: row.category,
    neighborhood: row.neighborhood,
    intro: row.intro,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email,
    links: row.links ?? undefined,
  };
}

export async function insertPartnerApplication(application: PartnerApplication): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("locy_partners").insert({
    id: application.id,
    type: application.type,
    name: application.name,
    category: application.category,
    neighborhood: application.neighborhood,
    intro: application.intro,
    contact_name: application.contactName,
    phone: application.phone,
    email: application.email,
    links: application.links ?? null,
    status: application.status,
    created_at: application.createdAt,
  });
  if (error) throw new Error(error.message);
}

export async function listPartners(): Promise<PartnerApplication[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("locy_partners")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as PartnerRow[]).map(fromRow);
}

export async function listApprovedPartners(): Promise<PartnerApplication[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("locy_partners").select("*").eq("status", "approved");
  if (error) throw new Error(error.message);
  return (data as PartnerRow[]).map(fromRow);
}

export async function updatePartnerStatus(
  id: string,
  status: PartnerStatus,
): Promise<PartnerApplication | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("locy_partners")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as PartnerRow) : null;
}

export async function isApprovedPartner(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("locy_partners")
    .select("id")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data !== null;
}
