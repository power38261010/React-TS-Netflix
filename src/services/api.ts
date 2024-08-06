import axios, { InternalAxiosRequestConfig } from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL ?? 'https://localhost:7054/api';


const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: any) => {

  return Promise.reject(error);
});

export default api;

