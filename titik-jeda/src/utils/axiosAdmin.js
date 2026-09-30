import axios from "axios";

const axiosAdmin = axios.create({
    // Gunakan relative path '/api' agar otomatis mengikuti domain/IP tempat halaman dibuka
    baseURL: "/api",
    withCredentials: true
});

// Otomatis kirim token ke semua request admin
axiosAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosAdmin;
