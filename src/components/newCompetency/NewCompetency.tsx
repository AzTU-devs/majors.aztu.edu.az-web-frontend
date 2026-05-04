import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TextArea from "../form/input/TextArea";
import { useLocation, useNavigate } from "react-router";
import { addCompetency, CompetencyPayload } from "../../services/competency/competencyService";

export default function NewCompetency() {
    const location = useLocation();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const [competencyContent, setCompetencyContent] = useState("");

    const createSpecialtyChar = async () => {
        try {
            setLoading(true);
            const competencyPaylaod: CompetencyPayload = {
                specialty_code: specialtyCode,
                competency_content: competencyContent
            }
            const result = await addCompetency(competencyPaylaod, token ? token : "");

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${specialtyName}" ixtisası üçün bacarıqlar əlavə edildi.\nİxtisas üçün digər məlumatları doldurmağınız tələb edilir.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details", { state: { specialtyCode, specialtyName } })
                })
            } else if (result === "ALREADY EXISTS") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün bacarıqlar artıq mövcuddur.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün bacarıqlar əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas üçün bacarıqlar əlavə edilə bilmədi.\nYenidən cəhd edin!',
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
                Səriştə
            </Label>
            <TextArea
                value={competencyContent}
                placeholder="Səriştə"
                onChange={(value) => setCompetencyContent(value.charAt(0).toUpperCase() + value.slice(1))}
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