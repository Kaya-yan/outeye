"use client";

import { useState } from "react";
import { AnnotationData } from "@/types";

interface AnnotationPanelProps {
  annotationsJson: string | null;
}

function TermHint({ term, explanation }: { term: string; explanation: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block">
      <span className="text-[#0F4C81] cursor-help font-medium" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {term}
        <span className="text-xs align-super ml-0.5">ⓘ</span>
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1A1A1A] text-white text-xs p-2.5 rounded-lg shadow-lg z-50">
          {explanation}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]" />
        </span>
      )}
    </span>
  );
}

function Section({ title, icon, color, children, defaultOpen = true }: {
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
      <button onClick={() => setOpen(!open)} className={`w-full flex items-center justify-between p-4 text-left ${c.text}`}>
        <span className="text-sm font-bold flex items-center gap-2">{icon} {title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function AnnotationPanel({ annotationsJson }: AnnotationPanelProps) {
  if (!annotationsJson) {
    return (
      <div className="text-center py-8 text-[#6B6B6B]">
        <p className="text-3xl mb-2">📝</p>
        <p className="text-sm">暂无学术注释</p>
      </div>
    );
  }

  let data: AnnotationData;
  try {
    data = JSON.parse(annotationsJson);
  } catch {
    return <div className="text-center py-8 text-[#E63946]"><p className="text-sm">注释数据解析失败</p></div>;
  }

  return (
    <div className="space-y-4">
      {data.rhetoric && data.rhetoric.length > 0 && (
        <Section title="修辞手法" icon="📝" color="purple">
          <div className="space-y-3">
            {data.rhetoric.map((item, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-[#1A1A1A] mb-1">
                  <TermHint term={item.device} explanation={`修辞手法：${item.device}，是一种常见的文学表达技巧。`} />
                </p>
                <p className="text-[#6B6B6B] italic mb-1">&quot;{item.text}&quot;</p>
                <p className="text-[#1A1A1A]">效果：{item.effect}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.translation && data.translation.length > 0 && (
        <Section title="翻译策略" icon="🌐" color="orange">
          <div className="space-y-3">
            {data.translation.map((item, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-[#1A1A1A] mb-1">&quot;{item.phrase}&quot;</p>
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-[#6B6B6B] mb-0.5">归化</p>
                    <p className="text-[#1A1A1A]">{item.domestication}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-[#6B6B6B] mb-0.5">异化</p>
                    <p className="text-[#1A1A1A]">{item.foreignization}</p>
                  </div>
                </div>
                {item.note && <p className="text-xs text-[#6B6B6B]">💡 {item.note}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.culture && data.culture.length > 0 && (
        <Section title="文化背景" icon="🌍" color="green">
          <div className="space-y-3">
            {data.culture.map((item, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-[#1A1A1A] mb-1">
                  <TermHint term={item.term} explanation={`专有名词：${item.term}，是理解本文文化语境的关键概念。`} />
                </p>
                <p className="text-[#1A1A1A] leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.discourse && (
        <Section title="语篇分析" icon="📖" color="blue">
          <p className="text-sm text-[#1A1A1A] leading-relaxed">{data.discourse}</p>
        </Section>
      )}

      {data.vocabulary && data.vocabulary.length > 0 && (
        <Section title="重点词汇" icon="📚" color="blue" defaultOpen={false}>
          <div className="space-y-2">
            {data.vocabulary.map((item, i) => (
              <div key={i} className="text-sm bg-white rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[#1A1A1A]">{item.word}</span>
                  <span className="text-xs text-[#6B6B6B] font-mono">{item.ipa}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                    backgroundColor: item.level === "GRE" ? "#E3F2FD" : item.level === "专八" ? "#FFF3E0" : "#E8F5E9",
                    color: item.level === "GRE" ? "#0F4C81" : item.level === "专八" ? "#F4A261" : "#2A9D8F",
                  }}>{item.level}</span>
                </div>
                <p className="text-[#1A1A1A]">{item.meaning}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">搭配：{item.collocation}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
