'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Layers, Lightbulb } from 'lucide-react';
import { ComplexSentence } from '@/types';

interface Props {
  sentences: ComplexSentence[];
}

export default function ComplexSentenceView({ sentences }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sentences || sentences.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
        <Layers size={20} className="text-[#8B5CF6]" />
        长难句分析
      </h3>

      {sentences.map((item, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-[#8B5CF6]/20 overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full p-4 text-left hover:bg-[#8B5CF6]/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-[#1A1A1A] leading-relaxed italic">
                    &ldquo;{item.sentence}&rdquo;
                  </p>
                </div>
                <div className="flex-shrink-0 text-[#8B5CF6]">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-[#8B5CF6]/10">
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-[#8B5CF6]" />
                    <span className="text-sm font-medium text-[#8B5CF6]">句子结构</span>
                  </div>
                  <p className="text-sm text-[#1A1A1A] bg-[#8B5CF6]/5 p-3 rounded-lg">
                    {item.structure}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={16} className="text-[#F4A261]" />
                    <span className="text-sm font-medium text-[#F4A261]">解析</span>
                  </div>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                {item.keyWords && item.keyWords.length > 0 && (
                  <div>
                    <span className="text-xs text-[#6B6B6B] mb-2 block">关键词汇</span>
                    <div className="flex flex-wrap gap-2">
                      {item.keyWords.map((word, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#0F4C81]/10 text-[#0F4C81] text-xs rounded-full"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
