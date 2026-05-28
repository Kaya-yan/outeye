import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEMO_NEWS } from "@/data/demo-news";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

    let news: typeof DEMO_NEWS = [];
    let total = 0;

    try {
      const where = category ? { category } : {};
      news = await prisma.news.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      total = await prisma.news.count({ where });
    } catch {
      const filtered = category ? DEMO_NEWS.filter((n) => n.category === category) : DEMO_NEWS;
      total = filtered.length;
      news = filtered.slice((page - 1) * pageSize, page * pageSize);
    }

    return NextResponse.json({ news, total, page, hasMore: page * pageSize < total });
  } catch {
    return NextResponse.json({ error: "获取新闻失败" }, { status: 500 });
  }
}
