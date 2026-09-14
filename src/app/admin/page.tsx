"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { PartnerApplication, PartnerStatus } from "@/lib/partners";
import type { BookingRequest } from "@/lib/bookings";

type Tab = "experts" | "bookings";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("experts");
  const [experts, setExperts] = useState<PartnerApplication[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [expertsRes, bookingsRes] = await Promise.all([
      fetch("/api/admin/experts"),
      fetch("/api/admin/bookings"),
    ]);
    if (expertsRes.status === 401 || bookingsRes.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    const expertsData = await expertsRes.json();
    const bookingsData = await bookingsRes.json();
    setExperts(expertsData.records ?? []);
    setBookings(bookingsData.records ?? []);
    setAuthed(true);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadAll();
  }, []);

  async function updateStatus(id: string, status: PartnerStatus) {
    setExperts((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    await fetch("/api/admin/experts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  if (authed === null) {
    return <div className="mx-auto max-w-3xl px-6 py-14 text-sm text-muted">불러오는 중...</div>;
  }

  if (authed === false) {
    return <AdminLogin onSuccess={loadAll} />;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent">PARTNER ADMIN</p>
      <h1 className="font-display mt-3 text-3xl font-bold">LOCALY 관리자</h1>

      <div className="mt-8 flex gap-2">
        <TabButton active={tab === "experts"} onClick={() => setTab("experts")}>
          전문가·업체 등록 ({experts.length})
        </TabButton>
        <TabButton active={tab === "bookings"} onClick={() => setTab("bookings")}>
          예약 신청 ({bookings.length})
        </TabButton>
      </div>

      {loading && <p className="mt-6 text-sm text-muted">불러오는 중...</p>}

      {!loading && tab === "experts" && (
        <div className="mt-6 space-y-4">
          {experts.length === 0 && <p className="text-sm text-muted">아직 등록 신청이 없어요.</p>}
          {experts.map((e) => (
            <div key={e.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {e.name} <span className="text-xs text-muted">· {e.category}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {e.type} · {e.neighborhood} · {new Date(e.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <p className="mt-3 text-sm text-foreground/90">{e.intro}</p>
              <p className="mt-2 text-xs text-muted">
                담당자 {e.contactName} · {e.phone} · {e.email}
                {e.links ? ` · ${e.links}` : ""}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus(e.id, "approved")}
                  disabled={e.status === "approved"}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:border-accent disabled:opacity-40"
                >
                  승인
                </button>
                <button
                  onClick={() => updateStatus(e.id, "rejected")}
                  disabled={e.status === "rejected"}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:border-accent disabled:opacity-40"
                >
                  반려
                </button>
                <button
                  onClick={() => updateStatus(e.id, "pending")}
                  disabled={e.status === "pending"}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:border-accent disabled:opacity-40"
                >
                  대기로
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "bookings" && (
        <div className="mt-6 space-y-4">
          {bookings.length === 0 && <p className="text-sm text-muted">아직 예약 신청이 없어요.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-surface p-5">
              <p className="font-semibold">
                {b.guestName} <span className="text-xs text-muted">· {b.serviceType}</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                {b.neighborhood} · {b.preferredDate} {b.preferredTime} ·{" "}
                {new Date(b.createdAt).toLocaleString("ko-KR")}
              </p>
              {b.courseSlug && <p className="mt-1 text-xs text-accent">코스: {b.courseSlug}</p>}
              {b.notes && <p className="mt-2 text-sm text-foreground/90">{b.notes}</p>}
              <p className="mt-2 text-xs text-muted">
                {b.phone} · {b.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-foreground text-background" : "border border-border hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: PartnerStatus }) {
  const label = { pending: "대기", approved: "승인", rejected: "반려" }[status];
  const cls = {
    pending: "bg-accent-soft text-accent-dark",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-neutral-200 text-neutral-500",
  }[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{label}</span>;
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "로그인에 실패했습니다.");
      return;
    }
    onSuccess();
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-24">
      <p className="font-display text-2xl font-bold">파트너 어드민</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          name="password"
          placeholder="관리자 비밀번호"
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-accent">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-60"
        >
          {submitting ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
