import apiClient from "../../util/apiClient";

export interface MatchPayload {
    subject_code: string;
    plo_code: string;
}

export const createMatch = async (payload: MatchPayload) => {
    try {
        const response = await apiClient.post("/api/match", payload);

        if (response.data.statusCode === 201 || response.data.statusCode === 200) {
            return "SUCCESS";
        } else {
            return "ERROR";
        }
    } catch (err: any) {
        return "ERROR";
    }
}

export const getMatchedPlosBySubject = async (subject_code: string) => {
    try {
        const response = await apiClient.get(`/api/match/subject/${subject_code}`);

        if (response.data.statusCode === 200) {
            // returns an array of matched PLOs
            return response.data.data; 
        } else {
            return [];
        }
    } catch (err: any) {
        return [];
    }
}