"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent text-lg">✦</span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">LOCALY</span>
            <span className="block text-[11px] tracking-[0.18em] text-muted">
              DISCOVER BEAUTY LIKE A LOCAL
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/courses"
            className="rounded-full px-4 py-2 hover:bg-surface hover:shadow-sm transition"
          >
            테마 탐색
          </Link>
          <Link
            href="/register"
            className="rounded-full px-4 py-2 hover:bg-surface hover:shadow-sm transition"
          >
            전문가·업체 등록
          </Link>
          <button
            type="button"
            onClick={openAuthModal}
            className="rounded-full px-4 py-2 hover:bg-surface hover:shadow-sm transition"
          >
            {user ? "내 계정" : "로그인"}
          </button>
          <Link
            href="/booking"
            className="ml-1 rounded-full bg-foreground px-4 py-2 text-background transition hover:opacity-85"
          >
            예약하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
