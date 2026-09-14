"use client";

import { useState, type FormEvent } from "react";
import { COURSES, NEIGHBORHOODS } from "@/lib/courses";
import ConsentFields from "@/components/ConsentFields";

export default function BookingForm({ defaultCourseSlug }: { defaultCourseSlug?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "예약 신청에 실패했습니다.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "예약 신청에 실패했습니다.");
    }
  }

  if (status === "done") {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-semibold" htmlFor="courseSlug">
          희망 코스 (선택)
        </label>
        <select
          id="courseSlug"
          name="courseSlug"
          defaultValue={defaultCourseSlug ?? ""}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        >
          <option value="">아직 정하지 않았어요</option>
          {COURSES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="원하는 서비스" name="serviceType" placeholder="예: 헤어, 스킨케어, 웨딩 메이크업" required />
        <div>
          <label className="text-sm font-semibold" htmlFor="neighborhood">
            희망 지역
          </label>
          <select
            id="neighborhood"
            name="neighborhood"
            required
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
          >
            <option value="" disabled>
              지역을 선택해 주세요
            </option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n.id} value={n.ko}>
                {n.ko}
              </option>
            ))}
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="희망 날짜" name="preferredDate" type="date" required />
        <Field label="희망 시간" name="preferredTime" type="time" required />
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

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:opacity-60"
      >
        {status === "submitting" ? "접수 중..." : "예약 신청하기"}
      </button>
    </form>
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
