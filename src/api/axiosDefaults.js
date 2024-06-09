import axios from "axios";

axios.defaults.baseURL = 'https://task-pilot-api-323c9bc2bc87.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
