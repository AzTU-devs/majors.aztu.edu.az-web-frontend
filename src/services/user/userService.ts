import apiClient from "../../util/apiClient";

export interface ManagedUser {
    fin_kod: string;
    name: string;
    surname: string;
    father_name: string;
    email: string;
    cafedra_code: string | null;
    role: number;
    approved: boolean;
    created_at: string | null;
}

// List users. Pass approved=false to get pending sign-ups awaiting approval.
export const getUsers = async (approved?: boolean): Promise<ManagedUser[]> => {
    try {
        const query = approved === undefined ? "" : `?approved=${approved}`;
        const response = await apiClient.get(`/api/users${query}`);
        if (response.data.statusCode === 200 && Array.isArray(response.data.users)) {
            return response.data.users;
        }
        return [];
    } catch {
        return [];
    }
};

// Approve (or revoke approval for) a user.
export const setUserApproval = async (fin_kod: string, approved: boolean) => {
    try {
        const response = await apiClient.post("/api/users/approve", { fin_kod, approved });
        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};

// Reject a pending sign-up (removes the user and auth records).
export const rejectUser = async (fin_kod: string) => {
    try {
        const response = await apiClient.delete(`/api/users/${fin_kod}`);
        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};
