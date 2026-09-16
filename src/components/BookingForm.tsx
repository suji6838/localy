"use client";

import { useState, type FormEvent } from "react";
import {
  COURSES,
  getCourseBySlug,
  neighborhoodLabel,
  nextAvailableDates,
  CATEGORY_WEEKDAYS,
} from "@/lib/courses";
import ConsentFields from "@/components/ConsentFields";

type Step = "course" | "schedule" | "contact" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "course", label: "코스 선택" },
  { id: "schedule", label: "날짜 선택" },
  { id: "contact", label: "연락처 입력" },
];

const TIME_SLOTS = ["11:00", "14:00", "16:00"];

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

function weekdayLabel(category: keyof typeof CATEGORY_WEEKDAYS) {
  return CATEGORY_WEEKDAYS[category].map((d) => WEEKDAY_KO[d]).join("·");
}

export default function BookingForm({ defaultCourseSlug }: { defaultCourseSlug?: string }) {
  const hasValidDefault = Boolean(defaultCourseSlug && getCourseBySlug(defaultCourseSlug));
  const [step, setStep] = useState<Step>(hasValidDefault ? "schedule" : "course");
  const [courseSlug, setCourseSlug] = useState(hasValidDefault ? defaultCourseSlug! : "");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const course = getCourseBySlug(courseSlug);
  const dateOptions = course ? nextAvailableDates(course.category, 6) : [];

  function chooseCourse(slug: string) {
    setCourseSlug(slug);
    setPreferredDate("");
    setPreferredTime("");
    setStep("schedule");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(form.entries()),
      courseSlug,
      preferredDate,
      preferredTime,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "예약 신청에 실패했습니다.");
      setStep("done");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "예약 신청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl font-bold">예약 신청이 완료되었어요</p>
        <p className="mt-2 text-sm text-muted">
          입력하신 연락처로 확정 안내를 드릴게요. 빛나는 하루를 준비해 볼까요?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator current={step} />

      {step === "course" && (
        <div className="space-y-3">
          {COURSES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => chooseCourse(c.slug)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                courseSlug === c.slug
                  ? "border-accent bg-accent-soft/50"
                  : "border-border bg-surface hover:border-accent/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {c.title}{" "}
                    <span className="ml-1 text-xs font-normal text-muted">{c.tagline}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {neighborhoodLabel(c.neighborhood)} · {c.duration} · 매주 {weekdayLabel(c.category)}요일 진행
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-accent">
                  {c.priceFrom.toLocaleString("ko-KR")}원~
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
            </button>
          ))}
        </div>
      )}

      {step === "schedule" && course && (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent bg-accent-soft/40 p-4">
            <p className="text-xs font-semibold text-accent-dark">선택한 코스</p>
            <p className="mt-1 font-semibold">
              {course.title}{" "}
              <span className="ml-1 text-xs font-normal text-muted">
                {course.priceFrom.toLocaleString("ko-KR")}원~ · {course.duration}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">날짜 선택</p>
            <p className="mt-1 text-xs text-muted">
              이 코스는 매주 {weekdayLabel(course.category)}요일에 진행돼요.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dateOptions.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setPreferredDate(d.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    preferredDate === d.value
                      ? "border-accent bg-accent text-white"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">시간 선택</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferredTime(t)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    preferredTime === t
                      ? "border-accent bg-accent text-white"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("course")}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!preferredDate || !preferredTime}
              onClick={() => setStep("contact")}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:opacity-60"
            >
              다음 <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}

      {step === "contact" && course && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-accent bg-accent-soft/40 p-4">
            <p className="text-xs font-semibold text-accent-dark">예약 내용</p>
            <p className="mt-1 font-semibold">{course.title}</p>
            <p className="mt-1 text-sm text-muted">
              {dateOptions.find((d) => d.value === preferredDate)?.label} · {preferredTime}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <Field label="예약자명" name="guestName" required />
            <Field label="연락처" name="phone" placeholder="010-0000-0000" required />
            <Field label="이메일" name="email" type="email" required />
          </div>

          <div>
            <label className="text-sm font-semibold" htmlFor="notes">
              요청 사항 (선택)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="원하는 스타일, 알레르기, 특이사항 등을 알려주세요."
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
            />
          </div>

          <ConsentFields />

          {submitError && <p className="text-sm text-accent">{submitError}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("schedule")}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              이전
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:opacity-60"
            >
              {submitting ? "접수 중..." : "예약 신청하기"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold text-muted">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              i <= currentIndex ? "bg-foreground text-background" : "border border-border"
            }`}
          >
            {i + 1}
          </span>
          <span className={i === currentIndex ? "text-foreground" : ""}>{s.label}</span>
          {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
      />
    </div>
  );
}
