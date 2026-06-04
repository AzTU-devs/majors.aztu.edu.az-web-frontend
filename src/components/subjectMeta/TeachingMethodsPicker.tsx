import { TEACHING_METHODS } from "../../constants/subjectMeta";

interface Props {
    selected: string[];
    onChange: (keys: string[]) => void;
}

export default function TeachingMethodsPicker({ selected, onChange }: Props) {
    const toggle = (key: string) => {
        onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
    };

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TEACHING_METHODS.map((m) => {
                const checked = selected.includes(m.key);
                return (
                    <label
                        key={m.key}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                            checked
                                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(m.key)}
                            className="h-4 w-4 accent-brand-500"
                        />
                        {m.label}
                    </label>
                );
            })}
        </div>
    );
}
