import RegisterForm from "@/components/RegisterForm";
import { PARTNER_TYPES, type PartnerType } from "@/lib/partners";

export const metadata = { title: "전문가·업체 등록 — LOCALY" };

const VALID_TYPES = PARTNER_TYPES.map((t) => t.id);

export default async function RegisterPage(props: PageProps<"/register">) {
  const params = await props.searchParams;
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const defaultType: PartnerType = VALID_TYPES.includes(rawType as PartnerType)
    ? (rawType as PartnerType)
    : "business";

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent">JOIN LOCALY</p>
      <h1 className="font-display mt-3 text-3xl font-bold">전문가·업체 등록</h1>
      <p className="mt-2 text-[15px] text-muted">
        살롱, 스파, 1인 전문가, 로컬 크리에이터 모두 환영해요. 등록 후 검토를 거쳐
        LOCALY 코스에 소개해 드려요.
      </p>

      <div className="mt-10">
        <RegisterForm defaultType={defaultType} />
      </div>
    </div>
  );
}
