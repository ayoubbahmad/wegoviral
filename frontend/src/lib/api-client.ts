import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('creator_os_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('creator_os_token');
            window.location.href = '/login';
        }
        const message = error.response?.data?.error || error.response?.data?.message || 'API request failed';
        return Promise.reject(new Error(message));
    }
);

export default apiClient;

// Keep apiFetch for backward compatibility during transition if needed, 
// but it will now use axios under the hood.
export async function apiFetch(endpoint: string, options: any = {}) {
    const method = (options.method || 'GET').toLowerCase();
    const response = await (apiClient as any)[method](endpoint, options.body ? JSON.parse(options.body) : undefined);
    return response;
}
