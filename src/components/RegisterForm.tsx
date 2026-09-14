"use client";

import { useState, type FormEvent } from "react";
import { NEIGHBORHOODS } from "@/lib/courses";
import { PARTNER_TYPES, type PartnerType } from "@/lib/partners";

export default function RegisterForm({ defaultType }: { defaultType: PartnerType }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "등록에 실패했습니다.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "등록에 실패했습니다.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl font-bold">신청이 접수되었어요</p>
        <p className="mt-2 text-sm text-muted">
          검토 후 입력하신 연락처로 안내드릴게요. LOCALY와 함께해 주셔서 감사합니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold">연결 방식</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {PARTNER_TYPES.map((type) => (
            <label
              key={type.id}
              className="flex cursor-pointer flex-col rounded-xl border border-border bg-surface p-4 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40"
            >
              <span className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="type"
                  value={type.id}
                  defaultChecked={type.id === defaultType}
                  className="accent-accent"
                />
                {type.en}
              </span>
              <span className="mt-1 text-xs text-muted">{type.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="업체명 / 활동명" name="name" placeholder="예: 성수 헤어살롱 오브" required />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="전문 분야" name="category" placeholder="예: 헤어, 스킨케어, 웨딩 메이크업" required />
        <div>
          <label className="text-sm font-semibold" htmlFor="neighborhood">
            활동 지역
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

      <div>
        <label className="text-sm font-semibold" htmlFor="intro">
          소개
        </label>
        <textarea
          id="intro"
          name="intro"
          required
          rows={4}
          placeholder="고객에게 보여질 소개와 대표 서비스, 경력 등을 자유롭게 적어주세요."
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="담당자명" name="contactName" required />
        <Field label="연락처" name="phone" placeholder="010-0000-0000" required />
        <Field label="이메일" name="email" type="email" required />
      </div>

      <Field
        label="포트폴리오 / SNS 링크 (선택)"
        name="links"
        placeholder="인스타그램, 홈페이지 등"
      />

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:opacity-60"
      >
        {status === "submitting" ? "접수 중..." : "파트너 등록 신청"}
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
