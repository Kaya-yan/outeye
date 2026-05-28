'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';
import { VocabItem } from '@/types';

interface Props {
  vocab: VocabItem;
  onComplete: (correct: boolean) => void;
}

export default function SpellPractice({ vocab, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setInput('');
    setStatus('idle');
    setAttempts(0);
    setShowHint(false);
  }, [vocab.word]);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(vocab.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'correct') return;

    const isCorrect = input.toLowerCase().trim() === vocab.word.toLowerCase();

    if (isCorrect) {
      setStatus('correct');
      setTimeout(() => onComplete(true), 1200);
    } else {
      setAttempts(prev => prev + 1);
      setStatus('wrong');

      if (attempts >= 1) {
        setShowHint(true);
      }

      setTimeout(() => {
        setStatus('idle');
        setInput('');
      }, 1000);
    }
  };

  const handleGiveUp = () => {
    setStatus('wrong');
    setShowHint(true);
    setTimeout(() => onComplete(false), 2000);
  };

  const getHint = () => {
    const word = vocab.word;
    if (attempts === 1) {
      return word[0] + '_ '.repeat(word.length - 1);
    }
    if (attempts >= 2) {
      return word.substring(0, 2) + '_ '.repeat(word.length - 2);
    }
    return '';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-[#6B6B6B] mb-2">根据释义拼写单词</p>
        <p className="text-xl font-medium text-[#1A1A1A]">{vocab.meaning}</p>
        {vocab.ipa && (
          <p className="font-mono text-sm text-[#6B6B6B] mt-1">{vocab.ipa}</p>
        )}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={playAudio}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81]/10 text-[#0F4C81] rounded-xl hover:bg-[#0F4C81]/20 transition-colors"
        >
          <Volume2 size={18} />
          <span className="text-sm">听发音</span>
        </button>
      </div>

      {vocab.context && (
        <div className="bg-[#FDFBF7] rounded-xl p-4 mb-6 border border-[#0F4C81]/10">
          <p className="text-xs text-[#6B6B6B] mb-1">原文语境提示</p>
          <p className="text-sm text-[#1A1A1A] italic leading-relaxed">
            {vocab.context.replace(new RegExp(vocab.word, 'gi'), '______')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus('idle');
            }}
            disabled={status === 'correct'}
            placeholder="输入单词..."
            autoComplete="off"
            spellCheck={false}
            className={`w-full px-4 py-3 text-lg font-mono text-center border-2 rounded-xl focus:outline-none transition-all ${
              status === 'correct'
                ? 'border-[#2A9D8F] bg-[#2A9D8F]/5 text-[#2A9D8F]'
                : status === 'wrong'
                  ? 'border-[#E63946] bg-[#E63946]/5 text-[#E63946]'
                  : 'border-gray-200 focus:border-[#0F4C81]'
            }`}
          />

          {status === 'correct' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle size={24} className="text-[#2A9D8F]" />
            </div>
          )}

          {status === 'wrong' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <XCircle size={24} className="text-[#E63946]" />
            </div>
          )}
        </div>

        {status === 'wrong' && (
          <p className="text-sm text-[#E63946] text-center mt-2">
            再试一次！
          </p>
        )}

        {showHint && (
          <div className="mt-3 p-3 bg-[#F4A261]/10 rounded-xl text-center">
            <p className="text-sm text-[#F4A261]">
              提示：<span className="font-mono">{getHint()}</span>
            </p>
          </div>
        )}

        {status === 'correct' && (
          <div className="mt-3 p-3 bg-[#2A9D8F]/10 rounded-xl text-center">
            <p className="text-sm text-[#2A9D8F] font-medium">正确！</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={!input.trim() || status === 'correct'}
            className="flex-1 py-3 bg-[#0F4C81] text-white rounded-xl font-medium hover:bg-[#0F4C81]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {status === 'correct' ? '已掌握' : '确认'}
          </button>

          {status !== 'correct' && attempts >= 2 && (
            <button
              type="button"
              onClick={handleGiveUp}
              className="px-4 py-3 bg-gray-100 text-[#6B6B6B] rounded-xl hover:bg-gray-200 transition-colors"
            >
              看答案
            </button>
          )}
        </div>
      </form>

      {attempts > 0 && status !== 'correct' && (
        <p className="text-xs text-center text-[#6B6B6B]">
          已尝试 {attempts} 次
        </p>
      )}
    </div>
  );
}
