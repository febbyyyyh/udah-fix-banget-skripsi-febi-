import { NavLink } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/logo.svg";
import dashboardIcon from "../../assets/icon-dashboard.svg";
import meditasiIcon from "../../assets/icon-meditasi.svg";
import edukasiIcon from "../../assets/icon-edukasi.svg";
import statistikIcon from "../../assets/icon-statistik.svg";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 py-3 bg-white shadow">
                <button
                    onClick={() => setOpen(true)}
                    className="text-[#0a1d48] text-2xl"
                >
                    ☰
                </button>
            </div>

            {/* OVERLAY */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed md:static top-0 left-0 z-50
                    w-64 min-h-screen bg-white font-poppins
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                {/* LOGO */}
                <div className="px-6 pt-8 pb-4">
                    <img
                        src={logo}
                        alt="Logo Admin"
                        className="w-26 object-contain"
                    />
                </div>

                {/* MENU */}
                <nav className="mt-2 flex flex-col gap-1">
                    <SidebarItem
                        to="/admin/dashboard"
                        label="Dashboard"
                        icon={dashboardIcon}
                        onClick={() => setOpen(false)}
                    />

                    <SidebarItem
                        to="/admin/kelola-meditasi"
                        label="Kelola Meditasi"
                        icon={meditasiIcon}
                        onClick={() => setOpen(false)}
                    />

                    <SidebarItem
                        to="/admin/kelola-edukasi"
                        label="Kelola Learn & Grow"
                        icon={edukasiIcon}
                        onClick={() => setOpen(false)}
                    />

                </nav>
            </aside>
        </>
    );
}

/* ======================
   Sidebar Item
====================== */
function SidebarItem({ to, label, icon, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `
                flex items-center gap-3 px-6 py-3 text-sm
                transition
                ${isActive
                    ? "bg-[#EAF3FF] text-[#0a1d48] font-medium border-r-4 border-[#0a1d48]"
                    : "text-gray-500 hover:bg-[#F4F8FF]"
                }
                `
            }
        >
            <img src={icon} alt={label} className="w-5 h-5" />
            <span>{label}</span>
        </NavLink>
    );
}
