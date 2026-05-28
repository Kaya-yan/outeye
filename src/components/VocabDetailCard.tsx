'use client';

import { useState } from 'react';
import { X, Volume2, ChevronDown, ChevronUp, BookOpen, Link2, ArrowRight } from 'lucide-react';
import { VocabItem } from '@/types';

interface Props {
  vocab: VocabItem;
  onClose: () => void;
}

export default function VocabDetailCard({ vocab, onClose }: Props) {
  const [showExtended, setShowExtended] = useState(false);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(vocab.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const synonyms: string[] = vocab.synonyms ? JSON.parse(vocab.synonyms) : [];
  const antonyms: string[] = vocab.antonyms ? JSON.parse(vocab.antonyms) : [];
  const derivatives: string[] = vocab.derivatives ? JSON.parse(vocab.derivatives) : [];

  const badgeColors: Record<string, string> = {
    '四级': 'bg-[#0F4C81]/10 text-[#0F4C81]',
    '专四': 'bg-[#2A9D8F]/10 text-[#2A9D8F]',
    '专八': 'bg-[#F4A261]/10 text-[#F4A261]',
    'GRE': 'bg-[#6B6B6B]/10 text-[#6B6B6B]',
  };
  const badge = badgeColors[vocab.level] || 'bg-gray-100 text-gray-600';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>{vocab.level}</span>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">{vocab.word}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[#6B6B6B]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <p className="font-mono text-lg text-[#6B6B6B]">{vocab.ipa}</p>
            <button
              onClick={playAudio}
              className="p-2 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] hover:bg-[#0F4C81]/20 transition-colors"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div>
            <p className="text-xl text-[#1A1A1A] font-medium">{vocab.meaning}</p>
          </div>

          <div className="bg-[#FDFBF7] rounded-xl p-4 border border-[#0F4C81]/10">
            <p className="text-xs text-[#6B6B6B] mb-2 font-medium flex items-center gap-1">
              <BookOpen size={12} /> 原文语境
            </p>
            <p className="text-sm text-[#1A1A1A] italic leading-relaxed">
              &ldquo;{vocab.context}&rdquo;
            </p>
            {vocab.news?.title && (
              <p className="text-xs text-[#6B6B6B] mt-2">
                —— 选自《{vocab.news.title}》
              </p>
            )}
          </div>

          {vocab.collocations && (
            <div>
              <p className="text-xs text-[#6B6B6B] mb-2 font-medium flex items-center gap-1">
                <Link2 size={12} /> 常用搭配
              </p>
              <span className="inline-block px-3 py-1.5 bg-[#2A9D8F]/10 text-[#2A9D8F] text-sm rounded-lg">
                {vocab.collocations}
              </span>
            </div>
          )}

          <button
            onClick={() => setShowExtended(!showExtended)}
            className="flex items-center gap-2 w-full px-4 py-3 bg-[#0F4C81]/5 rounded-xl text-[#0F4C81] text-sm font-medium hover:bg-[#0F4C81]/10 transition-colors"
          >
            {showExtended ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showExtended ? '收起扩展信息' : '查看更多扩展信息'}
          </button>

          {showExtended && (
            <div className="space-y-4">
              {vocab.etymology && (
                <div className="bg-[#8B5CF6]/5 p-4 rounded-xl">
                  <p className="text-xs text-[#8B5CF6] mb-1 font-medium">词根词缀</p>
                  <p className="text-sm text-[#1A1A1A]">{vocab.etymology}</p>
                </div>
              )}

              {synonyms.length > 0 && (
                <div>
                  <p className="text-xs text-[#6B6B6B] mb-2 font-medium">同义词</p>
                  <div className="flex flex-wrap gap-2">
                    {synonyms.map((word, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] text-sm rounded-lg">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {antonyms.length > 0 && (
                <div>
                  <p className="text-xs text-[#6B6B6B] mb-2 font-medium">反义词</p>
                  <div className="flex flex-wrap gap-2">
                    {antonyms.map((word, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#E63946]/10 text-[#E63946] text-sm rounded-lg">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {derivatives.length > 0 && (
                <div>
                  <p className="text-xs text-[#6B6B6B] mb-2 font-medium">派生词</p>
                  <div className="space-y-2">
                    {derivatives.map((word, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                        <ArrowRight size={12} className="text-[#F4A261]" />
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-[#0F4C81]">{vocab.repetitions}</p>
                <p className="text-xs text-[#6B6B6B]">已复习</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#2A9D8F]">
                  {Math.round(vocab.easeFactor * 100) / 100}
                </p>
                <p className="text-xs text-[#6B6B6B]">易度系数</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#F4A261]">{vocab.interval}天</p>
                <p className="text-xs text-[#6B6B6B]">复习间隔</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
