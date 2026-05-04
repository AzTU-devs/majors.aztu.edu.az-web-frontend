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

export const getTopics = async (subjectCode: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/topic/${subjectCode}?start=${start}&end=${end}&lang=${lang_code}`);

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