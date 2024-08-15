import axios from "axios";

// Base URL and default headers
axios.defaults.baseURL = 'https://task-pilot-api-323c9bc2bc87.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

// Create Axios instances for requests and responses
export const axiosReq = axios.create();
export const axiosRes = axios.create();

/**
 * Refreshes the access token using the refresh token stored in localStorage.
 * @returns {Promise<string>} A promise that resolves with the new access token.
 * @throws Will throw an error if no refresh token is found or if the refresh request fails.
 */
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      //Do nothing 
    }
    const response = await axios.post('/dj-rest-auth/token/refresh/', {
      refresh, // Send the refresh token to get a new access token
    });
    const newToken = response.data.access;
    localStorage.setItem('accessToken', newToken);
    return newToken;
  } catch (err) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw err;
  }
};

// Request interceptor to add token
axios.interceptors.request.use(
  /**
   * Adds the access token to the request headers if it exists.
   * @param {Object} config The Axios request configuration.
   * @returns {Object} The updated Axios request configuration.
   */
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
  /**
   * Passes the response through if successful.
   * @param {Object} response The Axios response object.
   * @returns {Object} The Axios response object.
   */
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem('refreshToken');

    // Only attempt to refresh token if a refresh token exists and the error is 401
    if (refresh && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
