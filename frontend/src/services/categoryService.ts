import api from './api';
import type { ApiResponse, Category, CategoryCreate } from '@/types';

const categoryService = {
    getCategories: () =>
        api.get<ApiResponse<Category[]>>('/category/all'),

    createCategory: (payload: CategoryCreate) =>
        api.post<ApiResponse<object>>('/category/create', payload),

    deleteCategory: (categoryId: number) =>
        api.delete<ApiResponse<object>>(`/category/delete/${categoryId}`),
};

export default categoryService;
