import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://localy-khaki.vercel.app"),
  title: "LOCALY — Discover Beauty like a local",
  description:
    "뷰티·웰니스 코스를 큐레이션하고, 현지 전문가와 업체를 연결하는 서비스 LOCALY.",
  openGraph: {
    title: "LOCALY — Discover Beauty like a local",
    description:
      "뷰티·웰니스 코스를 큐레이션하고, 현지 전문가와 업체를 연결하는 서비스 LOCALY.",
    url: "https://localy-khaki.vercel.app",
    siteName: "LOCALY",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCALY — Discover Beauty like a local",
    description:
      "뷰티·웰니스 코스를 큐레이션하고, 현지 전문가와 업체를 연결하는 서비스 LOCALY.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="google-identity-script" src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
