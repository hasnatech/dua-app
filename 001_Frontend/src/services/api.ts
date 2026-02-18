import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8000/api',
    baseURL: 'https://dua.hasnatech.tech/api',
    // baseURL: import.meta.env.VITE_API_URL || '/api',
    // baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
