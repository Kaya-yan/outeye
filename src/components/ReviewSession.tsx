'use client';

import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { VocabItem } from '@/types';
import { ReviewMode } from './ReviewModeSelector';
import FlipCard from './FlipCard';
import SpellPractice from './SpellPractice';
import ContextPractice from './ContextPractice';
import DefinitionPractice from './DefinitionPractice';

interface Props {
  vocabs: VocabItem[];
  mode: ReviewMode;
  onClose: () => void;
  onReview: (id: string, quality: number, mode: string) => Promise<void>;
}

export default function ReviewSession({ vocabs, mode, onClose, onReview }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Map<string, boolean>>(new Map());
  const [isComplete, setIsComplete] = useState(false);

  const currentVocab = vocabs[currentIndex];
  const progress = ((currentIndex + 1) / vocabs.length) * 100;

  const handleComplete = useCallback(async (correct: boolean) => {
    if (!currentVocab) return;

    const newResults = new Map(results);
    newResults.set(currentVocab.id, correct);
    setResults(newResults);

    const quality = correct ? 5 : 0;
    await onReview(currentVocab.id, quality, mode);

    if (currentIndex < vocabs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentVocab, currentIndex, vocabs.length, results, mode, onReview]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults(new Map());
    setIsComplete(false);
  };

  const handleSkip = () => {
    if (currentIndex < vocabs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const correctCount = Array.from(results.values()).filter(Boolean).length;
    const totalCount = results.size;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-card max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">
            复习完成！
          </h2>
          <p className="text-[#6B6B6B] mb-6">
            本次复习了 {totalCount} 个单词
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#2A9D8F]/10 p-4 rounded-xl">
              <p className="text-2xl font-bold text-[#2A9D8F]">{correctCount}</p>
              <p className="text-xs text-[#6B6B6B]">正确</p>
            </div>
            <div className="bg-[#E63946]/10 p-4 rounded-xl">
              <p className="text-2xl font-bold text-[#E63946]">{totalCount - correctCount}</p>
              <p className="text-xs text-[#6B6B6B]">错误</p>
            </div>
            <div className="bg-[#0F4C81]/10 p-4 rounded-xl">
              <p className="text-2xl font-bold text-[#0F4C81]">{accuracy}%</p>
              <p className="text-xs text-[#6B6B6B]">正确率</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0F4C81] text-white rounded-xl font-medium hover:bg-[#0F4C81]/90 transition-colors"
            >
              <RotateCcw size={18} />
              再来一轮
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-[#6B6B6B] rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-4 h-14 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-[#0F4C81]/10 text-[#0F4C81] transition-colors"
        >
          <X size={22} />
        </button>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-[#6B6B6B]">
          {currentIndex + 1}/{vocabs.length}
        </span>
      </header>

      <main className="px-4 py-8">
        {mode === 'recognition' && (
          <FlipCard vocab={currentVocab} onReview={async (id, quality) => {
            await onReview(id, quality, mode);
            if (currentIndex < vocabs.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              setIsComplete(true);
            }
          }} />
        )}

        {mode === 'spelling' && (
          <SpellPractice vocab={currentVocab} onComplete={handleComplete} />
        )}

        {mode === 'context' && (
          <ContextPractice vocab={currentVocab} allVocabs={vocabs} onComplete={handleComplete} />
        )}

        {mode === 'definition' && (
          <DefinitionPractice vocab={currentVocab} allVocabs={vocabs} onComplete={handleComplete} />
        )}

        {mode !== 'recognition' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-sm text-[#6B6B6B] hover:text-[#0F4C81] transition-colors"
            >
              跳过这个单词
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
