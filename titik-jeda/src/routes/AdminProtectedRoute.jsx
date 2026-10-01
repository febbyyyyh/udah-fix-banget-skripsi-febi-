import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("admin_token");
    const [authState, setAuthState] = useState(() => token ? "checking" : "unauthorized");

    useEffect(() => {
        if (!token) {
            return;
        }

        let isMounted = true;
        axios.get("/api/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then(() => {
                if (isMounted) setAuthState("authorized");
            })
            .catch((error) => {
                console.error("Admin auth error:", error);
                localStorage.removeItem("admin_token");
                if (isMounted) setAuthState("unauthorized");
            });
        return () => {
            isMounted = false;
        };
    }, [token]);

    if (authState === "checking") {
        return (
            <p className="text-sm text-gray-500">
                Memeriksa akses admin...
            </p>
        );
    }

    // 🚫 Tidak diizinkan
    if (authState !== "authorized") {
        return <Navigate to="/admin/login" replace />;
    }

    // ✅ Diizinkan
    return children;
}
