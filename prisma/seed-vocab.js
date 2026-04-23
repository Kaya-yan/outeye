// prisma/seed-vocab.js
// 作用：为词汇本填充演示数据，运行一次即可

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. 创建演示用户（如果不存在则新建）
  await prisma.user.upsert({
    where: { email: 'demo@outeye.app' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'demo@outeye.app',
      name: '演示用户',
    },
  });

  // 2. 找一篇新闻作为这些词汇的"出处"
  const news = await prisma.news.findFirst();
  if (!news) {
    console.log('❌ 错误：数据库中没有新闻数据。请先确保 import_seed.py 已执行。');
    process.exit(1);
  }

  // 3. 演示词汇列表（来自精读页的真实学术词汇）
  const vocabList = [
    { word: 'tariff', ipa: '/ˈtærɪf/', meaning: '关税；税率', level: '专四', context: 'The talks follow weeks of tit-for-tat tariffs.', collocations: 'impose tariff on' },
    { word: 'tit-for-tat', ipa: '/ˌtɪt fə ˈtæt/', meaning: '以牙还牙的', level: '专八', context: 'weeks of tit-for-tat tariffs that have rattled global markets', collocations: 'tit-for-tat retaliation' },
    { word: 'rattle', ipa: '/ˈrætl/', meaning: '使不安；使恐慌', level: '专八', context: 'tariffs that have rattled global markets', collocations: 'rattle the markets' },
    { word: 'disruption', ipa: '/dɪsˈrʌpʃn/', meaning: '中断；扰乱', level: '专四', context: 'raised concerns about supply chain disruptions.', collocations: 'cause disruption' },
    { word: 'barrier', ipa: '/ˈbæriə(r)/', meaning: '壁垒；障碍', level: '四级', context: 'discuss reducing trade barriers.', collocations: 'trade barrier' },
    { word: 'retaliation', ipa: '/rɪˌtæliˈeɪʃn/', meaning: '报复；反击', level: 'GRE', context: 'fears of retaliation from trading partners.', collocations: 'in retaliation for' },
    { word: 'consensus', ipa: '/kənˈsensəs/', meaning: '共识；一致意见', level: '专八', context: 'hoping to reach a consensus before the summit.', collocations: 'reach consensus' },
    { word: 'sanction', ipa: '/ˈsæŋkʃn/', meaning: '制裁；处罚', level: '专八', context: 'threatened with economic sanctions.', collocations: 'impose sanctions on' },
    { word: 'volatile', ipa: '/ˈvɒlətaɪl/', meaning: '不稳定的；易变的', level: 'GRE', context: 'volatile exchange rates have rattled investors.', collocations: 'volatile market' },
    { word: 'bilateral', ipa: '/ˌbaɪˈlætərəl/', meaning: '双边的', level: '专八', context: 'bilateral trade agreements between the two nations.', collocations: 'bilateral relations' },
  ];

  let count = 0;
  for (const v of vocabList) {
    // 检查是否已存在（避免重复）
    const existing = await prisma.vocabulary.findFirst({
      where: {
        userId: 'demo-user',
        word: v.word,
        newsId: news.id,
      },
    });

    if (!existing) {
      await prisma.vocabulary.create({
        data: {
          userId: 'demo-user',
          newsId: news.id,
          word: v.word,
          ipa: v.ipa,
          meaning: v.meaning,
          level: v.level,
          context: v.context,
          collocations: v.collocations,
          nextReview: new Date(),      // 今天就需要复习（演示用）
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
        },
      });
      count++;
    }
  }

  console.log(`✅ 演示词汇填充完成！新增 ${count} 条，词汇本已有数据。`);
  console.log('💡 验证方式：运行 npx prisma studio，查看 Vocabulary 表');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });