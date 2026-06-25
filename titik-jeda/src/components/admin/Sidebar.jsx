import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 py-3 bg-[#FFFFFF] border-b-2 border-[#F2F2F2]">
                <button
                    onClick={() => setOpen(true)}
                    className="text-[#292929] text-2xl cursor-pointer"
                >
                    ☰
                </button>
            </div>

            {/* OVERLAY */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-[#292929]/40 z-40 md:hidden backdrop-blur-sm"
                />
            )}

            {/* SIDEBAR CONTAINER */}
            <aside
                className={`
                    fixed md:relative top-0 left-0 z-50
                    w-64 h-full bg-[#FFFFFF] border-r-2 border-[#F2F2F2] text-[#292929]
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 flex flex-col shrink-0
                `}
            >
                {/* LOGO AREA - Menggunakan 'w-fit' agar background biru pas mengikuti panjang teks */}
                <div className="px-6 pt-10 pb-6 flex flex-col items-start">
                    <div className="w-fit flex items-center rounded-full bg-[#00BFFF] p-1 shadow-sm select-none pr-4">
                        <div className="w-8 h-8 rounded-full bg-[#ADFF2F] flex items-center justify-center font-black text-xs text-[#292929]">
                            ||
                        </div>
                        <span className="pl-2.5 font-black text-xs text-[#FFFFFF] tracking-wider uppercase whitespace-nowrap">
                            Titik Jeda
                        </span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#292929]/30 mt-2.5 ml-2">
                        Admin Panel
                    </p>
                </div>

                {/* MENU NAVIGATION */}
                <nav className="mt-4 flex flex-col gap-1">
                    <SidebarItem
                        to="/admin/dashboard"
                        label="Dashboard"
                        activeSymbol="◆"
                        inactiveSymbol="◇"
                        onClick={() => setOpen(false)}
                    />

                    <SidebarItem
                        to="/admin/kelola-meditasi"
                        label="Kelola Meditasi"
                        activeSymbol="◆"
                        inactiveSymbol="◇"
                        onClick={() => setOpen(false)}
                    />

                    <SidebarItem
                        to="/admin/kelola-edukasi"
                        label="Kelola Learn & Grow"
                        activeSymbol="◆"
                        inactiveSymbol="◇"
                        onClick={() => setOpen(false)}
                    />
                </nav>
            </aside>
        </>
    );
}

/* ====================================
    SUB-COMPONENT SIDEBAR ITEM KUSTOM
   ==================================== */
function SidebarItem({ to, label, activeSymbol, inactiveSymbol, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `
                flex items-center gap-3 px-6 py-3.5 text-sm transition-all duration-200
                ${isActive
                    ? "bg-[#F2F2F2] text-[#00BFFF] font-black border-r-4 border-[#00BFFF]"
                    : "text-[#292929]/60 font-bold hover:bg-[#F2F2F2]/50 hover:text-[#292929]"
                }
            `}
        >
            {({ isActive }) => (
                <>
                    <span className={`text-base transition-colors ${isActive ? "text-[#00BFFF]" : "text-[#292929]/20"}`}>
                        {isActive ? activeSymbol : inactiveSymbol}
                    </span>
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
}