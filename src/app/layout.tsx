import type { Metadata, Viewport } from "next";
import { Nanum_Pen_Script } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { DeskDecor } from "@/components/DeskDecor";

// 마루 부리는 제목과 큰 숫자에만 쓰고 크기가 커서 미리 불러오지 않는다(대체 글꼴로 먼저 그린다).
const maru = localFont({
  src: "./fonts/MaruBuri-Bold.woff2",
  weight: "700",
  variable: "--font-maru",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const pretendard = localFont({
  src: [
    { path: "./fonts/Pretendard-Regular.subset.woff2", weight: "400" },
    { path: "./fonts/Pretendard-SemiBold.subset.woff2", weight: "600" },
    { path: "./fonts/Pretendard-Bold.subset.woff2", weight: "700" },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

// 노트 "Date." 칸의 손글씨 날짜(D42). 숫자와 점만 쓰므로 latin subset만 받는다. 빌드할 때 내려받아 같은 서버에서 제공한다.
const pen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "마음결",
  applicationName: "마음결",
  appleWebApp: { title: "마음결" },
  description: "한 장에 적어 보는 나의 성격과 가치. 5분 안팎, 결과를 복사해 쓰시는 AI에게 해석을 받아 보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // 밝은 테마로만 보여 준다(D24).
  colorScheme: "light",
  themeColor: "#f3eee3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${maru.variable} ${pretendard.variable} ${pen.variable}`}>
      <body>
        {children}
        <DeskDecor />
      </body>
    </html>
  );
}
