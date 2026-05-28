'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ParagraphTranslation } from '@/types';

interface Props {
  content: string;
  translations: ParagraphTranslation[];
  knownWords?: Set<string>;
}

export default function ParagraphView({ content, translations, knownWords = new Set() }: Props) {
  const [expandedTranslations, setExpandedTranslations] = useState<Set<number>>(new Set());
  const [showAllTranslations, setShowAllTranslations] = useState(false);

  const paragraphs = content.split('\n\n').filter(p => p.trim());

  const toggleTranslation = (index: number) => {
    const newExpanded = new Set(expandedTranslations);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTranslations(newExpanded);
  };

  const toggleAllTranslations = () => {
    if (showAllTranslations) {
      setExpandedTranslations(new Set());
    } else {
      setExpandedTranslations(new Set(paragraphs.map((_, i) => i)));
    }
    setShowAllTranslations(!showAllTranslations);
  };

  const highlightWords = (text: string) => {
    const words = text.split(/(\s+|[.,;:!?'"()])/);
    return words.map((word, i) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (knownWords.has(cleanWord) && cleanWord.length > 3) {
        return (
          <span key={i} className="bg-[#2A9D8F]/20 text-[#2A9D8F] rounded px-0.5 cursor-help" title="已学习的词汇">
            {word}
          </span>
        );
      }
      return <span key={i}>{word}</span>;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleAllTranslations}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0F4C81] hover:bg-[#0F4C81]/10 rounded-lg transition-colors"
        >
          {showAllTranslations ? '收起所有翻译' : '展开所有翻译'}
        </button>
      </div>

      {paragraphs.map((paragraph, index) => {
        const translation = translations[index];
        const isExpanded = expandedTranslations.has(index);

        return (
          <div key={index} className="group">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 text-right">
                <span className="text-xs text-[#6B6B6B] font-mono">{index + 1}</span>
              </div>

              <div className="flex-1">
                <p className="text-base leading-[1.8] text-[#1A1A1A] mb-2 font-body">
                  {highlightWords(paragraph)}
                </p>

                {translation && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleTranslation(index)}
                      className="flex items-center gap-1 text-sm text-[#0F4C81] hover:text-[#0F4C81]/80 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? '收起翻译' : '查看翻译'}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-4 bg-[#F4A261]/10 rounded-xl border-l-4 border-[#F4A261]">
                        <p className="text-sm leading-relaxed text-[#1A1A1A]">
                          {translation.translation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
