import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const getPageTitle = () => {
        if (pathname === "/admin/dashboard") {
            return "Dashboard";
        }

        if (pathname === "/admin/kelola-meditasi") {
            return "Kelola Meditasi";
        }

        if (pathname.startsWith("/admin/kelola-meditasi/")) {
            return "Kelola Konten Meditasi";
        }

        if (pathname === "/admin/kelola-edukasi") {
            return "Kelola Learn & Grow";
        }

        if (pathname.startsWith("/admin/kelola-edukasi/")) {
            return "Kelola Konten Learn & Grow";
        }

        return "Admin";
    };

    const handleLogout = () => {
        // 🔐 hapus JWT admin
        localStorage.removeItem("admin_token");

        // ➜ redirect ke login
        navigate("/admin/login");
    };

    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-[#0a1d48]">
                {getPageTitle()}
            </h1>

            <button
                className="text-sm text-red-500 hover:underline"
                onClick={handleLogout}
            >
                Logout
            </button>
        </header>
    );
}
