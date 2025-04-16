import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
    baseURL: configuration.baseURL,
    withCredentials: true,
});

// Function to fetch CSRF token
const fetchCSRFToken = async () => {
    try {
        const response = await axios.get(`${configuration.baseURL}/csrf-token`, { withCredentials: true });
        API.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
    }
};

// Call fetchCSRFToken when setting up the API
fetchCSRFToken();


API.interceptors.request.use(
    async config => {
        if (!config.headers['X-CSRF-Token']) {
            const token = await fetchCSRFToken();
            if (token) {
                config.headers['X-CSRF-Token'] = token;
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

// API.defaults.retryCount = 0;
// const MAX_RETRIES = 3;

// Add response interceptor to handle CSRF token errors
API.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 403 && 
            error.response?.data?.message?.includes('Invalid CSRF token') && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            const token = await fetchCSRFToken();
            if (token) {
                originalRequest.headers['X-CSRF-Token'] = token;
                return API(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default API;