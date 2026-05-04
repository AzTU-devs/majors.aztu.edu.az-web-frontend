import Swal from "sweetalert2";
import { useState } from 'react';
import Label from '../form/Label';
import Select from '../form/Select';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import Input from '../form/input/InputField';
import { RootState } from '../../redux/store';
import { addTopic } from "../../services/topic/topic";

export default function NewTopic() {
    const location = useLocation();
    const [topicUrl, setTopicUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [topicName, setTopicName] = useState("");
    const [topicDesc, setTopicDesc] = useState("");
    const [topicResult, setTopicResult] = useState("");
    const { subjectCode } = location.state as { subjectCode: string };
    const { subjectName } = location.state as { subjectName: string };
    const token = useSelector((state: RootState) => state.auth.token);

    // clo_type logic

    const [selectedType, setSelectedType] = useState("");
    const typeOptions = [
        {
            value: "1",
            label: "Mühazirə"
        }, {
            value: "2",
            label: "Məşğələ"
        }, {
            value: "3",
            label: "Laboratoriya"
        }, {
            value: "4",
            label: "Sərbəst iş"
        }
    ];
    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    // create subject logic

    const createTopic = async () => {
        try {
            setLoading(true);
            const topicPayload = {
                subject_code: subjectCode,
                topic_name: topicName,
                topic_desc: topicDesc || "",
                topic_url: topicUrl,
                topic_result: topicResult,
                topic_type: +selectedType
            }
            console.log("Creating topic with payload:", topicPayload);
            const result = await addTopic(topicPayload, token ? token : "");

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: "success",
                    title: "Uğurla əlavə olundu",
                    text: "Yeni mövzu uğurla əlavə edildi!"
                }).then(() => {
                    setLoading(false);
                });
            } else if (result === "NOT_FOUND") {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: "Fənn tapılmadı!"
                }).then(() => {
                    setLoading(false);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: "Gözlənilməz xəta baş verdi!"
                }).then(() => {
                    setLoading(false);
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Gözlənilməz xəta baş verdi!"
            }).then(() => {
                setLoading(false);
            });
        }
    }
    return (
        <>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn adı
                    </Label>
                    <Input value={subjectName} readOnly />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn kodu
                    </Label>
                    <Input value={subjectCode} readOnly />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu adı
                    </Label>
                    <Input placeholder='Mövzu adı' value={topicName} onChange={(e) => { setTopicName(e.target.value) }} />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu tipi
                    </Label>
                    <Select
                        placeholder='Mövzu tipi'
                        options={typeOptions}
                        onChange={handleTypeChange}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu deskripsiyası
                    </Label>
                    <Input
                        placeholder='Mövzu linki'
                        value={topicDesc}
                        onChange={
                            (e) => { setTopicDesc(e.target.value) }
                        }
                    />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu linki
                    </Label>
                    <Input
                        placeholder='Mövzu linki'
                        value={topicUrl}
                        onChange={
                            (e) => { setTopicUrl(e.target.value) }
                        }
                    />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu nəticəsi
                    </Label>
                    <Input
                        placeholder='Mövzu nəticəsi'
                        value={topicResult}
                        onChange={
                            (e) => { setTopicResult(e.target.value) }
                        }
                    />
                </div>
            </div>
            <div className='flex justify-end items-center'>
                <Button disabled={loading} onClick={createTopic}>
                    {loading ? "Əlavə edilir" : "Əlavə et"}
                </Button>
            </div>
        </>
    )
}