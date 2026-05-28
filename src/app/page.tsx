"use client";

import { useState, useEffect, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import CategoryTabs from "@/components/CategoryTabs";
import AuthButton from "@/components/AuthButton";
import BottomNav from "@/components/BottomNav";
import { NewsCardSkeleton } from "@/components/Skeleton";
import { NewsItem } from "@/types";
import { Search } from "lucide-react";

function getTodayString(): string {
  const now = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${weekdays[now.getDay()]}，${now.getMonth() + 1}月${now.getDate()}日`;
}

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = useCallback(async (pageNum: number, cat: string | null, append: boolean) => {
    setLoading(true);
    setError("");

    try {
      const url = new URL("/api/news", window.location.origin);
      if (cat) url.searchParams.set("category", cat);
      url.searchParams.set("page", String(pageNum));

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "加载失败");

      setNews((prev) => (append ? [...prev, ...data.news] : data.news));
      setHasMore(data.hasMore);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setInitialLoading(true);
    fetchNews(1, category, false);
  }, [category, fetchNews]);

  useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
        if (nearBottom && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchNews(page, category, true);
  }, [page, category, fetchNews]);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Search size={20} className="text-[#1A1A1A]" />
        </button>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F4C81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="font-serif text-lg font-bold text-[#0F4C81]">外眼</span>
          <span className="font-serif text-sm text-[#0F4C81]/70">OutEye</span>
        </div>
        <AuthButton />
      </header>

      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <span className="text-sm text-[#1A1A1A] font-medium">{getTodayString()}</span>
        <span className="text-sm text-[#6B6B6B]">连续精读 🔥 7 天</span>
      </div>

      <CategoryTabs activeCategory={category} onCategoryChange={setCategory} />

      <main className="px-4 py-4 space-y-4">
        {error && (
          <div className="bg-[#E63946]/10 text-[#E63946] text-sm p-3 rounded-xl text-center">⚠️ {error}</div>
        )}

        {initialLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {news.map((item, index) => (
              <div key={item.id}>
                <NewsCard
                  id={item.id}
                  title={item.title}
                  summary={item.summary}
                  source={item.source}
                  category={item.category}
                  level={item.level}
                  publishedAt={item.publishedAt}
                />
                {(index + 1) % 10 === 0 && (
                  <div className="bg-[#F4A261]/10 text-[#F4A261] text-sm text-center py-3 rounded-xl">
                    📚 今日已读 {index + 1} 篇，休息一下叭
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-center py-4 text-[#6B6B6B] text-sm">
                <span className="inline-block w-4 h-4 border-2 border-[#0F4C81]/30 border-t-[#0F4C81] rounded-full animate-spin mr-2" />
                正在加载更多...
              </div>
            )}

            {!hasMore && news.length > 0 && (
              <div className="text-center py-4 text-[#6B6B6B] text-sm">— 已加载全部 {news.length} 篇新闻 —</div>
            )}

            {!loading && news.length === 0 && !error && (
              <div className="text-center py-12 text-[#6B6B6B]">
                <p className="text-4xl mb-2">📭</p>
                <p>该分类下暂无新闻</p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
