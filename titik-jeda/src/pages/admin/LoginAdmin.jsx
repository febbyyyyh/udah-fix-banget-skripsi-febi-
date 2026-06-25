import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAdmin from "../../utils/axiosAdmin";

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
        // Latar belakang diubah menjadi putih bersih sesuai prinsip desain baru
        <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] px-4 text-[#292929]">
            {/* Card Container dibalut border-2 #00BFFF */}
            <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-[2.5rem] p-8 md:p-12 shadow-sm">

                {/* Header Section dengan Logo Teks Kustom User */}
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-4">
                        <div className="flex items-center rounded-full bg-[#00BFFF] p-1 shadow-sm select-none">
                            <div className="w-10 h-10 rounded-full bg-[#ADFF2F] flex items-center justify-center font-black text-sm text-[#292929]">
                                ||
                            </div>
                            <span className="px-4 font-black text-sm text-[#FFFFFF] tracking-wider uppercase">
                                Titik Jeda
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-extrabold tracking-tight">Welcome Back!</h1>
                    <p className="text-[#292929]/50 text-sm mt-1 font-medium">
                        Silakan masuk ke panel admin
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Error Message Alert */}
                    {error && (
                        <div className="bg-[#FFFFFF] border-2 border-red-200 text-red-600 text-xs font-bold py-3.5 px-4 rounded-xl flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-[#292929]/50 ml-1 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-xl bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] outline-none transition-all text-sm font-medium"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-[#292929]/50 ml-1 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] outline-none transition-all text-sm font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#292929]/40 hover:text-[#00BFFF] transition-colors"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full mt-4 py-4 rounded-xl text-sm font-black transition-all active:scale-95 shadow-sm
                            ${isFormValid && !loading
                                ? "bg-[#00BFFF] text-[#FFFFFF] hover:opacity-90"
                                : "bg-[#F2F2F2] text-[#292929]/30 cursor-not-allowed"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            "Masuk ke Dashboard"
                        )}
                    </button>
                </form>

                {/* Footer Note */}
                <p className="text-center text-xs text-[#292929]/40 mt-8 font-medium">
                    &copy; 2026 Titik Jeda. All rights reserved.
                </p>
            </div>
        </div>
    );
}