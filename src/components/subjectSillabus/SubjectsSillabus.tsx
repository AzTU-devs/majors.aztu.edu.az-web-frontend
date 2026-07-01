import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Button from "../ui/button/Button";
import { Clo, getCloBySubjectCode } from "../../services/clo/clo";
import { SubjectDetails, getSubjectDetails } from "../../services/curricula/curricula";
import { getLiteratures, Literature } from "../../services/literature/LiteratureService";
import { Topic, getTopics } from "../../services/topic/topic";
import { Tlo, getTloByTopicCode } from "../../services/tlo/tloService";
import {
    formOfEducationLabel,
    languageLabel,
    parseTeachingMethods,
    teachingMethodLabel,
} from "../../constants/subjectMeta";

const semesterLabel = (s?: number) =>
    s === 1 ? "Yaz semestri" : s === 2 ? "Payız semestri" : "—";
const statusLabel = (s?: number) =>
    s === 1 ? "Seçmə" : s === 2 ? "Məcburi" : s === 3 ? "Digər" : "—";
const typeLabel = (t: number) =>
    t === 1 ? "Mühazirə" : t === 2 ? "Məşğələ" : t === 3 ? "Laboratoriya" : t === 4 ? "Sərbəst iş" : "—";

interface TopicWithTlos extends Topic {
    tlos: Tlo[];
}

