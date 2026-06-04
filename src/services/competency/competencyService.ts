import apiClient from "../../util/apiClient";

const lang_code = "az";

// competency_type: 1 = Peşə (Job), 2 = İxtisas (Specialty)
export interface Competency {
    id: number;
    specialty_code: string;
    competency_code: string;
    competency_type: number;
    language_code: string;
    competency_content: string;
}

export interface CompetencyPayload {
    specialty_code: string;
    competency_content: string;
    competency_type: number;
}

export const getCompetencyBySpecialty = async (
    specialty_code: string,
    token: string,
    competency_type?: number
) => {
    try {
        const typeQuery = competency_type ? `&type=${competency_type}` : "";
        const response = await apiClient.get(
            `/api/competency/${specialty_code}?lang=${lang_code}${typeQuery}`,
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
export const deleteCompetency = async (competencyCode: string) => {
    try {
        const response = await apiClient.delete(`/api/competency/${competencyCode}`);
        if (response.data.statusCode === 200) return "SUCCESS";
        if (response.data.statusCode === 404) return "NOT FOUND";
        return "ERROR";
    } catch (e: any) {
        if (e?.response?.status === 404) return "NOT FOUND";
        return "ERROR";
    }
};
