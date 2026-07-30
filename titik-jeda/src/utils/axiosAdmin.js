import axios from "axios";

const axiosAdmin = axios.create({
    // 💡 SUNTIKAN JALUR: Tembak langsung ke port backend Express di Docker
    baseURL: "http://localhost:5000/api", 
    withCredentials: true
});

// Otomatis kirim token ke semua request admin
axiosAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");

    // Pengaman: Hanya kirim jika token benar-benar ada (bukan null atau string "undefined")
    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // Hapus header jika kosong agar tidak mengacaukan backend
        delete config.headers.Authorization;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosAdmin;