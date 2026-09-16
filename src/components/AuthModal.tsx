"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const CONSENT_KEY = "locy:agreed";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

function friendlyAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않아요.";
  if (message.includes("User already registered")) return "이미 가입된 이메일이에요. 아래에서 로그인해 주세요.";
  if (message.includes("Email not confirmed"))
    return "이메일 인증이 아직 완료되지 않았어요. 메일함의 확인 링크를 눌러주세요.";
  if (message.includes("Password should be at least")) return "비밀번호는 6자 이상이어야 해요.";
  if (message.includes("rate limit")) return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
  return "처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}

export default function AuthModal() {
  const { user, supabase, closeAuthModal, signOut } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedBefore, setAgreedBefore] = useState(() => localStorage.getItem(CONSENT_KEY) === "1");
  const [agreeAll, setAgreeAll] = useState(false);
  const readyForAuth = agreedBefore || agreeAll;

  function markAgreed() {
    localStorage.setItem(CONSENT_KEY, "1");
    setAgreedBefore(true);
  }

  useEffect(() => {
    if (user) return;
    let cancelled = false;

    const handleCredential = async (response: { credential: string }) => {
      if (!readyForAuth) {
        setError("이용약관과 개인정보 수집·이용에 동의한 후 진행해 주세요.");
        return;
      }
      setSubmitting(true);
      setError("");
      try {
        const { error: signInError } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });
        if (signInError) throw signInError;
        markAgreed();
        closeAuthModal();
      } catch (err) {
        console.error("Google/Supabase sign-in failed:", err);
        setError("로그인 정보를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setSubmitting(false);
      }
    };

    const init = () => {
      if (cancelled || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredential,
      });
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: 320,
        });
      }
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const script = document.getElementById("google-identity-script");
      script?.addEventListener("load", init);
      return () => script?.removeEventListener("load", init);
    }
    return () => {
      cancelled = true;
    };
  }, [user, readyForAuth, supabase, closeAuthModal]);

  async function submitEmail(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError("올바른 이메일 주소를 입력해 주세요.");
    if (password.length < 6) return setError("비밀번호는 6자 이상이어야 해요.");
    if (!readyForAuth) return setError("이용약관과 개인정보 수집·이용에 동의한 후 진행해 주세요.");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: cleanEmail, password });
        if (signUpError) throw signUpError;
        markAgreed();
        if (!data.session) {
          setNotice("확인 이메일을 보냈어요. 메일함의 링크를 눌러 인증을 완료한 뒤 로그인해 주세요.");
          setMode("signin");
          setPassword("");
        } else {
          closeAuthModal();
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (signInError) throw signInError;
        markAgreed();
        closeAuthModal();
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (user) {
    return (
      <Modal title="LOCALY 회원" onClose={closeAuthModal}>
        <p className="text-sm text-muted">{user.email}으로 로그인되어 있어요.</p>
        <button
          type="button"
          onClick={async () => {
            setSubmitting(true);
            try {
              window.google?.accounts?.id?.disableAutoSelect();
              await signOut();
              closeAuthModal();
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-60"
        >
          {submitting ? "로그아웃하는 중이에요" : "로그아웃"}
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="LOCALY 시작하기" onClose={closeAuthModal}>
      <p className="text-sm text-muted">
        로그인하면 8체질 진단 결과와 예약 내역을 다른 기기에서도 이어서 확인할 수 있어요.
      </p>

      {!agreedBefore && (
        <label className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
          <input
            type="checkbox"
            checked={agreeAll}
            onChange={(e) => setAgreeAll(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          <span>
            <Link href="/terms" target="_blank" className="font-semibold underline">
              이용약관
            </Link>{" "}
            및{" "}
            <Link href="/privacy" target="_blank" className="font-semibold underline">
              개인정보 수집·이용
            </Link>
            에 동의합니다. (필수)
          </span>
        </label>
      )}

      {readyForAuth ? (
        <div ref={buttonRef} className="mt-5 flex justify-center" />
      ) : (
        <p className="mt-5 text-center text-xs text-muted">약관에 동의하면 구글로 계속하기를 이용할 수 있어요.</p>
      )}

      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        또는 이메일로 {mode === "signup" ? "가입" : "로그인"}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submitEmail} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          type="email"
          autoComplete="email"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (6자 이상)"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        />
        {notice && (
          <p className="text-sm text-muted" role="status">
            {notice}
          </p>
        )}
        {error && (
          <p className="text-sm text-accent" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting || !readyForAuth}
          className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-60"
        >
          {submitting ? "처리하고 있어요" : mode === "signup" ? "이메일로 회원가입" : "이메일로 로그인"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError("");
          setNotice("");
        }}
        className="mt-3 w-full text-center text-xs text-muted underline"
      >
        {mode === "signup" ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 이메일로 가입하기"}
      </button>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-sm rounded-2xl bg-surface p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 text-muted hover:text-foreground"
        >
          ×
        </button>
        <p id="auth-modal-title" className="font-display text-xl font-bold">
          {title}
        </p>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
