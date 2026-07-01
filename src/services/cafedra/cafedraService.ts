import apiClient from "../../util/apiClient";
const lang_code = "az";

export interface Cafedra {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
}

export interface CafedraPayload {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
}

// get all cafedras for language az

export const getCafedras = async () => {
    try {
        const response = await apiClient.get(`/api/cafedras?lang_code=${lang_code}`);

        const statusCode = response.data.statusCode;

        if (statusCode === 200) {
            return response.data.cafedras;
        } else if (response.status === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (e) {
        return "ERROR";
    }
}

export const addCafedra = async (payload: CafedraPayload) => {
    try {
        const response = await apiClient.post("/api/cafedra", payload);
        if (response.data.statusCode === 201) return "SUCCESS";
        return "ERROR";
    } catch (e: any) {
        if (e?.response?.status === 404) return "FACULTY_NOT_FOUND";
        if (e?.response?.status === 409) return "CONFLICT";
        return "ERROR";
    }
};

export interface CafedraMutationResult {
    status: "SUCCESS" | "CONFLICT" | "ERROR";
    message?: string;
}

export const updateCafedra = async (
    cafedra_code: string,
    payload: { cafedra_name?: string; faculty_code?: string }
): Promise<CafedraMutationResult> => {
    try {
        const response = await apiClient.put(`/api/cafedra/${cafedra_code}`, payload);
        if (response.data.statusCode === 200) return { status: "SUCCESS" };
        return { status: "ERROR", message: response.data.message };
    } catch (e: any) {
        if (e?.response?.status === 409)
            return { status: "CONFLICT", message: e.response.data?.message };
        return { status: "ERROR", message: e?.response?.data?.message };
    }
};

export const deleteCafedra = async (
    cafedra_code: string
): Promise<CafedraMutationResult> => {
    try {
        const response = await apiClient.delete(`/api/cafedra/${cafedra_code}`);
        if (response.data.statusCode === 200) return { status: "SUCCESS" };
        return { status: "ERROR", message: response.data.message };
    } catch (e: any) {
        if (e?.response?.status === 409)
            return { status: "CONFLICT", message: e.response.data?.message };
        return { status: "ERROR", message: e?.response?.data?.message };
    }
};

export const getCafedrasByFaculty = async (
    faculty_code: string,
    token: string
) => {
    const response = await apiClient.get(`/api/cafedras/${faculty_code}?lang=${lang_code}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.data.status_code === 200) {
        return response.data.cafedras;
    } else {
        return "NOT FOUND";
    }
};