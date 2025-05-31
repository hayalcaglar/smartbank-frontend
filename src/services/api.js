import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7116/api", // 👈 BACKEND URL’İN BURAYA
});

export default api;
