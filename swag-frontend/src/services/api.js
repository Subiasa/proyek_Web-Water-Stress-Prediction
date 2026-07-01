import axios from 'axios';

// Membuat instance axios dengan Base URL dari file .env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Interceptor Request: Otomatis menyelipkan Token jika user sudah login
api.interceptors.request.use(
    (config) => {
        // Asumsi token disimpan di localStorage saat login berhasil
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

// Interceptor Response: Menangkap error 401 (Token kadaluarsa / belum login)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Jika ditolak oleh Sanctum, hapus token dan tendang ke halaman login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;