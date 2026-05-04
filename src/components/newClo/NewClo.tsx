import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { useLocation, useNavigate } from "react-router";
import { CloPayload, createClo } from "../../services/clo/clo";

export default function NewClo() {
    const location = useLocation();
    const { subjectCode } = location.state as { subjectCode: string };
    const { subjectName } = location.state as { subjectName: string };
    const { specialtyCode } = location.state as { specialtyCode: string };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cloContent, setCloContent] = useState("");

    const createSpecialtyChar = async () => {
        try {
            setLoading(true);
            const cloPayload: CloPayload = {
                subject_code: subjectCode,
                clo_content: cloContent
            }
            const result = await createClo(cloPayload);

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${subjectName}" mövzusu üçün təlim nəticəsi əlavə edildi.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details/subjects/subject-details", { state: { specialtyCode, subjectCode } })
                })
            } else if (result === "NOT_FOUND") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'Mövzu tapılmadı.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'Mövzu üçün məzunların təlim nəticəsi əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas üçün məzunların karyera imkanları əlavə edilə bilmədi.\nYenidən cəhd edin!',
                confirmButtonText: 'Ok'
            }).then(() => {
                setLoading(false);
            })
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
                value={cloContent}
                placeholder="Təlim nəticəsi"
                onChange={(value) => setCloContent(value.charAt(0).toUpperCase() + value.slice(1))}
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