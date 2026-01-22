import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // future-proof (cookies, auth)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
