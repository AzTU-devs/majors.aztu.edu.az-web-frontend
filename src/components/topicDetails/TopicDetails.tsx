import Label from '../form/Label';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getTloByTopicCode, Tlo } from '../../services/tlo/tloService';

export default function TopicDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { topicName } = location.state as { topicName: string };
    const { topicUrl } = location.state as { topicUrl: string };
    const { topicType } = location.state as { topicType: number };
    const { topicDesc } = location.state as { topicDesc: string };
    const { topicCode } = location.state as { topicCode: string };
    const [tlos, setTlos] = useState<Tlo[]>([]);
    const [_, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        getTloByTopicCode(topicCode)
            .then(setTlos)
            .finally(() => {
                setLoading(true);
            })
    }, []);

    console.log(tlos);
    
    return (
        <>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu adı
                    </Label>
                    <Input value={topicName} readOnly />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzu tipi
                    </Label>
                    <Input placeholder='Fənn adı' value={topicType === 1 ? "Mühazirə" : topicType === 2 ? "Məşğələ" : topicType === 3 ? "Laboratoriya" : topicType === 4 ? "Sərbəst iş" : "Mövcud deyil"} />
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
                        placeholder='Mövzu deskripsiyası'
                        value={topicDesc}
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
                    />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Mövzunun təlim nəticələri
                    </Label>
                    <ul className="list-disc list-inside bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                        {!tlos || tlos.map((tlo, index) => (
                            <li key={index} className="text-gray-800">
                                {tlo.tlo_content}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='flex justify-end items-center'>
                <button
                    className='bg-red-500 text-white mr-[10px] px-4 py-2 rounded-[10px] h-[50px] w-[100px]'>
                    {/* {deleteLoading ? "Silinir" : "Sil"} */}
                    Sil
                </button>
                <Button>
                    {/* {saveLoading ? "Yadda saxlanılır..." : "Yadda saxla"} */}
                    Yadda saxla
                </Button>
                <Button
                    className='ml-[10px]'
                    onClick={() => {
                        navigate("/specialty-details/subjects/topics/new-tlo", { state: { topicCode } })
                    }}>
                    Yeni mözvu təlim nəticəsi
                </Button>
            </div>
        </>
    )
}