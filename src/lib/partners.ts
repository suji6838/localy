export type PartnerType = "business" | "expert" | "creator";

export const PARTNER_TYPES: {
  id: PartnerType;
  ko: string;
  en: string;
  desc: string;
}[] = [
  {
    id: "business",
    ko: "업체",
    en: "Partner Business",
    desc: "살롱, 스파, 사진관, 스튜디오 등",
  },
  {
    id: "expert",
    ko: "1인 전문가",
    en: "Local Expert",
    desc: "프리랜서, 1인 사업자, 전문가",
  },
  {
    id: "creator",
    ko: "로컬 크리에이터",
    en: "Local Creator",
    desc: "러닝, 사진, 쇼핑, 전시, 동네 탐방 등을 제공하는 사람",
  },
];

export type PartnerStatus = "pending" | "approved" | "rejected";

export type PartnerApplication = {
  id: string;
  createdAt: string;
  status: PartnerStatus;
  type: PartnerType;
  name: string;
  category: string;
  neighborhood: string;
  intro: string;
  contactName: string;
  phone: string;
  email: string;
  links?: string;
};
