// src/app/news/[id]/page.tsx —— 精读页主框架
// 用户点击新闻卡片后进入的页面，左右分栏布局

import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import AnnotationPanel from "@/components/AnnotationPanel";
import AddToVocabButton from "@/components/AddToVocabButton";
const prisma = new PrismaClient();

// ==================== 从数据库拿单篇新闻 ====================
async function getNews(id: string) {
  const news = await prisma.news.findUnique({
    where: { id },
  });
  if (!news) return null;
  return news;
}

// ==================== 页面组件 ====================
export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
    const news = await getNews(params.id);

  

  if (!news) {
    notFound();
  }

// 解析学术注释JSON，提取词汇列表给"加入词汇本"按钮用
const annotations = news.annotations ? JSON.parse(news.annotations) : null;
const vocabList = annotations?.vocabulary?.map((v: any) => ({
  word: v.word,
  ipa: v.ipa || '',
  meaning: v.meaning || '',
  level: v.level || '专四',
  context: v.context || news.summary.substring(0, 100),
  collocations: v.collocation || v.collocations || '',
})) || [];

  return (
    <div className="min-h-screen bg-rice-paper">
      {/* ---------- 顶部进度条（深海蓝，随滚动填充）---------- */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gray-200 z-30">
        <div className="h-full bg-deep-sea w-0 transition-all duration-300" id="reading-progress" />
      </div>

      {/* ---------- 顶部导航 ---------- */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-14 flex items-center px-4 gap-3">
        {/* 返回按钮 */}
        <a
          href="/"
          className="flex items-center gap-1 text-sm text-ink-light hover:text-deep-sea transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回
        </a>

        {/* 分类标签 */}
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: {
              Politics: "#0F4C8118",
              Economy: "#F4A26118",
              Technology: "#2A9D8F18",
              Culture: "#8B5CF618",
              Society: "#06B6D418",
            }[news.category] || "#F5F5F5",
            color: {
              Politics: "#0F4C81",
              Economy: "#F4A261",
              Technology: "#2A9D8F",
              Culture: "#8B5CF6",
              Society: "#06B6D4",
            }[news.category] || "#1A1A1A",
          }}
        >
          {news.category}
        </span>

        {/* 来源和时间 */}
        <span className="text-xs text-ink-light ml-auto">
          {news.source} · {new Date(news.publishedAt).toLocaleDateString("zh-CN")}
        </span>
      </header>

      {/* ---------- 桌面端左右分栏 / 移动端上下堆叠 ---------- */}
      <main className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* ====== 左侧：原文区（65%） ====== */}
        <article className="w-full md:w-[65%] px-4 md:px-12 py-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-charcoal mb-6 leading-tight">
            {news.title}
          </h1>

          {/* iframe 策略：先尝试加载原文，3秒超时则降级为摘要卡片 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
            <iframe
              src={news.sourceUrl}
              className="w-full h-[600px] border-0"
              sandbox="allow-same-origin allow-scripts"
              
            />
          </div>

          {/* Fallback 摘要（如果 iframe 加载失败会显示这个） */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-charcoal mb-3">新闻摘要</h2>
            <p className="font-body text-base text-ink-charcoal leading-english mb-4">
              {news.summary}
            </p>
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-deep-sea hover:underline"
            >
              阅读原文
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </article>

        {/* ====== 右侧：学术注释面板（35%） ====== */}
        <aside className="w-full md:w-[35%] border-l border-gray-200 bg-white">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
            <h2 className="font-serif text-lg font-bold text-ink-charcoal mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-deep-sea rounded-full" />
              学术注释
            </h2>

                        <AnnotationPanel annotationsJson={news.annotations} />

            {/* 加入词汇本按钮 */}
            <div className="mt-6">
              <AddToVocabButton newsId={news.id} vocabList={vocabList} />
            </div>
          </div>
        </aside>
          
      </main>
    </div>
  );
}