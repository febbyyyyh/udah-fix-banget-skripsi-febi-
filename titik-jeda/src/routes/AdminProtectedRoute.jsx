import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        // ❌ Tidak ada token → langsung tolak
        if (!token) {
            setLoading(false);
            return;
        }

        // ✅ Validasi token ke backend
        const verifyAdmin = async () => {
            try {
                await axios.get("http://localhost:5000/api/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setIsAuthorized(true);
            } catch (error) {
                console.error("Admin auth error:", error);
                localStorage.removeItem("admin_token"); // token invalid
            } finally {
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    // ⏳ Loading
    if (loading) {
        return (
            <p className="text-sm text-gray-500">
                Memeriksa akses admin...
            </p>
        );
    }

    // 🚫 Tidak diizinkan
    if (!isAuthorized) {
        return <Navigate to="/admin/login" replace />;
    }

    // ✅ Diizinkan
    return children;
}
