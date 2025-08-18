import axios from "axios";

// Base URL comes from env
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: false, // if you’re using cookies
});
console.log(import.meta.env.BACKEND_URL);

// Add interceptor for errors/logging if needed
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
