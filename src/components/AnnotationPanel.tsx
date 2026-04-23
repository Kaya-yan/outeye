// src/components/AnnotationPanel.tsx —— 学术注释面板
// 解析数据库中的 annotations JSON，显示修辞/翻译/文化/语篇四板块

"use client";

import { useState } from "react";

// ==================== 注释数据的"身份证" ====================
interface AnnotationData {
  vocabulary?: Array<{
    word: string;
    level: string;
    ipa: string;
    meaning: string;
    collocation: string;
  }>;
  rhetoric?: Array<{
    device: string;
    text: string;
    effect: string;
  }>;
  translation?: Array<{
    phrase: string;
    domestication: string;
    foreignization: string;
    note: string;
  }>;
  culture?: Array<{
    term: string;
    explanation: string;
  }>;
  discourse?: string;
}

interface AnnotationPanelProps {
  annotationsJson: string | null; // 数据库里存的是 JSON 字符串
}

// ==================== 术语悬浮提示组件 ====================
function TermHint({ term, explanation }: { term: string; explanation: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className="text-deep-sea cursor-help font-medium"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {term}
        <span className="text-xs align-super ml-0.5">ⓘ</span>
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-ink-charcoal text-white text-xs p-2.5 rounded-lg shadow-lg z-50">
          {explanation}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-charcoal" />
        </span>
      )}
    </span>
  );
}

// ==================== 可折叠板块组件 ====================
function Section({
  title,
  icon,
  color,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    purple: { border: "border-purple-400", bg: "bg-purple-50", text: "text-purple-700" },
    green: { border: "border-green-400", bg: "bg-green-50", text: "text-green-700" },
    blue: { border: "border-blue-400", bg: "bg-blue-50", text: "text-blue-700" },
    orange: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-xl border-l-2 ${c.border} ${c.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-4 text-left ${c.text}`}
      >
        <span className="text-sm font-bold flex items-center gap-2">
          {icon} {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ==================== 主组件 ====================
export default function AnnotationPanel({ annotationsJson }: AnnotationPanelProps) {
  // 如果数据库里没有注释，显示空状态
  if (!annotationsJson) {
    return (
      <div className="text-center py-8 text-ink-light">
        <p className="text-3xl mb-2">📝</p>
        <p className="text-sm">暂无学术注释</p>
      </div>
    );
  }

  // 解析 JSON
  let data: AnnotationData;
  try {
    data = JSON.parse(annotationsJson);
  } catch {
    return (
      <div className="text-center py-8 text-cinnabar">
        <p className="text-sm">注释数据解析失败</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ---------- 修辞手法 ---------- */}
      {data.rhetoric && data.rhetoric.length > 0 && (
        <Section title="修辞手法" icon="📝" color="purple">
          <div className="space-y-3">
            {data.rhetoric.map((item, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-ink-charcoal mb-1">
                  <TermHint
                    term={item.device}
                    explanation={`修辞手法：${item.device}，是一种常见的文学表达技巧。`}
                  />
                </p>
                <p className="text-ink-light italic mb-1">"{item.text}"</p>
                <p className="text-ink-charcoal">效果：{item.effect}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- 翻译策略 ---------- */}
      {data.translation && data.translation.length > 0 && (
        <Section title="翻译策略" icon="🌐" color="orange">
          <div className="space-y-3">
            {data.translation.map((item, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-ink-charcoal mb-1">"{item.phrase}"</p>
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-ink-light mb-0.5">归化</p>
                    <p className="text-ink-charcoal">{item.domestication}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-ink-light mb-0.5">异化</p>
                    <p className="text-ink-charcoal">{item.foreignization}</p>
                  </div>
                </div>
                {item.note && <p className="text-xs text-ink-light">💡 {item.note}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- 文化背景 ---------- */}
      {data.culture && data.culture.length > 0 && (
        <Section title="文化背景" icon="🌍" color="green">
          <div className="space-y-3">
            {data.culture.map((item, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-ink-charcoal mb-1">
                  <TermHint
                    term={item.term}
                    explanation={`专有名词：${item.term}，是理解本文文化语境的关键概念。`}
                  />
                </p>
                <p className="text-ink-charcoal leading-chinese">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- 语篇分析 ---------- */}
      {data.discourse && (
        <Section title="语篇分析" icon="📖" color="blue">
          <p className="text-sm text-ink-charcoal leading-chinese">{data.discourse}</p>
        </Section>
      )}

      {/* ---------- 重点词汇 ---------- */}
      {data.vocabulary && data.vocabulary.length > 0 && (
        <Section title="重点词汇" icon="📚" color="blue" defaultOpen={false}>
          <div className="space-y-2">
            {data.vocabulary.map((item, i) => (
              <div key={i} className="text-sm bg-white rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-ink-charcoal">{item.word}</span>
                  <span className="text-xs text-ink-light font-mono">{item.ipa}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        item.level === "GRE"
                          ? "#E3F2FD"
                          : item.level === "专八"
                          ? "#FFF3E0"
                          : "#E8F5E9",
                      color:
                        item.level === "GRE"
                          ? "#0F4C81"
                          : item.level === "专八"
                          ? "#F4A261"
                          : "#2A9D8F",
                    }}
                  >
                    {item.level}
                  </span>
                </div>
                <p className="text-ink-charcoal">{item.meaning}</p>
                <p className="text-xs text-ink-light mt-0.5">搭配：{item.collocation}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
