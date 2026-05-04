import Swal from "sweetalert2";
import { useState } from 'react';
import Label from '../form/Label';
import Select from '../form/Select';
import Button from '../ui/button/Button';
import { useLocation } from 'react-router';
import Input from '../form/input/InputField';
import { addCurricula } from '../../services/curricula/curricula';

export default function NewSubject() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [credit, setCredit] = useState<number>();
    const [subjectDesc, setSubjectDesc] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [hoursPerWeek, setHoursPerWeek] = useState<number>();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };

    // year

    const yearOptions = [
        {
            value: "1",
            label: "1-ci il"
        }, {
            value: "2",
            label: "2-ci il"
        }, {
            value: "3",
            label: "3-cü il"
        }, {
            value: "4",
            label: "4-cü il"
        }
    ];

    const [selectedYear, setSelectedYear] = useState<number>();

    const handleYearChange = (value: string) => {
        setSelectedYear(+value);
    }

    // status logic

    const [selectedStatus, setSelectedStatus] = useState("");
    const statusOptions = [
        {
            value: "1",
            label: "Seçmə"
        }, {
            value: "2",
            label: "Məcburi"
        }, {
            value: "3",
            label: "Digər"
        }
    ];
    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
    };

    // semester logic

    const [selectedSemester, setSelectedSemester] = useState("");
    const semesterOptions = [
        {
            value: "1",
            label: "Payız semestri"
        }, {
            value: "2",
            label: "Yaz semestri"
        }
    ];
    const handleSemesterChange = (value: string) => {
        setSelectedSemester(value);
    };

    // create subject logic

    const createSubject = async () => {
        try {
            setLoading(true);
            const subjectPayload = {
                specialty_code: specialtyCode,
                subject_code: subjectCode,
                subject_name: subjectName,
                subject_desc: subjectDesc,
                semester: +selectedSemester,
                status: +selectedStatus,
                credit: credit,
                year: selectedYear ? selectedYear : 1,
                hours_per_week: hoursPerWeek
            }
            const result = await addCurricula(subjectPayload);

            if (result === "SUCCESS") {
                Swal.fire({
                    icon: "success",
                    title: "Uğurla əlavə olundu",
                    text: "Yeni fənn uğurla əlavə edildi!"
                }).then(() => {
                    setLoading(false);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: "Gözlənilməz xəta baş verdi!"
                }).then(() => {
                    setLoading(false);
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Gözlənilməz xəta baş verdi!"
            }).then(() => {
                setLoading(false);
            });
        }
    }
    return (
        <>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        İxtisas adı
                    </Label>
                    <Input value={specialtyName} readOnly />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        İxtisas kodu
                    </Label>
                    <Input value={specialtyCode} readOnly />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn adı
                    </Label>
                    <Input placeholder='Fənn adı' value={subjectName} onChange={(e) => { setSubjectName(e.target.value) }} />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənn kodu
                    </Label>
                    <Input placeholder='Fənn kodu' value={subjectCode} onChange={(e) => { setSubjectCode(e.target.value) }} />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənnin deskripsiyası
                    </Label>
                    <Input placeholder='Fənnin deskripsiyası' value={subjectDesc} onChange={(e) => { setSubjectDesc(e.target.value) }} />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Tədris ili
                    </Label>
                    <Select
                        placeholder='Tədris ili seçin'
                        options={yearOptions}
                        onChange={handleYearChange}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Fənnin statusu
                    </Label>
                    <Select
                        placeholder='Status seçin'
                        options={statusOptions}
                        onChange={handleStatusChange}
                    />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Semestr
                    </Label>
                    <Select
                        placeholder='Semestr seçin'
                        options={semesterOptions}
                        onChange={handleSemesterChange}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Kredit
                    </Label>
                    <Input
                        placeholder='Kredit'
                        value={credit}
                        type='number'
                        onChange={
                            (e) => { setCredit(+e.target.value) }
                        }
                    />
                </div>
                <div style={{
                    width: "calc((100% / 2) - 20px)"
                }}>
                    <Label>
                        Həftə üzrə saat sayı
                    </Label>
                    <Input
                        placeholder='Həftə üzrə saat sayı'
                        value={hoursPerWeek}
                        type='number'
                        onChange={
                            (e) => { setHoursPerWeek(+e.target.value) }
                        }
                    />
                </div>
            </div>
            <div className='flex justify-end items-center'>
                <Button disabled={loading} onClick={createSubject}>
                    {loading ? "Əlavə edilir" : "Əlavə et"}
                </Button>
            </div>
        </>
    )
}