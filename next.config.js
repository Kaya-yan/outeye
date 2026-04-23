// next.config.js —— Next.js 的"电路总闸"配置文件
// 这里接入 next-pwa 插件，让网站具备"离线可用"和"添加到手机桌面"的能力

const withPWA = require("next-pwa")({
  dest: "public",           // 把 Service Worker（离线服务员）生成到 public 目录
  register: true,          // 自动在浏览器里注册离线服务
  skipWaiting: true,       // 有新版本时立即更新，不等待用户手动刷新
  disable: process.env.NODE_ENV === "development", // 开发模式暂时禁用 PWA（避免缓存干扰调试）
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片域名白名单：允许加载任何 https 图片（外刊网站的配图可能来自不同域名）
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // "**" 表示允许所有域名，课堂演示阶段这样最方便
      },
    ],
  },
  // 实验性功能：开启 Server Actions（Next.js 14 推荐，让前端直接调用后端函数）
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // 允许提交最大 2MB 的数据（AI 注释可能较长）
    },
  },
};

// 把 PWA 能力"包裹"到 Next.js 配置上，然后导出给整个项目使用
module.exports = withPWA(nextConfig);
