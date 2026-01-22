import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ✅ REQUEST INTERCEPTOR (DEV ONLY) */
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(
        "API Request:",
        config.method?.toUpperCase(),
        config.baseURL + config.url
      );
      return config;
    },
    (error) => Promise.reject(error)
  );
}

/* ✅ RESPONSE INTERCEPTOR (SAFE FOR PROD) */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default api;
