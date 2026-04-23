// src/app/profile/page.tsx
// 作用：个人中心页面（学习数据仪表盘 + 成就徽章 + 设置）

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  User,
  Flame,
  Clock,
  BookText,
  Trophy,
  Settings,
  Moon,
  Bell,
  Info,
  ChevronRight,
} from 'lucide-react';

// 数据结构定义（来自 /api/user/stats 返回的JSON）
interface Badge {
  id: string;
  name: string;
  icon: string;   // emoji图标
  desc: string;
}

interface Stats {
  weeklyReads: number;
  totalReads: number;
  totalMinutes: number;
  streak: number;
  vocabCount: number;
}

interface UserData {
  name: string;
  email: string;
  image: string;
  streak: number;
}

export default function ProfilePage() {
  const router = useRouter();

  // 状态管理
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // 深夜模式开关状态

  // 页面加载时，向后端拉取统计数据
  useEffect(() => {
    fetch('/api/user/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        if (data.stats) setStats(data.stats);
        if (data.badges) setBadges(data.badges);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* ===== 顶部导航 ===== */}
      <header className="px-4 h-14 flex items-center bg-white border-b border-[#1A1A1A]/5">
        <h1 className="text-lg font-bold text-[#1A1A1A]">我的</h1>
      </header>

      {/* ===== 用户信息卡片 ===== */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(15,76,129,0.08)]">
          <div className="flex items-center gap-4 mb-4">
            {/* 头像区：有头像显示头像，没有则显示默认图标 */}
            <div className="w-14 h-14 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-2xl overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="头像" className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">{user?.name || '用户'}</h2>
              <p className="text-xs text-[#6B6B6B]">{user?.email || ''}</p>
            </div>
          </div>

          {/* 连续打卡火焰徽章 */}
          {user && user.streak > 0 && (
            <div className="flex items-center gap-2 bg-[#F4A261]/10 text-[#F4A261] px-3 py-2 rounded-lg text-sm font-medium w-fit">
              <Flame size={16} />
              连续精读 {user.streak} 天
            </div>
          )}
        </div>
      </div>

      {/* ===== 数据仪表盘（4宫格） ===== */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold text-[#6B6B6B] mb-3 uppercase tracking-wider">
          学习数据
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<BookText size={20} />}
            label="本周精读"
            value={stats?.weeklyReads || 0}
            color="#0F4C81"
          />
          <StatCard
            icon={<BookOpen size={20} />}
            label="新增词汇"
            value={stats?.vocabCount || 0}
            color="#2A9D8F"
          />
          <StatCard
            icon={<Clock size={20} />}
            label="学习时长"
            value={`${stats?.totalMinutes || 0}分`}
            color="#F4A261"
          />
          <StatCard
            icon={<Trophy size={20} />}
            label="总阅读"
            value={stats?.totalReads || 0}
            color="#6B6B6B"
          />
        </div>
      </div>

      {/* ===== 成就徽章墙 ===== */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold text-[#6B6B6B] mb-3 uppercase tracking-wider">
          成就徽章
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-xl p-4 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(15,76,129,0.08)] hover:shadow-[0_8px_24px_rgba(15,76,129,0.15)] hover:-translate-y-1 transition-all active:scale-95"
            >
              <span className="text-3xl mb-2">{badge.icon}</span>
              <span className="text-sm font-bold text-[#1A1A1A]">{badge.name}</span>
              <span className="text-[10px] text-[#6B6B6B] mt-1 leading-tight">
                {badge.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 设置列表 ===== */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold text-[#6B6B6B] mb-3 uppercase tracking-wider">
          设置
        </h3>
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(15,76,129,0.08)]">
          <SettingItem
            icon={<Settings size={18} />}
            label="难度偏好"
            value="进阶"
            onClick={() => alert('MVP阶段：难度偏好将在精读页统一设置')}
          />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />

          {/* 深夜模式：带开关按钮 */}
          <SettingItem
            icon={<Moon size={18} />}
            label="深夜模式"
            isToggle
            toggleValue={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />

          <SettingItem
            icon={<Bell size={18} />}
            label="每日提醒"
            value="21:00"
            onClick={() => alert('MVP阶段：提醒功能暂未接入')}
          />
          <div className="h-px bg-[#1A1A1A]/5 mx-4" />

          <SettingItem
            icon={<Info size={18} />}
            label="关于外眼"
            value="v1.0"
            onClick={() => alert('外眼 OutEye v1.0\n为英专生设计的外刊精读工具')}
          />
        </div>
      </div>

      {/* ===== 底部导航栏（移动端PWA） ===== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#1A1A1A]/5 px-6 py-2 flex justify-around items-center z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center gap-1 p-2 text-[#6B6B6B] hover:text-[#0F4C81] active:scale-95 transition-all"
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button
          onClick={() => router.push('/vocab')}
          className="flex flex-col items-center gap-1 p-2 text-[#6B6B6B] hover:text-[#0F4C81] active:scale-95 transition-all"
        >
          <BookOpen size={22} />
          <span className="text-[10px] font-medium">词汇本</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#0F4C81]">
          <User size={22} />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
}

// ========================================
// 子组件：数据仪表盘卡片
// ========================================
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-[0_2px_8px_rgba(15,76,129,0.08)]">
      <div
        className="p-2 rounded-lg"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-[#1A1A1A]">{value}</p>
        <p className="text-xs text-[#6B6B6B]">{label}</p>
      </div>
    </div>
  );
}

// ========================================
// 子组件：设置列表项
// ========================================
function SettingItem({
  icon,
  label,
  value,
  isToggle,
  toggleValue,
  onClick,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#FDFBF7] active:bg-[#FDFBF7]/50 transition-colors"
    >
      <div className="text-[#0F4C81]">{icon}</div>
      <span className="flex-1 text-sm text-[#1A1A1A]">{label}</span>

      {isToggle ? (
        // 开关按钮：点击时阻止冒泡，只切换开关
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${
            toggleValue ? 'bg-[#2A9D8F]' : 'bg-[#6B6B6B]/20'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              toggleValue ? 'left-5' : 'left-1'
            }`}
          />
        </div>
      ) : (
        // 普通项：显示值 + 右箭头
        <div className="flex items-center gap-1 text-[#6B6B6B]">
          <span className="text-xs">{value}</span>
          <ChevronRight size={14} />
        </div>
      )}
    </button>
  );
}