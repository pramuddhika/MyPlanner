import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { setCredentials, updateName, logout } from '@/store/slices/authSlice';
import { resetUI } from '@/store/slices/uiSlice';
import { clearTasks } from '@/store/slices/taskSlice';
import authService from '@/services/authService';
import type { LoginPayload, SignUpPayload } from '@/types';
import toast from 'react-hot-toast';

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    const login = async (payload: LoginPayload) => {
        const response = await authService.login(payload);
        const { token, userId, email, name } = response.data.data;
        dispatch(setCredentials({ token, userId, email, name }));
        return response.data;
    };

    const register = async (payload: SignUpPayload) => {
        const response = await authService.register(payload);
        return response.data;
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Logout even if API call fails  
        }
        dispatch(logout());
        dispatch(resetUI());
        dispatch(clearTasks());
        toast.success('Logged out successfully');
    };

    const changeName = async (name: string) => {
        const response = await authService.changeName({ name });
        dispatch(updateName(name));
        return response.data;
    };

    return {
        ...auth,
        login,
        register,
        logout: handleLogout,
        changeName,
    };
}
