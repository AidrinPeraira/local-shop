import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
    baseURL: configuration.baseURL,
    withCredentials: true,
});

// Function to fetch CSRF token
const fetchCSRFToken = async () => {
    try {
        const response = await API.get('/csrf-token');
        API.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

// Call fetchCSRFToken when setting up the API
fetchCSRFToken();

API.defaults.retryCount = 0;
const MAX_RETRIES = 3;

// Add response interceptor to handle CSRF token errors
API.interceptors.response.use(
    response => {
        // Reset retry count on successful response
        API.defaults.retryCount = 0;
        return response;
    },
    async error => {
        if (error.response?.status === 403 && 
            error.response?.data?.message?.includes('Invalid CSRF token') && 
            API.defaults.retryCount < MAX_RETRIES) {
            
            API.defaults.retryCount++;
            await fetchCSRFToken();
            return API(error.config);
        }
        // Reset retry count and reject the promise
        API.defaults.retryCount = 0;
        return Promise.reject(error);
    }
);

export default API;