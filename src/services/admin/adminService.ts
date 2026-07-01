import apiClient from "../../util/apiClient";

export interface ManagedAdmin {
    fin_kod: string;
    name: string;
    surname: string;
    email: string;
    role: number;
    approved: boolean;
    created_at: string | null;
}

export interface CreateAdminPayload {
    name: string;
    surname: string;
    email: string;
    fin_kod: string;
    password: string;
}

export interface UpdateAdminPayload {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    approved?: boolean;
}

// Result for create, surfacing backend message on conflict/validation.
export interface CreateAdminResult {
    status: "SUCCESS" | "CONFLICT" | "VALIDATION" | "ERROR";
    message?: string;
}

// Result for delete, surfacing backend message on the self-delete guard.
export interface DeleteAdminResult {
    status: "SUCCESS" | "FORBIDDEN" | "ERROR";
    message?: string;
}

// List all admin profiles.
export const getAdmins = async (): Promise<ManagedAdmin[]> => {
    try {
        const response = await apiClient.get("/api/admins");
        if (response.data.statusCode === 200 && Array.isArray(response.data.admins)) {
            return response.data.admins;
        }
        return [];
    } catch {
        return [];
    }
};

// Create a new admin profile. Surfaces backend message on conflict/weak password.
export const createAdmin = async (
    payload: CreateAdminPayload
): Promise<CreateAdminResult> => {
    try {
        const response = await apiClient.post("/api/admins", payload);
        if (response.data.statusCode === 201) {
            return { status: "SUCCESS" };
        }
        if (response.data.statusCode === 409) {
            return { status: "CONFLICT", message: response.data.message };
        }
        return { status: "ERROR", message: response.data.message };
    } catch (err: any) {
        const httpStatus = err?.response?.status;
        const message = err?.response?.data?.message;
        if (httpStatus === 409) {
            return { status: "CONFLICT", message };
        }
        if (httpStatus === 400) {
            return { status: "VALIDATION", message };
        }
        return { status: "ERROR", message };
    }
};

// Update an admin profile. Only provided fields are changed.
export const updateAdmin = async (
    fin_kod: string,
    payload: UpdateAdminPayload
) => {
    try {
        const response = await apiClient.put(`/api/admins/${fin_kod}`, payload);
        if (response.data.statusCode === 200) {
            return "SUCCESS";
        }
        return "ERROR";
    } catch {
        return "ERROR";
    }
};

// Delete an admin profile. Surfaces backend message when deleting own account.
export const deleteAdmin = async (
    fin_kod: string
): Promise<DeleteAdminResult> => {
    try {
        const response = await apiClient.delete(`/api/admins/${fin_kod}`);
        if (response.data.statusCode === 200) {
            return { status: "SUCCESS" };
        }
        return { status: "ERROR", message: response.data.message };
    } catch (err: any) {
        const httpStatus = err?.response?.status;
        const message = err?.response?.data?.message;
        if (httpStatus === 400) {
            return { status: "FORBIDDEN", message };
        }
        return { status: "ERROR", message };
    }
};
