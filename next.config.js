// next.config.js —— Next.js 的"电路总闸"配置文件

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 构建时忽略 ESLint 报错（MVP 演示阶段，避免非致命警告阻断部署）
  eslint: { ignoreDuringBuilds: true },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = withPWA(nextConfig);