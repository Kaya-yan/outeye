// src/app/api/vocab/review/route.ts
// 作用：SRS间隔重复评分接口（翻转卡片背面的"不认识/模糊/认识"按钮）

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TEMP_USER_ID = 'demo-user';

// ========================================
// SRS 算法核心：根据评分计算下次复习时间
// ========================================
function calculateNextReview(
  quality: number,  // 0=不认识, 3=模糊, 5=认识
  current: {
    interval: number;
    easeFactor: number;
    repetitions: number;
  }
) {
  let { interval, easeFactor, repetitions } = current;

  // 第一步：根据评分决定间隔天数
  if (quality < 3) {
    // 不认识：完全重置，明天再来
    repetitions = 0;
    interval = 1;
  } else {
    // 模糊或认识：推进进度
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;      // 第一次认识：1天后复习
    } else if (repetitions === 2) {
      interval = 6;      // 第二次认识：6天后复习
    } else {
      interval = Math.round(interval * easeFactor); // 之后按难度系数倍增
    }
  }

  // 第二步：调整难度系数（easeFactor）
  // 公式：新系数 = 旧系数 + 0.1 - (5 - quality) × (0.08 + (5 - quality) × 0.02)
  // 最低不低于 1.3（太低会导致间隔增长过慢）
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  // 第三步：计算下次复习的具体日期
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, easeFactor, repetitions, nextReview };
}

// ========================================
// POST：提交评分
// 前端传来：{ vocabularyId, quality }
// ========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vocabularyId, quality } = body;

    // 校验参数
    if (!vocabularyId || quality === undefined) {
      return NextResponse.json(
        { error: '缺少必要参数：vocabularyId 和 quality' },
        { status: 400 }
      );
    }

    // quality 只允许 0, 3, 5（对应三个按钮）
    if (![0, 3, 5].includes(quality)) {
      return NextResponse.json(
        { error: 'quality 必须是 0（不认识）、3（模糊）或 5（认识）' },
        { status: 400 }
      );
    }

    // 查找这条词汇记录
    const vocab = await prisma.vocabulary.findFirst({
      where: {
        id: vocabularyId,
        userId: TEMP_USER_ID,
      },
    });

    if (!vocab) {
      return NextResponse.json(
        { error: '词汇记录不存在或无权访问' },
        { status: 404 }
      );
    }

    // 执行 SRS 算法，计算新参数
    const srsResult = calculateNextReview(quality, {
      interval: vocab.interval,
      easeFactor: vocab.easeFactor,
      repetitions: vocab.repetitions,
    });

    // 同时做两件事（数据库事务）：
    // 1. 记录本次评分日志（ReviewLog）
    // 2. 更新词汇的 SRS 参数
    const [reviewLog, updatedVocab] = await prisma.$transaction([
      prisma.reviewLog.create({
        data: {
          vocabularyId: vocabularyId,
          quality: quality,
          reviewedAt: new Date(),
        },
      }),
      prisma.vocabulary.update({
        where: { id: vocabularyId },
        data: {
          interval: srsResult.interval,
          easeFactor: srsResult.easeFactor,
          repetitions: srsResult.repetitions,
          nextReview: srsResult.nextReview,
        },
      }),
    ]);

    // 返回给前端：更新后的状态 + 下次复习时间
    return NextResponse.json({
      success: true,
      message: '评分已记录',
      quality,
      nextReview: srsResult.nextReview,
      interval: srsResult.interval,
      repetitions: srsResult.repetitions,
      easeFactor: parseFloat(srsResult.easeFactor.toFixed(2)),
      reviewLog,
    });
  } catch (error) {
    console.error('SRS评分失败:', error);
    return NextResponse.json(
      { error: '服务器错误，评分未保存' },
      { status: 500 }
    );
  }
}