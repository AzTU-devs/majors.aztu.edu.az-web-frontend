import apiClient from "../../util/apiClient";

export interface Credentials {
    fin_kod: string;
    password: string;
}

export interface SignUpCredentials {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    email: string;
    password: string;
    cafedra_code: string;
}

// sign in with fin kod and password

export const signin = async (credentials: Credentials) => {
    try {
        const resposne = await apiClient.post("/auth/signin", credentials);

        if (resposne.data.statusCode === 200) {
            return {
                "token": resposne.data.token,
                "user": resposne.data.user
            };
        } else if (resposne.data.statusCode === 403 || resposne.data.message === "NOT_APPROVED") {
            return "NOT_APPROVED";
        } else if (resposne.data.statusCode === 401) {
            return "UNAUTHORIZED";
        } else {
            return "UNAUTHORIZED";
        }
    } catch (err: any) {
        // The backend returns 403 (non-2xx) for accounts pending approval.
        if (err?.response?.status === 403 || err?.response?.data?.message === "NOT_APPROVED") {
            return "NOT_APPROVED";
        }
        if (err?.response?.status === 401) {
            return "UNAUTHORIZED";
        }
        return "error";
    };
};

// signup with form data

export interface SignUpResult {
    status: "SUCCESS" | "CONFLICT" | "VALIDATION" | "ERROR";
    message?: string;
}

export const signup = async (
    signUpCredentials: SignUpCredentials
): Promise<SignUpResult> => {
    try {
        const response = await apiClient.post("/auth/signup", signUpCredentials);

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
