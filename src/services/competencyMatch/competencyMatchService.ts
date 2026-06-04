import apiClient from "../../util/apiClient";

export interface CompetencyMatchPayload {
    subject_code: string;
    competency_code: string;
    match: boolean;
}

export const createCompetencyMatch = async (payload: CompetencyMatchPayload) => {
    try {
        const response = await apiClient.post("/api/competency-match", payload);
        if (response.data.statusCode === 201 || response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch (err: any) {
        return "ERROR";
    }
};

// Returns the subjects matched to a given competency.
export const getMatchedSubjectsByCompetency = async (competency_code: string) => {
    try {
        const response = await apiClient.get(`/api/competency-match/competency/${competency_code}`);
        if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (err: any) {
        return [];
    }
};
