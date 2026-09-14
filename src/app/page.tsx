import Link from "next/link";
import { CATEGORIES, NEIGHBORHOODS } from "@/lib/courses";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">
            BEAUTY IN SEOUL · MADE FOR YOUR DAY
          </p>
          <h1 className="font-display mt-5 text-[2.6rem] leading-[1.15] font-bold sm:text-5xl">
            서울에서 만나는
            <br />
            <span className="italic text-accent">나만의 빛나는 하루</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
            처음 만나는 K-뷰티부터 특별한 살롱 경험까지.
            <br />
            원하는 지역과 기분을 골라 하루 코스를 시작해 보세요.
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85"
          >
            코스 둘러보기 <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
          <div className="absolute inset-0 rounded-full bg-accent-soft" />
          <div className="absolute left-4 top-6 h-28 w-28 rounded-full bg-accent/40 blur-[1px]" />
          <div className="absolute bottom-8 right-6 h-16 w-16 rounded-full bg-accent-dark/30" />
          <div className="relative flex h-56 w-40 flex-col items-center justify-center rounded-t-full bg-background/90 shadow-sm">
            <span className="font-display text-sm font-bold tracking-widest text-accent-dark">
              LOCALY
            </span>
            <span className="mt-1 text-[10px] tracking-[0.2em] text-muted">GLOW</span>
          </div>
          <span className="absolute right-4 top-2 text-2xl text-accent-dark" aria-hidden>
            ✿
          </span>
        </div>
      </section>

      {/* Curated courses */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent">
          CURATED FOR YOUR SEOUL DAY
        </p>
        <h2 className="font-display mt-3 text-2xl font-bold sm:text-[1.7rem]">
          어떤 하루를 만나고 싶나요?
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          원하는 분위기를 고르면, 가까운 뷰티 경험을 한 코스로 이어 드려요.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/courses?category=${category.id}`}
              className="rounded-2xl border border-border bg-surface p-6 transition hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-dark"
                aria-hidden
              >
                {CATEGORY_ICON[category.id]}
              </span>
              <p className="mt-5 text-lg font-semibold">{categoryTitle(category.id)}</p>
              <p className="mt-1 text-xs font-semibold tracking-wide text-muted">
                {category.en}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {categoryDescription(category.id)}
              </p>
              <span className="mt-4 inline-block text-muted" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl border-t border-border" />

      {/* Neighborhoods */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent">
              OR START WITH A NEIGHBORHOOD
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold sm:text-[1.7rem]">
              지역부터 고를 수도 있어요
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:flex">
            {NEIGHBORHOODS.map((n) => (
              <Link
                key={n.id}
                href={`/courses?neighborhood=${n.id}`}
                className="rounded-xl border border-border bg-surface px-5 py-3 transition hover:border-accent hover:shadow-sm"
              >
                <p className="text-[10px] tracking-[0.2em] text-muted">{n.en}</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  {n.ko} <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const CATEGORY_ICON: Record<string, string> = {
  beginner: "✦",
  wedding: "♛",
  skincare: "☾",
};

function categoryTitle(id: string) {
  const map: Record<string, string> = {
    beginner: "K-뷰티 입문",
    wedding: "메이크업",
    skincare: "웰니스 데이",
  };
  return map[id];
}

function categoryDescription(id: string) {
  const map: Record<string, string> = {
    beginner: "퍼스널 진단부터 K-뷰티 쇼핑까지, 서울의 뷰티 문화를 가볍게 만나보세요.",
    wedding: "특별한 날을 위한 맑고 섬세한 메이크업 영감을 모은 프리미엄 코스예요.",
    skincare: "내 피부를 살피고 편안하게 쉬어가는 케어 중심의 하루를 제안해요.",
  };
  return map[id];
}
