'use client';

import { BookOpen, PenTool, ListChecks, Shuffle } from 'lucide-react';

export type ReviewMode = 'recognition' | 'spelling' | 'context' | 'definition';

interface Props {
  onSelect: (mode: ReviewMode) => void;
  vocabCount: number;
}

const modes = [
  {
    id: 'recognition' as ReviewMode,
    name: '翻卡认词',
    desc: '传统翻转卡片，快速复习',
    icon: BookOpen,
    color: '#0F4C81',
    difficulty: '简单',
  },
  {
    id: 'definition' as ReviewMode,
    name: '释义选择',
    desc: '看单词选释义，强化词义记忆',
    icon: ListChecks,
    color: '#2A9D8F',
    difficulty: '中等',
  },
  {
    id: 'context' as ReviewMode,
    name: '语境填词',
    desc: '根据原文语境选择正确单词',
    icon: Shuffle,
    color: '#F4A261',
    difficulty: '较难',
  },
  {
    id: 'spelling' as ReviewMode,
    name: '拼写练习',
    desc: '根据释义拼写单词，深度记忆',
    icon: PenTool,
    color: '#8B5CF6',
    difficulty: '最难',
  },
];

export default function ReviewModeSelector({ onSelect, vocabCount }: Props) {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">选择复习模式</h2>
        <p className="text-sm text-[#6B6B6B]">共 {vocabCount} 个待复习单词</p>
      </div>

      <div className="space-y-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className="w-full bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${mode.color}15`, color: mode.color }}
                >
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[#1A1A1A]">{mode.name}</h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${mode.color}15`, color: mode.color }}
                    >
                      {mode.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B]">{mode.desc}</p>
                </div>
                <div className="text-[#6B6B6B] group-hover:text-[#0F4C81] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
