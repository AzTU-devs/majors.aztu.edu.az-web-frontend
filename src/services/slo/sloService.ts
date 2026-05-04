import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Slo {
    id: number;
    specialty_code: string;
    slo_code: string;
    language_code: string;
    slo_content: string;
}

export interface SloPayload {
    specialty_code: string;
    slo_content: string;
}

export const getSloBySpecialty = async (specialty_code: string, token: string) => {
    try {
        const response = await apiClient.get(
            `/api/slo/${specialty_code}?lang=${lang_code}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.statusCode === 200) {
            return response.data.slos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (e: any) {
        if (e.response) {
            if (e.response.status === 404) {
                return "NOT FOUND";
            } else if (e.response.status === 409) {
                return "CONFLICT";
            }
        }
        return "ERROR";
    }
}

export const addSlo = async (sloPayload: SloPayload, token: string) => {
    try {
        const response = await apiClient.post(
            "/api/slo",
            sloPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            return "NOT FOUND";
        } else if (error.response?.status === 409) {
            return "ALREADY EXISTS";
        }
        throw error;
    }
}