import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ahr999-3D",
  description: "ahr999-3D 囤币指标，公式为 (Price/200DCA)×(Price/拟合价格)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
