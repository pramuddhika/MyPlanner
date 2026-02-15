import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    userId: number | null;
    email: string | null;
    name: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    userId: null,
    email: null,
    name: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                token: string;
                userId: number;
                email: string;
                name: string;
            }>
        ) => {
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.isAuthenticated = true;
        },
        updateName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.userId = null;
            state.email = null;
            state.name = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, updateName, logout } = authSlice.actions;
export default authSlice.reducer;
