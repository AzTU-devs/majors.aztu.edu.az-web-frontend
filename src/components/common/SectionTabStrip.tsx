interface Tab {
  key: string;
  label: string;
}

interface SectionTabStripProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function SectionTabStrip({ tabs, activeTab, onChange }: SectionTabStripProps) {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="no-scrollbar flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
