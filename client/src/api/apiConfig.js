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

// Add response interceptor to handle CSRF token errors
API.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 403 && error.response?.data?.message?.includes('Invalid CSRF token')) {
            // If CSRF token is invalid, fetch new token and retry request
            await fetchCSRFToken();
            return API(error.config);
        }
        return Promise.reject(error);
    }
);

export default API;