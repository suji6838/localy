"use client";

import { useState, type FormEvent } from "react";
import { COURSES, NEIGHBORHOODS } from "@/lib/courses";
import { SERVICE_TYPES } from "@/lib/services";
import type { MatchedPartner } from "@/lib/matching";
import ConsentFields from "@/components/ConsentFields";

export default function BookingForm({ defaultCourseSlug }: { defaultCourseSlug?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchedPartner[]>([]);

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
      setMatches(data.matches ?? []);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "예약 신청에 실패했습니다.");
    }
  }

  if (status === "done") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="font-display text-xl font-bold">예약 신청이 완료되었어요</p>
          <p className="mt-2 text-sm text-muted">
            입력하신 연락처로 확정 안내를 드릴게요. 빛나는 하루를 준비해 볼까요?
          </p>
        </div>

        {matches.length > 0 ? (
          <div>
            <p className="text-sm font-semibold">이런 파트너와 매칭됐어요</p>
            <div className="mt-3 space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-semibold">
                    {m.name}{" "}
                    <span className="ml-1 text-xs font-normal text-muted">
                      {m.category} · {m.neighborhood}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{m.intro}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              위 파트너를 포함해 어울리는 곳을 검토한 뒤 연락드릴게요.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">
            아직 조건에 딱 맞는 등록 파트너가 없어요. 검토 후 가장 어울리는 곳을 찾아 연결해 드릴게요.
          </p>
        )}
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
        <div>
          <label className="text-sm font-semibold" htmlFor="serviceType">
            원하는 서비스
          </label>
          <select
            id="serviceType"
            name="serviceType"
            required
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
          >
            <option value="" disabled>
              서비스를 선택해 주세요
            </option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
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
