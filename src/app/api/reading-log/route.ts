import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TEMP_USER_ID = 'demo-user';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { newsId, duration, progress, completed } = body;

    if (!newsId) {
      return NextResponse.json({ error: '缺少 newsId' }, { status: 400 });
    }

    const readingLog = await prisma.readingLog.create({
      data: {
        userId: TEMP_USER_ID,
        newsId,
        duration: duration || 0,
        progress: progress || 0,
        completed: completed || false,
      },
    });

    return NextResponse.json({ success: true, readingLog });
  } catch (error) {
    console.error('记录阅读进度失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
