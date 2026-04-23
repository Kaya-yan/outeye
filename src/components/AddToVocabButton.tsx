// src/components/AddToVocabButton.tsx
// 作用：精读页"加入词汇本"按钮（一键批量收藏重点词汇）

'use client';

import { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';

// 单个词汇的数据结构
interface VocabItem {
  word: string;
  ipa?: string;
  meaning?: string;
  level?: string;
  context?: string;
  collocations?: string;
}

interface Props {
  newsId: string;
  vocabList: VocabItem[];
}

export default function AddToVocabButton({ newsId, vocabList }: Props) {
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  // 点击后批量添加
  const handleAdd = async () => {
    if (added || adding || vocabList.length === 0) return;
    setAdding(true);

    let successCount = 0;
    let duplicateCount = 0;

    for (const vocab of vocabList) {
      try {
        const res = await fetch('/api/vocab', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: vocab.word,
            ipa: vocab.ipa || '',
            meaning: vocab.meaning || '',
            level: vocab.level || '专四',
            context: vocab.context || '',
            collocations: vocab.collocations || '',
            newsId,
          }),
        });

        if (res.ok) successCount++;
        else if (res.status === 409) duplicateCount++; // 已存在
      } catch (e) {
        console.error('添加失败:', e);
      }
    }

    setAdding(false);
    if (successCount > 0) {
      setAdded(true);
      alert(`✅ 成功添加 ${successCount} 个词汇！${duplicateCount > 0 ? `（${duplicateCount} 个已存在）` : ''}`);
    } else if (duplicateCount > 0) {
      alert('这些词汇已在你的词汇本中');
    } else {
      alert('添加失败，请检查网络');
    }
  };

  // 如果没有词汇数据，不显示按钮
  if (!vocabList || vocabList.length === 0) return null;

  return (
    <button
      onClick={handleAdd}
      disabled={adding || added}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 w-full justify-center ${
        added
          ? 'bg-[#2A9D8F]/10 text-[#2A9D8F] cursor-default'
          : 'bg-[#0F4C81] text-white hover:bg-[#0F4C81]/90 shadow-md hover:shadow-lg'
      }`}
    >
      {adding ? <Loader2 size={16} className="animate-spin" /> : added ? <Check size={16} /> : <Plus size={16} />}
      {adding ? '正在收藏...' : added ? '已加入词汇本' : `收藏本文 ${vocabList.length} 个重点词汇`}
    </button>
  );
}