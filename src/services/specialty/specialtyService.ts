import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Specialty {
    cafedra_name: string;
    specialty_name: string;
    specialty_code: string;
}

export interface SpecialtyPayload {
    cafedra_code: string;
    specialty_name: string;
    specialty_code: string;
}

export const addSpecialty = async (specialty: SpecialtyPayload, token: string) => {
    try {
        const response = await apiClient.post("/api/specialty", specialty, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else {
            return "ERROR";
        }
    } catch (error: any) {
        if (error.response?.status === 409) {
            return "CONFLICT";
        }
        return "ERROR";
    }
};

export const getSpecialtiesByCafedra = async (cafedraCode: string, token: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/specialties/${cafedraCode}?lang=${lang_code}&start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "specialties": response.data.specialties,
                "total_specialties": response.data.total
            };
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

export interface SpecialtyUpdateResult {
    status: "SUCCESS" | "CONFLICT" | "ERROR";
    newCode?: string;
    message?: string;
}

export const updateSpecialty = async (
    specialtyCode: string,
    payload: { specialty_name?: string; new_specialty_code?: string }
): Promise<SpecialtyUpdateResult> => {
    try {
        const response = await apiClient.put(`/api/specialty/${specialtyCode}`, payload);
        if (response.data.statusCode === 200) {
            return { status: "SUCCESS", newCode: response.data.specialty_code };
        }
        return { status: "ERROR", message: response.data.message };
    } catch (e: any) {
        if (e?.response?.status === 409) {
            return { status: "CONFLICT", message: e.response.data?.message };
        }
        return { status: "ERROR", message: e?.response?.data?.message };
    }
};

export const deleteSpecialty = async (specialtyCode: string) => {
    try {
        const response = await apiClient.delete(`/api/specialty/${specialtyCode}`);
        if (response.data.statusCode === 200) return "SUCCESS";
        if (response.data.statusCode === 404) return "NOT FOUND";
        return "ERROR";
    } catch (e: any) {
        if (e?.response?.status === 404) return "NOT FOUND";
        return "ERROR";
    }
};

export const getAllSpecialties = async (token: string) => {
    try {
        const response = await apiClient.get(`/api/specialties?lang=${lang_code}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.statusCode === 200) {
            return response.data.specialties;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
};