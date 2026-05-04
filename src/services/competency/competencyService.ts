import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Competency {
    id: number;
    specialty_code: string;
    competency_code: string;
    language_code: string;
    competency_content: string;
}

export interface CompetencyPayload {
    specialty_code: string;
    competency_content: string;
}

export const getCompetencyBySpecialty = async (specialty_code: string, token: string) => {
    try {
        const response = await apiClient.get(
            `/api/competency/${specialty_code}?lang=${lang_code}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.statusCode === 200) {
            return response.data.competencies;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                return "NOT FOUND";
            } else if (error.response.status === 409) {
                return "CONFLICT";
            }
        }
        throw error;
    }
}

export const addCompetency = async (competencyPayload: CompetencyPayload, token: string) => {
    try {
        const response = await apiClient.post(
            "/api/competency",
            competencyPayload,
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