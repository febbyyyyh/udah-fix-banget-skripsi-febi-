import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
const logo = "/assets/logo.svg";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { to: "/", label: "Home" },
        { to: "/meditation", label: "Meditation" },
        { to: "/education", label: "Learn & Grow" },
        { to: "/dass/result", label: "Screening" },
    ];

    return (
        // Tambahkan relative dan z-[200] di tag nav agar posisinya selalu di atas halaman
        <nav className="w-full flex justify-center py-6 relative z-[200]">
            <div className="w-[90%] max-w-6xl bg-white rounded-full px-8 py-4 shadow-sm flex items-center justify-between relative z-[200]">

                {/* Logo */}
                <NavLink to="/" className="flex items-center active:scale-95 transition">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-10 h-10 scale-[2.8] origin-left cursor-pointer"
                    />
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 text-gray-600 text-[16px]">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `
                                relative 
                                transition-all duration-300 
                                hover:text-blue-900 
                                active:scale-90 
                                font-medium
                                ${isActive ? "text-blue-900" : ""}
                                `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {item.label}
                                    <span
                                        className={`
                                            absolute left-0 -bottom-1 h-0.5 bg-blue-900 
                                            transition-all duration-300 
                                            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                                        `}
                                    ></span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Burger */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {open && (
                // Tambahkan z-[200] di dropdown ini
                <div className="absolute top-[88px] w-[90%] max-w-6xl bg-white shadow-md rounded-xl py-6 px-6 md:hidden animate-slideDown z-[200]">
                    <div className="flex flex-col gap-6 text-gray-700 text-[16px]">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `
                                    transition-all duration-300 
                                    hover:text-blue-900 
                                    active:scale-95 
                                    font-medium
                                    ${isActive ? "text-blue-900" : ""}
                                    `
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