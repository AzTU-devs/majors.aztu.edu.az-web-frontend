import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import { addSpecialty, SpecialtyPayload } from "../../services/specialty/specialtyService";

export default function NewSpecialty() {
    const navigate = useNavigate();
    const [specialtyName, setSpecialtyName] = useState("");
    const [specialtyCode, setSpecialtyCode] = useState("");
    const [loading, setLoading] = useState(false);
    // const [ploText, setPloText] = useState("");
    // const [sloText, setSloText] = useState("");
    // const [gcoText, setGcoText] = useState("");
    // const [competenciesText, setCompetenciesText] = useState("");
    // const [curriculaText, setCurriculaText] = useState("");
    // const [degreeReq, setDegreeReq] = useState("");
    // const [isPloOpen, setIsPloOpen] = useState(false);
    // const [isSloOpen, setIsSloOpen] = useState(false);
    // const [isGcoOpen, setIsGcoOpen] = useState(false);
    // const [isCompenOpen, setIsCompenOpen] = useState(false);
    // const [isCurriculaOpen, setIsCurriculaOpen] = useState(false);
    // const [programDescription, setProgramDescription] = useState("");

    const token = useSelector((state: RootState) => state.auth.token);
    const cafedraCode = useSelector((state: RootState) => state.auth.cafedra_code);

    const createSpecialty = async () => {
        try {
            setLoading(true);
            const specialty: SpecialtyPayload = {
                cafedra_code: cafedraCode ? cafedraCode : "",
                specialty_code: specialtyCode,
                specialty_name: specialtyName
            }
            const result = await addSpecialty(specialty, token ? token : "");

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: 'success',
                    title: 'Uğurla əlavə edildi!',
                    text: `İxtisas "${specialtyName}" əlavə edildi.\nİxtisas üçün digər məlumatları doldurmağınız tələb edilir.`,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                    navigate("/specialty-details", { state: { specialtyCode, specialtyName } })
                })
            } else if (result === "CONFLICT") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas artıq mövcuddur.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else if (result === "ERROR") {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Xəta baş verdi',
                    text: 'İxtisas əlavə edilə bilmədi.\nYenidən cəhd edin!',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setLoading(false);
                })
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta baş verdi',
                text: 'İxtisas əlavə edilə bilmədi.\nYenidən cəhd edin!',
                confirmButtonText: 'Ok'
            }).then(() => {
                setLoading(false);
            })
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        İxtisasın adı
                    </Label>
                    <Input
                        value={specialtyName}
                        placeholder="İxtisasın adı"
                        onChange={(e) => setSpecialtyName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                        className="mb-[10px]"
                    />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        İxtisasın kodu
                    </Label>
                    <Input
                        value={specialtyCode}
                        placeholder="İxtisasın kodu"
                        onChange={(e) => setSpecialtyCode(e.target.value)}
                        className="mb-[10px]"
                    />
                </div>
            </div>
            {/* <Label>
                Proqramın Təsviri
            </Label>
            <TextArea
                value={programDescription}
                onChange={(value) => {
                    if (value.length === 0) {
                        setProgramDescription("");
                    } else {
                        setProgramDescription(value.charAt(0).toUpperCase() + value.slice(1));
                    }
                }}
                placeholder="Proqramın Təsviri"
            />
            <Label>
                Dərəcə Tələbləri
            </Label>
            <TextArea
                value={degreeReq}
                onChange={(value) => {
                    if (value.length === 0) {
                        setDegreeReq("");
                    } else {
                        setDegreeReq(value.charAt(0).toUpperCase() + value.slice(1));
                    }
                }}
                placeholder="Dərəcə Tələbləri"
            />

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10
                }}
                onClick={() => setIsPloOpen(!isPloOpen)}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Proqram Təlim Məqsədləri</span>
                <KeyboardArrowDownIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                    style={{ transform: isPloOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}
                />
            </div>

            {isPloOpen && (
                <div style={{ marginTop: "10px" }}>
                    <TextArea
                        value={sloText}
                        onChange={(value) => setSloText(
                            value.charAt(0).toUpperCase() + value.slice(1)
                        )}
                        placeholder="Proqram Təlim Məqsədləri Mətnini daxil edin"
                    />
                </div>
            )}
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10
                }}
                onClick={() => setIsSloOpen(!isSloOpen)}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Tələbələrin Təlim Nəticələri</span>
                <KeyboardArrowDownIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                    style={{ transform: isSloOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}
                />
            </div>

            {isSloOpen && (
                <div style={{ marginTop: "10px" }}>
                    <TextArea
                        value={ploText}
                        onChange={(value) => setPloText(
                            value.charAt(0).toUpperCase() + value.slice(1)
                        )}
                        placeholder="Tələbələrin Təlim Nəticələri Mətnini daxil edin"
                    />
                </div>
            )}
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10
                }}
                onClick={() => setIsGcoOpen(!isGcoOpen)}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Məzunların Karyera İmkanları</span>
                <KeyboardArrowDownIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                    style={{ transform: isGcoOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}
                />
            </div>

            {isGcoOpen && (
                <div style={{ marginTop: "10px" }}>
                    <TextArea
                        value={gcoText}
                        onChange={(value) => setGcoText(
                            value.charAt(0).toUpperCase() + value.slice(1)
                        )}
                        placeholder="Məzunların Karyera İmkanları Mətnini daxil edin"
                    />
                </div>
            )}
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10
                }}
                onClick={() => setIsCompenOpen(!isCompenOpen)}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Bacarıqlar</span>
                <KeyboardArrowDownIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                    style={{ transform: isCompenOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}
                />
            </div> */}

            {/* {isCompenOpen && (
                <div style={{ marginTop: "10px" }}>
                    <TextArea
                        value={competenciesText}
                        onChange={(value) => setCompetenciesText(
                            value.charAt(0).toUpperCase() + value.slice(1)
                        )}
                        placeholder="Bacarıqlar Mətnini daxil edin"
                    />
                </div>
            )} */}
            {/* Dropdown for Curricula Text */}
            {/* <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10
                }}
                onClick={() => setIsCurriculaOpen(!isCurriculaOpen)}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Kurikulum Proqramı</span>
                <KeyboardArrowDownIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                    style={{ transform: isCurriculaOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}
                />
            </div>

            {isCurriculaOpen && (
                <div style={{ marginTop: "10px" }}>
                    <TextArea
                        value={curriculaText}
                        onChange={(value) => setCurriculaText(
                            value.charAt(0).toUpperCase() + value.slice(1)
                        )}
                        placeholder="Kurikulum Proqramı Mətnini daxil edin"
                    />
                </div>
            )} */}
            <div className="mt-[20px] flex justify-end">
                <Button disabled={loading} onClick={createSpecialty}>
                    {loading ? "Əlavə edilir" : "Əlavə et"}
                </Button>
            </div>
        </div>
    );
}