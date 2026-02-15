import api from './api';
import type { ApiResponse, Status } from '@/types';

const statusService = {
    getStatuses: () =>
        api.get<ApiResponse<Status[]>>('/status/all'),
};

export default statusService;
