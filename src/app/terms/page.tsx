import { LEGAL_EFFECTIVE_DATE, TERMS_SECTIONS } from "@/lib/legal";

export const metadata = { title: "이용약관 — LOCALY" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent">LEGAL</p>
      <h1 className="font-display mt-3 text-3xl font-bold">이용약관</h1>
      <p className="mt-2 text-sm text-muted">시행일 {LEGAL_EFFECTIVE_DATE}</p>

      <div className="mt-10 space-y-8">
        {TERMS_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-semibold">{section.title}</h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground/80">
              {section.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
