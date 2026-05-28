import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TEMP_USER_ID = 'demo-user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const whereCondition: Record<string, unknown> = { userId: TEMP_USER_ID };

    if (status === 'due') {
      whereCondition.nextReview = { lte: new Date() };
    } else if (status === 'known') {
      whereCondition.repetitions = { gte: 3 };
    }

    const vocabularies = await prisma.vocabulary.findMany({
      where: whereCondition,
      orderBy: { nextReview: 'asc' },
      include: { news: { select: { title: true } } },
    });

    return NextResponse.json({ vocabularies, count: vocabularies.length, status });
  } catch (error) {
    console.error('获取词汇列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, ipa, meaning, level, context, collocations, newsId } = body;

    if (!word || !newsId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const existing = await prisma.vocabulary.findFirst({
      where: { userId: TEMP_USER_ID, word, newsId },
    });

    if (existing) {
      return NextResponse.json({ error: '该单词已在你的词汇本中', existingId: existing.id }, { status: 409 });
    }

    const vocabulary = await prisma.vocabulary.create({
      data: {
        userId: TEMP_USER_ID,
        newsId,
        word,
        ipa: ipa || '',
        meaning: meaning || '',
        level: level || '专四',
        context: context || '',
        collocations: collocations || '',
        nextReview: new Date(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
      },
    });

    return NextResponse.json({ success: true, vocabulary, message: `「${word}」已成功加入词汇本` });
  } catch (error) {
    console.error('添加词汇失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
