import axios from 'axios';

// 1. Create an instance with our backend's core URL location
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Attach an interceptor to inject the security token automatically before the request leaves
API.interceptors.request.use(
    (config) => {
        // Look up the saved token inside the browser's localStorage
        const token = localStorage.getItem('nexus_token');
        
        if (token) {
            // Securely stamp it into the Authorization header just like we did manually in Postman
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;