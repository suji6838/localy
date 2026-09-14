import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base text-foreground">LOCALY</p>
          <p className="mt-1">Discover Beauty like a local</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/courses" className="hover:text-foreground">
            테마 탐색
          </Link>
          <Link href="/register" className="hover:text-foreground">
            전문가·업체 등록
          </Link>
          <Link href="/booking" className="hover:text-foreground">
            예약하기
          </Link>
          <Link href="/admin" className="hover:text-foreground">
            파트너 어드민
          </Link>
        </div>
      </div>
    </footer>
  );
}
