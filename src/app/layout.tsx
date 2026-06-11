import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "一块 Blackwell GPU 的环球旅行",
  description: "A minimal editorial prototype mapping NVIDIA AI hardware supply-chain relationships.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
