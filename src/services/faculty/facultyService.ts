import apiClient from "../../util/apiClient";

export interface Faculty {
    id?: number;
    faculty_name: string;
    faculty_code: string;
    cafedra_count?: number;
    created_at?: string;
}

export interface FacultyPayload {
    faculty_code: string;
    faculty_name: string;
}

export const getFaculties = async (): Promise<Faculty[]> => {
    try {
        const response = await apiClient.get("/api/faculties?lang=az");
        if (response.data.status === 200 || response.data.statusCode === 200) {
            return response.data.faculties || [];
        }
        return [];
    } catch {
        return [];
    }
};

export const addFaculty = async (payload: FacultyPayload) => {
    try {
        const response = await apiClient.post("/api/faculty", payload);
        if (response.data.statusCode === 201) return "SUCCESS";
        return "ERROR";
    } catch (e: any) {
        if (e?.response?.status === 409) return "CONFLICT";
        return "ERROR";
    }
};

export interface MutationResult {
    status: "SUCCESS" | "CONFLICT" | "ERROR";
    message?: string;
}

export const updateFaculty = async (
    faculty_code: string,
    faculty_name: string
): Promise<MutationResult> => {
    try {
        const response = await apiClient.put(`/api/faculty/${faculty_code}`, {
            faculty_name,
        });
        if (response.data.statusCode === 200) return { status: "SUCCESS" };
        return { status: "ERROR", message: response.data.message };
    } catch (e: any) {
        if (e?.response?.status === 409)
            return { status: "CONFLICT", message: e.response.data?.message };
        return { status: "ERROR", message: e?.response?.data?.message };
    }
};

export const deleteFaculty = async (
    faculty_code: string
): Promise<MutationResult> => {
    try {
        const response = await apiClient.delete(`/api/faculty/${faculty_code}`);
        if (response.data.statusCode === 200) return { status: "SUCCESS" };
        return { status: "ERROR", message: response.data.message };
    } catch (e: any) {
        if (e?.response?.status === 409)
            return { status: "CONFLICT", message: e.response.data?.message };
        return { status: "ERROR", message: e?.response?.data?.message };
    }
};
