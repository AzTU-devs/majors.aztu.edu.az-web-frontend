import Swal from 'sweetalert2';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Input from '../form/input/InputField';
import { RootState } from '../../redux/store';
import { useLocation, useNavigate } from 'react-router';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Clo, getCloBySubjectCode } from '../../services/clo/clo';
import { deleteCurricula, getSubjectDetails, updateCurricula, SubjectDetails } from '../../services/curricula/curricula';

export default function SubjectDeails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { subjectCode } = location.state as { subjectCode: string };
    const { specialtyCode } = location.state as { specialtyCode: string };
    const token = useSelector((state: RootState) => state.auth.token);
    const [subjectDetails, setSubjectDetails] = useState<SubjectDetails>();
    // Editable state for each field
    const [subjectName, setSubjectName] = useState('');
    const [subjectDescription, setSubjectDescription] = useState('');
    const [credit, setCredit] = useState('');
    const [semester, setSemester] = useState('');
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [status, setStatus] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [clos, setClos] = useState<Clo[]>([]);

    console.log(specialtyCode);

    useEffect(() => {
        getSubjectDetails(subjectCode)
            .then((details) => {
                setSubjectDetails(details);
                setSubjectName(details.subject_name ?? "");
                setSubjectDescription(details.subject_description ?? "");
                setCredit(details.credit !== undefined ? String(details.credit) : "");
                setSemester(details.semester !== undefined ? String(details.semester) : "");
                setHoursPerWeek(details.hours_per_week !== undefined ? String(details.hours_per_week) : "");
                setStatus(details.status !== undefined ? String(details.status) : "");
            });
        getCloBySubjectCode(subjectCode)
            .then(setClos)
    }, [subjectCode]);


    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            const result = await deleteCurricula(subjectCode, token ? token : "");

            if (result === "SUCCESS") {
                await Swal.fire({
                    icon: 'success',
                    title: 'Uğurla silindi',
                    text: 'Fənn uğurla silindi.',
                }).then(() => {
                    setDeleteLoading(false);
                    navigate("/specialty-details/subjects", { state: { specialtyCode } });
                });
            } else if (result === "NOT FOUND") {
                await Swal.fire({
                    icon: 'error',
                    title: 'Xəta',
                    text: 'Fənn tapılmadı.',
                }).then(() => {
                    setDeleteLoading(false);
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Xəta',
                    text: 'Fənn silinərkən xəta baş verdi.',
                }).then(() => {
                    setDeleteLoading(false);
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete curricula',
            }).then(() => {
                setDeleteLoading(false);
                navigate("/specialty-details/subjects", { state: { specialtyCode } });
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const isLoading = subjectDetails === undefined;
    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const updateData: any = {};

            if (subjectName !== subjectDetails?.subject_name) {
                updateData.subject_name = { az: subjectName };
            }
            if (subjectDescription !== subjectDetails?.subject_description) {
                updateData.subject_description = { az: subjectDescription };
            }
            const creditNum = Number(credit);
            if (!isNaN(creditNum) && creditNum !== subjectDetails?.credit) {
                updateData.credit = creditNum;
            }
            const semesterNum = Number(semester);
            if (!isNaN(semesterNum) && semesterNum !== subjectDetails?.semester) {
                updateData.semester = semesterNum;
            }
            const hoursPerWeekNum = Number(hoursPerWeek);
            if (!isNaN(hoursPerWeekNum) && hoursPerWeekNum !== subjectDetails?.hours_per_week) {
                updateData.hours_per_week = hoursPerWeekNum;
            }
            const statusNum = Number(status);
            if (!isNaN(statusNum) && statusNum !== subjectDetails?.status) {
                updateData.status = statusNum;
            }

            if (Object.keys(updateData).length === 0) {
                Swal.fire("Info", "Yadda saxlamaq üçün heç bir dəyişiklik edilməyib.", "info");
                setSaveLoading(false);
                return;
            }

            const result = await updateCurricula(subjectCode, updateData, token || "");

            if (result === "SUCCESS") {
                Swal.fire("Uğurla yeniləndi", "Fənn detalları uğurla yeniləndi.", "success").then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire("Error", "Fənn detalları yenilənərkən xəta baş verdi", "error");
            }

        } catch (error) {
            Swal.fire("Error", "Failed to update curricula", "error");
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn adı
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <Input
                            value={subjectName}
                            onChange={e => setSubjectName(e.target.value)}
                        />
                    )}
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn kodu
                    </Label>
                    {/* Subject code is always known, so no skeleton needed */}
                    <Input placeholder='Fənn kodu' value={subjectCode} readOnly />
                </div>
            </div>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    marginBottom: 20
                }}
                onClick={() => navigate("/specialty-details/subjects/subject-details/sillabus", { state: { subjectCode, subjectName, subjectDetails } })}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Fənnin sillabusu</span>
                <ArrowOutwardIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                />
            </div>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    marginBottom: 20
                }}
                onClick={() => navigate("/literatures", { state: { subjectCode } })}
            >
                <span className="text-sm text-gray-500 dark:text-gray-400">Ədəbiyyat siyahısı</span>
                <ArrowOutwardIcon
                    className="text-sm text-gray-500 dark:text-gray-400"
                />
            </div>
            <div className="flex justify-between items-center w-full mt-[15px]">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn deskripsiyası
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <Input
                            placeholder='Fənn deskripsiyası'
                            value={subjectDescription}
                            onChange={e => setSubjectDescription(e.target.value)}
                        />
                    )}
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Kredit
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <Input
                            placeholder='Kredit'
                            value={credit}
                            onChange={e => setCredit(e.target.value)}
                            type="number"
                        />
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center w-full mt-[15px]">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        İl
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <Input value={`Tədris ili: ${subjectDetails.year}`} />
                    )}
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Semestr
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <select
                            value={Number(semester)}
                            onChange={e => setSemester(e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 px-3"
                        >
                            <option value={1}>Yaz semestri</option>
                            <option value={2}>Payız semestri</option>
                        </select>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center w-full mt-[15px]">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Həftə başı saat
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <Input
                            placeholder='Həftə başı saat'
                            value={hoursPerWeek}
                            onChange={e => setHoursPerWeek(e.target.value)}
                            type="number"
                        />
                    )}
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn tipi
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <select
                            value={Number(status)}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 px-3"
                        >
                            <option value={1}>Seçmə</option>
                            <option value={2}>Məcburi</option>
                            <option value={3}>Digər</option>
                        </select>
                    )}
                </div>
            </div>
            <div className='mt-[20px]'>
                <Label>Təlim nəticələri</Label>
                {!clos || clos.length === 0 ? (
                    <p className="text-gray-500 italic">Heç bir təlim nəticəsi mövcud deyil.</p>
                ) : (
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {clos.map((clo, index) => (
                            <li key={index}>
                                {clo.clo_content}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className='flex justify-end items-center'>
                <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className='bg-red-500 text-white mr-[10px] px-4 py-2 rounded-[10px] h-[50px] w-[100px]'>
                    {deleteLoading ? "Silinir" : "Sil"}
                </button>
                <Button
                    onClick={handleSave}
                    disabled={saveLoading || isLoading}
                >
                    {saveLoading ? "Yadda saxlanılır..." : "Yadda saxla"}
                </Button>
                <Button
                    className='ml-[10px]'
                    onClick={() => navigate("/specialty-details/subjects/subject-details/new-clo", { state: { subjectCode: subjectCode, subjectName: subjectName, specialtyCode: specialtyCode } })}
                    disabled={saveLoading || isLoading}
                >
                    Yeni fənn təlim nəticəsi
                </Button>
            </div>
        </>
    )
}