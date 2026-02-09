import axios from "axios";

const axiosAdmin = axios.create({
    baseURL: "http://localhost:5000/api",
});

// otomatis kirim token ke semua request admin
axiosAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosAdmin;
