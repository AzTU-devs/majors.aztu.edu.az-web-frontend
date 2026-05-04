import apiClient from "../../util/apiClient";

export interface Faculty {
    id: number;
    faculty_name: string;
    faculty_code: string;
    cafedra_count: number;
    created_at: string;
}

export const getFaculties = async (token: string | null) => {
    const response = await apiClient.get("/api/faculties", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response);
    if (response.data.status === 200) {
        return response.data.faculties;
    }
}