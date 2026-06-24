import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAdmin from "../../utils/axiosAdmin";
const logo = "/assets/logo.svg";

export default function LoginAdmin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isFormValid = email.trim() !== "" && password.trim() !== "";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axiosAdmin.post("/admin/login", {
                email,
                password,
            });
            localStorage.setItem("admin_token", response.data.token);
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Email atau password salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EAF3FF] font-poppins px-4">
            {/* Card Container */}
            <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl shadow-blue-900/5 p-8 md:p-12 transition-all">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                    {/* Ukuran div pembungkus dan margin-bottom (mb-1) diperkecil untuk merapatkan jarak */}
                    <div className="mb-1">
                        <img
                            src={logo}
                            alt="Logo Titik Jeda"
                            className="w-24 h-24 object-contain"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-[#0a1d48]">Welcome Back!</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Silakan masuk ke panel admin
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Error Message Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded-xl flex items-center gap-2 animate-shake">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm text-[#0a1d48]"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm text-[#0a1d48]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0a1d48] transition-colors"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`
                            w-full mt-4 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300
                            ${isFormValid && !loading
                                ? "bg-[#0a1d48] text-white shadow-lg shadow-blue-900/20 hover:translate-y-[-2px] active:scale-[0.98]"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            "Masuk ke Dashboard"
                        )}
                    </button>
                </form>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    &copy; 2025 Titik Jeda. All rights reserved.
                </p>
            </div>
        </div>
    );
}
