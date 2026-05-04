import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface EmptyStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export default function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warning-50 dark:bg-warning-500/[0.12]">
        <InfoOutlinedIcon className="text-warning-500" sx={{ fontSize: 24 }} />
      </div>
      <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">{message}</p>
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
      >
        {actionLabel}
      </button>
    </div>
  );
}
