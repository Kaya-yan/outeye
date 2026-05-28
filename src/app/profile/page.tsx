'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import WeeklyChart from '@/components/WeeklyChart';
import GoalTracker from '@/components/GoalTracker';
import GoalSettingModal from '@/components/GoalSettingModal';
import LearningHeatmap from '@/components/LearningHeatmap';
import StreakCalendar from '@/components/StreakCalendar';
import { UserData, UserStats, Badge, Goal } from '@/types';
import {
  Flame, Clock, BookText, Trophy, BookOpen,
  Settings, Moon, Bell, Info, ChevronRight,
  Target, BarChart3, Calendar
} from 'lucide-react';

const DEFAULT_GOALS: Goal[] = [
  { id: 'tem4', name: '专四词汇', target: 6000, current: 0, icon: '📚', color: '#2A9D8F' },
  { id: 'tem8', name: '专八词汇', target: 10000, current: 0, icon: '🎓', color: '#F4A261' },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'goals' | 'heatmap'>('main');
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [showGoalSetting, setShowGoalSetting] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('outeye-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const savedGoals = localStorage.getItem('outeye-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    fetch('/api/user/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        if (data.stats) setStats(data.stats);
        if (data.badges) setBadges(data.badges);

        if (data.stats?.vocabCount) {
          setGoals(prev => prev.map(g => ({ ...g, current: data.stats.vocabCount })));
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('outeye-theme', newMode ? 'dark' : 'light');
  };

  const handleSaveGoals = (newGoals: Goal[]) => {
    const vocabCount = stats?.vocabCount || 0;
    const updatedGoals = newGoals.map(g => ({ ...g, current: vocabCount }));
    setGoals(updatedGoals);
    localStorage.setItem('outeye-goals', JSON.stringify(updatedGoals));
  };

  const weeklyData = [3, 5, 2, 8, 4, 6, 1];

  const heatmapData: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 84; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    heatmapData[dateStr] = Math.floor(Math.random() * 10);
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <header className="px-4 h-14 flex items-center bg-white border-b border-[#1A1A1A]/5">
          <h1 className="text-lg font-bold text-[#1A1A1A]">我的</h1>
        </header>
        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-card animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="w-20 h-5 bg-gray-200 rounded" />
                <div className="w-32 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-card animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-12 h-6 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (activeView === 'goals') {
    return (
      <div className="min-h-screen pb-24">
        <header className="px-4 h-14 flex items-center bg-white border-b border-[#1A1A1A]/5">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2">
            <ChevronRight size={20} className="rotate-180 text-[#0F4C81]" />
          </button>
          <h1 className="text-lg font-bold text-[#1A1A1A] ml-2">学习目标</h1>
          <button
            onClick={() => setShowGoalSetting(true)}
            className="ml-auto text-sm text-[#0F4C81]"
          >
            编辑
          </button>
        </header>
        <main className="px-4 py-6 space-y-6">
          <GoalTracker goals={goals} />
        </main>
        <BottomNav />
        {showGoalSetting && (
          <GoalSettingModal
            currentGoals={goals}
            onSave={handleSaveGoals}
            onClose={() => setShowGoalSetting(false)}
          />
        )}
      </div>
    );
  }

  if (activeView === 'heatmap') {
    return (
      <div className="min-h-screen pb-24">
        <header className="px-4 h-14 flex items-center bg-white border-b border-[#1A1A1A]/5">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2">
            <ChevronRight size={20} className="rotate-180 text-[#0F4C81]" />
          </button>
          <h1 className="text-lg font-bold text-[#1A1A1A] ml-2">学习热力图</h1>
        </header>
        <main className="px-4 py-6">
          <LearningHeatmap data={heatmapData} />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="px-4 h-14 flex items-center bg-white border-b border-[#1A1A1A]/5">
        <h1 className="text-lg font-bold text-[#1A1A1A]">我的</h1>
      </header>

      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-2xl overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="头像" className="w-full h-full object-cover" />
              ) : '👤'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">{user?.name || '用户'}</h2>
              <p className="text-xs text-[#6B6B6B]">{user?.email || ''}</p>
            </div>
          </div>
          {user && user.streak > 0 && (
            <div className="flex items-center gap-2 bg-[#F4A261]/10 text-[#F4A261] px-3 py-2 rounded-lg text-sm font-medium w-fit">
              <Flame size={16} />
              连续精读 {user.streak} 天
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold text-[#6B6B6B] mb-3 uppercase tracking-wider">学习数据</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<BookText size={20} />} label="本周精读" value={stats?.weeklyReads || 0} color="#0F4C81" />
          <StatCard icon={<BookOpen size={20} />} label="新增词汇" value={stats?.vocabCount || 0} color="#2A9D8F" />
          <StatCard icon={<Clock size={20} />} label="学习时长" value={`${stats?.totalMinutes || 0}分`} color="#F4A261" />
          <StatCard icon={<Trophy size={20} />} label="总阅读" value={stats?.totalReads || 0} color="#6B6B6B" />
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wider">本周学习趋势</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-card">
          <WeeklyChart data={weeklyData} />
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wider">连续打卡</h3>
        </div>
        <StreakCalendar streak={user?.streak || 0} />
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wider">学习目标</h3>
          <button
            onClick={() => setActiveView('goals')}
            className="text-xs text-[#0F4C81] flex items-center gap-0.5"
          >
            查看全部
            <ChevronRight size={14} />
          </button>
        </div>
        <GoalTracker goals={goals.slice(0, 2)} />
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wider">学习热力图</h3>
          <button
            onClick={() => setActiveView('heatmap')}
            className="text-xs text-[#0F4C81] flex items-center gap-0.5"
          >
            查看全部
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card" onClick={() => setActiveView('heatmap')}>
          <LearningHeatmap data={heatmapData} />
        </div>
      </div>

      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold text-[#6B6B6B] mb-3 uppercase tracking-wider">成就徽章</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-xl p-4 flex flex-col items-center text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
              <span className="text-3xl mb-2">{badge.icon}</span>
              <span className="text-sm font-bold text-[#1A1A1A]">{badge.name}</span>
              <span className="text-[10px] text-[#6B6B6B] mt-1 leading-tight">{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold text-[#6B6B6B] mb-3 uppercase tracking-wider">设置</h3>
        <div className="bg-white rounded-xl overflow-hidden shadow-card">
          <SettingItem icon={<Settings size={18} />} label="难度偏好" value="进阶" />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />
          <SettingItem icon={<Moon size={18} />} label="深夜模式" isToggle toggleValue={darkMode} onToggle={toggleDarkMode} />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />
          <SettingItem icon={<Bell size={18} />} label="每日提醒" value="21:00" />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />
          <SettingItem icon={<Target size={18} />} label="学习目标" value={`${goals.length} 个`} onClick={() => setActiveView('goals')} />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />
          <SettingItem icon={<Info size={18} />} label="关于外眼" value="v1.0" />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-card">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15`, color }}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-[#1A1A1A]">{value}</p>
        <p className="text-xs text-[#6B6B6B]">{label}</p>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value, isToggle, toggleValue, onToggle, onClick }: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#FDFBF7] transition-colors"
    >
      <div className="text-[#0F4C81]">{icon}</div>
      <span className="flex-1 text-sm text-[#1A1A1A]">{label}</span>
      {isToggle ? (
        <div onClick={(e) => { e.stopPropagation(); onToggle?.(); }} className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${toggleValue ? 'bg-[#2A9D8F]' : 'bg-[#6B6B6B]/20'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${toggleValue ? 'left-5' : 'left-1'}`} />
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[#6B6B6B]">
          <span className="text-xs">{value}</span>
          <ChevronRight size={14} />
        </div>
      )}
    </button>
  );
}
