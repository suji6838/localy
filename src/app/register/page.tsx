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

      <div className="mt-14 border-t border-border pt-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent">LOCAL MATCHING</p>
        <h2 className="font-display mt-3 text-xl font-bold">3가지 방식으로 참여할 수 있어요</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {PARTNER_TYPES.map((type) => (
            <div key={type.id} className="rounded-2xl border border-border bg-surface p-6">
              <span className="text-2xl" aria-hidden>
                {PARTNER_ICON[type.id]}
              </span>
              <p className="font-display mt-4 text-base font-bold">{type.en}</p>
              <p className="mt-1 text-sm text-muted">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PARTNER_ICON: Record<string, string> = {
  business: "🏢",
  expert: "👤",
  creator: "🧑‍🤝‍🧑",
};
