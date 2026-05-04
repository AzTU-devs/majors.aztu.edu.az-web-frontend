import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import { useLocation, useNavigate } from "react-router";
import { SpecialtyCharPayload, addSpecialtychar } from "../../services/specialtCharacteristics/specialtyChar";

export default function NewSpecChar() {
    const location = useLocation();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);

    const [degreeReq, setDegreeReq] = useState("");
    const [programDesc, setProgramDesc] = useState("");

    const createSpecialtyChar = async () => {
        try {
            setLoading(true);
            const specialty: SpecialtyCharPayload = {
                specialty_code: specialtyCode,
                program_desc: programDesc,
                degree_requirements: degreeReq
            }
            const result = await addSpecialtychar(specialty, token ? token : "");

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `"${specialtyName}" ixtisası üçün xarakteristika əlavə edildi.\nİxtisas üçün digər məlumatları doldurmağınız tələb edilir.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details", { state: { specialtyCode, specialtyName } })
                })
            } else if (result === "ALREADY EXISTS") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün xarakteristika artıq mövcuddur.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else if (result === "ERROR") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün xarakteristika əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas üçün xarakteristika əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas üçün xarakteristika əlavə edilə bilmədi.\nYenidən cəhd edin!',
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
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Proqramın tələbləri
                    </Label>
                    <Input
                        value={degreeReq}
                        placeholder="Proqramın tələbləri"
                        onChange={(e) => setDegreeReq(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                        className="mb-[10px]"
                    />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Proqramın təsviri
                    </Label>
                    <Input
                        value={programDesc}
                        placeholder="Proqramın təsviri"
                        onChange={(e) => setProgramDesc(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                        className="mb-[10px]"
                    />
                </div>
            </div>
            <div className="mt-[20px] flex justify-end">
                <Button disabled={loading} onClick={createSpecialtyChar}>
                    {loading ? "Əlavə edilir" : "Əlavə et"}
                </Button>
            </div>
        </div>
    );
}