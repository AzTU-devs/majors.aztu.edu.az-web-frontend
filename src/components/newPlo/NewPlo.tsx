import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation, useNavigate } from "react-router";
import { addPlo, PloPayload } from "../../services/plo/ploService";
import TextArea from "../form/input/TextArea";

export default function NewPlo() {
    const location = useLocation();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const [ploContent, setPloContent] = useState("");

    const createSpecialtyChar = async () => {
        try {
            setLoading(true);
            const ploPayload: PloPayload = {
                specialty_code: specialtyCode,
                plo_content: ploContent
            }
            const result = await addPlo(ploPayload, token ? token : "");

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${specialtyName}" ixtisası üçün proqram təlim məqsədləri əlavə edildi.\nİxtisas üçün digər məlumatları doldurmağınız tələb edilir.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details", { state: { specialtyCode, specialtyName } })
                })
            } else if (result === "ALREADY EXISTS") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün proqram təlim məqsədləri artıq mövcuddur.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün proqram təlim məqsədləri əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas üçün proqram təlim məqsədləri əlavə edilə bilmədi.\nYenidən cəhd edin!',
                confirmButtonText: 'Ok'
            }).then(() => {
                setLoading(false);
            })
        }
    }

    return (
        <div>
            <div className="mb-[20px]">
                <Label>{specialtyName} ({specialtyCode})</Label>
            </div>
            <Label>
                Proqram təlim məqsədləri
            </Label>
            <TextArea
                value={ploContent}
                placeholder="Proqram təlim məqsədləri"
                onChange={(value) => setPloContent(value.charAt(0).toUpperCase() + value.slice(1))}
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