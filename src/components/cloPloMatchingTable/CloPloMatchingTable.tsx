import { Checkbox, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createCloPloMatch,
    getCloPloMatchesBySubject,
} from "../../services/cloPloMatch/cloPloMatchService";
import { getPloBySpecailty, Plo } from "../../services/plo/ploService";
import { getCloBySubjectCode } from "../../services/clo/clo";

interface CloRow {
    clo_code: string;
    clo_content: string;
}

export default function CloPloMatchingTable() {
    const location = useLocation();
    const { subjectCode, specialtyCode } = location.state || {};
    const [plos, setPlos] = useState<Plo[]>([]);
    const [clos, setClos] = useState<CloRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!subjectCode || !specialtyCode) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const plosData = await getPloBySpecailty(specialtyCode);
                const ploList: Plo[] = Array.isArray(plosData) ? plosData : [];
                setPlos(ploList);

                const closData = await getCloBySubjectCode(subjectCode);
                const cloList: CloRow[] = Array.isArray(closData) ? closData : [];
                setClos(cloList);

                // Initialise every cell to false, then mark existing matches.
                const initialState: { [key: string]: boolean } = {};
                cloList.forEach((clo) => {
                    for (const plo of ploList) {
                        initialState[`${clo.clo_code}_${plo.plo_code}`] = false;
                    }
                });

                const matched = await getCloPloMatchesBySubject(subjectCode);
                matched.forEach((m) => {
                    initialState[`${m.clo_code}_${m.plo_code}`] = true;
                });

                setCheckedState(initialState);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subjectCode, specialtyCode]);

    const handleCheckboxChange = async (cloCode: string, ploCode: string) => {
        const key = `${cloCode}_${ploCode}`;
        const newState = !checkedState[key];
        setCheckedState((prev) => ({ ...prev, [key]: newState }));

        const result = await createCloPloMatch({
            clo_code: cloCode,
            plo_code: ploCode,
            match: newState,
        });

        if (result === "ERROR") {
            // revert checkbox if API fails
            setCheckedState((prev) => ({ ...prev, [key]: !newState }));
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Uyğunluq yadda saxlanıla bilmədi.",
            });
        }
    };

    const ploLabel = (plo: Plo, index: number) => plo.plo_code || `PLO${index + 1}`;
    const cloLabel = (clo: CloRow, index: number) => clo.clo_code || `CLO${index + 1}`;

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={48} />
                ))}
            </div>
        );
    }

    if (plos.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                Bu ixtisas üçün proqram təlim nəticəsi (PLO) əlavə edilməyib.
            </div>
        );
    }

    if (clos.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                Bu fənn üçün fənn təlim nəticəsi (CLO) əlavə edilməyib.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Hər fənn təlim nəticəsini (CLO) uyğun gələn proqram təlim nəticələri (PLO) ilə işarələyin. Dəyişikliklər avtomatik yadda saxlanılır.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-white/10">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 min-w-[240px] border-b border-r border-white/15 bg-brand-600 px-4 py-3 text-left font-semibold text-white">
                                CLO
                            </th>
                            {plos.map((plo, index) => (
                                <th
                                    key={plo.plo_code ?? index}
                                    title={plo.plo_content}
                                    className="whitespace-nowrap border-b border-l border-white/15 bg-brand-600 px-3 py-3 text-center font-semibold text-white"
                                >
                                    {ploLabel(plo, index)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {clos.map((clo, index) => (
                            <tr
                                key={clo.clo_code ?? index}
                                className="odd:bg-white even:bg-gray-50 hover:bg-brand-50/50 dark:odd:bg-gray-900 dark:even:bg-white/[0.03] dark:hover:bg-white/5"
                            >
                                <td
                                    title={clo.clo_content}
                                    className="sticky left-0 z-10 min-w-[240px] max-w-[360px] truncate border-t border-r border-gray-200 bg-inherit px-4 py-2.5 font-medium text-gray-800 dark:border-white/10 dark:text-gray-100"
                                >
                                    <span className="mr-2 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                                        {cloLabel(clo, index)}
                                    </span>
                                    {clo.clo_content}
                                </td>
                                {plos.map((plo, ploIndex) => {
                                    const key = `${clo.clo_code}_${plo.plo_code}`;
                                    return (
                                        <td
                                            key={ploIndex}
                                            className="border-t border-l border-gray-200 px-3 py-2.5 text-center dark:border-white/10"
                                        >
                                            <Checkbox
                                                size="small"
                                                checked={!!checkedState[key]}
                                                onChange={() => handleCheckboxChange(clo.clo_code, plo.plo_code)}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend: PLO code → full content */}
            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    İşarələmə
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {plos.map((plo, index) => (
                        <div
                            key={plo.plo_code ?? index}
                            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-900"
                        >
                            <span className="flex-shrink-0 rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                                {ploLabel(plo, index)}
                            </span>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {plo.plo_content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
