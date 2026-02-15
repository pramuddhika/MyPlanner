import api from './api';
import type { ApiResponse, Task, TaskCreate, TaskUpdate } from '@/types';

const taskService = {
    getTasks: (startDate?: string, endDate?: string) => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return api.get<ApiResponse<Task[]>>('/task/get', { params });
    },

    createTask: (payload: TaskCreate) =>
        api.post<ApiResponse<object>>('/task/create', payload),

    updateTask: (payload: TaskUpdate) =>
        api.put<ApiResponse<object>>('/task/update', payload),

    deleteTask: (taskId: number) =>
        api.delete<ApiResponse<object>>(`/task/delete/${taskId}`),
};

export default taskService;
