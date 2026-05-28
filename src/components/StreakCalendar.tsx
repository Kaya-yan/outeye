'use client';

import { useMemo } from 'react';

interface Props {
  streak: number;
}

export default function StreakCalendar({ streak }: Props) {
  const days = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      const dayName = dayNames[date.getDay()];
      const isToday = i === 0;
      const hasStreak = i < streak;

      result.push({
        day: dayName,
        date: date.getDate(),
        isToday,
        hasStreak,
      });
    }

    return result;
  }, [streak]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">连续打卡</h3>
        <div className="flex items-center gap-1.5 bg-[#F4A261]/10 text-[#F4A261] px-3 py-1.5 rounded-full text-sm font-medium">
          <span>🔥</span>
          <span>{streak} 天</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              day.isToday
                ? 'bg-[#0F4C81] text-white'
                : day.hasStreak
                  ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]'
                  : 'bg-gray-50 text-[#6B6B6B]'
            }`}
          >
            <span className="text-[10px] mb-1">{day.day}</span>
            <span className="text-sm font-medium">{day.date}</span>
            {day.hasStreak && !day.isToday && (
              <span className="text-[10px] mt-0.5">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