export default function SubjectsSillabus() {
    const location = useLocation();
    const { subjectCode, subjectDetails: stateDetails } = (location.state || {}) as {
        subjectCode?: string;
        subjectName?: string;
        subjectDetails?: SubjectDetails;
    };

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<SubjectDetails | undefined>(stateDetails);
    const [clos, setClos] = useState<Clo[]>([]);
    const [topics, setTopics] = useState<TopicWithTlos[]>([]);
    const [literatures, setLiteratures] = useState<Literature[]>([]);

    useEffect(() => {
        if (!subjectCode) {
            setLoading(false);
            return;
        }
        let cancelled = false;

        const load = async () => {
            setLoading(true);

            // Subject details (use navigation state when present, else fetch).
            if (!stateDetails) {
                const d = await getSubjectDetails(subjectCode);
                if (!cancelled && d && typeof d === "object") setDetails(d);
            }

            const cloRes = await getCloBySubjectCode(subjectCode);
            if (!cancelled) setClos(Array.isArray(cloRes) ? cloRes : []);

            const litRes = await getLiteratures(subjectCode);
            if (!cancelled) {
                setLiteratures(
                    litRes && typeof litRes === "object" && Array.isArray(litRes.literatures)
                        ? litRes.literatures
                        : []
                );
            }

            const topicRes = await getTopics(subjectCode, 0, 100);
            const topicList: Topic[] =
                topicRes && typeof topicRes === "object" && Array.isArray(topicRes.topics)
                    ? topicRes.topics
                    : [];
            const withTlos = await Promise.all(
                topicList.map(async (t) => ({
                    ...t,
                    tlos: await getTloByTopicCode(t.topic_code),
                }))
            );
            if (!cancelled) setTopics(withTlos);

            if (!cancelled) setLoading(false);
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [subjectCode]);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={48} />
                ))}
            </div>
        );
    }

    const cell = "border border-gray-300 dark:border-gray-700 p-3 align-top";
    const labelCell = `${cell} w-1/3 font-medium bg-gray-50 dark:bg-white/5`;

    return (
        <div className="space-y-4">
            <div className="flex justify-end print:hidden">
                <Button size="sm" startIcon={<PrintIcon fontSize="small" />} onClick={() => window.print()}>
                    Çap et
                </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-200">
                    <tbody>
                        <tr>
                            <td colSpan={2} className={`${cell} bg-gray-100 dark:bg-white/10 text-lg font-semibold`}>
                                {details?.subject_name || "—"}{" "}
                                <span className="text-gray-500 dark:text-gray-400">({subjectCode})</span>
                            </td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Kredit</td>
                            <td className={cell}>{details?.credit ?? "—"}</td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Tələbənin iş yükü</td>
                            <td className={cell}>{details?.hours_per_week ?? "—"}</td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Semestr</td>
                            <td className={cell}>{semesterLabel(details?.semester)}</td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Tədris ili</td>
                            <td className={cell}>{details?.year ?? "—"}</td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Fənnin tipi</td>
                            <td className={cell}>{statusLabel(details?.status)}</td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Təhsil forması</td>
                            <td className={cell}>{formOfEducationLabel(details?.form_of_education)}</td>
                        </tr>
                        <tr>
                            <td className={labelCell}>Tədris dili</td>
                            <td className={cell}>{languageLabel(details?.language_of_instruction)}</td>
                        </tr>
                        {details?.in_class_hours && (
                            <tr>
                                <td className={labelCell}>Auditoriyadaxili saatlar</td>
                                <td className={`${cell} whitespace-pre-line`}>{details.in_class_hours}</td>
                            </tr>
                        )}
                        {details?.out_of_class_hours && (
                            <tr>
                                <td className={labelCell}>Auditoriya kənar saatlar</td>
                                <td className={`${cell} whitespace-pre-line`}>{details.out_of_class_hours}</td>
                            </tr>
                        )}
                        <tr>
                            <td className={labelCell}>Tədris metodları</td>
                            <td className={cell}>
                                {parseTeachingMethods(details?.teaching_methods).length === 0 ? (
                                    <span className="text-gray-400">Əlavə edilməyib</span>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {parseTeachingMethods(details?.teaching_methods).map((k) => (
                                            <li key={k}>{teachingMethodLabel(k)}</li>
                                        ))}
                                    </ul>
                                )}
                            </td>
                        </tr>
                        {details?.subject_description && (
                            <tr>
                                <td className={labelCell}>Təsvir</td>
                                <td className={cell}>{details.subject_description}</td>
                            </tr>
                        )}

                        {/* Course learning outcomes */}
                        <tr>
                            <td className={labelCell}>Fənnin təlim nəticələri (CLO)</td>
                            <td className={cell}>
                                {clos.length === 0 ? (
                                    <span className="text-gray-400">Əlavə edilməyib</span>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {clos.map((clo, i) => (
                                            <li key={i}>{clo.clo_content}</li>
                                        ))}
                                    </ul>
                                )}
                            </td>
                        </tr>

                        {/* Topic plan with TLOs */}
                        <tr>
                            <td className={labelCell}>Mövzu planı</td>
                            <td className={cell}>
                                {topics.length === 0 ? (
                                    <span className="text-gray-400">Mövzu əlavə edilməyib</span>
                                ) : (
                                    <ol className="list-decimal pl-5 space-y-3">
                                        {topics.map((topic) => (
                                            <li key={topic.topic_code}>
                                                <div className="font-medium">
                                                    {topic.topic_name}{" "}
                                                    <span className="text-xs font-normal text-gray-500">
                                                        ({typeLabel(topic.topic_type)})
                                                    </span>
                                                </div>
                                                {topic.topic_desc && (
                                                    <p className="text-gray-600 dark:text-gray-400">{topic.topic_desc}</p>
                                                )}
                                                {topic.tlos.length > 0 && (
                                                    <ul className="mt-1 list-disc pl-5 text-gray-600 dark:text-gray-400">
                                                        {topic.tlos.map((tlo) => (
                                                            <li key={tlo.tlo_code}>{tlo.tlo_content}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </td>
                        </tr>

                        {/* Literature */}
                        <tr>
                            <td className={labelCell}>Ədəbiyyat</td>
                            <td className={cell}>
                                {literatures.length === 0 ? (
                                    <span className="text-gray-400">Əlavə edilməyib</span>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {literatures.map((lit) => (
                                            <li key={lit.id}>
                                                {lit.url ? (
                                                    <a
                                                        href={lit.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        {lit.literature_name}
                                                    </a>
                                                ) : (
                                                    lit.literature_name
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Assessment */}
            {details?.assessment && details.assessment.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                    <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-200">
                        <thead>
                            <tr>
                                <td colSpan={4} className={`${cell} bg-gray-100 dark:bg-white/10 font-semibold`}>
                                    Qiymətləndirmə haqqında məlumat
                                </td>
                            </tr>
                            <tr className="bg-gray-50 dark:bg-white/5 text-xs font-semibold">
                                <td className={cell}>Qiymətləndirmə forması</td>
                                <td className={cell}>Açıqlama</td>
                                <td className={cell}>Bal</td>
                                <td className={cell}>Uyğun FTN</td>
                            </tr>
                        </thead>
                        <tbody>
                            {details.assessment.map((row, i) => (
                                <tr key={i}>
                                    <td className={`${cell} font-medium`}>{row.form}</td>
                                    <td className={cell}>{row.description}</td>
                                    <td className={`${cell} whitespace-nowrap`}>{row.score}</td>
                                    <td className={`${cell} whitespace-nowrap`}>{row.ftn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
