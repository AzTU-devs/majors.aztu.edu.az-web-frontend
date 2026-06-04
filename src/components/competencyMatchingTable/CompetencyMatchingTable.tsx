import { Checkbox, Skeleton } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../redux/store";
import { Competency, getCompetencyBySpecialty } from "../../services/competency/competencyService";
import { getCurriculaBySpecialtyCode, Subject } from "../../services/curricula/curricula";
import {
    createCompetencyMatch,
    getMatchedSubjectsByCompetency,
} from "../../services/competencyMatch/competencyMatchService";

const TYPE_GROUPS = [
    { type: 1, label: "Peşə Səriştələri" },
    { type: 2, label: "İxtisas Səriştələri" },
];

export default function CompetencyMatchingTable() {
    const location = useLocation();
    const token = useSelector((state: RootState) => state.auth.token) || "";
    const { specialtyCode } = (location.state || {}) as { specialtyCode?: string };

    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [competencies, setCompetencies] = useState<Competency[]>([]);
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!specialtyCode) return;
        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);
            try {
                const compRes = await getCompetencyBySpecialty(specialtyCode, token);
                const compList: Competency[] = Array.isArray(compRes) ? compRes : [];

                const curriculaData = await getCurriculaBySpecialtyCode(specialtyCode, 0, 100);
                const subjectList: Subject[] =
                    curriculaData && typeof curriculaData === "object" && Array.isArray(curriculaData.subjects)
                        ? curriculaData.subjects
                        : [];

                const initialState: { [key: string]: boolean } = {};
                const matchedResults = await Promise.all(
                    compList.map((c) => getMatchedSubjectsByCompetency(c.competency_code))
                );
                compList.forEach((comp, i) => {
                    matchedResults[i].forEach((m: any) => {
                        initialState[`${comp.competency_code}_${m.subject_code}`] = true;
                    });
                });

                if (!cancelled) {
                    setCompetencies(compList);
                    setSubjects(subjectList);
                    setCheckedState(initialState);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => {
            cancelled = true;
        };
    }, [specialtyCode]);

    const handleCheckboxChange = async (competencyCode: string, subjectCode: string) => {
        const key = `${competencyCode}_${subjectCode}`;
        const newState = !checkedState[key];
        setCheckedState((prev) => ({ ...prev, [key]: newState }));

        const result = await createCompetencyMatch({
            competency_code: competencyCode,
            subject_code: subjectCode,
            match: newState,
        });
        if (result === "ERROR") {
            setCheckedState((prev) => ({ ...prev, [key]: !newState }));
            Swal.fire({ icon: "error", title: "Xəta", text: "Uyğunluq yadda saxlanıla bilmədi." });
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={48} />
                ))}
            </div>
        );
    }

    if (competencies.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                Bu ixtisas üçün səriştə əlavə edilməyib.
            </div>
        );
    }

    if (subjects.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                Bu ixtisas üçün fənn tapılmadı.
            </div>
        );
    }

    const cell = "border border-gray-200 dark:border-white/10 px-3 py-2.5 text-center";
    const colCount = subjects.length + 1;

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Hər səriştəni uyğun gələn fənlərlə işarələyin. Səriştələr sol tərəfdə, fənlər başlıqda yerləşir. Dəyişikliklər avtomatik yadda saxlanılır.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-white/10">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 min-w-[260px] border-b border-r border-white/15 bg-brand-600 px-4 py-3 text-left font-semibold text-white">
                                Səriştə
                            </th>
                            {subjects.map((subject, i) => (
                                <th
                                    key={subject.subject_code ?? i}
                                    title={subject.subject_name}
                                    className="whitespace-nowrap border-b border-l border-white/15 bg-brand-600 px-3 py-3 text-center font-semibold text-white"
                                >
                                    {subject.subject_code}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TYPE_GROUPS.map((group) => {
                            const groupComps = competencies.filter((c) => c.competency_type === group.type);
                            if (groupComps.length === 0) return null;
                            return (
                                <Fragment key={`group-${group.type}`}>
                                    <tr>
                                        <td
                                            colSpan={colCount}
                                            className="border border-gray-200 bg-gray-100 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                                        >
                                            {group.label}
                                        </td>
                                    </tr>
                                    {groupComps.map((comp) => (
                                        <tr
                                            key={comp.competency_code}
                                            className="odd:bg-white even:bg-gray-50 hover:bg-brand-50/50 dark:odd:bg-gray-900 dark:even:bg-white/[0.03] dark:hover:bg-white/5"
                                        >
                                            <td
                                                className="sticky left-0 z-10 min-w-[260px] border-t border-r border-gray-200 bg-inherit px-4 py-2.5 text-left text-gray-800 dark:border-white/10 dark:text-gray-100"
                                                title={comp.competency_code}
                                            >
                                                {comp.competency_content}
                                            </td>
                                            {subjects.map((subject, sIndex) => {
                                                const key = `${comp.competency_code}_${subject.subject_code}`;
                                                return (
                                                    <td key={sIndex} className={`${cell} border-t border-l`}>
                                                        <Checkbox
                                                            size="small"
                                                            checked={!!checkedState[key]}
                                                            onChange={() =>
                                                                handleCheckboxChange(comp.competency_code, subject.subject_code)
                                                            }
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Subject legend: code → name */}
            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Fənlər</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {subjects.map((subject, i) => (
                        <div
                            key={subject.subject_code ?? i}
                            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-900"
                        >
                            <span className="flex-shrink-0 rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                                {subject.subject_code}
                            </span>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {subject.subject_name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
