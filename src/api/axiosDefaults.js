import axios from "axios";

axios.defaults.baseURL = 'https://task-pilot-e84398da7501.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;