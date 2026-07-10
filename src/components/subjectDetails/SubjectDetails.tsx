import Swal from 'sweetalert2';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Input from '../form/input/InputField';
import { RootState } from '../../redux/store';
import { useLocation, useNavigate } from 'react-router';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DescriptionIcon from '@mui/icons-material/Description';
import StarsIcon from '@mui/icons-material/Stars';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Clo, getCloBySubjectCode, updateClo, deleteClo } from '../../services/clo/clo';
import { deleteCurricula, getSubjectDetails, updateCurricula, SubjectDetails, AssessmentRow } from '../../services/curricula/curricula';
import {
    FORM_OF_EDUCATION_OPTIONS,
    LANGUAGE_OPTIONS,
    parseTeachingMethods,
    DEFAULT_ASSESSMENT,
} from '../../constants/subjectMeta';
import TeachingMethodsPicker from '../subjectMeta/TeachingMethodsPicker';
import AssessmentEditor from '../subjectMeta/AssessmentEditor';
import TextArea from '../form/input/TextArea';

export default function SubjectDeails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { subjectCode } = location.state as { subjectCode: string };
    const { specialtyCode } = location.state as { specialtyCode: string };
    const token = useSelector((state: RootState) => state.auth.token);
    const [subjectDetails, setSubjectDetails] = useState<SubjectDetails>();
    const [notFound, setNotFound] = useState(false);
    // Editable state for each field
    const [subjectName, setSubjectName] = useState('');
    const [subjectDescription, setSubjectDescription] = useState('');
    const [credit, setCredit] = useState('');
    const [semester, setSemester] = useState('');
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [status, setStatus] = useState('');
    const [formOfEducation, setFormOfEducation] = useState('');
    const [languageOfInstruction, setLanguageOfInstruction] = useState('');
    const [inClassHours, setInClassHours] = useState('');
    const [outOfClassHours, setOutOfClassHours] = useState('');
    const [teachingMethods, setTeachingMethods] = useState<string[]>([]);
    const [assessment, setAssessment] = useState<AssessmentRow[]>([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [clos, setClos] = useState<Clo[]>([]);

    console.log(specialtyCode);

    useEffect(() => {
        getSubjectDetails(subjectCode)
            .then((details) => {
                if (!details || typeof details !== "object") {
                    // Bad/renamed/whitespace code — don't hang on the skeleton.
                    setNotFound(true);
                    return;
                }
                setNotFound(false);
                setSubjectDetails(details);
                setSubjectName(details.subject_name ?? "");
                setSubjectDescription(details.subject_description ?? "");
                setCredit(details.credit !== undefined ? String(details.credit) : "");
                setSemester(details.semester !== undefined ? String(details.semester) : "");
                setHoursPerWeek(details.hours_per_week !== undefined ? String(details.hours_per_week) : "");
                setStatus(details.status !== undefined ? String(details.status) : "");
                setFormOfEducation(details.form_of_education ? String(details.form_of_education) : "");
                setLanguageOfInstruction(details.language_of_instruction ? String(details.language_of_instruction) : "");
                setInClassHours(details.in_class_hours ?? "");
                setOutOfClassHours(details.out_of_class_hours ?? "");
                setTeachingMethods(parseTeachingMethods(details.teaching_methods));
                setAssessment(Array.isArray(details.assessment) && details.assessment.length > 0 ? details.assessment : DEFAULT_ASSESSMENT);
            });
        getCloBySubjectCode(subjectCode)
            .then((result) => {
                if (Array.isArray(result)) {
                    setClos(result);
                } else {
                    setClos([]);
                }
            })
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

    const handleEditClo = async (clo: Clo) => {
        if (!clo.clo_code) return;
        const { value } = await Swal.fire({
            title: "Təlim nəticəsini redaktə et",
            input: "textarea",
            inputValue: clo.clo_content,
            inputLabel: "CLO məzmunu",
            showCancelButton: true,
            confirmButtonText: "Yadda saxla",
            cancelButtonText: "Ləğv et",
            inputValidator: (v) => (!v.trim() ? "Boş ola bilməz" : undefined),
        });
        if (!value || value.trim() === clo.clo_content) return;
        const res = await updateClo(clo.clo_code, value.trim());
        if (res === "SUCCESS") {
            setClos((prev) =>
                prev.map((c) => (c.clo_code === clo.clo_code ? { ...c, clo_content: value.trim() } : c))
            );
            Swal.fire("Yeniləndi", "Təlim nəticəsi yeniləndi.", "success");
        } else {
            Swal.fire("Xəta!", "Təlim nəticəsi yenilənə bilmədi.", "error");
        }
    };

    const handleDeleteClo = async (clo: Clo) => {
        if (!clo.clo_code) return;
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Silinsin?",
            text: "Bu təlim nəticəsi (CLO) silinəcək.",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Ləğv et",
            confirmButtonColor: "#dc2626",
        });
        if (!confirm.isConfirmed) return;
        const res = await deleteClo(clo.clo_code);
        if (res === "SUCCESS") {
            setClos((prev) => prev.filter((c) => c.clo_code !== clo.clo_code));
            Swal.fire("Silindi", "Təlim nəticəsi silindi.", "success");
        } else {
            Swal.fire("Xəta!", "Təlim nəticəsi silinə bilmədi.", "error");
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
            const formNum = Number(formOfEducation);
            if (formOfEducation !== "" && !isNaN(formNum) && formNum !== subjectDetails?.form_of_education) {
                updateData.form_of_education = formNum;
            }
            const langNum = Number(languageOfInstruction);
            if (languageOfInstruction !== "" && !isNaN(langNum) && langNum !== subjectDetails?.language_of_instruction) {
                updateData.language_of_instruction = langNum;
            }
            if (inClassHours !== (subjectDetails?.in_class_hours ?? "")) {
                updateData.in_class_hours = inClassHours;
            }
            if (outOfClassHours !== (subjectDetails?.out_of_class_hours ?? "")) {
                updateData.out_of_class_hours = outOfClassHours;
            }
            const methodsStr = teachingMethods.join(",");
            if (methodsStr !== (subjectDetails?.teaching_methods ?? "")) {
                updateData.teaching_methods = methodsStr;
            }
            const assessmentStr = JSON.stringify(assessment);
            if (assessmentStr !== JSON.stringify(subjectDetails?.assessment ?? [])) {
                updateData.assessment = assessmentStr;
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

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-white/[0.03]">
                <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Fənn tapılmadı
                </p>
                <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                    Bu fənn açıla bilmədi. Fənn kodu yanlış simvol və ya boşluq ehtiva edə bilər.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                    Geri qayıt
                </button>
            </div>
        );
    }

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
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                                <MenuBookIcon sx={{ fontSize: 18 }} />
                            </span>
                            <Input
                                value={subjectName}
                                onChange={e => setSubjectName(e.target.value)}
                                className="!pl-10"
                            />
                        </div>
                    )}
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn kodu
                    </Label>
                    {/* Subject code is always known, so no skeleton needed */}
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                            <QrCode2Icon sx={{ fontSize: 18 }} />
                        </span>
                        <Input placeholder='Fənn kodu' value={subjectCode} readOnly className="!pl-10" />
                    </div>
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
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                                <DescriptionIcon sx={{ fontSize: 18 }} />
                            </span>
                            <Input
                                placeholder='Fənn deskripsiyası'
                                value={subjectDescription}
                                onChange={e => setSubjectDescription(e.target.value)}
                                className="!pl-10"
                            />
                        </div>
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
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                                <StarsIcon sx={{ fontSize: 18 }} />
                            </span>
                            <Input
                                placeholder='Kredit'
                                value={credit}
                                onChange={e => setCredit(e.target.value)}
                                type="number"
                                className="!pl-10"
                            />
                        </div>
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
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                                <EventNoteIcon sx={{ fontSize: 18 }} />
                            </span>
                            <Input value={`Akademik il: ${subjectDetails.year}`} className="!pl-10" />
                        </div>
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
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <CalendarMonthIcon sx={{ fontSize: 18 }} />
                            </span>
                            <select
                                value={Number(semester)}
                                onChange={e => setSemester(e.target.value)}
                                className="h-10 w-full appearance-none rounded border border-gray-300 bg-white pl-10 pr-9 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value={1}>Payız semestri</option>
                                <option value={2}>Yaz semestri</option>
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center w-full mt-[15px]">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Tələbənin iş yükü
                    </Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                                <AccessTimeIcon sx={{ fontSize: 18 }} />
                            </span>
                            <Input
                                placeholder='Tələbənin iş yükü'
                                value={hoursPerWeek}
                                onChange={e => setHoursPerWeek(e.target.value)}
                                type="number"
                                className="!pl-10"
                            />
                        </div>
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
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <CategoryIcon sx={{ fontSize: 18 }} />
                            </span>
                            <select
                                value={Number(status)}
                                onChange={e => setStatus(e.target.value)}
                                className="h-10 w-full appearance-none rounded border border-gray-300 bg-white pl-10 pr-9 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value={1}>Seçmə</option>
                                <option value={2}>Məcburi</option>
                                <option value={3}>Digər</option>
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center w-full mt-[15px]">
                <div style={{ width: "calc((100% / 2) - 20px)" }}>
                    <Label>Təhsil forması</Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <select
                            value={formOfEducation}
                            onChange={e => setFormOfEducation(e.target.value)}
                            className="h-10 w-full appearance-none rounded border border-gray-300 bg-white px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        >
                            <option value="">Seçin</option>
                            {FORM_OF_EDUCATION_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div style={{ width: "calc((100% / 2) - 20px)" }}>
                    <Label>Tədris dili</Label>
                    {isLoading ? (
                        <div className="h-10 rounded bg-gray-200 animate-pulse w-full mt-1" />
                    ) : (
                        <select
                            value={languageOfInstruction}
                            onChange={e => setLanguageOfInstruction(e.target.value)}
                            className="h-10 w-full appearance-none rounded border border-gray-300 bg-white px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        >
                            <option value="">Seçin</option>
                            {LANGUAGE_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="w-full mt-[15px]">
                <Label>Auditoriyadaxili saatlar</Label>
                <TextArea
                    placeholder="a) XX saat - mühazirə b) XX saat - seminar və s."
                    value={inClassHours}
                    onChange={(value) => setInClassHours(value)}
                />
            </div>

            <div className="w-full mt-[15px]">
                <Label>Auditoriya kənar saatlar</Label>
                <TextArea
                    placeholder="a) XX saat - sərbəst iş b) XX saat - hazırlıq və s."
                    value={outOfClassHours}
                    onChange={(value) => setOutOfClassHours(value)}
                />
            </div>

            <div className="w-full mt-[15px]">
                <Label>Tədris metodları</Label>
                <TeachingMethodsPicker selected={teachingMethods} onChange={setTeachingMethods} />
            </div>

            <div className="w-full mt-[15px]">
                <Label>Qiymətləndirmə haqqında məlumat</Label>
                <AssessmentEditor rows={assessment} onChange={setAssessment} />
            </div>

            <div className='mt-[20px]'>
                <div className="flex items-center justify-between">
                    <Label>Təlim nəticələri</Label>
                    <button
                        type="button"
                        onClick={() => navigate("/specialty-details/subjects/subject-details/clo-plo-matching-table", { state: { subjectCode, subjectName, specialtyCode } })}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <TableChartIcon sx={{ fontSize: 16 }} />
                        CLO-PLO uyğunluq cədvəli
                    </button>
                </div>
                {!clos || clos.length === 0 ? (
                    <p className="text-gray-500 italic">Heç bir təlim nəticəsi mövcud deyil.</p>
                ) : (
                    <ul className="space-y-1 text-gray-600">
                        {clos.map((clo, index) => (
                            <li key={index} className="group flex items-start gap-2">
                                <span className="flex-1">• {clo.clo_content}</span>
                                {clo.clo_code && (
                                    <span className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClo(clo)}
                                            className="rounded-lg border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            Redaktə et
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClo(clo)}
                                            className="rounded-lg border border-error-200 px-2 py-0.5 text-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/30 dark:hover:bg-error-500/10"
                                        >
                                            Sil
                                        </button>
                                    </span>
                                )}
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