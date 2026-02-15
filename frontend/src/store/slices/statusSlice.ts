import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Status } from '@/types';
import statusService from '@/services/statusService';

interface StatusState {
    statuses: Status[];
    loading: boolean;
}

const initialState: StatusState = {
    statuses: [],
    loading: false,
};

export const fetchStatuses = createAsyncThunk(
    'statuses/fetchStatuses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await statusService.getStatuses();
            return response.data.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch statuses');
        }
    }
);

const statusSlice = createSlice({
    name: 'statuses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatuses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.statuses = action.payload;
            })
            .addCase(fetchStatuses.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default statusSlice.reducer;
