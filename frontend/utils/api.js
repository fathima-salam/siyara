import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('siyara-auth');
        if (auth) {
            const { state } = JSON.parse(auth);
            if (state.userInfo?.token) {
                config.headers.Authorization = `Bearer ${state.userInfo.token}`;
            }
        }
    }
    return config;
});

export default api;
