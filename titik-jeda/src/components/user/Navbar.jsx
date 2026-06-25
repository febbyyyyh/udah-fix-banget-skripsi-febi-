import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { to: "/", label: "Home" },
        { to: "/meditation", label: "Meditation" },
        { to: "/education", label: "Learn & Grow" },
        { to: "/dass", label: "Screening" },
    ];

    return (
        // Tetap menggunakan absolute agar ikut ter-scroll ke atas bersama halaman
        <nav className="w-full flex justify-center pt-6 absolute top-0 left-0 right-0 z-[500] px-4">
            {/* KONTEN UTAMA NAVBAR: Border biru luar dihapus total, digantikan shadow-md agar kontras dengan bg putih */}
            <div className="w-full max-w-6xl bg-[#FFFFFF] rounded-full pl-3 pr-6 md:pr-8 py-3 shadow-md flex items-center justify-between">

                {/* Brand Logo Terintegrasi (Nge-pas mengikuti bentuk tinggi navbar) */}
                <NavLink to="/" className="flex items-center active:scale-95 transition h-11 bg-[#00BFFF] rounded-full pr-5 overflow-hidden shadow-sm">
                    {/* Sisi Kiri: Setengah lingkaran ikon Jeda warna hijau cerah */}
                    <div className="h-full aspect-square bg-[#ADFF2F] rounded-full flex items-center justify-center mr-3">
                        <span className="font-extrabold text-[#292929] text-base select-none">II</span>
                    </div>
                    {/* Sisi Kanan: Teks Titik Jeda berlatar biru */}
                    <span className="text-[#FFFFFF] text-sm font-black tracking-wide">
                        Titik Jeda
                    </span>
                </NavLink>

                {/* Desktop Navigation Link */}
                <div className="hidden md:flex items-center gap-10 text-[#292929] text-[15px]">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative transition-all duration-300 hover:text-[#00BFFF] font-bold active:scale-90 ${isActive ? "text-[#00BFFF]" : "text-[#292929]"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {item.label}
                                    <span
                                        className={`absolute left-0 -bottom-1 h-0.5 bg-[#00BFFF] transition-all duration-300 ${isActive ? "w-full" : "w-0"
                                            }`}
                                    ></span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Burger Menu */}
                <button
                    className="md:hidden text-[#292929] p-2 hover:bg-[#F2F2F2] rounded-full transition"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu (Mengikuti visual tanpa border) */}
            {open && (
                <div className="absolute top-[84px] w-[90%] max-w-6xl bg-[#FFFFFF] shadow-xl rounded-2xl py-5 px-6 md:hidden">
                    <div className="flex flex-col gap-4 text-[#292929] text-[16px]">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-xl font-bold transition-all ${isActive
                                        ? "bg-[#00BFFF] text-[#FFFFFF]"
                                        : "hover:bg-[#F2F2F2] text-[#292929]"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}