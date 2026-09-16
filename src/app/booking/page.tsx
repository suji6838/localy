import BookingForm from "@/components/BookingForm";

export const metadata = { title: "예약하기 — LOCALY" };

export default async function BookingPage(props: PageProps<"/booking">) {
  const params = await props.searchParams;
  const rawCourse = Array.isArray(params.course) ? params.course[0] : params.course;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent">BOOK YOUR DAY</p>
      <h1 className="font-display mt-3 text-3xl font-bold">뷰티·웰니스 예약하기</h1>
      <p className="mt-2 text-[15px] text-muted">
        원하는 코스를 고르면 진행 요일에 맞는 날짜를 보여드려요. 날짜와 시간만 골라 바로 예약해 보세요.
      </p>

      <div className="mt-10">
        <BookingForm defaultCourseSlug={rawCourse} />
      </div>
    </div>
  );
}
