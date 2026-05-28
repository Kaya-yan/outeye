'use client';

import { useMemo } from 'react';

interface Props {
  data: number[];
  labels?: string[];
}

export default function WeeklyChart({ data, labels }: Props) {
  const max = Math.max(...data, 1);

  const defaultLabels = ['一', '二', '三', '四', '五', '六', '日'];
  const chartLabels = labels || defaultLabels;

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((value, i) => {
        const height = (value / max) * 100;
        const isToday = i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0);

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-[#6B6B6B] font-medium">{value}</span>
            <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  isToday
                    ? 'bg-gradient-to-t from-[#0F4C81] to-[#2A9D8F]'
                    : value > 0
                      ? 'bg-[#0F4C81]/20 hover:bg-[#0F4C81]/30'
                      : 'bg-gray-100'
                }`}
                style={{ height: `${Math.max(height, 4)}%` }}
              />
            </div>
            <span className={`text-xs ${isToday ? 'text-[#0F4C81] font-bold' : 'text-[#6B6B6B]'}`}>
              {chartLabels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
