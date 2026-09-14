import Link from "next/link";
import { CATEGORIES, COURSES, NEIGHBORHOODS, type Neighborhood } from "@/lib/courses";

export const metadata = { title: "테마 탐색 — LOCALY" };

export default async function CoursesPage(props: PageProps<"/courses">) {
  const params = await props.searchParams;
  const category = firstValue(params.category);
  const neighborhood = firstValue(params.neighborhood);

  const filtered = COURSES.filter((course) => {
    if (category && course.category !== category) return false;
    if (neighborhood && course.neighborhood !== neighborhood) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent">테마 탐색</p>
      <h1 className="font-display mt-3 text-3xl font-bold">모든 뷰티 코스 둘러보기</h1>
      <p className="mt-2 text-[15px] text-muted">
        분위기와 지역으로 필터링해서 오늘 나에게 맞는 코스를 찾아보세요.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterPill
          href="/courses"
          active={!category}
          label="전체"
        />
        {CATEGORIES.map((c) => (
          <FilterPill
            key={c.id}
            href={buildHref("category", c.id, neighborhood)}
            active={category === c.id}
            label={c.ko}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterPill href={dropParam("neighborhood", category)} active={!neighborhood} label="전체 지역" muted />
        {NEIGHBORHOODS.map((n) => (
          <FilterPill
            key={n.id}
            href={buildHref("neighborhood", n.id, undefined, category)}
            active={neighborhood === n.id}
            label={n.ko}
            muted
          />
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="rounded-2xl border border-border bg-surface p-6 transition hover:shadow-md"
          >
            <p className="text-xs font-semibold tracking-wide text-accent">
              {course.tagline}
            </p>
            <p className="font-display mt-3 text-lg font-bold">{course.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{course.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>{neighborhoodLabel(course.neighborhood)} · {course.duration}</span>
              <span>{course.priceFrom.toLocaleString("ko-KR")}원~</span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted">
            조건에 맞는 코스가 아직 없어요. 다른 필터를 선택해 보세요.
          </p>
        )}
      </div>
    </div>
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildHref(
  key: "category" | "neighborhood",
  value: string,
  keepNeighborhood?: string,
  keepCategory?: string,
) {
  const search = new URLSearchParams();
  if (key === "category") {
    search.set("category", value);
    if (keepNeighborhood) search.set("neighborhood", keepNeighborhood);
  } else {
    search.set("neighborhood", value);
    if (keepCategory) search.set("category", keepCategory);
  }
  return `/courses?${search.toString()}`;
}

function dropParam(key: "neighborhood" | "category", keep?: string) {
  const search = new URLSearchParams();
  if (key === "neighborhood" && keep) search.set("category", keep);
  if (key === "category" && keep) search.set("neighborhood", keep);
  const qs = search.toString();
  return qs ? `/courses?${qs}` : "/courses";
}

function neighborhoodLabel(id: Neighborhood) {
  return NEIGHBORHOODS.find((n) => n.id === id)?.ko ?? id;
}

function FilterPill({
  href,
  active,
  label,
  muted,
}: {
  href: string;
  active: boolean;
  label: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-accent bg-accent text-white"
          : muted
            ? "border-border text-muted hover:border-accent hover:text-foreground"
            : "border-border hover:border-accent"
      }`}
    >
      {label}
    </Link>
  );
}
