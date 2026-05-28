"use client";

import Link from "next/link";
import { CATEGORY_COLORS, CATEGORY_NAMES, LEVEL_BADGES, ParagraphTranslation, ComplexSentence } from "@/types";
import { ArrowLeft, ExternalLink, Clock, BookOpen, Layers } from "lucide-react";
import { ReactNode } from "react";
import ParagraphView from "@/components/ParagraphView";
import ComplexSentenceView from "@/components/ComplexSentenceView";
import ReadingProgress from "@/components/ReadingProgress";

interface Props {
  news: {
    id: string;
    title: string;
    summary: string;
    content?: string | null;
    source: string;
    sourceUrl: string;
    category: string;
    level: string;
    publishedAt: string | Date;
    wordCount?: number | null;
    readingTime?: number | null;
  };
  paragraphTranslations: ParagraphTranslation[];
  complexSentences: ComplexSentence[];
  children: ReactNode;
}

export default function NewsDetailClient({ news, paragraphTranslations, complexSentences, children }: Props) {
  const catColor = CATEGORY_COLORS[news.category] || "#6B6B6B";
  const catName = CATEGORY_NAMES[news.category] || news.category;
  const levelBadge = LEVEL_BADGES[news.level] || { text: news.level, bg: "#F5F5F5", color: "#1A1A1A" };

  return (
    <>
      <ReadingProgress newsId={news.id} />

      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-30">
        <div
          id="reading-progress-bar"
          className="h-full bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] w-0 transition-all duration-150"
        />
      </div>

      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-14 flex items-center px-4 gap-3">
        <Link href="/" className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#0F4C81] transition-colors">
          <ArrowLeft size={16} />
          返回
        </Link>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: catColor + "18", color: catColor }}
        >
          {catName}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: levelBadge.bg, color: levelBadge.color }}
        >
          {levelBadge.text}
        </span>
        <span className="text-xs text-[#6B6B6B] ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {news.wordCount || '—'} 词
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {news.readingTime || '—'} 分钟
          </span>
          <span>{news.source}</span>
        </span>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <article className="w-full md:w-[65%] px-4 md:px-12 py-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4 leading-tight">
            {news.title}
          </h1>

          <p className="text-base text-[#6B6B6B] mb-8 leading-relaxed font-body border-l-4 border-[#0F4C81] pl-4 py-2 bg-[#0F4C81]/5 rounded-r-lg">
            {news.summary}
          </p>

          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F4C81] text-white text-sm rounded-lg hover:bg-[#0F4C81]/90 transition-colors"
            >
              阅读原文
              <ExternalLink size={14} />
            </a>
            <span className="text-xs text-[#6B6B6B]">
              发布于 {new Date(news.publishedAt).toLocaleDateString("zh-CN")}
            </span>
          </div>

          {news.content && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[#0F4C81] rounded-full" />
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">全文精读</h2>
              </div>

              <div className="bg-[#FDFBF7] rounded-xl p-6 md:p-8 border border-[#0F4C81]/10">
                <ParagraphView
                  content={news.content}
                  translations={paragraphTranslations}
                />
              </div>
            </div>
          )}

          {complexSentences.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[#8B5CF6] rounded-full" />
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">句法分析</h2>
              </div>
              <ComplexSentenceView sentences={complexSentences} />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={20} className="text-[#2A9D8F]" />
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">学习要点</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F4C81]/5 p-4 rounded-xl">
                <p className="text-2xl font-bold text-[#0F4C81]">
                  {paragraphTranslations.length}
                </p>
                <p className="text-xs text-[#6B6B6B]">段落翻译</p>
              </div>
              <div className="bg-[#8B5CF6]/5 p-4 rounded-xl">
                <p className="text-2xl font-bold text-[#8B5CF6]">
                  {complexSentences.length}
                </p>
                <p className="text-xs text-[#6B6B6B]">长难句</p>
              </div>
            </div>
          </div>
        </article>

        {children}
      </main>
    </>
  );
}
