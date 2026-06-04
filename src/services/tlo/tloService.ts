import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface TLoPayload {
    topic_code: string;
    tlo_content: string;
}

export interface UpdateTloPayload {
    tlo_code: string;
    tlo_content: string;
}

export interface Tlo {
    topic_code: string;
    tlo_code: string;
    tlo_content: string;
}

export const createTlo = async (tloPayload: TLoPayload) => {
    try {
        const response = await apiClient.post("/api/tlo/create", tloPayload);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch (err) {
        return "ERROR";
    }
};

// Always returns an array (empty when the topic has no TLOs yet).
export const getTloByTopicCode = async (topicCode: string): Promise<Tlo[]> => {
    try {
        const response = await apiClient.get(`/api/tlo/topic/${topicCode}?lang=${lang_code}`);

        if (response.data.statusCode === 200 && Array.isArray(response.data.tlos)) {
            return response.data.tlos;
        }
        return [];
    } catch (err) {
        return [];
    }
};

export const updateTlo = async (payload: UpdateTloPayload) => {
    try {
        const response = await apiClient.patch("/api/tlo/update", payload);

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch (err) {
        return "ERROR";
    }
};

export const deleteTlo = async (tloCode: string) => {
    try {
        const response = await apiClient.delete(`/api/tlo/${tloCode}`);

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch (err) {
        return "ERROR";
    }
};
