'use client';

import { TrendingUp, TrendingDown, Minus, BookOpen, Clock, Target, Award } from 'lucide-react';

interface ReportData {
  weekStart: string;
  weekEnd: string;
  wordsLearned: number;
  wordsReviewed: number;
  articlesRead: number;
  studyMinutes: number;
  accuracy: number;
  streak: number;
  topCategories: string[];
  weakWords: string[];
}

interface Props {
  data: ReportData;
}

export default function WeeklyReport({ data }: Props) {
  const getAccuracyIcon = () => {
    if (data.accuracy >= 80) return <TrendingUp size={16} className="text-[#2A9D8F]" />;
    if (data.accuracy >= 60) return <Minus size={16} className="text-[#F4A261]" />;
    return <TrendingDown size={16} className="text-[#E63946]" />;
  };

  const getAccuracyColor = () => {
    if (data.accuracy >= 80) return 'text-[#2A9D8F]';
    if (data.accuracy >= 60) return 'text-[#F4A261]';
    return 'text-[#E63946]';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] p-6 text-white">
        <h3 className="font-serif text-xl font-bold mb-1">周学习报告</h3>
        <p className="text-sm opacity-80">{data.weekStart} - {data.weekEnd}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0F4C81]/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-[#0F4C81]" />
              <span className="text-xs text-[#6B6B6B]">新学词汇</span>
            </div>
            <p className="text-2xl font-bold text-[#0F4C81]">{data.wordsLearned}</p>
          </div>

          <div className="bg-[#2A9D8F]/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-[#2A9D8F]" />
              <span className="text-xs text-[#6B6B6B]">复习词汇</span>
            </div>
            <p className="text-2xl font-bold text-[#2A9D8F]">{data.wordsReviewed}</p>
          </div>

          <div className="bg-[#F4A261]/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-[#F4A261]" />
              <span className="text-xs text-[#6B6B6B]">精读文章</span>
            </div>
            <p className="text-2xl font-bold text-[#F4A261]">{data.articlesRead}</p>
          </div>

          <div className="bg-[#8B5CF6]/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-[#8B5CF6]" />
              <span className="text-xs text-[#6B6B6B]">学习时长</span>
            </div>
            <p className="text-2xl font-bold text-[#8B5CF6]">{data.studyMinutes}分</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            {getAccuracyIcon()}
            <span className="text-sm text-[#1A1A1A]">复习正确率</span>
          </div>
          <span className={`text-lg font-bold ${getAccuracyColor()}`}>{data.accuracy}%</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#F4A261]/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#F4A261]" />
            <span className="text-sm text-[#1A1A1A]">连续打卡</span>
          </div>
          <span className="text-lg font-bold text-[#F4A261]">{data.streak} 天</span>
        </div>

        {data.topCategories.length > 0 && (
          <div>
            <p className="text-sm font-medium text-[#1A1A1A] mb-2">常读分类</p>
            <div className="flex flex-wrap gap-2">
              {data.topCategories.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-[#0F4C81]/10 text-[#0F4C81] text-xs rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.weakWords.length > 0 && (
          <div>
            <p className="text-sm font-medium text-[#1A1A1A] mb-2">薄弱词汇</p>
            <div className="flex flex-wrap gap-2">
              {data.weakWords.map((word, i) => (
                <span key={i} className="px-3 py-1 bg-[#E63946]/10 text-[#E63946] text-xs rounded-full">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
