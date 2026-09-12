import axios from "axios";
import store from "./store";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5001",

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const user = store.getState().auth.user;

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request");

      // Don't manipulate localStorage directly here.
      // Redux should be the source of truth.
      store.dispatch({
        type: "auth/clearUser",
      });
    }

    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default API;