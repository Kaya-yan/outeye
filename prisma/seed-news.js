// prisma/seed-news.js
// 将 demo-news.ts 中的 5 条新闻导入 Supabase News 表

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NEWS_DATA = [
  {
    id: "news-001",
    title: "US-China Trade Talks Resume Amid Tariff Disputes",
    summary: "Senior officials met in Geneva to discuss reducing trade barriers, with analysts cautiously optimistic about a potential breakthrough.",
    content: "Senior officials from the United States and China convened in Geneva this week for high-level trade negotiations, marking the first formal dialogue since the latest round of tariff hikes took effect in March. The talks focused on agricultural imports, technology transfers, and intellectual property protections.\n\nBoth sides issued a joint statement committing to 'constructive engagement' and a follow-up meeting in June. The statement emphasized the importance of maintaining open communication channels to prevent further escalation of trade tensions.\n\nAnalysts noted that the resumption of dialogue itself is a positive signal, though significant hurdles remain regarding semiconductor export controls. 'The fact that they are talking again is progress,' said Sarah Chen, a trade policy researcher at the Peterson Institute. 'But the structural issues have not gone away.'\n\nThe negotiations come at a critical juncture for the global economy, with supply chains still recovering from pandemic-era disruptions. Business leaders on both sides have expressed hope that reduced tariffs could lower costs for consumers and stimulate economic growth.",
    source: "Reuters",
    sourceUrl: "https://www.reuters.com",
    category: "Politics",
    level: "Intermediate",
    imageUrl: null,
    publishedAt: "2026-04-20T08:00:00.000Z",
    wordCount: 180,
    readingTime: 3,
    paragraphTranslations: JSON.stringify([
      { paragraph: "Senior officials from the United States and China convened in Geneva this week for high-level trade negotiations, marking the first formal dialogue since the latest round of tariff hikes took effect in March. The talks focused on agricultural imports, technology transfers, and intellectual property protections.", translation: "中美高级官员本周在日内瓦举行高层贸易谈判，这是自三月最新一轮关税上调生效以来的首次正式对话。会谈重点讨论了农产品进口、技术转让和知识产权保护等问题。" },
      { paragraph: "Both sides issued a joint statement committing to constructive engagement and a follow-up meeting in June.", translation: "双方发表联合声明，承诺进行建设性接触，并将于六月举行后续会议。" },
      { paragraph: "Analysts noted that the resumption of dialogue itself is a positive signal, though significant hurdles remain regarding semiconductor export controls.", translation: "分析人士指出，对话恢复本身就是一个积极信号，尽管在半导体出口管制方面仍存在重大障碍。" },
      { paragraph: "The negotiations come at a critical juncture for the global economy, with supply chains still recovering from pandemic-era disruptions.", translation: "此次谈判正值全球经济的关键时刻，供应链仍在从疫情时期的中断中恢复。" }
    ]),
    complexSentences: JSON.stringify([
      { sentence: "Senior officials from the United States and China convened in Geneva this week for high-level trade negotiations, marking the first formal dialogue since the latest round of tariff hikes took effect in March.", structure: "主句 + 现在分词短语（作状语）+ since 时间状语从句", explanation: "句子主干是 officials convened。marking 是现在分词短语，表示伴随结果。since 引导时间状语从句，说明从三月关税生效以来。", keyWords: ["convened", "marking", "took effect"] },
      { sentence: "Analysts noted that the resumption of dialogue itself is a positive signal, though significant hurdles remain regarding semiconductor export controls.", structure: "主句 + that 宾语从句 + though 让步状语从句", explanation: "主句是 Analysts noted that。that 引导宾语从句，though 引导让步状语从句，表示转折关系。regarding 介词短语修饰 hurdles。", keyWords: ["resumption", "hurdles", "regarding"] }
    ]),
    annotations: JSON.stringify({
      vocabulary: [
        { word: "tariff", level: "专四", ipa: "/ˈtærɪf/", meaning: "关税；税率", collocation: "impose tariff on", etymology: "来自阿拉伯语 tarif，原意为通知、定义", synonyms: ["duty", "levy", "customs"] },
        { word: "convene", level: "专八", ipa: "/kənˈviːn/", meaning: "召集；开会", collocation: "convene a meeting", etymology: "con- (一起) + venire (来) = 一起来", synonyms: ["assemble", "gather", "meet"] },
        { word: "hurdle", level: "专四", ipa: "/ˈhɜːrdl/", meaning: "障碍；难关", collocation: "overcome hurdles", etymology: "古英语 hyrdel，原意为栅栏", synonyms: ["obstacle", "barrier", "impediment"] },
        { word: "constructive", level: "专四", ipa: "/kənˈstrʌktɪv/", meaning: "建设性的", collocation: "constructive criticism", etymology: "con- (一起) + struere (建造)", synonyms: ["productive", "helpful", "positive"] },
        { word: "engagement", level: "专四", ipa: "/ɪnˈɡeɪdʒmənt/", meaning: "接触；参与", collocation: "constructive engagement", etymology: "en- (使) + gage (保证) = 使做出保证", synonyms: ["involvement", "participation", "interaction"] }
      ],
      rhetoric: [
        { device: "Euphemism", text: "constructive engagement", effect: "用积极词汇软化谈判僵硬的实质，体现外交辞令的委婉" },
        { device: "Metaphor", text: "critical juncture", effect: "将抽象的时间点具象化为道路交叉口，暗示选择的重要性" }
      ],
      translation: [
        { phrase: "constructive engagement", domestication: "建设性接触", foreignization: "有建设意义的参与", note: "外交术语，常指对立双方保持对话渠道" },
        { phrase: "critical juncture", domestication: "关键时刻", foreignization: "关键节点", note: "juncture 原意为连接点，此处比喻重要时间点" }
      ],
      culture: [
        { term: "Geneva", explanation: "日内瓦，瑞士城市，众多国际组织总部所在地，象征中立谈判场所" },
        { term: "Peterson Institute", explanation: "彼得森国际经济研究所，美国知名智库，专注国际经济政策研究" }
      ],
      discourse: "新闻语篇结构：事件概述（首段）、双方立场（次段）、专家分析（三段）、背景意义（末段）。使用 material process 动词（convened, focused, issued）推动叙事，relational process（is）定义意义。"
    })
  },
  {
    id: "news-002",
    title: "Federal Reserve Signals Potential Rate Cuts",
    summary: "The Fed hinted at easing monetary policy later this year as inflation shows signs of cooling across major sectors.",
    content: "The Federal Reserve signaled Wednesday that interest rate cuts could begin as early as September, citing meaningful progress in bringing inflation toward the 2% target. Chair Jerome Powell emphasized that any decision would remain data-dependent, noting strong labor market resilience.\n\nWall Street reacted positively to the announcement, with the S&P 500 reaching a record high. Investors interpreted the Fed language as a clear indication that the tightening cycle may be approaching its end.\n\nHowever, some economists warned that premature easing could reignite price pressures, particularly in housing and energy markets. We need to see sustained evidence that inflation is firmly under control, said Dr. Michael Torres, chief economist at Capital Economics.\n\nThe Fed decision will have significant implications for global markets, as many emerging economies have been struggling with capital outflows driven by higher US interest rates. A rate cut could provide much-needed relief to these markets.",
    source: "BBC",
    sourceUrl: "https://www.bbc.com",
    category: "Economy",
    level: "Intermediate",
    imageUrl: null,
    publishedAt: "2026-04-19T10:30:00.000Z",
    wordCount: 165,
    readingTime: 3,
    paragraphTranslations: JSON.stringify([
      { paragraph: "The Federal Reserve signaled Wednesday that interest rate cuts could begin as early as September, citing meaningful progress in bringing inflation toward the 2% target.", translation: "美联储周三发出信号，最早可能在9月开始降息，理由是在将通胀率降至2%目标方面取得了重大进展。" },
      { paragraph: "Wall Street reacted positively to the announcement, with the S&P 500 reaching a record high.", translation: "华尔街对这一消息反应积极，标普500指数创下历史新高。" },
      { paragraph: "However, some economists warned that premature easing could reignite price pressures, particularly in housing and energy markets.", translation: "然而，一些经济学家警告称，过早放松可能会重新引发价格压力，尤其是在住房和能源市场。" },
      { paragraph: "The Fed decision will have significant implications for global markets, as many emerging economies have been struggling with capital outflows driven by higher US interest rates.", translation: "美联储的决定将对全球市场产生重大影响，因为许多新兴经济体一直在应对美国高利率驱动的资本外流。" }
    ]),
    complexSentences: JSON.stringify([
      { sentence: "The Federal Reserve signaled Wednesday that interest rate cuts could begin as early as September, citing meaningful progress in bringing inflation toward the 2% target.", structure: "主句 + that 宾语从句 + 现在分词短语（作原因状语）", explanation: "主句是 The Fed signaled that。that 引导宾语从句，citing 是现在分词短语，表示原因。as early as 表示最早在。", keyWords: ["signaled", "citing", "meaningful progress"] },
      { sentence: "The Fed decision will have significant implications for global markets, as many emerging economies have been struggling with capital outflows driven by higher US interest rates.", structure: "主句 + as 原因状语从句 + 过去分词短语（作后置定语）", explanation: "主句是 The decision will have implications。as 引导原因状语从句，driven by 是过去分词短语，修饰 capital outflows。", keyWords: ["implications", "struggling with", "driven by"] }
    ]),
    annotations: JSON.stringify({
      vocabulary: [
        { word: "monetary", level: "专八", ipa: "/ˈmʌnɪteri/", meaning: "货币的；金融的", collocation: "monetary policy", etymology: "拉丁语 moneta (铸币) + -ary (形容词后缀)", synonyms: ["financial", "fiscal"] },
        { word: "resilience", level: "专八", ipa: "/rɪˈzɪliəns/", meaning: "韧性；恢复力", collocation: "market resilience", etymology: "re- (回) + salire (跳) = 弹回", synonyms: ["toughness", "adaptability"] },
        { word: "reignite", level: "GRE", ipa: "/ˌriːɪɡˈnaɪt/", meaning: "重新点燃；再次引发", collocation: "reignite inflation", etymology: "re- (再) + ignite (点燃)", synonyms: ["revive", "restart"] },
        { word: "premature", level: "专八", ipa: "/ˈpremətʃər/", meaning: "过早的；不成熟的", collocation: "premature decision", etymology: "pre- (前) + mature (成熟)", synonyms: ["early", "hasty"] }
      ],
      rhetoric: [
        { device: "Metaphor", text: "cooling inflation", effect: "将抽象经济趋势具象为温度变化，降低理解门槛" },
        { device: "Metaphor", text: "reignite price pressures", effect: "将经济问题比作火焰，暗示危险性" }
      ],
      translation: [
        { phrase: "data-dependent", domestication: "视数据而定", foreignization: "依赖数据的", note: "央行政策用语，强调决策基于经济指标而非预设路线" },
        { phrase: "tightening cycle", domestication: "紧缩周期", foreignization: "收紧周期", note: "指央行持续加息的阶段" }
      ],
      culture: [
        { term: "Federal Reserve", explanation: "美联储，美国中央银行，其利率决策影响全球资本流动" },
        { term: "S&P 500", explanation: "标普500指数，美国500家大型上市公司股票指数，被视为美国股市风向标" }
      ],
      discourse: "经济新闻语篇：政策信号（首段）、市场反应（次段）、专家警告（三段）、全球影响（末段）。使用引语增强权威性，however 实现语义转折。"
    })
  },
  {
    id: "news-003",
    title: "Apple Announces On-Device AI for iPhone 17",
    summary: "The tech giant unveiled a neural engine that processes data locally, addressing growing privacy concerns among users.",
    content: "Apple announced Monday that its upcoming iPhone 17 will feature a dedicated neural processing unit capable of running large language models entirely on-device. The move represents a strategic pivot toward edge AI, allowing Siri and messaging apps to offer personalized suggestions without transmitting user data to cloud servers.\n\nPrivacy advocates praised the development, while competitors scrambled to announce similar capabilities. This is a game-changer for user privacy, said Elena Rodriguez, director of the Digital Rights Foundation. For the first time, users can enjoy AI features without sacrificing their personal data.\n\nThe announcement came amid heightened regulatory scrutiny of AI data practices in the European Union. The EU Artificial Intelligence Act, which took effect earlier this year, imposes strict requirements on how companies collect and process user data for AI training.\n\nIndustry analysts predict that on-device AI will become a standard feature across all smartphone manufacturers within the next two years. The technology could also extend to other devices, including laptops, tablets, and smart home products.",
    source: "The Guardian",
    sourceUrl: "https://www.theguardian.com",
    category: "Technology",
    level: "Foundation",
    imageUrl: null,
    publishedAt: "2026-04-18T14:00:00.000Z",
    wordCount: 170,
    readingTime: 3,
    paragraphTranslations: JSON.stringify([
      { paragraph: "Apple announced Monday that its upcoming iPhone 17 will feature a dedicated neural processing unit capable of running large language models entirely on-device.", translation: "苹果周一宣布，即将推出的iPhone 17将配备专用神经处理单元，能够完全在设备上运行大型语言模型。" },
      { paragraph: "Privacy advocates praised the development, while competitors scrambled to announce similar capabilities.", translation: "隐私倡导者对此举表示赞赏，而竞争对手则争相宣布类似功能。" },
      { paragraph: "The announcement came amid heightened regulatory scrutiny of AI data practices in the European Union.", translation: "这一消息发布之际，欧盟正加强对AI数据实践的监管审查。" },
      { paragraph: "Industry analysts predict that on-device AI will become a standard feature across all smartphone manufacturers within the next two years.", translation: "行业分析师预测，未来两年内，设备端AI将成为所有智能手机制造商的标准功能。" }
    ]),
    complexSentences: JSON.stringify([
      { sentence: "Apple announced Monday that its upcoming iPhone 17 will feature a dedicated neural processing unit capable of running large language models entirely on-device.", structure: "主句 + that 宾语从句 + 形容词短语（作后置定语）", explanation: "主句是 Apple announced that。that 引导宾语从句，capable of 是形容词短语，修饰 unit。", keyWords: ["feature", "dedicated", "capable of"] },
      { sentence: "The EU Artificial Intelligence Act, which took effect earlier this year, imposes strict requirements on how companies collect and process user data for AI training.", structure: "主句 + which 非限制性定语从句 + how 宾语从句", explanation: "主句是 The Act imposes requirements。which 引导非限制性定语从句，补充说明法案生效时间。how 引导宾语从句，说明要求的具体内容。", keyWords: ["took effect", "imposes", "requirements on"] }
    ]),
    annotations: JSON.stringify({
      vocabulary: [
        { word: "neural", level: "专四", ipa: "/ˈnʊərəl/", meaning: "神经的", collocation: "neural network", etymology: "希腊语 neuron (神经) + -al (形容词后缀)", synonyms: ["nervous", "neurological"] },
        { word: "scrutiny", level: "专八", ipa: "/ˈskruːtəni/", meaning: "仔细审查", collocation: "under scrutiny", etymology: "拉丁语 scrutinium (检查)", synonyms: ["examination", "inspection", "review"] },
        { word: "dedicated", level: "专四", ipa: "/ˈdedɪkeɪtɪd/", meaning: "专用的；专注的", collocation: "dedicated server", etymology: "de- (完全) + dicare (宣称)", synonyms: ["committed", "devoted"] },
        { word: "transmit", level: "专四", ipa: "/trænzˈmɪt/", meaning: "传输；发送", collocation: "transmit data", etymology: "trans- (跨越) + mittere (发送)", synonyms: ["send", "transfer", "convey"] }
      ],
      rhetoric: [
        { device: "Alliteration", text: "dedicated neural processing unit", effect: "头韵增强技术术语的记忆点与专业感" },
        { device: "Metaphor", text: "game-changer", effect: "体育术语借用，强调变革性影响" }
      ],
      translation: [
        { phrase: "edge AI", domestication: "边缘人工智能", foreignization: "端侧AI", note: "指在终端设备而非云端运行AI计算" },
        { phrase: "game-changer", domestication: "改变游戏规则的事物", foreignization: "游戏改变者", note: "指彻底改变现状的事物" }
      ],
      culture: [
        { term: "Siri", explanation: "苹果公司开发的智能语音助手，已成为AI语音交互的代名词" },
        { term: "EU AI Act", explanation: "欧盟人工智能法案，全球首部全面规范AI的法律，2024年生效" }
      ],
      discourse: "科技新闻语篇：产品发布（首段）、各方反应（次段）、监管背景（三段）、行业趋势（末段）。使用直接引语增强可信度，技术术语与通俗解释并用。"
    })
  },
  {
    id: "news-004",
    title: "British Museum Returns Looted Bronzes to Nigeria",
    summary: "The historic repatriation marks a turning point in the global debate over colonial-era artifacts held in Western institutions.",
    content: "The British Museum formally returned 36 Benin Bronzes to Nigeria on Tuesday, ending a decades-long dispute over artifacts looted during the 1897 punitive expedition. Nigerian officials hailed the move as a new chapter in cultural diplomacy.\n\nThe bronze sculptures, dating back to the 16th century, were originally created by artists of the Benin Kingdom to decorate the royal palace. They were seized by British forces during a military campaign that has been widely condemned as an act of cultural vandalism.\n\nMuseum curators acknowledged mounting pressure from source communities and former colonial subjects. We recognize that these objects hold profound spiritual and cultural significance for the people of Nigeria, said Dr. James Wright, the museum director of collections.\n\nThe repatriation follows similar actions by German and French institutions, signaling a broader shift in museum ethics. However, critics questioned whether Western museums can maintain their encyclopedic collections under evolving legal standards.",
    source: "Reuters",
    sourceUrl: "https://www.reuters.com",
    category: "Culture",
    level: "Intermediate",
    imageUrl: null,
    publishedAt: "2026-04-17T09:15:00.000Z",
    wordCount: 168,
    readingTime: 3,
    paragraphTranslations: JSON.stringify([
      { paragraph: "The British Museum formally returned 36 Benin Bronzes to Nigeria on Tuesday, ending a decades-long dispute over artifacts looted during the 1897 punitive expedition.", translation: "大英博物馆周二正式将36件贝宁青铜器归还给尼日利亚，结束了因1897年惩罚性远征期间被掠夺文物而持续数十年的争端。" },
      { paragraph: "The bronze sculptures, dating back to the 16th century, were originally created by artists of the Benin Kingdom to decorate the royal palace.", translation: "这些可追溯至16世纪的青铜雕塑最初由贝宁王国的艺术家创作，用于装饰皇宫。" },
      { paragraph: "Museum curators acknowledged mounting pressure from source communities and former colonial subjects.", translation: "博物馆馆长承认来自原产地社区和前殖民地臣民的压力日益增大。" },
      { paragraph: "The repatriation follows similar actions by German and French institutions, signaling a broader shift in museum ethics.", translation: "此次归还行动继德国和法国机构的类似举措之后，标志着博物馆伦理的更广泛转变。" }
    ]),
    complexSentences: JSON.stringify([
      { sentence: "The British Museum formally returned 36 Benin Bronzes to Nigeria on Tuesday, ending a decades-long dispute over artifacts looted during the 1897 punitive expedition.", structure: "主句 + 现在分词短语（作结果状语）+ 过去分词短语（作后置定语）", explanation: "主句是 The Museum returned Bronzes。ending 是现在分词短语，表示结果。looted 是过去分词短语，修饰 artifacts。", keyWords: ["returned", "ending", "looted", "punitive expedition"] },
      { sentence: "They were seized by British forces during a military campaign that has been widely condemned as an act of cultural vandalism.", structure: "被动语态主句 + that 定语从句", explanation: "主句是 They were seized。that 引导定语从句，修饰 campaign。condemned as 表示被谴责为。", keyWords: ["seized", "condemned", "vandalism"] }
    ]),
    annotations: JSON.stringify({
      vocabulary: [
        { word: "repatriation", level: "GRE", ipa: "/ˌriːpætriˈeɪʃn/", meaning: "遣返；归还", collocation: "artifact repatriation", etymology: "re- (回) + patria (祖国) = 返回祖国", synonyms: ["return", "restoration"] },
        { word: "expedition", level: "专四", ipa: "/ˌekspəˈdɪʃn/", meaning: "远征；探险", collocation: "military expedition", etymology: "ex- (出) + pedis (脚) = 迈出脚", synonyms: ["campaign", "journey"] },
        { word: "curator", level: "专八", ipa: "/kjʊəˈreɪtər/", meaning: "馆长；策展人", collocation: "museum curator", etymology: "拉丁语 curare (照看) = 照看藏品的人", synonyms: ["keeper", "custodian"] },
        { word: "vandalism", level: "专八", ipa: "/ˈvændəlɪzəm/", meaning: "故意破坏", collocation: "cultural vandalism", etymology: "来自汪达尔人，日耳曼部落，以破坏罗马文明著称", synonyms: ["destruction", "sabotage"] }
      ],
      rhetoric: [
        { device: "Metonymy", text: "Benin Bronzes", effect: "以具体文物代指殖民掠夺历史，引发情感共鸣" },
        { device: "Euphemism", text: "punitive expedition", effect: "用惩罚性远征美化军事侵略，批判性解读殖民话语" }
      ],
      translation: [
        { phrase: "cultural diplomacy", domestication: "文化外交", foreignization: "文化外交", note: "通过文化交流促进国际关系的外交形式" },
        { phrase: "source communities", domestication: "原产地社区", foreignization: "来源社区", note: "指文物原属的国家或民族群体" }
      ],
      culture: [
        { term: "Benin Bronzes", explanation: "贝宁青铜器，16-17世纪西非贝宁王国宫廷艺术品，1897年被英军掠夺" },
        { term: "British Museum", explanation: "大英博物馆，世界最大博物馆之一，藏有大量殖民时期掠夺的文物" }
      ],
      discourse: "文化遗产报道语篇：归还事件（首段）、历史背景（次段）、官方回应（三段）、行业趋势（末段）。使用历史现在时增强叙事感，直接引语平衡各方立场。"
    })
  },
  {
    id: "news-005",
    title: "Remote Work Reshapes Urban Housing Markets",
    summary: "City centers see rising vacancy rates as employees prioritize suburban homes with dedicated office spaces.",
    content: "A comprehensive study published Thursday reveals that remote work policies have fundamentally altered housing demand in major metropolitan areas. Downtown apartment vacancies in New York and San Francisco reached 15-year highs, while suburban markets experienced bidding wars for properties with home offices.\n\nReal estate analysts coined the term Zoom rooms to describe the new must-have feature in suburban homes. These dedicated workspaces, often converted from spare bedrooms or basements, have become a key selling point for properties outside city centers.\n\nThe trend has prompted urban planners to reconsider mixed-use zoning laws. Some cities are exploring incentives to convert vacant commercial space into residential units, while others are investing in public amenities to attract residents back to downtown areas.\n\nEconomists warn of a potential commercial real estate crisis, as office buildings struggle with low occupancy rates. We are witnessing a fundamental restructuring of how people live and work, said Professor David Miller of Columbia University urban planning department.",
    source: "BBC",
    sourceUrl: "https://www.bbc.com",
    category: "Society",
    level: "Foundation",
    imageUrl: null,
    publishedAt: "2026-04-16T11:00:00.000Z",
    wordCount: 175,
    readingTime: 3,
    paragraphTranslations: JSON.stringify([
      { paragraph: "A comprehensive study published Thursday reveals that remote work policies have fundamentally altered housing demand in major metropolitan areas.", translation: "周四发表的一项综合研究表明，远程工作政策从根本上改变了大都市地区的住房需求。" },
      { paragraph: "Real estate analysts coined the term Zoom rooms to describe the new must-have feature in suburban homes.", translation: "房地产分析师创造了Zoom房间一词来描述郊区住宅的新必备功能。" },
      { paragraph: "The trend has prompted urban planners to reconsider mixed-use zoning laws.", translation: "这一趋势促使城市规划者重新考虑混合用途分区法规。" },
      { paragraph: "Economists warn of a potential commercial real estate crisis, as office buildings struggle with low occupancy rates.", translation: "经济学家警告可能出现商业地产危机，因为写字楼正面临低入住率的困境。" }
    ]),
    complexSentences: JSON.stringify([
      { sentence: "Downtown apartment vacancies in New York and San Francisco reached 15-year highs, while suburban markets experienced bidding wars for properties with home offices.", structure: "主句 + while 对比状语从句", explanation: "两个分句通过 while 连接，形成对比：市中心空置率高 vs 郊区竞价激烈。15-year highs 是复合名词，表示15年来最高。", keyWords: ["vacancies", "bidding wars", "while"] },
      { sentence: "Some cities are exploring incentives to convert vacant commercial space into residential units, while others are investing in public amenities to attract residents back to downtown areas.", structure: "主句 + to do 不定式（作目的状语）+ while 对比结构", explanation: "convert into 表示将...转变为...。to attract 是目的状语。while 连接两个对比的做法。", keyWords: ["incentives", "convert", "amenities"] }
    ]),
    annotations: JSON.stringify({
      vocabulary: [
        { word: "vacancy", level: "专四", ipa: "/ˈveɪkənsi/", meaning: "空缺；空房", collocation: "job vacancy", etymology: "拉丁语 vacare (空)", synonyms: ["opening", "availability"] },
        { word: "metropolitan", level: "专四", ipa: "/ˌmetrəˈpɒlɪtən/", meaning: "大都市的", collocation: "metropolitan area", etymology: "希腊语 meter (母亲) + polis (城市)", synonyms: ["urban", "city"] },
        { word: "amenity", level: "专八", ipa: "/əˈmiːnəti/", meaning: "便利设施", collocation: "public amenities", etymology: "拉丁语 amoenus (愉快)", synonyms: ["facility", "convenience"] },
        { word: "occupancy", level: "专八", ipa: "/ˈɒkjəpənsi/", meaning: "入住率；占用率", collocation: "occupancy rate", etymology: "拉丁语 occupare (占据)", synonyms: ["occupation", "use"] }
      ],
      rhetoric: [
        { device: "Neologism", text: "Zoom rooms", effect: "以品牌名创造新词，生动概括后疫情时代居住需求变迁" },
        { device: "Antithesis", text: "downtown vacancies vs suburban bidding wars", effect: "城乡对比，突出远程工作对住房市场的颠覆性影响" }
      ],
      translation: [
        { phrase: "bidding wars", domestication: "竞价大战", foreignization: "出价战争", note: "房地产术语，指多方买家竞争抬高价格" },
        { phrase: "mixed-use zoning", domestication: "混合用途分区", foreignization: "多功能分区", note: "指同一区域允许多种用途的城市规划方式" }
      ],
      culture: [
        { term: "Zoom", explanation: "视频会议软件，疫情期间成为远程工作代名词" },
        { term: "mixed-use zoning", explanation: "混合用途分区，指同一区域允许住宅、商业、办公共存的城市规划理念" }
      ],
      discourse: "社会趋势语篇：研究发现（首段）、新概念阐释（次段）、政策应对（三段）、专家警告（末段）。使用数据支撑论点，创造新词增强传播力。"
    })
  }
];

async function main() {
  let count = 0;
  for (const news of NEWS_DATA) {
    const existing = await prisma.news.findUnique({ where: { id: news.id } });
    if (!existing) {
      await prisma.news.create({ data: news });
      count++;
      console.log(`  + ${news.id}: ${news.title}`);
    } else {
      console.log(`  = ${news.id}: already exists, skipped`);
    }
  }
  console.log(`\nDone! ${count} news articles inserted.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
