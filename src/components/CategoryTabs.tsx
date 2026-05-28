interface CategoryTabsProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const TABS = [
  { label: "全部", value: null },
  { label: "政治", value: "Politics" },
  { label: "经济", value: "Economy" },
  { label: "科技", value: "Technology" },
  { label: "文化", value: "Culture" },
  { label: "社会", value: "Society" },
];

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-14 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onCategoryChange(tab.value)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === tab.value
                ? "bg-[#0F4C81] text-white shadow-sm"
                : "bg-white text-[#6B6B6B] border border-gray-200 hover:border-[#0F4C81] hover:text-[#0F4C81]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
