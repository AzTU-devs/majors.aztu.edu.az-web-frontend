import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { createMatch, getMatchedPlosBySubject } from "../../services/match/MatchService";
import { getPloBySpecailty, Plo } from "../../services/plo/ploService";
import { getCurriculaBySpecialtyCode, Subject } from "../../services/curricula/curricula";

export default function SubjectMatchingTable() {
    const location = useLocation();
    const [plos, setPlos] = useState<Plo[]>([]);
    const { specialtyCode } = location.state || {};
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!specialtyCode) return;

        const fetchData = async () => {
            const plosData = await getPloBySpecailty(specialtyCode);
            setPlos(plosData);

            const curriculaData = await getCurriculaBySpecialtyCode(specialtyCode, 0, 10);
            if (curriculaData === "ERROR" || curriculaData === "NOT FOUND") {
                setSubjects([]);
            } else if (typeof curriculaData === "object") {
                setSubjects(curriculaData.subjects);

                // Initialize checkbox states
                const initialState: { [key: string]: boolean } = {};
                for (const subject of curriculaData.subjects) {
                    for (const plo of plosData) {
                        initialState[`${subject.subject_code}_${plo.plo_code}`] = false;
                    }
                    const matchedPlos = await getMatchedPlosBySubject(subject.subject_code);
                    matchedPlos.forEach((m: any) => {
                        const key = `${subject.subject_code}_${m.plo_code}`;
                        initialState[key] = true;
                    });
                }
                setCheckedState(initialState);
            }
        };

        fetchData();
    }, [specialtyCode]);

    const handleCheckboxChange = async (subjectCode: string, ploCode: string) => {
        const key = `${subjectCode}_${ploCode}`;
        const newState = !checkedState[key];
        setCheckedState(prev => ({ ...prev, [key]: newState }));

        const payload = { subject_code: subjectCode, plo_code: ploCode, match: newState };

        const result = await createMatch(payload);
        if (result === "ERROR") {
            // revert checkbox if API fails
            setCheckedState(prev => ({ ...prev, [key]: !newState }));
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save match",
            });
        }
    };

    return (
        <div>
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm mt-6">
                <thead>
                    <tr className="text-left">
                        <th className="border px-4 py-2 text-gray-800 font-semibold"></th>
                        {plos.map((plo, index) => (
                            <th key={index} className="border px-4 py-2 text-gray-800 font-semibold">
                                {plo.plo_content}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, index) => (
                        <tr key={index} className="border-t hover:bg-gray-100 transition-colors">
                            <td className="border px-4 py-2 text-gray-800">{subject.subject_name}</td>
                            {plos.map((plo, ploIndex) => {
                                const key = `${subject.subject_code}_${plo.plo_code}`;
                                return (
                                    <td key={ploIndex} className="border px-4 py-2 text-center">
                                        <Checkbox
                                            checked={!!checkedState[key]}
                                            onChange={() => handleCheckboxChange(subject.subject_code, plo.plo_code)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}