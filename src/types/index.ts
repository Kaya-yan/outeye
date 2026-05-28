export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  source: string;
  sourceUrl: string;
  category: string;
  level: string;
  imageUrl: string | null;
  publishedAt: string | Date;
  createdAt: string | Date;
  annotations: string | null;
  paragraphTranslations?: string | null;
  complexSentences?: string | null;
  wordCount?: number | null;
  readingTime?: number | null;
}

export interface ParagraphTranslation {
  paragraph: string;
  translation: string;
}

export interface ComplexSentence {
  sentence: string;
  structure: string;
  explanation: string;
  keyWords: string[];
}

export interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  level: string;
  context: string;
  collocations: string | null;
  etymology?: string | null;
  synonyms?: string | null;
  antonyms?: string | null;
  derivatives?: string | null;
  wordFamily?: string | null;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastQuality?: number | null;
  nextReview: string;
  news?: { title: string };
}

export interface VocabInput {
  word: string;
  ipa?: string;
  meaning?: string;
  level?: string;
  context?: string;
  collocations?: string;
  etymology?: string;
  synonyms?: string[];
  antonyms?: string[];
  derivatives?: string[];
}

export interface AnnotationData {
  vocabulary?: Array<{
    word: string;
    level: string;
    ipa: string;
    meaning: string;
    collocation: string;
    etymology?: string;
    synonyms?: string[];
    antonyms?: string[];
  }>;
  rhetoric?: Array<{
    device: string;
    text: string;
    effect: string;
  }>;
  translation?: Array<{
    phrase: string;
    domestication: string;
    foreignization: string;
    note: string;
  }>;
  culture?: Array<{
    term: string;
    explanation: string;
  }>;
  discourse?: string;
}

export interface UserStats {
  weeklyReads: number;
  totalReads: number;
  totalMinutes: number;
  streak: number;
  vocabCount: number;
  weeklyVocab?: number;
  completionRate?: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
}

export interface UserData {
  name: string;
  email: string;
  image: string;
  streak: number;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Politics: "#0F4C81",
  Economy: "#F4A261",
  Technology: "#2A9D8F",
  Culture: "#8B5CF6",
  Society: "#06B6D4",
};

export const CATEGORY_NAMES: Record<string, string> = {
  Politics: "政治",
  Economy: "经济",
  Technology: "科技",
  Culture: "文化",
  Society: "社会",
};

export const LEVEL_BADGES: Record<string, { text: string; bg: string; color: string }> = {
  Foundation: { text: "基础", bg: "#E8F5E9", color: "#2A9D8F" },
  Intermediate: { text: "进阶", bg: "#FFF3E0", color: "#F4A261" },
  Advanced: { text: "高级", bg: "#E3F2FD", color: "#0F4C81" },
};
