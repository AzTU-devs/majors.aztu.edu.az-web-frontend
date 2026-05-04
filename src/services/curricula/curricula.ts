import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Subject {
    subject_code: string;
    subject_name: string;
    semester: number;
    hours_per_week: number;
    status: number;
    credit: number
};

export interface SubjectPayload {
    specialty_code: string;
    subject_code: string;
    subject_name: string;
    subject_desc: string;
    semester: number;
    status: number;
    credit?: number;
    year: number;
    hours_per_week?: number;
};

export interface SubjectDetails {
    subject_code: string;
    subject_name: string;
    subject_description: string;
    semester: number;
    status: number;
    credit?: number;
    year: number;
    hours_per_week?: number;
};

export const getCurriculaBySpecialtyCode = async (specialtyCode: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(
            `/api/curricula/${specialtyCode}/subjects?start=${start}&end=${end}&lang=${lang_code}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (response.data.statusCode === 200) {
            return {
                "subjects": response.data.subjects,
                "total_subjects": response.data.total
            }
        } else {
            return "ERROR";
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}

export const addCurricula = async (subjectPayload: SubjectPayload) => {
    try {
        const response = await apiClient.post(
            "/api/curricula/create",
            subjectPayload,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (response.data.statusCode === 201) {
            return "SUCCESS";
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}

export const getSubjectDetails = async (subjectCode: string) => {
    try {
        const response = await apiClient.get(`/api/curricula/${subjectCode}?lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return response.data.subject_details;
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}

export const deleteCurricula = async (subjectCode: string, token: string) => {
    try {
        const response = await apiClient.delete(`/api/curricula/${subjectCode}/delete`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}

export const updateCurricula = async (subjectCode: string, updateData: any, token: string) => {
    try {
        const response = await apiClient.patch(
            `/api/curricula/${subjectCode}/update`,
            updateData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}