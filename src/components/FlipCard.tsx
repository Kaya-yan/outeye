// src/components/FlipCard.tsx
// 作用：3D翻转单词卡片（词汇本的核心视觉组件）

'use client';

import { useState } from 'react';
import { Volume2, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

// 描述一条词汇的数据结构（来自 /api/vocab 返回的JSON）
interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  level: string;           // 四级 / 专四 / 专八 / GRE
  context: string;         // 原文例句
  collocations: string | null;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: string;
  news?: { title: string };
}

interface FlipCardProps {
  vocab: VocabItem;
  onReview: (id: string, quality: number) => Promise<void>; // 评分回调
}

export default function FlipCard({ vocab, onReview }: FlipCardProps) {
  // isFlipped: false=正面，true=背面
  const [isFlipped, setIsFlipped] = useState(false);
  // reviewing: 防止重复点击评分按钮
  const [reviewing, setReviewing] = useState(false);

  // 点击卡片空白处：翻转
  const handleFlip = () => {
    if (!reviewing) setIsFlipped(!isFlipped);
  };

  // 点击评分按钮：提交SRS评分，然后自动翻回正面
  const handleReview = async (e: React.MouseEvent, quality: number) => {
    e.stopPropagation(); // 阻止触发翻转
    setReviewing(true);
    try {
      await onReview(vocab.id, quality);
      setIsFlipped(false); // 评分后翻回正面，准备看下一个单词
    } catch {
      alert('评分保存失败，请刷新重试');
    } finally {
      setReviewing(false);
    }
  };

  // 发音：调用浏览器内置语音合成（免费，离线可用）
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(vocab.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 难度徽章颜色（严格使用项目色彩系统）
  const badgeColors: Record<string, string> = {
    '四级': 'bg-[#0F4C81]/10 text-[#0F4C81]',
    '专四': 'bg-[#2A9D8F]/10 text-[#2A9D8F]',
    '专八': 'bg-[#F4A261]/10 text-[#F4A261]',
    'GRE': 'bg-[#6B6B6B]/10 text-[#6B6B6B]',
  };
  const badge = badgeColors[vocab.level] || 'bg-gray-100 text-gray-600';

  return (
    <div
      className="w-full max-w-sm mx-auto cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-[420px] rounded-xl transition-all"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionDuration: '400ms',
        }}
        onClick={handleFlip}
      >
        {/* ==================== 正面 ==================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-white p-8 flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(15,76,129,0.08)] hover:shadow-[0_8px_24px_rgba(15,76,129,0.15)] hover:-translate-y-1 transition-all"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* 难度徽章 */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium mb-6 ${badge}`}>
            {vocab.level}
          </span>

          {/* 单词：英文标题字体 */}
          <h2 className="font-serif text-4xl font-bold text-[#1A1A1A] mb-3 text-center leading-tight">
            {vocab.word}
          </h2>

          {/* 音标：等宽字体 */}
          <p className="font-mono text-lg text-[#6B6B6B] mb-8">
            {vocab.ipa}
          </p>

          {/* 发音按钮 */}
          <button
            onClick={playAudio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] hover:bg-[#0F4C81]/20 active:scale-95 transition-all"
          >
            <Volume2 size={18} />
            <span className="text-sm font-medium">点击发音</span>
          </button>

          <p className="absolute bottom-5 text-xs text-[#6B6B6B]/60">
            点击卡片查看释义
          </p>
        </div>

        {/* ==================== 背面 ==================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-[#FDFBF7] p-6 flex flex-col shadow-[0_2px_8px_rgba(15,76,129,0.08)]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* 顶部回顾栏 */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A1A1A]/10">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">{vocab.word}</h3>
              <p className="font-mono text-sm text-[#6B6B6B]">{vocab.ipa}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs ${badge}`}>{vocab.level}</span>
              <button onClick={playAudio} className="p-2 rounded-full hover:bg-[#0F4C81]/10 text-[#0F4C81]">
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          {/* 释义 */}
          <div className="mb-3">
            <p className="text-xl text-[#1A1A1A] font-medium leading-relaxed">{vocab.meaning}</p>
          </div>

          {/* 原文语境 */}
          <div className="mb-3 bg-white/80 rounded-lg p-3 border border-[#1A1A1A]/5">
            <p className="text-xs text-[#6B6B6B] mb-1 font-medium">原文语境</p>
            <p className="text-sm text-[#1A1A1A]/80 italic leading-relaxed">"{vocab.context}"</p>
          </div>

          {/* 搭配 */}
          {vocab.collocations && (
            <div className="mb-4">
              <span className="inline-block text-xs font-medium text-[#2A9D8F] bg-[#2A9D8F]/10 px-2.5 py-1 rounded-md">
                搭配：{vocab.collocations}
              </span>
            </div>
          )}

          {/* 复习状态 */}
          <div className="mb-2 text-xs text-[#6B6B6B]">
            已复习 {vocab.repetitions} 次 · 下次 {new Date(vocab.nextReview).toLocaleDateString('zh-CN')}
          </div>

          {/* SRS评分按钮（背面底部固定） */}
          <div className="mt-auto grid grid-cols-3 gap-2">
            <button
              onClick={(e) => handleReview(e, 0)}
              disabled={reviewing}
              className="flex flex-col items-center gap-1 py-3 rounded-lg bg-[#E63946]/10 text-[#E63946] hover:bg-[#E63946]/20 active:scale-95 transition-all disabled:opacity-40"
            >
              <XCircle size={22} />
              <span className="text-xs font-medium">不认识</span>
            </button>
            <button
              onClick={(e) => handleReview(e, 3)}
              disabled={reviewing}
              className="flex flex-col items-center gap-1 py-3 rounded-lg bg-[#F4A261]/10 text-[#F4A261] hover:bg-[#F4A261]/20 active:scale-95 transition-all disabled:opacity-40"
            >
              <HelpCircle size={22} />
              <span className="text-xs font-medium">模糊</span>
            </button>
            <button
              onClick={(e) => handleReview(e, 5)}
              disabled={reviewing}
              className="flex flex-col items-center gap-1 py-3 rounded-lg bg-[#2A9D8F]/10 text-[#2A9D8F] hover:bg-[#2A9D8F]/20 active:scale-95 transition-all disabled:opacity-40"
            >
              <CheckCircle size={22} />
              <span className="text-xs font-medium">认识</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}