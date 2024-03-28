import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { Roboto, Noto_Sans_KR } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const notoSansKr = Noto_Sans_KR({
  // preload: true, 기본값
  subsets: ["latin"], // 또는 preload: false
  weight: ["100", "400", "700", "900"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
});

const roboto = Roboto({
  subsets: ["latin"], // preload에 사용할 subsets입니다.
  weight: ["100", "400", "700"],
  variable: "--roboto", // CSS 변수 방식으로 스타일을 지정할 경우에 사용합니다.
});

export const metadata: Metadata = {
  title: "ECShare",
  description: "Collaborative File Sharing System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${cls(notoSansKr.className, roboto.variable)}`} >
        <header>
          <Header />
        </header>
        <main>
          {children}
        </main>
        <footer>
        </footer>
      </body>
    </html>
  );
}

export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};