'use client';

import { useState, useEffect, useCallback } from 'react';
import FlipCard from '@/components/FlipCard';
import VocabDetailCard from '@/components/VocabDetailCard';
import ReviewModeSelector, { ReviewMode } from '@/components/ReviewModeSelector';
import ReviewSession from '@/components/ReviewSession';
import MemoryCurveChart from '@/components/MemoryCurveChart';
import BottomNav from '@/components/BottomNav';
import { VocabCardSkeleton } from '@/components/Skeleton';
import { showToast } from '@/components/Toast';
import { VocabItem } from '@/types';
import { BookOpen, ArrowLeft, Search, Play, BarChart3 } from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'list' | 'selectMode' | 'reviewing' | 'stats';

export default function VocabPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'due' | 'known'>('all');
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [reviewMode, setReviewMode] = useState<ReviewMode>('recognition');

  const fetchVocab = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocab?status=${activeTab}`);
      const data = await res.json();
      if (data.vocabularies) setVocabList(data.vocabularies);
    } catch (error) {
      console.error('获取词汇失败:', error);
      showToast('error', '获取词汇失败');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchVocab();
  }, [fetchVocab]);

  const handleReview = async (vocabularyId: string, quality: number) => {
    try {
      const res = await fetch('/api/vocab/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabularyId, quality }),
      });

      const result = await res.json();
      if (result.success) {
        const label = quality === 5 ? '认识' : quality === 3 ? '模糊' : '不认识';
        showToast('success', `「${label}」已记录`);
        await fetchVocab();
      } else {
        showToast('error', result.error || '评分失败');
      }
    } catch {
      showToast('error', '网络错误，评分未保存');
    }
  };

  const handleReviewWithMode = async (id: string, quality: number, mode: string) => {
    await handleReview(id, quality);
  };

  const handleStartReview = (mode: ReviewMode) => {
    setReviewMode(mode);
    setViewMode('reviewing');
  };

  const filteredVocabList = vocabList.filter(vocab =>
    vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vocab.meaning.includes(searchQuery)
  );

  const dueVocabs = vocabList.filter(v => new Date(v.nextReview) <= new Date());

  const tabs = [
    { key: 'all' as const, label: '全部', count: vocabList.length },
    { key: 'due' as const, label: '待复习', count: dueVocabs.length },
    { key: 'known' as const, label: '已掌握', count: vocabList.filter(v => v.repetitions >= 3).length },
  ];

  if (viewMode === 'selectMode') {
    return (
      <div className="min-h-screen pb-24">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 -ml-2 rounded-full hover:bg-[#0F4C81]/10 text-[#0F4C81] transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-[#1A1A1A]">选择复习模式</h1>
        </header>
        <main className="px-4 py-8">
          <ReviewModeSelector
            onSelect={handleStartReview}
            vocabCount={dueVocabs.length}
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (viewMode === 'reviewing') {
    const vocabsToReview = dueVocabs.length > 0 ? dueVocabs : vocabList.slice(0, 10);
    return (
      <ReviewSession
        vocabs={vocabsToReview}
        mode={reviewMode}
        onClose={() => {
          setViewMode('list');
          fetchVocab();
        }}
        onReview={handleReviewWithMode}
      />
    );
  }

  if (viewMode === 'stats') {
    return (
      <div className="min-h-screen pb-24">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 -ml-2 rounded-full hover:bg-[#0F4C81]/10 text-[#0F4C81] transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-[#1A1A1A]">学习统计</h1>
        </header>
        <main className="px-4 py-6 space-y-6">
          <MemoryCurveChart vocabs={vocabList} />

          <div className="bg-white rounded-xl p-6 shadow-card">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-4">学习建议</h3>
            <div className="space-y-3">
              {dueVocabs.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-[#F4A261]/10 rounded-lg">
                  <span className="text-lg">⏰</span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{dueVocabs.length} 个单词待复习</p>
                    <p className="text-xs text-[#6B6B6B]">及时复习可以提高记忆留存率</p>
                  </div>
                </div>
              )}
              {vocabList.filter(v => v.repetitions === 0).length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-[#0F4C81]/10 rounded-lg">
                  <span className="text-lg">📚</span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {vocabList.filter(v => v.repetitions === 0).length} 个新词等待首次学习
                    </p>
                    <p className="text-xs text-[#6B6B6B]">建议先用翻卡模式熟悉，再用拼写练习巩固</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-4 h-14 flex items-center gap-3 shadow-sm">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-[#0F4C81]/10 text-[#0F4C81] active:scale-95 transition-all">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-lg font-bold text-[#1A1A1A]">词汇本</h1>
        <span className="ml-auto text-xs text-[#6B6B6B]">{vocabList.length} 词</span>
      </header>

      <div className="sticky top-14 z-40 bg-[#FDFBF7] px-4 py-3 border-b border-[#1A1A1A]/5">
        {dueVocabs.length > 0 && (
          <button
            onClick={() => setViewMode('selectMode')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] text-white rounded-xl font-medium mb-4 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Play size={18} />
            开始复习 ({dueVocabs.length} 词)
          </button>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-2 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  activeTab === tab.key
                    ? 'bg-[#0F4C81] text-white shadow-md'
                    : 'bg-white text-[#6B6B6B] border border-[#1A1A1A]/10 hover:border-[#0F4C81]/30'
                }`}
              >
                {tab.label}
                <span className="ml-1 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setViewMode('stats')}
            className="p-2 rounded-lg hover:bg-[#0F4C81]/10 text-[#6B6B6B] hover:text-[#0F4C81] transition-colors"
          >
            <BarChart3 size={20} />
          </button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="搜索单词或释义..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1A1A1A]/10 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] transition-colors"
          />
        </div>
      </div>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <VocabCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredVocabList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
            <BookOpen size={48} className="mb-4 opacity-30" />
            <p className="text-base font-medium mb-1">
              {searchQuery ? '没有找到匹配的单词' :
                activeTab === 'due' ? '今天没有待复习的单词' :
                  activeTab === 'known' ? '还没有已掌握的单词' : '词汇本空空如也'}
            </p>
            <p className="text-sm opacity-60">
              {searchQuery ? '试试其他关键词' :
                activeTab === 'due' ? '去精读页收藏一些新词吧' : '坚持复习，单词会出现在这里'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredVocabList.map((vocab) => (
              <div key={vocab.id} className="relative">
                <FlipCard vocab={vocab} onReview={handleReview} />
                <button
                  onClick={() => setSelectedVocab(vocab)}
                  className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#0F4C81]/10 text-[#0F4C81] text-xs rounded-full hover:bg-[#0F4C81]/20 transition-colors"
                >
                  详情
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedVocab && (
        <VocabDetailCard
          vocab={selectedVocab}
          onClose={() => setSelectedVocab(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
