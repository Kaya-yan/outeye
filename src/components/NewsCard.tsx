// src/components/NewsCard.tsx —— 单张新闻卡片
// 这是首页信息流的"小砖块"，每篇新闻对应一张卡片

import Link from "next/link";

// ==================== 组件接收的数据接口 ====================
// 就像一张"订货单"，告诉组件：你需要这些食材才能做菜
interface NewsCardProps {
  id: string;           // 新闻唯一编号（用于点击跳转）
  title: string;        // 新闻标题
  summary: string;      // 新闻摘要
  source: string;       // 来源：BBC / Reuters / The Guardian
  category: string;     // 分类：Politics / Economy / Technology / Culture / Society
  level: string;        // 难度：Foundation / Intermediate / Advanced
  publishedAt: string;  // 发布时间（ISO格式字符串）
}

// ==================== 分类颜色映射 ====================
// 方案手册规定：政治=深海蓝，经济=琥珀暖，科技=薄荷绿，文化=紫，社会=青
// 前三个已在 tailwind.config.ts 定义，文化/社会的精确色值后续补充到 Design Token

const CATEGORY_COLORS: Record<string, string> = {
  Politics: "#0F4C81",      // deep-sea 深海蓝
  Economy: "#F4A261",       // amber-warm 琥珀暖
  Technology: "#2A9D8F",    // mint 薄荷绿
  Culture: "#8B5CF6",       // 紫色（文化）
  Society: "#06B6D4",       // 青色（社会）
};

// 分类中文名映射
const CATEGORY_NAMES: Record<string, string> = {
  Politics: "政治",
  Economy: "经济",
  Technology: "科技",
  Culture: "文化",
  Society: "社会",
};

// ==================== 难度徽章样式 ====================
// 基础=浅绿底+薄荷字，进阶=浅橙底+琥珀字，高级=浅蓝底+深海字
const LEVEL_BADGES: Record<string, { text: string; bg: string; color: string }> = {
  Foundation: { text: "基础", bg: "#E8F5E9", color: "#2A9D8F" },
  Intermediate: { text: "进阶", bg: "#FFF3E0", color: "#F4A261" },
  Advanced: { text: "高级", bg: "#E3F2FD", color: "#0F4C81" },
};

// ==================== 时间格式化工具 ====================
// 把 "2026-04-20T08:00:00.000Z" 变成 "2小时前" 或 "4月20日"
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// ==================== 卡片组件 ====================
export default function NewsCard({
  id,
  title,
  summary,
  source,
  category,
  level,
  publishedAt,
}: NewsCardProps) {
  // 取出分类颜色和中文名，如果找不到就用灰色兜底
  const catColor = CATEGORY_COLORS[category] || "#6B6B6B";
  const catName = CATEGORY_NAMES[category] || category;

  // 取出难度徽章样式
  const badge = LEVEL_BADGES[level] || { text: level, bg: "#F5F5F5", color: "#1A1A1A" };

  return (
    // Link 包裹整个卡片，点击后跳转到精读页 /news/[id]
    <Link href={`/news/${id}`} className="block">
      <article
        className="
          bg-white rounded-xl p-4 px-5
          shadow-card hover:shadow-card-hover
          hover:scale-[1.02] hover:-translate-y-1
          transition-all duration-200
          cursor-pointer
        "
      >
        {/* ---------- 顶部行：色条 + 分类标签 + 来源时间 ---------- */}
        <div className="flex items-center gap-2 mb-3">
          {/* 分类色条：一条短粗线 */}
          <span
            className="inline-block w-8 h-1 rounded-full"
            style={{ backgroundColor: catColor }}
          />

          {/* 分类标签：圆角小 pill */}
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: catColor + "18", // 18 = 10% 透明度，浅色底
              color: catColor,
            }}
          >
            {catName}
          </span>

          {/* 来源和时间：靠右对齐 */}
          <span className="text-xs text-ink-light ml-auto">{source}</span>
          <span className="text-xs text-ink-light">·</span>
          <span className="text-xs text-ink-light">{formatTime(publishedAt)}</span>
        </div>

        {/* ---------- 标题 ---------- */}
        {/* font-serif = Playfair Display，text-lg ≈ 18px，line-clamp-2 = 最多两行 */}
        <h2 className="font-serif text-lg font-bold text-ink-charcoal leading-tight mb-2 line-clamp-2">
          {title}
        </h2>

        {/* ---------- 摘要 ---------- */}
        {/* font-body = Merriweather，text-sm ≈ 14px，line-clamp-3 = 最多三行 */}
        <p className="font-body text-sm text-ink-light leading-english line-clamp-3 mb-3">
          {summary}
        </p>

        {/* ---------- 底部：难度徽章 + 阅读数 ---------- */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.text}
          </span>
          <span className="text-xs text-ink-light">📖 1.2k 精读</span>
        </div>
      </article>
    </Link>
  );
}