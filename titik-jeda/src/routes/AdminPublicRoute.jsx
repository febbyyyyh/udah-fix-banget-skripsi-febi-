import { Navigate } from "react-router-dom";

export default function AdminPublicRoute({ children }) {
    const token = localStorage.getItem("admin_token");

    // kalau SUDAH login → langsung ke dashboard
    if (token) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // kalau BELUM login → boleh akses halaman (login)
    return children;
}
