import axios from "axios";

// Base URL and default headers
axios.defaults.baseURL = 'https://task-pilot-api-323c9bc2bc87.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

// Create Axios instances for requests and responses
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Function to refresh token
const refreshToken = async () => {
  try {
    const response = await axios.post('/dj-rest-auth/token/refresh/');
    const newToken = response.data.access; // Adjust key as necessary
    localStorage.setItem('accessToken', newToken);
    return newToken;
  } catch (err) {
    localStorage.removeItem('accessToken');
    // Optionally redirect to sign-in or handle error
    throw err;
  }
};

// Request interceptor to add token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (err) {
        // Handle token refresh error, e.g., redirect to login page
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
