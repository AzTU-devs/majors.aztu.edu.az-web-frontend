import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    name: string | null;
    surname: string | null;
    father_name: string | null;
    fin_kod: string | null;
    role: number | null;
    token: string | null;
    email: string | null;
    approved: boolean | null;
    cafedra_code: string | null;
    created_at: string | null;
}

const initialState: AuthState = {
    name: null,
    surname: null,
    father_name: null,
    fin_kod: null,
    role: null,
    token: null,
    email: null,
    approved: null,
    cafedra_code: null,
    created_at: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (
            state: AuthState,
            action: PayloadAction<{
                token: string;
                user: {
                    name: string,
                    surname: string,
                    father_name: string,
                    fin_kod: string,
                    role: number;
                    email: string;
                    approved: boolean;
                    cafedra_code: string | null;
                    created_at: string
                };
            }>
        ) => {
            state.name = action.payload.user.name;
            state.surname = action.payload.user.surname;
            state.father_name = action.payload.user.father_name;
            state.fin_kod = action.payload.user.fin_kod;
            state.role = action.payload.user.role;
            state.token = action.payload.token;
            state.email = action.payload.user.email;
            state.approved = action.payload.user.approved;
            state.cafedra_code = action.payload.user.cafedra_code;
            state.created_at = action.payload.user.created_at;
        },
        logout: () => initialState,
        clearLoginSteps: (state: AuthState) => {
            state.name = null;
            state.surname = null;
            state.father_name = null;
            state.fin_kod = null;
            state.role = null;
            state.token = null;
            state.email = null;
            state.approved = null;
            state.cafedra_code = null;
            state.created_at = null;
        },
    },
});

export const {
    loginSuccess,
    clearLoginSteps,
    logout
} = authSlice.actions;
export default authSlice.reducer;