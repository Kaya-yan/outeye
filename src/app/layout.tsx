import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastContainer from "@/components/Toast";

export const metadata: Metadata = {
  title: "外眼 OutEye — 英专生外刊精读工具",
  description: "向外看，向内长。See the World, Grow Within.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0F4C81",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Merriweather:wght@300;400;700&family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@chinese-fonts/lxgwwenkai/dist/LXGWWenKai-Regular/result.css"
        />
      </head>
      <body className="antialiased font-sans">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
