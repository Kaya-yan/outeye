// src/app/api/vocab/route.ts
// 作用：词汇本的后端接口（获取列表 + 添加单词）

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// MVP过渡方案：Auth.js配置前，临时使用演示用户ID
// 等Day 11登录系统完成后，这里会改为从session中读取真实用户ID
const TEMP_USER_ID = 'demo-user';

// ========================================
// GET：获取词汇列表
// 用法：/api/vocab?status=all      → 全部单词
//       /api/vocab?status=due      → 今天该复习的
//       /api/vocab?status=known    → 已掌握的（复习过3次以上）
// ========================================
export async function GET(request: Request) {
  try {
    // 从URL中提取筛选参数
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // 基础查询条件：只查当前用户
    let whereCondition: any = { userId: TEMP_USER_ID };

    // 根据状态添加额外筛选
    if (status === 'due') {
      // 待复习：nextReview（下次复习时间）<= 现在
      whereCondition = {
        ...whereCondition,
        nextReview: { lte: new Date() },
      };
    } else if (status === 'known') {
      // 已掌握：重复次数 >= 3
      whereCondition = {
        ...whereCondition,
        repetitions: { gte: 3 },
      };
    }
    // status === 'all' 不需要额外条件

    // 查询数据库，按复习时间排序（早复习的排在前面）
    const vocabularies = await prisma.vocabulary.findMany({
      where: whereCondition,
      orderBy: { nextReview: 'asc' },
      include: {
        news: {
          select: { title: true }, // 顺便带出出自哪篇新闻
        },
      },
    });

    return NextResponse.json({
      vocabularies,
      count: vocabularies.length,
      status,
    });
  } catch (error) {
    console.error('获取词汇列表失败:', error);
    return NextResponse.json(
      { error: '服务器错误，无法获取词汇列表' },
      { status: 500 }
    );
  }
}

// ========================================
// POST：添加单词到词汇本
// 用法：精读页点击"加入词汇本"按钮时调用
// ========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 前端必须传来的字段
    const {
      word,        // 单词本身，如 "tariff"
      ipa,         // 音标，如 "/ˈtærɪf/"
      meaning,     // 中文释义
      level,       // 难度：四级/专四/专八/GRE
      context,     // 原文例句
      collocations,// 搭配用法
      newsId,      // 出自哪篇新闻的ID
    } = body;

    // 简单校验：单词和新闻ID不能为空
    if (!word || !newsId) {
      return NextResponse.json(
        { error: '缺少必要参数：word 和 newsId 不能为空' },
        { status: 400 }
      );
    }

    // 查重：同一个用户 + 同一个单词 + 同一篇新闻 = 已存在
    const existing = await prisma.vocabulary.findFirst({
      where: {
        userId: TEMP_USER_ID,
        word: word,
        newsId: newsId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: '该单词已在你的词汇本中', existingId: existing.id },
        { status: 409 } // 409 = Conflict 冲突状态码
      );
    }

    // 创建新词汇记录（SRS参数初始值）
    const vocabulary = await prisma.vocabulary.create({
      data: {
        userId: TEMP_USER_ID,
        newsId: newsId,
        word: word,
        ipa: ipa || '',
        meaning: meaning || '',
        level: level || '专四',
        context: context || '',
        collocations: collocations || '',
        nextReview: new Date(),    // 今天就开始复习
        interval: 0,               // 初始间隔0天
        easeFactor: 2.5,         // 初始难度系数
        repetitions: 0,          // 还没复习过
      },
    });

    return NextResponse.json({
      success: true,
      vocabulary,
      message: `「${word}」已成功加入词汇本`,
    });
  } catch (error) {
    console.error('添加词汇失败:', error);
    return NextResponse.json(
      { error: '服务器错误，无法添加词汇' },
      { status: 500 }
    );
  }
}