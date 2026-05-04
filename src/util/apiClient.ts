import axios from 'axios';
import { RootState, store } from "../redux/store";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = (store.getState() as RootState).auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; 