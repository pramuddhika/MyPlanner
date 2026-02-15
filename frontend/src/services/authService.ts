import api from './api';
import type {
    ApiResponse,
    AuthResponse,
    LoginPayload,
    SignUpPayload,
    UserProfile,
    ChangeNamePayload,
    ChangePasswordPayload,
} from '@/types';

const authService = {
    login: (payload: LoginPayload) =>
        api.post<ApiResponse<AuthResponse>>('/user/login', payload),

    register: (payload: SignUpPayload) =>
        api.post<ApiResponse<object>>('/user/register', payload),

    getProfile: () =>
        api.get<ApiResponse<UserProfile>>('/user/profile'),

    changeName: (payload: ChangeNamePayload) =>
        api.put<ApiResponse<object>>('/user/change-name', payload),

    changePassword: (payload: ChangePasswordPayload) =>
        api.put<ApiResponse<object>>('/user/change-password', payload),

    logout: () =>
        api.post<ApiResponse<object>>('/user/logout'),
};

export default authService;
