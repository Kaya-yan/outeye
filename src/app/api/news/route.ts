// src/app/api/news/route.ts —— 新闻数据"水龙头"
// 前端首页请求数据时，这个文件去数据库里拿，然后打包成 JSON 返回

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Prisma 客户端是"数据库遥控器"，用它操作 SQLite
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 从网址里提取查询参数，比如 ?category=Politics&page=1
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");      // 分类筛选
    const page = parseInt(searchParams.get("page") || "1", 10);  // 页码，默认第1页
    const pageSize = 10;  // 每页10篇，和方案手册一致

    // 组装"查询条件"：如果传了 category，就加上筛选；没传就全拿
    const where = category ? { category } : {};

    // 去数据库里查：按发布时间倒序（最新的在前），跳过前面页的数据，取10篇
    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 再查一下总共有多少篇（前端需要显示"加载更多"按钮时用到）
    const total = await prisma.news.count({ where });

    // 打包成 JSON 返回给前端
    return NextResponse.json({
      news,
      total,
      page,
      pageSize,
      hasMore: total > page * pageSize,  // 还有没有下一页？
    });
  } catch (error) {
    console.error("API /news 报错:", error);
    return NextResponse.json(
      { error: "获取新闻失败" },
      { status: 500 }
    );
  } finally {
    // 用完数据库连接要断开，避免资源泄漏
    await prisma.$disconnect();
  }
}