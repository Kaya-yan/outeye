// src/app/layout.tsx —— 全站的"装修基底"
// 每个页面都会"套"在这个布局里，就像每间房都有相同的地板和天花板

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ==================== 英文字体加载 ====================
// next/font 会自动优化：只下载网页上用到的字符，不会把整个字体文件拖下来
// 这就像印刷厂只印你需要的几页，而不是整本书

const playfair = Playfair_Display({
  subsets: ["latin"],        // 只加载拉丁字母（英文），不加载阿拉伯语等
  display: "swap",            // 字体加载期间先用系统字体顶着，加载完瞬间切换，避免"白屏"
  variable: "--font-playfair", // 生成 CSS 变量，方便全局引用
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // 加载细、常规、粗三种粗细
  display: "swap",
  variable: "--font-merriweather",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

// ==================== 页面元信息 ====================
// 这些会注入到 HTML 的 <head> 里，浏览器标签页和搜索引擎都能看到

export const metadata: Metadata = {
  title: "外眼 OutEye — 英专生外刊精读工具",
  description: "向外看，向内长。See the World, Grow Within.",
};

export const viewport: Viewport = {
  themeColor: "#0F4C81", // 手机浏览器顶部状态栏颜色（深海蓝）
};

// ==================== 根布局组件 ====================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // children 就是每个具体页面的内容
}) {
  return (
    <html
      lang="zh-CN"
      className={`${playfair.variable} ${merriweather.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* 霞鹜文楷（LXGW WenKai）中文字体 CDN */}
        {/* 中文字体文件很大（几MB），通过 CDN 按需加载，用户访问时才下载 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@chinese-fonts/lxgwwenkai/dist/LXGWWenKai-Regular/result.css"
        />
      </head>
      {/* 
        bg-white: 默认白底
        text-ink-charcoal: 默认文字墨炭黑（来自 tailwind.config.ts）
        antialiased: 让文字边缘更平滑（Mac/Retina 屏幕尤其明显）
        font-sans: 使用 tailwind.config.ts 里定义的 sans 字体栈（霞鹜文楷优先）
      */}
      <body className="bg-white text-ink-charcoal antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
