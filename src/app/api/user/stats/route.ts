// src/app/api/user/stats/route.ts
// 作用：个人中心数据统计接口（打卡天数、成就徽章、学习仪表盘）

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TEMP_USER_ID = 'demo-user';

// 辅助函数：日期格式化为 YYYY-MM-DD
function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 核心算法：计算连续打卡天数
// 从今天往前数，只要有阅读记录就算一天，断了就停
function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  const todayStr = formatDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 如果今天没读，从昨天开始算（给今天留余地）
  let checkDate = dates.includes(todayStr) ? new Date(today) : yesterday;
  let streak = 0;

  while (true) {
    const checkStr = formatDate(checkDate);
    if (dates.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function GET() {
  try {
    // 1. 用户基本信息
    const user = await prisma.user.findUnique({
      where: { id: TEMP_USER_ID },
    });

    // 2. 词汇总数
    const vocabCount = await prisma.vocabulary.count({
      where: { userId: TEMP_USER_ID },
    });

    // 3. 新闻总数（用于演示数据估算）
    const newsCount = await prisma.news.count();

    // 4. 阅读记录（用于真实统计）
    const logs = await prisma.readingLog.findMany({
      where: { userId: TEMP_USER_ID },
      orderBy: { readAt: 'desc' },
      select: { readAt: true, duration: true, newsId: true },
    });

    // 提取所有阅读日期（去重，只看有没有读，不看读几篇）
    const dateSet = new Set<string>();
    logs.forEach((log) => dateSet.add(formatDate(new Date(log.readAt))));
    const dates = Array.from(dateSet).sort().reverse();

    // 5. 计算连续打卡天数
    const streak = calculateStreak(dates);

    // 6. 本周阅读篇数（从本周一开始算）
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=周日, 1=周一...
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    const weeklyReads = logs.filter((log) => new Date(log.readAt) >= monday).length;

    // 7. 学习时长累加（分钟）
    const totalMinutes = logs.reduce((sum, log) => sum + (log.duration || 0), 0);

    // 8. 判断是否演示模式（没有真实阅读记录时）
    const isDemo = logs.length === 0;

    // 9. 真实徽章（基于真实阅读记录判断）
    const badges = [];
    if (vocabCount >= 1) badges.push({ id: 'starter', name: '初出茅庐', icon: '🌱', desc: '加入第1个词汇' });
    if (streak >= 3) badges.push({ id: 'streak3', name: '三日不辍', icon: '🔥', desc: '连续打卡3天' });
    if (streak >= 7) badges.push({ id: 'streak7', name: '持之以恒', icon: '📅', desc: '连续打卡7天' });

    // 分类阅读徽章（读过哪类新闻就解锁）
    const readNewsIds = [...new Set(logs.map((l) => l.newsId))];
    if (readNewsIds.length > 0) {
      const readNews = await prisma.news.findMany({
        where: { id: { in: readNewsIds } },
        select: { category: true },
      });
      const categories = new Set(readNews.map((n) => n.category));
      if (categories.has('Politics')) badges.push({ id: 'politics', name: '政治通', icon: '🏛️', desc: '阅读过政治类新闻' });
      if (categories.has('Economy')) badges.push({ id: 'economy', name: '经济迷', icon: '📈', desc: '阅读过经济类新闻' });
      if (categories.has('Technology')) badges.push({ id: 'tech', name: '科技迷', icon: '💻', desc: '阅读过科技类新闻' });
      if (categories.has('Culture')) badges.push({ id: 'culture', name: '文化人', icon: '🎭', desc: '阅读过文化类新闻' });
    }

    // 演示数据（基于真实数量，合理估算，让页面不空）
    const demoStats = {
      weeklyReads: Math.min(newsCount, 3),
      totalReads: newsCount,
      totalMinutes: vocabCount * 3,
      streak: 1,
      vocabCount,
    };

    const realStats = {
      weeklyReads,
      totalReads: readNewsIds.length,
      totalMinutes,
      streak,
      vocabCount,
    };

    return NextResponse.json({
      user: {
        name: user?.name || '演示用户',
        email: user?.email || '',
        image: user?.image || '',
        streak: isDemo ? demoStats.streak : realStats.streak,
      },
      stats: isDemo ? demoStats : realStats,
      badges: badges.length > 0 ? badges : [
        { id: 'starter', name: '初出茅庐', icon: '🌱', desc: '加入第1个词汇' },
        { id: 'economy', name: '经济迷', icon: '📈', desc: '阅读过经济类新闻' },
      ],
      isDemo,
    });
  } catch (error) {
    console.error('获取用户统计失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}