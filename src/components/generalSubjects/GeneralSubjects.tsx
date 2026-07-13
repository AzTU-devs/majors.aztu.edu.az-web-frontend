import Swal from "sweetalert2";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { Modal } from "../ui/modal";
import { RootState } from "../../redux/store";
import {
    AssessmentRow,
    SubjectDetails,
    getSubjectDetails,
} from "../../services/curricula/curricula";
import {
    DEFAULT_ASSESSMENT,
    FORM_OF_EDUCATION_OPTIONS,
    LANGUAGE_OPTIONS,
    SEMESTER_OPTIONS,
    semesterLabel,
    formOfEducationLabel,
    languageLabel,
    parseTeachingMethods,
    teachingMethodLabel,
} from "../../constants/subjectMeta";
import TeachingMethodsPicker from "../subjectMeta/TeachingMethodsPicker";
import AssessmentEditor from "../subjectMeta/AssessmentEditor";
import { Cafedra, getCafedras } from "../../services/cafedra/cafedraService";
import { getAllSpecialties, Specialty } from "../../services/specialty/specialtyService";
import {
    GeneralSubject,
    createGeneralSubject,
    deleteGeneralSubject,
    getGeneralSubjectsByCafedra,
} from "../../services/generalSubject/generalSubjectService";

const statusOptions = [
    { value: "1", label: "Seçmə" },
    { value: "2", label: "Məcburi" },
    { value: "3", label: "Digər" },
];

const statusLabel = (s?: number) =>
    s === 1 ? "Seçmə" : s === 2 ? "Məcburi" : s === 3 ? "Digər" : "—";

function Info({ k, v }: { k: string; v: ReactNode }) {
    return (
        <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {k}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{v}</p>
        </div>
    );
}

