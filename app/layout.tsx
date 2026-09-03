import type { Metadata } from "next";
import { Suspense } from "react";
import { FlowBackground } from "@/components/layout/FlowBackground";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/lib/session/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "명리온 | Myeongri:ON",
  description:
    "계산은 엄밀하게, 근거는 투명하게. AI 사주 상담 서비스 명리온.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;650&display=swap"
        />
      </head>
      <body>
        <div className="fixed inset-0 -z-10 bg-canvas" aria-hidden />
        <SessionProvider>
          <Suspense fallback={null}>
            <FlowBackground />
          </Suspense>
          <Header />
          <main className="relative mx-auto min-h-[calc(100dvh-64px)] w-full max-w-[1180px] px-5 pb-16 pt-6 md:px-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
