import { AssessmentRow } from "../../services/curricula/curricula";
import Button from "../ui/button/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Props {
    rows: AssessmentRow[];
    onChange: (rows: AssessmentRow[]) => void;
}

const emptyRow: AssessmentRow = { form: "", description: "", score: "", ftn: "" };

export default function AssessmentEditor({ rows, onChange }: Props) {
    const update = (i: number, field: keyof AssessmentRow, value: string) => {
        const next = rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r));
        onChange(next);
    };
    const addRow = () => onChange([...rows, { ...emptyRow }]);
    const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-white/5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            <th className="px-3 py-2">Qiymətləndirmə forması</th>
                            <th className="px-3 py-2">Açıqlama</th>
                            <th className="px-3 py-2 w-24">Bal</th>
                            <th className="px-3 py-2 w-28">Uyğun FTN</th>
                            <th className="px-3 py-2 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-t border-gray-100 dark:border-white/5 align-top">
                                <td className="px-2 py-2">
                                    <textarea
                                        value={row.form}
                                        onChange={(e) => update(i, "form", e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <textarea
                                        value={row.description}
                                        onChange={(e) => update(i, "description", e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        value={row.score}
                                        onChange={(e) => update(i, "score", e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        value={row.ftn}
                                        onChange={(e) => update(i, "ftn", e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-sm focus:border-brand-300 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    />
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(i)}
                                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                                        aria-label="Sil"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Button type="button" size="sm" variant="outline" startIcon={<AddIcon fontSize="small" />} onClick={addRow}>
                Sətir əlavə et
            </Button>
        </div>
    );
}
