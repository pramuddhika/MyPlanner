import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

// Base API URL - Update this with your backend URL
const BASE_URL = 'http://localhost:8080';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Only show toast for mutation errors (POST, PUT, DELETE)
    const method = error.config?.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'DELETE'].includes(method)) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Standard API response interface
export interface ApiResponse<T = unknown> {
  status: string;
  code: number;
  message: string;
  data: T;
}

// API request wrapper
export const apiRequest = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.request<ApiResponse<T>>(config);
  return response.data;
};

// GET request
export const apiGet = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ ...config, method: 'GET', url });
};

// POST request with toast notification
export const apiPost = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiRequest<T>({ ...config, method: 'POST', url, data });
  
  // Show success toast for POST
  if (response.status === 'success') {
    toast.success(response.message);
  }
  
  return response;
};

// PUT request with toast notification
export const apiPut = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiRequest<T>({ ...config, method: 'PUT', url, data });
  
  // Show success toast for PUT
  if (response.status === 'success') {
    toast.success(response.message);
  }
  
  return response;
};

// DELETE request with toast notification
export const apiDelete = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiRequest<T>({ ...config, method: 'DELETE', url });
  
  // Show success toast for DELETE
  if (response.status === 'success') {
    toast.success(response.message);
  }
  
  return response;
};

export default axiosInstance;
