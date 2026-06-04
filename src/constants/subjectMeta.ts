import { AssessmentRow } from "../services/curricula/curricula";

// Form of education
export const FORM_OF_EDUCATION_OPTIONS = [
    { value: "1", label: "Əyani" },
    { value: "2", label: "Qiyabi" },
];
export const formOfEducationLabel = (v?: number | null) =>
    v === 1 ? "Əyani" : v === 2 ? "Qiyabi" : "—";

// Language of instruction
export const LANGUAGE_OPTIONS = [
    { value: "1", label: "Azərbaycan" },
    { value: "2", label: "İngilis" },
    { value: "3", label: "Rus" },
];
export const languageLabel = (v?: number | null) =>
    v === 1 ? "Azərbaycan" : v === 2 ? "İngilis" : v === 3 ? "Rus" : "—";

// Teaching methods (stored as comma-separated keys)
export const TEACHING_METHODS: { key: string; label: string }[] = [
    { key: "lecture", label: "mühazirə" },
    { key: "interactive", label: "interaktiv müzakirə" },
    { key: "seminar", label: "seminar" },
    { key: "lab", label: "laboratoriya işi" },
    { key: "pbl", label: "problem-based learning" },
    { key: "case", label: "case study" },
    { key: "project", label: "layihə əsaslı öyrənmə" },
    { key: "team", label: "komanda işi" },
    { key: "presentation", label: "təqdimatlar" },
];

export const teachingMethodLabel = (key: string) =>
    TEACHING_METHODS.find((m) => m.key === key)?.label ?? key;

export const parseTeachingMethods = (value?: string | null): string[] =>
    value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];

// Standard AzTU assessment template (matches the backend seed).
export const DEFAULT_ASSESSMENT: AssessmentRow[] = [
    {
        form: "Cari qiymətləndirmə",
        description:
            "Cari qiymətləndirmə - fənn üzrə tələbənin semestr müddətində fəaliyyətinin qiymətləndirilməsi olmaqla, mühazirə və məşğələ (laboratoriya) dərs materiallarının mənimsənilmə səviyyəsini qiymətləndirilir.",
        score: "30 bal",
        ftn: "FTN 1-5",
    },
    {
        form: "Davamiyyət",
        description: "Tələbə fənn üzrə dərslərin 25%-dən çoxunda iştirak etmədiyi halda imtahana buraxılmır.",
        score: "10 bal",
        ftn: "-",
    },
    {
        form: "Tələbənin sərbəst işi",
        description:
            "Tələbəyə fənn üzrə semestr ərzində 1 sərbəst işin (zəruri hallarda sərbəst işlərin sayı artırıla bilər) yerinə yetirilməsi tapşırığı verilir.",
        score: "10 bal",
        ftn: "FTN--",
    },
    {
        form: "İmtahan",
        description: "İmtahan şifahi, yazılı, yazılı-elektron, test üsulu ilə keçirilir",
        score: "50 bal",
        ftn: "FTN 1-5",
    },
];
