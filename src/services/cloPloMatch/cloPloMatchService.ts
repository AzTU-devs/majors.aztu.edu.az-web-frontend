import apiClient from "../../util/apiClient";

export interface CloPloMatchPayload {
    clo_code: string;
    plo_code: string;
    match: boolean;
}

// Toggle a CLO ↔ PLO match on or off.
export const createCloPloMatch = async (payload: CloPloMatchPayload) => {
    try {
        const response = await apiClient.post("/api/clo-plo-match", payload);

        if (response.data.statusCode === 201 || response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};

// Return every CLO→PLO match for the CLOs that belong to a subject.
export const getCloPloMatchesBySubject = async (subject_code: string) => {
    try {
        const response = await apiClient.get(`/api/clo-plo-match/subject/${subject_code}`);

        if (response.data.statusCode === 200) {
            return response.data.data as { clo_code: string; plo_code: string }[];
        }
        return [];
    } catch {
        return [];
    }
};
