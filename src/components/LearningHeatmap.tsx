'use client';

import { useMemo } from 'react';

interface Props {
  data: Record<string, number>;
}

export default function LearningHeatmap({ data }: Props) {
  const weeks = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let w = 11; w >= 0; w--) {
      const week = [];
      for (let d = 6; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split('T')[0];
        const count = data[dateStr] || 0;

        week.push({
          date: date.getDate(),
          count,
          isToday: w === 0 && d === 0,
        });
      }
      result.push(week);
    }

    return result;
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-[#0F4C81]/20';
    if (count <= 5) return 'bg-[#0F4C81]/40';
    if (count <= 10) return 'bg-[#0F4C81]/60';
    return 'bg-[#0F4C81]';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-4">学习热力图</h3>

      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 flex-1">
            {week.map((day, di) => (
              <div
                key={di}
                className={`aspect-square rounded-sm ${getColor(day.count)} ${
                  day.isToday ? 'ring-2 ring-[#0F4C81] ring-offset-1' : ''
                }`}
                title={`${day.date}日: ${day.count} 个单词`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-[#6B6B6B]">少</span>
        {[0, 2, 5, 10].map(count => (
          <div key={count} className={`w-3 h-3 rounded-sm ${getColor(count)}`} />
        ))}
        <span className="text-[10px] text-[#6B6B6B]">多</span>
      </div>
    </div>
  );
}
