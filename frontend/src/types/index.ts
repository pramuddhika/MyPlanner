// ============================================================
// API Response Wrapper (matches backend ApiResponse<T>)
// ============================================================
export interface ApiResponse<T> {
    status: 'success' | 'error';
    code: number;
    message: string;
    data: T;
}

// ============================================================
// Auth Types
// ============================================================
export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignUpPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    userId: number;
    email: string;
    name: string;
}

export interface UserProfile {
    name: string;
    email: string;
}

export interface ChangeNamePayload {
    name: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

// ============================================================
// Task Types
// ============================================================
export interface StatusInfo {
    statusId: number;
    statusName: string;
}

export interface CategoryInfo {
    categoryId: number;
    categoryName: string;
}

export interface Task {
    taskId: number;
    topic: string;
    description: string | null;
    status: StatusInfo;
    category: CategoryInfo | null;
    createTime: string;
    startTime: string | null;
    endTime: string | null;
    isRemainder: boolean | null;
    remainderTime: string | null;
    lastUpdateTime: string;
}

export interface TaskCreate {
    topic: string;
    description?: string;
    statusId: number;
    categoryId?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    isRemainder?: boolean;
    remainderTime?: string | null;
}

export interface TaskUpdate {
    taskId: number;
    topic: string;
    description?: string;
    statusId: number;
    categoryId?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    isRemainder?: boolean;
    remainderTime?: string | null;
}

// ============================================================
// Category Types
// ============================================================
export interface Category {
    categoryId: number;
    categoryName: string;
}

export interface CategoryCreate {
    categoryName: string;
}

// ============================================================
// Status Types
// ============================================================
export interface Status {
    statusId: number;
    statusName: string;
}
