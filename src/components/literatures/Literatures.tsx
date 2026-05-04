import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router";
import { getLiteratures, Literature } from "../../services/literature/LiteratureService";
import Button from "../ui/button/Button";


export default function Literatures() {
    const location = useLocation();
    const [literatures, setLiteratures] = useState<Literature[]>([]);
    const { subjectCode } = (location.state ?? {}) as { subjectCode?: string };
    const [_, setTotal] = useState<number>();
    console.log(subjectCode);
    const navigate = useNavigate();


    useEffect(() => {
        if (!subjectCode) {
            setLiteratures([]);
            setTotal(0);
            return;
        }

        getLiteratures(subjectCode)
            .then((res) => {
                if (res && typeof res === "object" && Array.isArray(res.literatures)) {
                    setLiteratures(res.literatures);
                    setTotal(res.total);
                } else {
                    setLiteratures([]);
                    setTotal(0);
                }
            })
            .catch(() => {
                setLiteratures([]);
                setTotal(0);
            });
    }, [subjectCode]);
    
    return (
        <>
            <div>
                <ul>
                    {Array.isArray(literatures) && literatures.map((literature, index) => {
                        return (
                            <a
                                key={index}
                                href={literature.url}
                                target="_blank"
                                className="mb-[10px] flex gap-3 text-white bg-blue-500 border-2 border-blue-500 rounded-md p-3 w-full hover:bg-white hover:text-blue-500 transition-colors duration-300"
                            >
                                {literature.literature_name}
                            </a>
                        )
                    })}
                </ul>
            </div>
            <div className="flex justify-end items-center">
                <Button onClick={() => { navigate("/new-literature", { state: { subjectCode: subjectCode } }) }}>
                    Yeni Ədəbiyyat
                </Button>
            </div>
        </>
    )
}
