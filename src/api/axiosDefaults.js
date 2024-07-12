import axios from "axios";

/**
 * Sets up Axios defaults for requests and responses.
 * 
 * - Sets base URL to the Task Pilot API.
 * - Configures headers for POST requests to handle multipart/form-data.
 * - Enables sending cookies with requests.
 */

axios.defaults.baseURL = 'https://task-pilot-api-323c9bc2bc87.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;

/**
 * Instance of Axios for making requests.
 * 
 * This instance can be used for making requests to the API.
 */

export const axiosReq = axios.create();
/**
 * Instance of Axios for handling responses.
 * 
 * This instance can be used for handling responses from the API.
 */
export const axiosRes = axios.create();
