import Link from "next/link";
import { CATEGORY_COLORS, CATEGORY_NAMES, LEVEL_BADGES } from "@/types";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  level: string;
  publishedAt: string | Date;
}

function formatTime(isoString: string | Date): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function NewsCard({ id, title, summary, source, category, level, publishedAt }: NewsCardProps) {
  const catColor = CATEGORY_COLORS[category] || "#6B6B6B";
  const catName = CATEGORY_NAMES[category] || category;
  const badge = LEVEL_BADGES[level] || { text: level, bg: "#F5F5F5", color: "#1A1A1A" };

  return (
    <Link href={`/news/${id}`} className="block">
      <article className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-8 h-1 rounded-full" style={{ backgroundColor: catColor }} />
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: catColor + "18", color: catColor }}>
            {catName}
          </span>
          <span className="text-xs text-[#6B6B6B] ml-auto">{source}</span>
          <span className="text-xs text-[#6B6B6B]">·</span>
          <span className="text-xs text-[#6B6B6B]">{formatTime(publishedAt)}</span>
        </div>
        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] leading-tight mb-2 line-clamp-2">{title}</h2>
        <p className="font-body text-sm text-[#6B6B6B] leading-english line-clamp-3 mb-3">{summary}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: badge.bg, color: badge.color }}>
            {badge.text}
          </span>
          <span className="text-xs text-[#6B6B6B]">📖 1.2k 精读</span>
        </div>
      </article>
    </Link>
  );
}
