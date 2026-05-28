'use client';

import { useMemo } from 'react';
import { VocabItem } from '@/types';

interface Props {
  vocabs: VocabItem[];
}

export default function MemoryCurveChart({ vocabs }: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const categories = {
      new: 0,          // 新词（未复习）
      learning: 0,     // 学习中（1-2次）
      mastered: 0,     // 已掌握（3次以上）
      due: 0,          // 待复习
      overdue: 0,      // 逾期未复习
    };

    vocabs.forEach(v => {
      if (v.repetitions === 0) categories.new++;
      else if (v.repetitions < 3) categories.learning++;
      else categories.mastered++;

      const nextReview = new Date(v.nextReview);
      if (nextReview <= now) {
        categories.due++;
        const daysDiff = Math.floor((now.getTime() - nextReview.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) categories.overdue++;
      }
    });

    return categories;
  }, [vocabs]);

  const total = vocabs.length || 1;

  const segments = [
    { label: '新词', count: stats.new, color: '#6B6B6B', percent: (stats.new / total) * 100 },
    { label: '学习中', count: stats.learning, color: '#F4A261', percent: (stats.learning / total) * 100 },
    { label: '已掌握', count: stats.mastered, color: '#2A9D8F', percent: (stats.mastered / total) * 100 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-4">记忆状态分布</h3>

      <div className="flex h-4 rounded-full overflow-hidden mb-4 bg-gray-100">
        {segments.map((seg, i) => (
          seg.percent > 0 && (
            <div
              key={i}
              className="h-full transition-all duration-500"
              style={{
                width: `${seg.percent}%`,
                backgroundColor: seg.color,
              }}
            />
          )
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {segments.map((seg, i) => (
          <div key={i} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-sm text-[#1A1A1A] font-medium">{seg.count}</span>
            </div>
            <p className="text-xs text-[#6B6B6B]">{seg.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="bg-[#0F4C81]/5 p-3 rounded-lg text-center">
          <p className="text-lg font-bold text-[#0F4C81]">{stats.due}</p>
          <p className="text-xs text-[#6B6B6B]">待复习</p>
        </div>
        <div className="bg-[#E63946]/5 p-3 rounded-lg text-center">
          <p className="text-lg font-bold text-[#E63946]">{stats.overdue}</p>
          <p className="text-xs text-[#6B6B6B]">已逾期</p>
        </div>
      </div>
    </div>
  );
}
