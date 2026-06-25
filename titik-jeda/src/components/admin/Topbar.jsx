import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // State untuk kontrol modal logout
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

  const confirmLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Header Utama Panel Admin */}
      <header className="h-16 bg-[#FFFFFF] border-b-2 border-[#F2F2F2] flex items-center justify-between px-6 text-[#292929]">
        <h1 className="text-xl font-extrabold tracking-tight">
          {getPageTitle()}
        </h1>

        {/* Tombol Logout Minimalis Modis */}
        <button
          className="text-xs text-red-500 font-black uppercase tracking-wider bg-red-50 hover:bg-red-100 transition px-4 py-2.5 rounded-xl cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </header>

      {/* ================= MODAL KONFIRMASI LOGOUT (SUDAH DI-AKALI TANPA IKON GAMBAR) ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#292929]/50 backdrop-blur-sm">
          {/* Card Modal dibalut border-2 #00BFFF */}
          <div className="bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-3xl p-8 max-w-sm w-full shadow-xl">
            <div className="text-center">

              {/* Diakali memakai bulatan karakter teks tanda seru (!) kustom penanda warning */}
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black select-none">
                !
              </div>

              <h3 className="text-xl font-extrabold tracking-tight text-[#292929] mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-[#292929]/60 text-sm font-normal leading-relaxed mb-8">
                Apakah Anda yakin ingin keluar dari panel admin? Anda harus
                login kembali untuk mengelola konten.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmLogout}
                  className="w-full bg-red-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition active:scale-95 cursor-pointer shadow-sm"
                >
                  Ya, Keluar Sekarang
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full bg-[#F2F2F2] text-[#292929]/60 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-80 transition cursor-pointer"
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