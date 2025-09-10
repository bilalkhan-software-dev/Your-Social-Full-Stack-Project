export const APP_BASE_URL = "http://localhost:8081/api/v1";
import axios from 'axios';
// import { useNavigate } from 'react-router';

export const api = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log("Removing jwt because 401 error occurs api.js line#25");
      localStorage.removeItem('jwt');
      window.location.href = '/';
      // useNavigate('/')
    }
    return Promise.reject(error);
  }
);
