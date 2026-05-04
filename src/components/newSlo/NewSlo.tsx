import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TextArea from "../form/input/TextArea";
import { useLocation, useNavigate } from "react-router";
import { addSlo, SloPayload } from "../../services/slo/sloService";

export default function NewSlo() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sloContent, setSloContent] = useState("");
    const token = useSelector((state: RootState) => state.auth.token);
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };

    const createSpecialtyChar = async () => {
        try {
            setLoading(true);
            const sloPayload: SloPayload = {
                specialty_code: specialtyCode,
                slo_content: sloContent
            }
            const result = await addSlo(sloPayload, token ? token : "");

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${specialtyName}" ixtisası üçün tələbələrin təlim nəticələri əlavə edildi.\nİxtisas üçün digər məlumatları doldurmağınız tələb edilir.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details", { state: { specialtyCode, specialtyName } })
                })
            } else if (result === "ALREADY EXISTS") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün tələbələrin təlim nəticələri artıq mövcuddur.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün tələbələrin təlim nəticələri əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas üçün tələbələrin təlim nəticələri əlavə edilə bilmədi.\nYenidən cəhd edin!',
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
                Tələbələrin Təlim Nəticələri
            </Label>
            <TextArea
                value={sloContent}
                placeholder="Tələbələrin Təlim Nəticələri"
                onChange={(value) => setSloContent(value.charAt(0).toUpperCase() + value.slice(1))}
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