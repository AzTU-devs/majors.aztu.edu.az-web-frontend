import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface SpecialtyCharPayload {
    specialty_code: string;
    program_desc: string;
    degree_requirements: string;
}

export interface SpecialtyChar {
    id: number;
    specialty_code: string;
    program_desc: string;
    degree_requirements: string;
}

export const addSpecialtychar = async (specCharPayload: SpecialtyCharPayload, token: string) => {
    try {
        const response = await apiClient.post(
            "/api/specialty-characteristics",
            specCharPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else if (response.data.statusCode === 409) {
            return "ALREADY EXISTS";
        } else {
            return "ERROR";
        }
    } catch (error: any) {
        if (error.response?.status === 409) {
            return "ALREADY EXISTS";
        }
        return "ERROR";
    }
};

export const getSpecialtyChar = async (specialtyCode: string, token: string) => {
    try {
        const response = await apiClient.get(
            `/api/specialty-characteristics/${specialtyCode}?lang=${lang_code}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.statusCode === 200) {
            return response.data.characteristics[0];
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            return "NOT FOUND";
        }
        return "ERROR";
    }
};