import Stack from '@mui/material/Stack';
import { Skeleton } from "@mui/material";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Subject, getCurriculaBySpecialtyCode } from "../../services/curricula/curricula";


export default function Subjects() {
    const location = useLocation();
    const navigate = useNavigate();
    const [end, setEnd] = useState<number>(20);
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState<number>(0);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectLength, setSubjectLength] = useState<number>(0);
    const { specialtyCode } = location.state as { specialtyCode: string };

    useEffect(() => {
        setLoading(true);
        getCurriculaBySpecialtyCode(
            specialtyCode,
            start,
            end
        )
            .then((res) => {
                if (typeof res === "object" && res.subjects) {
                    setSubjects(res.subjects);
                    setSubjectLength(res.total_subjects);
                } else {
                    setSubjects([]);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
        <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 10,
          marginBottom: 20
        }}
       onClick={() => navigate("/specialty-details/subjects/subject-matching-table", { state: { specialtyCode } })}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">Subject correspondence table</span>
        <ArrowOutwardIcon
          className="text-sm text-gray-500 dark:text-gray-400"
        />
      </div>
            <div className="flex flex-wrap">
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-[48%] m-2 p-4 flex justify-between items-center 
                            bg-blue-100 border-2 border-blue-200 rounded-[15px]"
                        >
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="circular" width={25} height={25} />
                        </div>
                    ))
                ) : (
                    subjects.map((subject, index) => (
                        <div
                            key={index}
                            className="w-[48%] m-2 p-4 flex justify-between items-center 
                                bg-white text-gray-900 border-2 border-blue-500 rounded-[15px]
                                transition-colors duration-300
                                hover:bg-gray-100
                                cursor-pointer"
                            >
                            <div className="flex-1">
                                {subject.subject_name} ({subject.subject_code})
                            </div>

                            <div className="flex gap-3 text-blue-500">
                                <Link
                                    to={"/specialty-details/subjects/topics"}
                                    state={{ subjectCode: subject.subject_code, subjectName: subject.subject_name }}
                                >
                                    <ArrowOutwardIcon sx={{ fontSize: 25 }} />
                                </Link>

                                <Link
                                    to={"/specialty-details/subjects/subject-details"}
                                    state={{ subjectCode: subject.subject_code, specialtyCode: specialtyCode }}
                                >
                                    <VisibilityIcon sx={{ fontSize: 25 }} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
                {!loading && subjects.length === 0 && (
                    <div className="flex justify-center items-center w-full">
                        <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                            İxtisas üçün fənn mövcud deyil
                        </p>
                    </div>
                )}
            </div>
            {subjects.length > 0 && (
                <div className="flex justify-center items-center">
                    <Stack spacing={2}>
                        <Pagination
                            count={subjectLength ? (subjectLength <= 6 ? 1 : Math.ceil(subjectLength / 6)) : 1}
                            page={Math.floor(start / (end - start)) + 1}
                            onChange={(_event, page) => {
                                const pageSize = end - start;
                                const newStart = (page - 1) * pageSize;
                                const newEnd = newStart + pageSize;
                                setStart(newStart);
                                setEnd(newEnd);
                                setLoading(true);
                                getCurriculaBySpecialtyCode(
                                    specialtyCode,
                                    newStart,
                                    newEnd
                                )
                                    .then((res) => {
                                        if (typeof res === "object" && res.subjects) {
                                            setSubjects(res.subjects);
                                            setSubjectLength(res.total_subjects);
                                        } else {
                                            setSubjects([]);
                                        }
                                    })
                                    .finally(() => setLoading(false));
                            }}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: 'text.primary',
                                    bgcolor: 'background.paper',
                                },
                                '& .MuiPaginationItem-root.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                },
                                '& .MuiPaginationItem-root:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        />
                    </Stack>
                </div>
            )}
        </>
    )
}   