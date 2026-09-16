import { listApprovedPartners, isApprovedPartner as checkApprovedPartner } from "@/lib/supabase/partners";
import type { PartnerApplication } from "@/lib/partners";

export type MatchedPartner = Pick<
  PartnerApplication,
  "id" | "name" | "type" | "category" | "neighborhood" | "intro"
>;

function toMatchedPartner(p: PartnerApplication): MatchedPartner {
  const { id, name, type, category, neighborhood, intro } = p;
  return { id, name, type, category, neighborhood, intro };
}

/**
 * 승인된(approved) 파트너 중 같은 서비스 분야를 우선 매칭하고,
 * 그 안에서 같은 지역을 우선 순위로 최대 `limit`명까지 돌려준다.
 */
export async function matchPartners(
  serviceType: string,
  neighborhood: string,
  limit = 3,
): Promise<MatchedPartner[]> {
  const approvedAll = await listApprovedPartners();
  const approved = approvedAll.filter((p) => p.category === serviceType);

  const sameNeighborhood = approved.filter((p) => p.neighborhood === neighborhood);
  const otherNeighborhood = approved.filter((p) => p.neighborhood !== neighborhood);

  return [...sameNeighborhood, ...otherNeighborhood].slice(0, limit).map(toMatchedPartner);
}

/**
 * 고객이 고른 파트너가 실제로 승인된 파트너인지 서버에서 다시 확인한다.
 */
export async function isApprovedPartner(id: string): Promise<boolean> {
  return checkApprovedPartner(id);
}
