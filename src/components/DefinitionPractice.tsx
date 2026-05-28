'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { VocabItem } from '@/types';

interface Props {
  vocab: VocabItem;
  allVocabs: VocabItem[];
  onComplete: (correct: boolean) => void;
}

export default function DefinitionPractice({ vocab, allVocabs, onComplete }: Props) {
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setSelectedDef(null);
    setStatus('idle');

    const otherDefs = allVocabs
      .filter(v => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.meaning);

    const allOptions = [...otherDefs, vocab.meaning].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  }, [vocab, allVocabs]);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(vocab.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (def: string) => {
    if (status !== 'idle') return;

    setSelectedDef(def);

    if (def === vocab.meaning) {
      setStatus('correct');
      setTimeout(() => onComplete(true), 1200);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('idle');
        setSelectedDef(null);
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-[#6B6B6B] mb-3">选择正确的释义</p>
        <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">{vocab.word}</h2>
        {vocab.ipa && (
          <p className="font-mono text-sm text-[#6B6B6B]">{vocab.ipa}</p>
        )}
        <button
          onClick={playAudio}
          className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 bg-[#0F4C81]/10 text-[#0F4C81] rounded-xl hover:bg-[#0F4C81]/20 transition-colors"
        >
          <Volume2 size={16} />
          <span className="text-sm">听发音</span>
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {options.map((def) => {
          const isSelected = selectedDef === def;
          const isCorrect = def === vocab.meaning;

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
              key={def}
              onClick={() => handleSelect(def)}
              disabled={status !== 'idle'}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bgColor}`}
            >
              <div className="flex items-center gap-3">
                {status !== 'idle' && isSelected && isCorrect && <CheckCircle size={18} className="flex-shrink-0" />}
                {status !== 'idle' && isSelected && !isCorrect && <XCircle size={18} className="flex-shrink-0" />}
                {status === 'wrong' && !isSelected && isCorrect && <CheckCircle size={18} className="flex-shrink-0" />}
                <span className="text-sm">{def}</span>
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
          <p className="text-sm text-[#E63946]">答错了，正确答案已标出</p>
        </div>
      )}
    </div>
  );
}
