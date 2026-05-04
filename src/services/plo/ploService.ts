import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Plo {
    id: number;
    specialty_code: string;
    plo_code: string;
    language_code: string;
    plo_content: string;
};

export interface PloPayload {
    specialty_code: string;
    plo_content: string;
}

export const getPloBySpecailty = async (specialty_code: string) => {
    try {
        const response = await apiClient.get(
            `/api/plo/${specialty_code}?lang=${lang_code}`,
            // {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // }
        );

        if (response.data.statusCode === 200) {
            return response.data.plos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            return "NOT FOUND";
        }
        throw error;
    }
}

export const addPlo = async (ploPayload: PloPayload, token: string) => {
    try {
        const response = await apiClient.post(
            "/api/plo",
            ploPayload,
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