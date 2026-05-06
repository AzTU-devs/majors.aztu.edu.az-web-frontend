import axios from 'axios';
import { RootState, store } from "../redux/store";
import { logout } from "../redux/slice/authSlice";

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
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const hasToken = (store.getState() as RootState).auth.token;
      if (hasToken) {
        store.dispatch(logout());
      }
      if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
        window.location.assign("/signin");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
