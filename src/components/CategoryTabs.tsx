// src/components/CategoryTabs.tsx —— 分类标签栏
// 首页顶部的"分类指示牌"，点击后筛选不同类别的新闻

// ==================== 组件接收的指令 ====================
interface CategoryTabsProps {
  activeCategory: string | null;   // 当前激活的分类，null 表示"全部"
  onCategoryChange: (category: string | null) => void;  // 点击标签后通知父组件
}

// ==================== 标签配置 ====================
// 顺序和显示名称，"全部"对应 null（查询时不加分类筛选）
const TABS = [
  { label: "全部", value: null },
  { label: "政治", value: "Politics" },
  { label: "经济", value: "Economy" },
  { label: "科技", value: "Technology" },
  { label: "文化", value: "Culture" },
  { label: "社会", value: "Society" },
];

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    // 容器：横向排列，允许滚动（移动端标签多，需要左右滑），粘性定位
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          // 判断这个标签是否被选中
          const isActive = activeCategory === tab.value;

          return (
            <button
              key={tab.label}  // React 要求列表项必须有唯一 key
              onClick={() => onCategoryChange(tab.value)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-deep-sea text-white shadow-sm"  // 激活：深海蓝底+白字
                    : "bg-white text-ink-light border border-gray-200 hover:border-deep-sea hover:text-deep-sea"  // 未激活：白底+淡墨字+细边框
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}