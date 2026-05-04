import apiClient from "../../util/apiClient";

const lang_code = "az";

export interface Specialty {
    cafedra_name: string;
    specialty_name: string;
    specialty_code: string;
}

export interface SpecialtyPayload {
    cafedra_code: string;
    specialty_name: string;
    specialty_code: string;
}

export const addSpecialty = async (specialty: SpecialtyPayload, token: string) => {
    try {
        const response = await apiClient.post("/api/specialty", specialty, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        } else {
            return "ERROR";
        }
    } catch (error: any) {
        if (error.response?.status === 409) {
            return "CONFLICT";
        }
        return "ERROR";
    }
};

export const getSpecialtiesByCafedra = async (cafedraCode: string, token: string, start: number, end: number) => {
    try {
        const response = await apiClient.get(`/api/specialties/${cafedraCode}?lang=${lang_code}&start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "specialties": response.data.specialties,
                "total_specialties": response.data.total
            };
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

export const getAllSpecialties = async (token: string) => {
    try {
        const response = await apiClient.get(`/api/specialties?lang=${lang_code}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.statusCode === 200) {
            return response.data.specialties;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
};