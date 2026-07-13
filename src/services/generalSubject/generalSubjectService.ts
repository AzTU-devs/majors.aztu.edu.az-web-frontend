import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface GeneralSubjectSpecialty {
    specialty_code: string;
    specialty_name: string;
}

export interface GeneralSubject {
    subject_code: string;
    subject_name: string;
    semester: number;
    credit: number;
    year: string;
    specialties: GeneralSubjectSpecialty[];
}

export interface GeneralSubjectPayload {
    owner_cafedra_code: string;
    specialty_codes: string[];
    subject_code: string;
    subject_name: string;
    subject_desc: string;
    semester: number;
    status: number;
    credit: number;
    year: string;
    hours_per_week: number;
    form_of_education?: number;
    language_of_instruction?: number;
    in_class_hours?: string;
    out_of_class_hours?: string;
    teaching_methods?: string;
    assessment?: string;
}

export interface CreateGeneralSubjectResult {
    status: "SUCCESS" | "CONFLICT" | "FORBIDDEN" | "ERROR";
    message?: string;
}

// Create a general subject and assign it to one or more specialties (typically
// belonging to other cafedras). axios throws on non-2xx, so backend messages
// for 403 / 409 / 404 / 400 are surfaced from err.response.
export const createGeneralSubject = async (
    payload: GeneralSubjectPayload
): Promise<CreateGeneralSubjectResult> => {
    try {
        const response = await apiClient.post("/api/general-subjects", payload);
        if (response.data.statusCode === 201) {
            return { status: "SUCCESS" };
        }
        return { status: "ERROR", message: response.data?.message };
    } catch (err: any) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 403) return { status: "FORBIDDEN", message };
        if (status === 409) return { status: "CONFLICT", message };
        return { status: "ERROR", message };
    }
};

// List general subjects owned by a cafedra. Returns [] on any error.
export const getGeneralSubjectsByCafedra = async (
    cafedraCode: string
): Promise<GeneralSubject[]> => {
    try {
        const response = await apiClient.get(
            `/api/general-subjects/${encodeURIComponent(cafedraCode)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200) {
            return response.data.general_subjects ?? [];
        }
        return [];
    } catch {
        return [];
    }
};

export const deleteGeneralSubject = async (
    subjectCode: string
): Promise<"SUCCESS" | "ERROR"> => {
    try {
        const response = await apiClient.delete(
            `/api/general-subjects/${encodeURIComponent(subjectCode)}`
        );
        if (response.data.statusCode === 200) return "SUCCESS";
        return "ERROR";
    } catch {
        return "ERROR";
    }
};
