// tailwind.config.ts —— 外眼的装修色卡与字体规范
// 这个文件定义了全站所有颜色、字体、阴影的"昵称"
// 以后写代码时，比如写 "text-deep-sea" 就会自动变成深海蓝色

import type { Config } from "tailwindcss";

const config: Config = {
  // 告诉 Tailwind：去这些文件夹里扫描，看看哪些类名被用到了
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    // extend = 在默认配置基础上"追加"我们的自定义设计
    extend: {
      // ==================== 色彩系统 ====================
      // 这些名字来自《外眼设计手册》，必须严格对应
      colors: {
        "deep-sea": "#0F4C81",      // 主色：导航栏、政治标签、Logo
        "amber-warm": "#F4A261",    // 辅色：CTA按钮、经济标签
        "mint": "#2A9D8F",          // 强调色：成功状态、科技标签、打卡
        "rice-paper": "#FDFBF7",    // 精读页原文区背景（宣纸白）
        "ink-charcoal": "#1A1A1A",  // 正文主色（墨炭黑）
        "ink-light": "#6B6B6B",     // 摘要、时间戳（淡墨色）
        "cinnabar": "#E63946",      // 警示色（朱砂红），极少使用
        "night-ink": "#1E1E1E",     // 深夜模式背景
        "night-text": "#E8E6E3",    // 深夜模式文字
      },

      // ==================== 字体栈 ====================
      // 这里给每种场景起"字体昵称"，方便全局统一调用
      fontFamily: {
        // 默认无衬线：中文正文、UI文字
        sans: ["LXGW WenKai", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        // 英文标题：新闻标题、大标题
        serif: ["Playfair Display", "LXGW WenKai", "serif"],
        // 英文正文：新闻摘要、段落
        body: ["Merriweather", "LXGW WenKai", "serif"],
        // 等宽字体：音标、代码、数据
        mono: ["JetBrains Mono", "LXGW WenKai", "monospace"],
      },

      // ==================== 阴影系统 ====================
      boxShadow: {
        // 卡片默认阴影：淡淡的深海蓝阴影
        card: "0 2px 8px rgba(15, 76, 129, 0.08)",
        // 卡片悬停阴影：更深+上浮效果配合用
        "card-hover": "0 8px 24px rgba(15, 76, 129, 0.15)",
      },

      // ==================== 圆角与行高 ====================
      borderRadius: {
        xl: "12px", // 卡片统一圆角：12像素
      },
      lineHeight: {
        chinese: "1.8", // 中文精读行高
        english: "1.6", // 英文精读行高
      },
    },
  },
  
  plugins: [],
};

export default config;