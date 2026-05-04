import { Link } from "react-router";
import Stack from '@mui/material/Stack';
import { Skeleton } from "@mui/material";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import { Topic, getTopics } from "../../services/topic/topic";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export default function Topics() {
    const location = useLocation();
    const [end, setEnd] = useState<number>(6);
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState<number>(0);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [topicLength, setTopicLength] = useState<number>(0);
    const { subjectCode } = location.state as { subjectCode: string };

    useEffect(() => {
        setLoading(true);
        getTopics(
            subjectCode,
            start,
            end
        )
            .then((res) => {
                if (typeof res === "object" && res.topics) {
                    setTopics(res.topics);
                    setTopicLength(res.total);
                } else {
                    setTopics([]);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
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
                    topics.map((topic, index) => (
                        <div
                            key={index}
                            className="w-[48%] m-2 p-4 flex justify-between items-center 
                            bg-blue-500 text-white border-2 border-blue-500 rounded-[15px]
                            transition-colors duration-300
                            hover:bg-white hover:text-blue-500
                            cursor-pointer"
                        >
                            <Link to={`${topic.topic_url}`} state={{ topicName: topic.topic_name, topicUrl: topic.topic_url, topicType: topic.topic_type, topicDesc: topic.topic_desc, topicResult: topic.topic_result, topicCode: topic.topic_code }} className="flex justify-between w-full">
                                <div>
                                    {topic.topic_name} ({topic.topic_type === 1 ? "Lecture" : topic.topic_type === 2 ? "Məşğələ" : topic.topic_type === 3 ? "Laboratoriya" : topic.topic_type === 4 ? "Sərbəsi iş" : "Mövcud deyil"})
                                </div>
                                <div>
                                    <ArrowOutwardIcon sx={{ fontSize: 25 }} />
                                </div>
                            </Link>
                        </div>
                    ))
                )}
                {!loading && topics.length === 0 && (
                    <div className="flex justify-center items-center w-full">
                        <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block ml-[10px]">
                            İxtisas üçün fənn mövcud deyil
                        </p>
                    </div>
                )}
            </div>
            {topics.length > 0 && (
                <div className="flex justify-center items-center">
                    <Stack spacing={2}>
                        <Pagination
                            count={topicLength ? (topicLength <= 6 ? 1 : Math.ceil(topicLength / 6)) : 1}
                            page={Math.floor(start / (end - start)) + 1}
                            onChange={(_event, page) => {
                                const pageSize = end - start;
                                const newStart = (page - 1) * pageSize;
                                const newEnd = newStart + pageSize;
                                setStart(newStart);
                                setEnd(newEnd);
                                setLoading(true);
                                getTopics(
                                    subjectCode,
                                    newStart,
                                    newEnd
                                )
                                    .then((res) => {
                                        if (typeof res === "object" && res.topics) {
                                            setTopics(res.topics);
                                            setTopicLength(res.total);
                                        } else {
                                            setTopics([]);
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