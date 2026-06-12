import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "一块 Blackwell GPU 的环球旅行",
  description: "基于 Scrutica 供应链数据，追踪 NVIDIA AI 硬件从设计到部署的全球地理链条。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
