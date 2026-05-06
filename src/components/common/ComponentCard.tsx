import { Link } from "react-router";
import Button from "../ui/button/Button";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  isNew?: boolean;
  path?: string;
  state?: {
    specialtyCode: string;
    specialtyName: string;
  };
  topicState?: {
    subjectCode: string;
    subjectName: string;
  };
  buttonTitle?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  isNew = false,
  path = "",
  state = {
    specialtyCode: "",
    specialtyName: "",
  },
  topicState,
  buttonTitle = "",
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/95 shadow-soft transition duration-300 hover:shadow-elevated dark:border-white/5 dark:bg-gray-900/80 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {isNew && (
          <Link to={path} state={topicState ? topicState : state}>
            <Button size="sm">{buttonTitle ? buttonTitle : "Yeni fənn"}</Button>
          </Link>
        )}
      </div>

      <div className="border-t border-gray-100 p-4 sm:p-6 dark:border-white/5">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
