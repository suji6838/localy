import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES, getCourseBySlug, NEIGHBORHOODS } from "@/lib/courses";

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const neighborhood = NEIGHBORHOODS.find((n) => n.id === course.neighborhood);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <Link href="/courses" className="text-sm text-muted hover:text-foreground">
        ← 테마 탐색으로
      </Link>

      <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-accent">
        {course.tagline}
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold">{course.title}</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{course.description}</p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
        <span>📍 {neighborhood?.ko}</span>
        <span>⏱ {course.duration}</span>
        <span>{course.priceFrom.toLocaleString("ko-KR")}원부터</span>
      </div>

      <div className="mt-10">
        <p className="font-display text-lg font-bold">코스 구성</p>
        <ol className="mt-4 space-y-3">
          {course.stops.map((stop, i) => (
            <li
              key={stop.name}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-dark">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{stop.name}</p>
                <p className="text-xs text-muted">{stop.type}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Link
        href={`/booking?course=${course.slug}`}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85"
      >
        이 코스로 예약하기 <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
