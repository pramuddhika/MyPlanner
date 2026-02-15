import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Task } from '@/types';
import taskService from '@/services/taskService';

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (
        { startDate, endDate }: { startDate?: string; endDate?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await taskService.getTasks(startDate, endDate);
            return response.data.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (payload: Parameters<typeof taskService.createTask>[0], { rejectWithValue }) => {
        try {
            await taskService.createTask(payload);
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (payload: Parameters<typeof taskService.updateTask>[0], { rejectWithValue }) => {
        try {
            await taskService.updateTask(payload);
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId: number, { rejectWithValue }) => {
        try {
            await taskService.deleteTask(taskId);
            return taskId;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTasks: (state) => {
            state.tasks = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete task (optimistic removal)
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((t) => t.taskId !== action.payload);
            });
    },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
