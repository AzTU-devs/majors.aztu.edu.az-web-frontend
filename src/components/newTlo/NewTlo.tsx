import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { useLocation, useNavigate } from "react-router";
import { createTlo, TLoPayload } from "../../services/tlo/tloService";

export default function NewTlo() {
    const location = useLocation();
    const { subjectCode } = location.state as { subjectCode: string };
    const { subjectName } = location.state as { subjectName: string };
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { topicCode } = location.state as { topicCode: string };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tloContent, setTloContent] = useState("");

    console.log(topicCode);

    const createSpecialtyChar = async () => {
        try {
            setLoading(true);
            const tloPayload: TLoPayload = {
                topic_code: topicCode,
                tlo_content: tloContent
            }
            const result = await createTlo(tloPayload);

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${subjectName}" mövzusu üçün təlim nəticəsi əlavə edildi.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details/subjects/topics", { state: { specialtyCode, subjectCode } });
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'Mövzu üçün məzunların təlim nəticəsi əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas üçün məzunların karyera imkanları əlavə edilə bilmədi.\nYenidən cəhd edin!',
                confirmButtonText: 'Ok'
            }).then(() => {
                setLoading(false);
            });
        }
    }

    return (
        <div>
            <div className="mb-[20px]">
                <Label>{subjectName} ({subjectCode})</Label>
            </div>
            <Label>
                Təlim nəticəsi
            </Label>
            <TextArea
                value={tloContent}
                placeholder="Təlim nəticəsi"
                onChange={(value) => setTloContent(value.charAt(0).toUpperCase() + value.slice(1))}
                className="mb-[10px]"
            />
            <div className="mt-[20px] flex justify-end">
                <Button disabled={loading} onClick={createSpecialtyChar}>
                    {loading ? "Əlavə edilir" : "Əlavə et"}
                </Button>
            </div>
        </div>
    );
}