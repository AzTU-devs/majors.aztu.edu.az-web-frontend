import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface TopicPayload {
    subject_code: string;
    topic_name: string;
    topic_desc: string;
    topic_result: string;
    topic_url: string;
    topic_type: number;
}

export interface Topic {
    topic_code: string;
    topic_name: string;
    topic_url: string;
    topic_type: number;
    topic_result: string;
    topic_desc: string;
    created_at: string;
}

export interface UpdateTopicPayload {
    topic_code: string;
    topic_name?: string;
    topic_desc?: string;
    topic_result?: string;
    topic_url?: string;
    topic_type?: number;
}

export const updateTopic = async (payload: UpdateTopicPayload, token: string) => {
    try {
        const response = await apiClient.patch("/api/topic/update", payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return "NOT_FOUND";
        }
        return "ERROR";
    }
}

export const addTopic = async (topicPayload: TopicPayload, token: string) => {
    try {
        const response = await apiClient.post("/api/topic/create", topicPayload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        }
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return "NOT_FOUND";
        }
        return "ERROR";
    }
}

export const deleteTopic = async (topicCode: string) => {
    try {
        const response = await apiClient.delete(`/api/topic/${encodeURIComponent(topicCode)}`);
        if (response.data.statusCode === 200) return "SUCCESS";
        if (response.data.statusCode === 404) return "NOT_FOUND";
        return "ERROR";
    } catch (error: any) {
        if (error?.response?.status === 404) return "NOT_FOUND";
        return "ERROR";
    }
};

export const getTopics = async (subjectCode: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/topic/${encodeURIComponent(subjectCode)}?start=${start}&end=${end}&lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return {
                topics: response.data.topics,
                total: response.data.total
            };
        }

        if (response.status === 204) {
            return {
                topics: [],
                total: 0
            };
        }

    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                return "NOT_FOUND";
            }
            if (error.response.status === 204) {
                return {
                    topics: [],
                    total: 0
                };
            }
        }
        return "ERROR";
    }
};