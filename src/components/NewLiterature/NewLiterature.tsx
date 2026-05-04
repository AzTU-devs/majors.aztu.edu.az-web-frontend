import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { useLocation, useNavigate } from "react-router";
import { addLiterature, LiteraturePayload } from "../../services/literature/LiteratureService";

export default function NewLiterature() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [literatureUrl, setLiteratureUrl] = useState("");
    const [literatureName, setLiteratureName] = useState("");
    const { subjectCode } = location.state as { subjectCode: string };
    const { subjectName } = location.state as { subjectName: string };
    const { specialtyCode } = location.state as { specialtyCode: string };

    const createLiterature = async () => {
        try {
            setLoading(true);
            const literaturePayload: LiteraturePayload = {
                subject_code: subjectCode,
                url: literatureUrl,
                literature_name: literatureName
            }
            const result = await addLiterature(literaturePayload);

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${subjectName}" mövzusu üçün ədəbiyyat əlavə edildi.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/literatures", { state: { subjectCode } })
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'Ədəbiyyat əlavə edilə bilmədi.\nYenidən cəhd edin!',
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
                <Label>{specialtyCode}</Label>
            </div>
            <Label>
                Ədəbiyyat adı
            </Label>
            <TextArea
                value={literatureName}
                placeholder="Ədəbiyyat adı"
                onChange={(value) => setLiteratureName(value.charAt(0).toUpperCase() + value.slice(1))}
                className="mb-[10px]"
            />
            <Label>
                Ədəbiyyat Linki
            </Label>

            <Input value={literatureUrl} onChange={(e) => { setLiteratureUrl(e.target.value) }} placeholder="Ədəbiyyat Linki" />

            <div className="mt-[20px] flex justify-end">
                <Button disabled={loading} onClick={createLiterature}>
                    {loading ? "Əlavə edilir" : "Əlavə et"}
                </Button>
            </div>
        </div>
    );
}