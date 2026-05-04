import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: "brand" | "success" | "warning";
}

const colorMap = {
  brand: {
    bg: "bg-brand-50 dark:bg-brand-500/[0.12]",
    text: "text-brand-500",
  },
  success: {
    bg: "bg-success-50 dark:bg-success-500/[0.12]",
    text: "text-success-500",
  },
  warning: {
    bg: "bg-warning-50 dark:bg-warning-500/[0.12]",
    text: "text-warning-500",
  },
};

export default function StatCard({ icon, label, value, color = "brand" }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}
