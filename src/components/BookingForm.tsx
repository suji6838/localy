"use client";

import { useState, type FormEvent } from "react";
import { COURSES, NEIGHBORHOODS } from "@/lib/courses";
import { SERVICE_TYPES } from "@/lib/services";
import type { MatchedPartner } from "@/lib/matching";
import ConsentFields from "@/components/ConsentFields";

type Step = "criteria" | "select" | "contact" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "criteria", label: "일정 선택" },
  { id: "select", label: "업체 선택" },
  { id: "contact", label: "연락처 입력" },
];

export default function BookingForm({ defaultCourseSlug }: { defaultCourseSlug?: string }) {
  const [step, setStep] = useState<Step>("criteria");

  const [courseSlug, setCourseSlug] = useState(defaultCourseSlug ?? "");
  const [serviceType, setServiceType] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const [matches, setMatches] = useState<MatchedPartner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedPartner = matches.find((m) => m.id === selectedPartnerId) ?? null;

  async function handleFindPartners(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMatchLoading(true);
    setMatchError(null);
    try {
      const params = new URLSearchParams({ serviceType, neighborhood });
      const res = await fetch(`/api/partners/match?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "업체를 불러오지 못했어요.");
      setMatches(data.matches ?? []);
      setSelectedPartnerId(null);
      setStep("select");
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : "업체를 불러오지 못했어요.");
    } finally {
      setMatchLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(form.entries()),
      courseSlug,
      serviceType,
      neighborhood,
      preferredDate,
      preferredTime,
      selectedPartnerId: selectedPartnerId ?? undefined,
      shownPartnerIds: matches.map((m) => m.id),
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
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="font-display text-xl font-bold">예약 신청이 완료되었어요</p>
          <p className="mt-2 text-sm text-muted">
            입력하신 연락처로 확정 안내를 드릴게요. 빛나는 하루를 준비해 볼까요?
          </p>
        </div>

        {selectedPartner ? (
          <div>
            <p className="text-sm font-semibold">이 업체와 연결됐어요</p>
            <div className="mt-3 rounded-xl border border-accent bg-accent-soft/40 p-4">
              <p className="font-semibold">
                {selectedPartner.name}{" "}
                <span className="ml-1 text-xs font-normal text-muted">
                  {selectedPartner.category} · {selectedPartner.neighborhood}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted">{selectedPartner.intro}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            아직 조건에 딱 맞는 등록 업체가 없어요. 검토 후 가장 어울리는 곳을 찾아 연결해 드릴게요.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator current={step} />

      {step === "criteria" && (
        <form onSubmit={handleFindPartners} className="space-y-6">
          <div>
            <label className="text-sm font-semibold" htmlFor="courseSlug">
              희망 코스 (선택)
            </label>
            <select
              id="courseSlug"
              value={courseSlug}
              onChange={(e) => setCourseSlug(e.target.value)}
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
                required
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
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
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
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
            <div>
              <label className="text-sm font-semibold" htmlFor="preferredDate">
                희망 날짜
              </label>
              <input
                id="preferredDate"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="preferredTime">
                희망 시간
              </label>
              <input
                id="preferredTime"
                type="time"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              />
            </div>
          </div>

          {matchError && <p className="text-sm text-accent">{matchError}</p>}

          <button
            type="submit"
            disabled={matchLoading}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:opacity-60"
          >
            {matchLoading ? "업체 찾는 중..." : "업체 찾기"} <span aria-hidden>→</span>
          </button>
        </form>
      )}

      {step === "select" && (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold">
              {preferredDate} {preferredTime} · {neighborhood} · {serviceType}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              원하는 업체 1곳을 선택하면 해당 업체와 바로 연결해 드려요.
            </p>
          </div>

          {matches.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              아직 조건에 맞는 등록 업체가 없어요. 연락처를 남겨주시면 검토 후 가장 어울리는 곳을
              찾아 연결해 드릴게요.
            </p>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                const active = selectedPartnerId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedPartnerId(m.id)}
                    aria-pressed={active}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-accent bg-accent-soft/50"
                        : "border-border bg-surface hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">
                        {m.name}{" "}
                        <span className="ml-1 text-xs font-normal text-muted">
                          {m.category} · {m.neighborhood}
                        </span>
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                          active
                            ? "bg-accent text-background"
                            : "border border-border text-muted"
                        }`}
                      >
                        {active ? "선택됨" : "선택하기"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{m.intro}</p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("criteria")}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-accent"
            >
              이전
            </button>
            <button
              type="button"
              disabled={matches.length > 0 && !selectedPartnerId}
              onClick={() => setStep("contact")}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:opacity-60"
            >
              {matches.length === 0 ? "연락처 남기고 계속하기" : "선택한 업체와 연결하기"}{" "}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}

      {step === "contact" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedPartner && (
            <div className="rounded-xl border border-accent bg-accent-soft/40 p-4">
              <p className="text-xs font-semibold text-accent-dark">연결될 업체</p>
              <p className="mt-1 font-semibold">
                {selectedPartner.name}{" "}
                <span className="ml-1 text-xs font-normal text-muted">
                  {selectedPartner.category} · {selectedPartner.neighborhood}
                </span>
              </p>
            </div>
          )}

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
              onClick={() => setStep("select")}
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
