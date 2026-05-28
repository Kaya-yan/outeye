'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { VocabItem } from '@/types';

interface Props {
  vocab: VocabItem;
  allVocabs: VocabItem[];
  onComplete: (correct: boolean) => void;
}

export default function ContextPractice({ vocab, allVocabs, onComplete }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setSelectedWord(null);
    setStatus('idle');

    const otherWords = allVocabs
      .filter(v => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.word);

    const allOptions = [...otherWords, vocab.word].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  }, [vocab, allVocabs]);

  const handleSelect = (word: string) => {
    if (status !== 'idle') return;

    setSelectedWord(word);

    if (word === vocab.word) {
      setStatus('correct');
      setTimeout(() => onComplete(true), 1200);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('idle');
        setSelectedWord(null);
      }, 1500);
    }
  };

  const blankedContext = vocab.context.replace(
    new RegExp(vocab.word, 'gi'),
    '______'
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-[#6B6B6B] mb-2">选择正确的单词填入空格</p>
        <p className="text-lg font-medium text-[#1A1A1A]">{vocab.meaning}</p>
      </div>

      <div className="bg-[#FDFBF7] rounded-xl p-4 mb-6 border border-[#0F4C81]/10">
        <p className="text-sm text-[#1A1A1A] italic leading-relaxed">
          {blankedContext}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map((word) => {
          const isSelected = selectedWord === word;
          const isCorrect = word === vocab.word;

          let bgColor = 'bg-white border-gray-200 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5';
          if (status !== 'idle' && isSelected) {
            bgColor = isCorrect
              ? 'bg-[#2A9D8F]/10 border-[#2A9D8F] text-[#2A9D8F]'
              : 'bg-[#E63946]/10 border-[#E63946] text-[#E63946]';
          } else if (status === 'wrong' && isCorrect) {
            bgColor = 'bg-[#2A9D8F]/10 border-[#2A9D8F] text-[#2A9D8F]';
          }

          return (
            <button
              key={word}
              onClick={() => handleSelect(word)}
              disabled={status !== 'idle'}
              className={`p-4 rounded-xl border-2 font-mono text-sm transition-all ${bgColor}`}
            >
              <div className="flex items-center justify-center gap-2">
                {status !== 'idle' && isSelected && isCorrect && <CheckCircle size={16} />}
                {status !== 'idle' && isSelected && !isCorrect && <XCircle size={16} />}
                <span>{word}</span>
              </div>
            </button>
          );
        })}
      </div>

      {status === 'correct' && (
        <div className="p-3 bg-[#2A9D8F]/10 rounded-xl text-center">
          <p className="text-sm text-[#2A9D8F] font-medium">正确！</p>
        </div>
      )}

      {status === 'wrong' && (
        <div className="p-3 bg-[#E63946]/10 rounded-xl text-center">
          <p className="text-sm text-[#E63946]">再想想...</p>
        </div>
      )}
    </div>
  );
}
