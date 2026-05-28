import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEMO_NEWS } from "@/data/demo-news";
import AnnotationPanel from "@/components/AnnotationPanel";
import AddToVocabButton from "@/components/AddToVocabButton";
import NewsDetailClient from "./NewsDetailClient";
import { ParagraphTranslation, ComplexSentence } from "@/types";

async function getNews(id: string) {
  try {
    const news = await prisma.news.findUnique({ where: { id } });
    if (news) return news;
  } catch {
    // fallback to demo
  }
  return DEMO_NEWS.find((n) => n.id === id) || null;
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getNews(params.id);

  if (!news) notFound();

  const annotations = news.annotations ? JSON.parse(news.annotations) : null;
  const paragraphTranslations: ParagraphTranslation[] = news.paragraphTranslations
    ? JSON.parse(news.paragraphTranslations)
    : [];
  const complexSentences: ComplexSentence[] = news.complexSentences
    ? JSON.parse(news.complexSentences)
    : [];

  const vocabList = annotations?.vocabulary?.map((v: {
    word: string;
    ipa?: string;
    meaning?: string;
    level?: string;
    context?: string;
    collocation?: string;
    collocations?: string;
    etymology?: string;
    synonyms?: string[];
    antonyms?: string[];
  }) => ({
    word: v.word,
    ipa: v.ipa || "",
    meaning: v.meaning || "",
    level: v.level || "专四",
    context: v.context || news.summary.substring(0, 100),
    collocations: v.collocation || v.collocations || "",
    etymology: v.etymology,
    synonyms: v.synonyms,
    antonyms: v.antonyms,
  })) || [];

  return (
    <div className="min-h-screen">
      <NewsDetailClient
        news={news}
        paragraphTranslations={paragraphTranslations}
        complexSentences={complexSentences}
      >
        <aside className="w-full md:w-[35%] border-l border-gray-200 bg-white">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
            <h2 className="font-serif text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#0F4C81] rounded-full" />
              学术注释
            </h2>
            <AnnotationPanel annotationsJson={news.annotations} />
            <div className="mt-6">
              <AddToVocabButton newsId={news.id} vocabList={vocabList} />
            </div>
          </div>
        </aside>
      </NewsDetailClient>
    </div>
  );
}
