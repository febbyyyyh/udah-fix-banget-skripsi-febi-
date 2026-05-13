import { useState } from "react"; // Tambahkan useState
import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // 1. State untuk kontrol modal logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname === "/admin/kelola-meditasi") return "Kelola Meditasi";
    if (pathname.startsWith("/admin/kelola-meditasi/"))
      return "Kelola Konten Meditasi";
    if (pathname === "/admin/kelola-edukasi") return "Kelola Learn & Grow";
    if (pathname.startsWith("/admin/kelola-edukasi/"))
      return "Kelola Konten Learn & Grow";
    return "Admin";
  };

  // 2. Fungsi Logout yang sebenarnya
  const confirmLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <>
      <header className="h-16 bg-white shadow flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-[#0a1d48]">
          {getPageTitle()}
        </h1>

        {/* Tombol Logout memicu Modal */}
        <button
          className="text-sm text-red-500 font-medium hover:text-red-700 transition-colors bg-red-50 px-4 py-2 rounded-lg"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </header>

      {/* ================= MODAL KONFIRMASI LOGOUT ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
            <div className="text-center">
              {/* Icon Warning (Opsional) */}
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#0A1D48] mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                Apakah Anda yakin ingin keluar dari panel admin? Anda harus
                login kembali untuk mengelola konten.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmLogout}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                >
                  Ya, Keluar Sekarang
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
