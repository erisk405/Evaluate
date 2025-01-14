import axios from "axios";

const apiClient = axios.create();

// Add an interceptor to include the token in headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Fetch token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config;
});

export default apiClient;