export default function GeneralSubjects() {
    const role = useSelector((s: RootState) => s.auth.role);
    const token = useSelector((s: RootState) => s.auth.token);
    const cafedraCode = useSelector((s: RootState) => s.auth.cafedra_code);
    const isAdmin = role === 1;

    // bootstrap data
    const [bootstrapping, setBootstrapping] = useState(true);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [selectedOwner, setSelectedOwner] = useState("");

    // specialties multi-select
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [specialtySearch, setSpecialtySearch] = useState("");
    const [selectedSpecialtyCodes, setSelectedSpecialtyCodes] = useState<string[]>([]);

    // subject fields (mirrors NewSubject)
    const [subjectName, setSubjectName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [subjectDesc, setSubjectDesc] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [credit, setCredit] = useState<number>();
    const [hoursPerWeek, setHoursPerWeek] = useState<number>();
    const [formOfEducation, setFormOfEducation] = useState<number>(1);
    const [languageOfInstruction, setLanguageOfInstruction] = useState<number>(1);
    const [inClassHours, setInClassHours] = useState("");
    const [outOfClassHours, setOutOfClassHours] = useState("");
    const [teachingMethods, setTeachingMethods] = useState<string[]>([]);
    const [assessment, setAssessment] = useState<AssessmentRow[]>(DEFAULT_ASSESSMENT);

    const [loading, setLoading] = useState(false);
    // remount the create form on success so uncontrolled <Select>s reset too
    const [formKey, setFormKey] = useState(0);

    // list
    const [generalSubjects, setGeneralSubjects] = useState<GeneralSubject[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);

    // create-form visibility (list-first view)
    const [showForm, setShowForm] = useState(false);

    // details modal
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [details, setDetails] = useState<SubjectDetails | null>(null);
    const [detailsSubject, setDetailsSubject] = useState<GeneralSubject | null>(null);

    // owner cafedra: role 2 uses own cafedra, admin uses the picked one
    const owner = isAdmin ? selectedOwner : cafedraCode ?? "";
    const ownerCafedra = useMemo(
        () => cafedras.find((c) => c.cafedra_code === owner),
        [cafedras, owner]
    );
    const isEnabled = ownerCafedra?.general_subjects_enabled === true;
    const enabledCafedras = useMemo(
        () => cafedras.filter((c) => c.general_subjects_enabled === true),
        [cafedras]
    );

    useEffect(() => {
        (async () => {
            setBootstrapping(true);
            const [cafRes, specRes] = await Promise.all([
                getCafedras(),
                getAllSpecialties(token ?? ""),
            ]);
            if (Array.isArray(cafRes)) setCafedras(cafRes);
            if (Array.isArray(specRes)) setSpecialties(specRes);
            setBootstrapping(false);
        })();
    }, [token]);

    const refreshList = useCallback(async () => {
        if (!owner || !isEnabled) {
            setGeneralSubjects([]);
            return;
        }
        setListLoading(true);
        const list = await getGeneralSubjectsByCafedra(owner);
        setGeneralSubjects(list);
        setListLoading(false);
    }, [owner, isEnabled]);

    useEffect(() => {
        refreshList();
    }, [refreshList]);

    const filteredSpecialties = useMemo(() => {
        const q = specialtySearch.trim().toLowerCase();
        if (!q) return specialties;
        return specialties.filter((s) =>
            `${s.specialty_name} ${s.cafedra_name} ${s.specialty_code}`
                .toLowerCase()
                .includes(q)
        );
    }, [specialties, specialtySearch]);

    const toggleSpecialty = (code: string) => {
        setSelectedSpecialtyCodes((prev) =>
            prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
        );
    };

    const resetForm = () => {
        setSubjectName("");
        setSubjectCode("");
        setSubjectDesc("");
        setAcademicYear("");
        setSelectedStatus("");
        setSelectedSemester("");
        setCredit(undefined);
        setHoursPerWeek(undefined);
        setFormOfEducation(1);
        setLanguageOfInstruction(1);
        setInClassHours("");
        setOutOfClassHours("");
        setTeachingMethods([]);
        setAssessment(DEFAULT_ASSESSMENT);
        setSelectedSpecialtyCodes([]);
        setSpecialtySearch("");
        setFormKey((k) => k + 1);
    };

    const handleCreate = async () => {
        if (!subjectName.trim() || !subjectCode.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Boş sahələr",
                text: "Fənnin adı və kodunu daxil edin.",
                confirmButtonText: "Ok",
            });
            return;
        }
        if (selectedSpecialtyCodes.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "İxtisas seçilməyib",
                text: "Ən azı bir ixtisas seçin.",
                confirmButtonText: "Ok",
            });
            return;
        }

        try {
            setLoading(true);
            const result = await createGeneralSubject({
                owner_cafedra_code: owner,
                specialty_codes: selectedSpecialtyCodes,
                subject_code: subjectCode,
                subject_name: subjectName,
                subject_desc: subjectDesc,
                semester: +selectedSemester,
                status: +selectedStatus,
                credit: credit ?? 0,
                year: academicYear,
                hours_per_week: hoursPerWeek ?? 0,
                form_of_education: formOfEducation,
                language_of_instruction: languageOfInstruction,
                in_class_hours: inClassHours,
                out_of_class_hours: outOfClassHours,
                teaching_methods: teachingMethods.join(","),
                assessment: JSON.stringify(assessment),
            });

            if (result.status === "SUCCESS") {
                await Swal.fire({
                    icon: "success",
                    title: "Uğurla əlavə olundu",
                    text: "Ümumi fənn uğurla yaradıldı!",
                });
                resetForm();
                setShowForm(false);
                refreshList();
            } else if (result.status === "FORBIDDEN") {
                Swal.fire({
                    icon: "error",
                    title: "İcazə yoxdur",
                    text:
                        result.message ??
                        "Bu kafedra üçün ümumi fənlər modulu aktiv deyil.",
                    confirmButtonText: "Ok",
                });
            } else if (result.status === "CONFLICT") {
                Swal.fire({
                    icon: "error",
                    title: "Fənn kodu mövcuddur",
                    text: result.message ?? "Bu kodla fənn artıq mövcuddur.",
                    confirmButtonText: "Ok",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: result.message ?? "Gözlənilməz xəta baş verdi!",
                    confirmButtonText: "Ok",
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Gözlənilməz xəta baş verdi!",
                confirmButtonText: "Ok",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (gs: GeneralSubject) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Silinsin?",
            text: `"${gs.subject_name}" (${gs.subject_code}) ümumi fənni silinəcək.`,
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Ləğv et",
            confirmButtonColor: "#dc2626",
        });
        if (!confirm.isConfirmed) return;

        setBusy(gs.subject_code);
        const result = await deleteGeneralSubject(gs.subject_code);
        setBusy(null);
        if (result === "SUCCESS") {
            Swal.fire({
                icon: "success",
                title: "Silindi",
                timer: 1400,
                showConfirmButton: false,
            });
            refreshList();
        } else {
            Swal.fire("Xəta!", "Ümumi fənn silinə bilmədi.", "error");
        }
    };

    const openDetails = async (gs: GeneralSubject) => {
        setDetailsSubject(gs);
        setDetails(null);
        setDetailsOpen(true);
        setDetailsLoading(true);
        const res = await getSubjectDetails(gs.subject_code);
        setDetails(res && typeof res === "object" ? (res as SubjectDetails) : null);
        setDetailsLoading(false);
    };

    if (bootstrapping) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={72} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {isAdmin && (
                <div>
                    <Label>Kafedra (sahib)</Label>
                    <Select
                        placeholder="Kafedra seçin"
                        defaultValue={selectedOwner}
                        onChange={(value) => setSelectedOwner(value)}
                        options={enabledCafedras.map((c) => ({
                            value: c.cafedra_code,
                            label: c.cafedra_name,
                        }))}
                    />
                    {enabledCafedras.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Ümumi fənlər modulu aktiv olan kafedra yoxdur.
                        </p>
                    )}
                </div>
            )}

            {isAdmin && !owner ? (
                <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    Ümumi fənləri idarə etmək üçün kafedra seçin.
                </p>
            ) : !isEnabled ? (
                <div className="surface-card p-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Bu kafedra üçün ümumi fənlər modulu aktiv deyil. Admin ilə əlaqə
                        saxlayın.
                    </p>
                </div>
            ) : showForm ? (
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Yeni ümumi fənn
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                            Geri
                        </button>
                    </div>
                    {/* Create form */}
                    <div key={formKey} className="space-y-6">
                        <div className="flex justify-between items-center w-full">
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Fənn adı</Label>
                                <Input
                                    placeholder="Fənn adı"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                />
                            </div>
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Fənn kodu</Label>
                                <Input
                                    placeholder="Fənn kodu"
                                    value={subjectCode}
                                    onChange={(e) =>
                                        setSubjectCode(
                                            e.target.value.replace(/[^\p{L}\p{N}()-]/gu, "")
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Fənnin deskripsiyası</Label>
                                <Input
                                    placeholder="Fənnin deskripsiyası"
                                    value={subjectDesc}
                                    onChange={(e) => setSubjectDesc(e.target.value)}
                                />
                            </div>
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Akademik il</Label>
                                <Input
                                    placeholder="2025-2026"
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Fənnin statusu</Label>
                                <Select
                                    placeholder="Status seçin"
                                    options={statusOptions}
                                    onChange={(value) => setSelectedStatus(value)}
                                />
                            </div>
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Semestr</Label>
                                <Select
                                    placeholder="Semestr seçin"
                                    options={SEMESTER_OPTIONS}
                                    onChange={(value) => setSelectedSemester(value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Kredit</Label>
                                <Input
                                    placeholder="Kredit"
                                    value={credit}
                                    type="number"
                                    onChange={(e) => setCredit(+e.target.value)}
                                />
                            </div>
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Tələbənin iş yükü</Label>
                                <Input
                                    placeholder="Tələbənin iş yükü"
                                    value={hoursPerWeek}
                                    type="number"
                                    onChange={(e) => setHoursPerWeek(+e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Təhsil forması</Label>
                                <Select
                                    placeholder="Təhsil forması seçin"
                                    options={FORM_OF_EDUCATION_OPTIONS}
                                    defaultValue="1"
                                    onChange={(value) => setFormOfEducation(+value)}
                                />
                            </div>
                            <div style={{ width: "calc((100% / 2) - 20px)" }}>
                                <Label>Tədris dili</Label>
                                <Select
                                    placeholder="Tədris dili seçin"
                                    options={LANGUAGE_OPTIONS}
                                    defaultValue="1"
                                    onChange={(value) => setLanguageOfInstruction(+value)}
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <Label>Auditoriyadaxili saatlar</Label>
                            <TextArea
                                placeholder="a) XX saat - mühazirə b) XX saat - seminar və s."
                                value={inClassHours}
                                onChange={(value) => setInClassHours(value)}
                            />
                        </div>
                        <div className="w-full">
                            <Label>Auditoriya kənar saatlar</Label>
                            <TextArea
                                placeholder="a) XX saat - sərbəst iş b) XX saat - hazırlıq və s."
                                value={outOfClassHours}
                                onChange={(value) => setOutOfClassHours(value)}
                            />
                        </div>
                        <div className="w-full">
                            <Label>Tədris metodları</Label>
                            <TeachingMethodsPicker
                                selected={teachingMethods}
                                onChange={setTeachingMethods}
                            />
                        </div>
                        <div className="w-full">
                            <Label>Qiymətləndirmə haqqında məlumat</Label>
                            <AssessmentEditor rows={assessment} onChange={setAssessment} />
                        </div>

                        {/* Specialty multi-select */}
                        <div className="w-full">
                            <Label>İxtisaslar (digər kafedralar)</Label>
                            <Input
                                placeholder="İxtisas, kafedra və ya kod üzrə axtarın"
                                value={specialtySearch}
                                onChange={(e) => setSpecialtySearch(e.target.value)}
                                className="mb-3"
                            />
                            <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-200 dark:border-white/10">
                                {filteredSpecialties.length === 0 ? (
                                    <p className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        İxtisas tapılmadı.
                                    </p>
                                ) : (
                                    filteredSpecialties.map((s) => {
                                        const checked = selectedSpecialtyCodes.includes(
                                            s.specialty_code
                                        );
                                        return (
                                            <label
                                                key={s.specialty_code}
                                                className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2.5 text-sm transition last:border-b-0 dark:border-white/5 ${
                                                    checked
                                                        ? "bg-brand-50 dark:bg-brand-500/10"
                                                        : "hover:bg-gray-50 dark:hover:bg-white/5"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        toggleSpecialty(s.specialty_code)
                                                    }
                                                    className="h-4 w-4 accent-brand-500"
                                                />
                                                <span className="text-gray-700 dark:text-gray-200">
                                                    {s.specialty_name} — {s.cafedra_name}{" "}
                                                    <span className="font-mono text-gray-500 dark:text-gray-400">
                                                        ({s.specialty_code})
                                                    </span>
                                                </span>
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                            {selectedSpecialtyCodes.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {selectedSpecialtyCodes.length} ixtisas seçildi
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end items-center">
                            <Button disabled={loading} onClick={handleCreate}>
                                {loading ? "Əlavə edilir" : "Əlavə et"}
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Existing general subjects */}
                    <div className="space-y-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">
                                Yaradılmış ümumi fənlər
                            </h3>
                            <Button
                                size="sm"
                                startIcon={<AddIcon fontSize="small" />}
                                onClick={() => setShowForm(true)}
                            >
                                Yeni ümumi fənn
                            </Button>
                        </div>
                        {listLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} variant="rounded" height={96} />
                                ))}
                            </div>
                        ) : generalSubjects.length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                Hələ ümumi fənn yaradılmayıb.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {generalSubjects.map((gs) => (
                                    <div
                                        key={gs.subject_code}
                                        className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {gs.subject_name}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-mono">
                                                    {gs.subject_code}
                                                </span>
                                                {" · "}
                                                Semestr: {semesterLabel(gs.semester)}
                                                {" · "}
                                                Kredit: {gs.credit}
                                                {gs.year ? ` · ${gs.year}` : ""}
                                            </p>
                                            {gs.specialties && gs.specialties.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {gs.specialties.map((sp) => (
                                                        <span
                                                            key={sp.specialty_code}
                                                            className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                                                        >
                                                            {sp.specialty_name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                startIcon={<VisibilityIcon fontSize="small" />}
                                                onClick={() => openDetails(gs)}
                                            >
                                                Ətraflı
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={busy === gs.subject_code}
                                                startIcon={
                                                    <DeleteOutlineIcon fontSize="small" />
                                                }
                                                onClick={() => handleDelete(gs)}
                                            >
                                                Sil
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Details modal */}
            <Modal
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                className="max-w-2xl m-4 p-6 sm:p-8"
            >
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {detailsSubject?.subject_name}
                </h3>
                <p className="mb-5 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {detailsSubject?.subject_code}
                </p>

                {detailsLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} variant="text" />
                        ))}
                    </div>
                ) : details ? (
                    <div className="space-y-4">
                        {details.subject_description && (
                            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                {details.subject_description}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <Info k="Semestr" v={semesterLabel(details.semester)} />
                            <Info k="Fənnin statusu" v={statusLabel(details.status)} />
                            <Info k="Kredit" v={details.credit ?? "—"} />
                            <Info k="Akademik il" v={details.year ?? "—"} />
                            <Info k="Tələbənin iş yükü" v={details.hours_per_week ?? "—"} />
                            <Info
                                k="Təhsil forması"
                                v={formOfEducationLabel(details.form_of_education)}
                            />
                            <Info
                                k="Tədris dili"
                                v={languageLabel(details.language_of_instruction)}
                            />
                        </div>
                        {details.in_class_hours && (
                            <Info k="Auditoriyadaxili saatlar" v={details.in_class_hours} />
                        )}
                        {details.out_of_class_hours && (
                            <Info k="Auditoriya kənar saatlar" v={details.out_of_class_hours} />
                        )}
                        {parseTeachingMethods(details.teaching_methods).length > 0 && (
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Tədris metodları
                                </p>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                    {parseTeachingMethods(details.teaching_methods).map((m) => (
                                        <span
                                            key={m}
                                            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-200"
                                        >
                                            {teachingMethodLabel(m)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Təyin olunmuş ixtisaslar
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                                {(detailsSubject?.specialties ?? []).map((sp) => (
                                    <span
                                        key={sp.specialty_code}
                                        className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                                    >
                                        {sp.specialty_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Detallar yüklənə bilmədi.
                    </p>
                )}

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                        Bağla
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
