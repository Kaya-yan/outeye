// src/app/page.tsx —— 外眼首页（总指挥）
// 这个文件把导航栏、分类标签、新闻卡片拼在一起，组成完整的首页
// 因为需要用户交互（点击标签、滚动加载），所以标记为客户端组件

"use client";

import { useState, useEffect, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import CategoryTabs from "@/components/CategoryTabs";
import { useRouter } from 'next/navigation';
import AuthButton from '@/components/AuthButton';
// ==================== 新闻数据的"身份证"形状 ====================
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  level: string;
  imageUrl: string | null;
  publishedAt: string;
}

// ==================== 日期格式化工具 ====================
function getTodayString(): string {
  const now = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${weekdays[now.getDay()]}，${now.getMonth() + 1}月${now.getDate()}日`;
}

// ==================== 首页组件 ====================
export default function HomePage() {
  // ---------- 状态管理（React的"记忆便签"）----------
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);       // 已加载的新闻列表
  const [category, setCategory] = useState<string | null>(null); // 当前分类
  const [page, setPage] = useState(1);                      // 当前页码
  const [loading, setLoading] = useState(false);           // 是否正在加载
  const [hasMore, setHasMore] = useState(true);            // 还有没有更多
  const [error, setError] = useState("");                 // 错误信息

  // ---------- 从API"水龙头"接水 ----------
  const fetchNews = useCallback(
    async (pageNum: number, cat: string | null, append: boolean) => {
      // append=true 表示"追加"（滚动加载更多），false 表示"替换"（切换分类）
      setLoading(true);
      setError("");

      try {
        // 组装网址：如果有分类就加 ?category=xxx，再加 &page=n
        const url = new URL("/api/news", window.location.origin);
        if (cat) url.searchParams.set("category", cat);
        url.searchParams.set("page", String(pageNum));

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "加载失败");

        if (append) {
          // 追加模式：把新数据接到旧列表后面
          setNews((prev) => [...prev, ...data.news]);
        } else {
          // 替换模式：全新分类，清空旧列表
          setNews(data.news);
        }

        setHasMore(data.hasMore);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ---------- 首次加载 + 分类切换 ----------
  useEffect(() => {
    setPage(1);
    fetchNews(1, category, false);
  }, [category, fetchNews]);

  // ---------- 无限滚动 ----------
  // 监听页面滚动：快到底部时，自动加载下一页
  useEffect(() => {
    function handleScroll() {
      // 距离底部还有 200px 时触发加载
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (nearBottom && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // page 变化时加载更多
  useEffect(() => {
    if (page > 1) {
      fetchNews(page, category, true);
    }
  }, [page, category, fetchNews]);

  // ---------- 渲染 ----------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ==================== 顶部导航栏 ==================== */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        {/* 左侧：搜索图标 */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink-charcoal"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        {/* 中央：Logo */}
        <div className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0F4C81"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="font-serif text-lg font-bold text-deep-sea">外眼</span>
          <span className="font-serif text-sm text-deep-sea/70">OutEye</span>
        </div>

        {/* 右侧：用户头像（未登录显示登录按钮） */}
<div className="flex items-center">
  <AuthButton />
</div>
      </header>

      {/* ==================== 日期问候条 ==================== */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <span className="text-sm text-ink-charcoal font-medium">{getTodayString()}</span>
        <span className="text-sm text-ink-light">连续精读 🔥 7 天</span>
      </div>

      {/* ==================== 分类标签栏 ==================== */}
      <CategoryTabs activeCategory={category} onCategoryChange={setCategory} />

      {/* ==================== 新闻信息流 ==================== */}
      <main className="px-4 py-4 space-y-4">
        {/* 错误提示 */}
        {error && (
          <div className="bg-cinnabar/10 text-cinnabar text-sm p-3 rounded-xl text-center">
            ⚠️ {error}
          </div>
        )}

        {/* 新闻卡片列表 */}
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
            {/* 每10篇插入一个"休息提示"卡片 */}
            {(index + 1) % 10 === 0 && (
              <div className="bg-amber-warm/10 text-amber-warm text-sm text-center py-3 rounded-xl">
                📚 今日已读 {index + 1} 篇，休息一下叭
              </div>
            )}
          </div>
        ))}

        {/* 加载中提示 */}
        {loading && (
          <div className="text-center py-4 text-ink-light text-sm">
            <span className="inline-block w-4 h-4 border-2 border-deep-sea/30 border-t-deep-sea rounded-full animate-spin mr-2" />
            正在加载更多...
          </div>
        )}

        {/* 没有更多 */}
        {!hasMore && news.length > 0 && (
          <div className="text-center py-4 text-ink-light text-sm">
            — 已加载全部 {news.length} 篇新闻 —
          </div>
        )}

        {/* 空状态 */}
        {!loading && news.length === 0 && !error && (
          <div className="text-center py-12 text-ink-light">
            <p className="text-4xl mb-2">📭</p>
            <p>该分类下暂无新闻</p>
          </div>
        )}
      </main>

      {/* ==================== 底部导航（移动端PWA） ==================== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-14 flex items-center justify-around z-50">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-0.5 text-deep-sea">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="text-[10px]">首页</span>
        </button>
        <button onClick={() => router.push('/vocab')} className="flex flex-col items-center gap-0.5 text-ink-light">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          <span className="text-[10px]">词汇本</span>
        </button>
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-0.5 text-ink-light">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[10px]">我的</span>
        </button>
      </nav>
    </div>
  );
}