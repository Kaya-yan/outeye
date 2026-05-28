import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TEMP_USER_ID = 'demo-user';

function calculateNextReview(
  quality: number,
  current: { interval: number; easeFactor: number; repetitions: number }
) {
  let { interval, easeFactor, repetitions } = current;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, easeFactor, repetitions, nextReview };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vocabularyId, quality, reviewType = 'recognition' } = body;

    if (!vocabularyId || quality === undefined) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    if (![0, 3, 5].includes(quality)) {
      return NextResponse.json({ error: 'quality 必须是 0、3 或 5' }, { status: 400 });
    }

    const vocab = await prisma.vocabulary.findFirst({
      where: { id: vocabularyId, userId: TEMP_USER_ID },
    });

    if (!vocab) {
      return NextResponse.json({ error: '词汇记录不存在' }, { status: 404 });
    }

    const srsResult = calculateNextReview(quality, {
      interval: vocab.interval,
      easeFactor: vocab.easeFactor,
      repetitions: vocab.repetitions,
    });

    const [reviewLog, updatedVocab] = await prisma.$transaction([
      prisma.reviewLog.create({
        data: {
          vocabularyId,
          quality,
          reviewType,
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
          lastQuality: quality,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      quality,
      reviewType,
      nextReview: srsResult.nextReview,
      interval: srsResult.interval,
      repetitions: srsResult.repetitions,
      easeFactor: parseFloat(srsResult.easeFactor.toFixed(2)),
      reviewLog,
    });
  } catch (error) {
    console.error('SRS评分失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
