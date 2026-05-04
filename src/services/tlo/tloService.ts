import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface TLoPayload {
    topic_code: string;
    tlo_content: string;
}

export interface Tlo {
    id: number;
    topic_code: string;
    tlo_code: string;
    language_code: string;
    tlo_content: string;
}

export const createTlo = async (tloPayload: TLoPayload) => {
    try {
        const response = await apiClient.post("/api/tlo/create", tloPayload);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        }
    } catch (err) {
        return "ERROR";
    }
}

export const getTloByTopicCode = async (tloCode: string) => {
    try {
        const response = await apiClient.get(`/api/tlo/${tloCode}?lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return response.data.tlos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (err) {
        return "ERROR";
    }
};