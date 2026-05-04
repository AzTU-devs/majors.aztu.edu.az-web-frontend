import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Gco {
    id: number;
    specialty_code: string;
    career_code: string;
    career_title: string;
    language_code: string;
    career_content: string;
}

export interface GcoPayload {
    specialty_code: string;
    career_title: string;
    career_content: string;
}

export const getGcosBySpecailty = async (specialty_code: string, token: string) => {
    try {
        const response = await apiClient.get(
            `/api/gco/${specialty_code}?lang=${lang_code}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.statusCode === 200) {
            return response.data.gcos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            if (status === 404) {
                return "NOT FOUND";
            } else if (status === 409) {
                return "CONFLICT";
            } else {
                return `ERROR: ${status}`;
            }
        } else {
            return "NETWORK ERROR";
        }
    }
};

export const addGco = async (gcoPayload: GcoPayload, token: string) => {
    try {
        const response = await apiClient.post(
            "/api/gco",
            gcoPayload,
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