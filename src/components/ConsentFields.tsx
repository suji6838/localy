import Link from "next/link";

export default function ConsentFields() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="agreeTerms"
          value="agree"
          required
          className="mt-0.5 accent-accent"
        />
        <span>
          <Link href="/terms" target="_blank" className="font-semibold underline">
            이용약관
          </Link>
          에 동의합니다. (필수)
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="agreePrivacy"
          value="agree"
          required
          className="mt-0.5 accent-accent"
        />
        <span>
          <Link href="/privacy" target="_blank" className="font-semibold underline">
            개인정보 수집·이용
          </Link>
          에 동의합니다. (필수)
        </span>
      </label>
    </div>
  );
}
