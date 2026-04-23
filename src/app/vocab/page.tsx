// src/app/vocab/page.tsx
// 作用：词汇本总页面（整合FlipCard + 标签切换 + 数据拉取）

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Home, User } from 'lucide-react';
import FlipCard from '@/components/FlipCard';

// 描述一条词汇的数据结构（和FlipCard里的一致）
interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  level: string;
  context: string;
  collocations: string | null;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: string;
  news?: { title: string };
}

export default function VocabPage() {
  const router = useRouter();

  // 当前激活的标签：all=全部, due=待复习, known=已掌握
  const [activeTab, setActiveTab] = useState<'all' | 'due' | 'known'>('all');

  // 词汇列表数据
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);

  // 加载状态（首次打开显示"加载中..."）
  const [loading, setLoading] = useState(true);

  // 从后端拉取词汇数据
  const fetchVocab = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocab?status=${activeTab}`);
      const data = await res.json();
      if (data.vocabularies) {
        setVocabList(data.vocabularies);
      }
    } catch (error) {
      console.error('获取词汇失败:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // 当标签切换时，重新拉取对应数据
  useEffect(() => {
    fetchVocab();
  }, [fetchVocab]);

  // 评分回调：用户点击"认识/模糊/不认识"后执行
  const handleReview = async (vocabularyId: string, quality: number) => {
    try {
      const res = await fetch('/api/vocab/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabularyId, quality }),
      });

      const result = await res.json();
      if (result.success) {
        // 评分成功后，刷新当前列表（该单词的复习状态已改变）
        await fetchVocab();
        // 给用户一个轻量提示（非弹窗，避免打断）
        console.log(`✅ 「${result.quality === 5 ? '认识' : result.quality === 3 ? '模糊' : '不认识'}」已记录，下次复习：${new Date(result.nextReview).toLocaleDateString('zh-CN')}`);
      } else {
        alert(result.error || '评分失败');
      }
    } catch (error) {
      console.error('评分提交失败:', error);
      alert('网络错误，评分未保存');
    }
  };

  // 标签配置
  const tabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'due' as const, label: '待复习' },
    { key: 'known' as const, label: '已掌握' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* ===== 顶部固定导航 ===== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-4 h-14 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.push('/')}
          className="p-2 -ml-2 rounded-full hover:bg-[#0F4C81]/10 text-[#0F4C81] active:scale-95 transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-bold text-[#1A1A1A]">词汇本</h1>
        <span className="ml-auto text-xs text-[#6B6B6B]">
          {vocabList.length} 词
        </span>
      </header>

      {/* ===== 标签切换栏 ===== */}
      <div className="sticky top-14 z-40 bg-[#FDFBF7] px-4 py-3 border-b border-[#1A1A1A]/5">
        <div className="flex gap-2">
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
            </button>
          ))}
        </div>
      </div>

      {/* ===== 主内容区 ===== */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {loading ? (
          // 加载中状态
          <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
            <div className="w-8 h-8 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">正在加载词汇...</p>
          </div>
        ) : vocabList.length === 0 ? (
          // 空状态
          <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
            <BookOpen size={48} className="mb-4 opacity-30" />
            <p className="text-base font-medium mb-1">
              {activeTab === 'due' ? '今天没有待复习的单词' : activeTab === 'known' ? '还没有已掌握的单词' : '词汇本空空如也'}
            </p>
            <p className="text-sm opacity-60">
              {activeTab === 'due' ? '去精读页收藏一些新词吧' : '坚持复习，单词会出现在这里'}
            </p>
          </div>
        ) : (
          // 卡片网格
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vocabList.map((vocab) => (
              <FlipCard
                key={vocab.id}
                vocab={vocab}
                onReview={handleReview}
              />
            ))}
          </div>
        )}
      </main>

      {/* ===== 底部导航栏（移动端PWA） ===== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#1A1A1A]/5 px-6 py-2 flex justify-around items-center z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center gap-1 p-2 text-[#6B6B6B] hover:text-[#0F4C81] active:scale-95 transition-all"
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#0F4C81]">
          <BookOpen size={22} />
          <span className="text-[10px] font-medium">词汇本</span>
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="flex flex-col items-center gap-1 p-2 text-[#6B6B6B] hover:text-[#0F4C81] active:scale-95 transition-all"
        >
          <User size={22} />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
}