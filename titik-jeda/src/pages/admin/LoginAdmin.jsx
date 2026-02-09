import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAdmin from "../../utils/axiosAdmin";
import logo from "../../assets/logo.svg";

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
            const response = await axiosAdmin.post("/admin/login", { email, password });

            console.log("Login response:", response.data);

            // simpan JWT
            localStorage.setItem("admin_token", response.data.token);

            // redirect ke dashboard
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message || "Login gagal. Coba lagi."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EAF3FF] font-poppins">
            <div className="w-full max-w-sm flex flex-col items-center">

                {/* Logo */}
                <div className="mb-6">
                    <img
                        src={logo}
                        alt="Logo Titik Jeda"
                        className="w-24 h-24"
                    />
                </div>

                {/* Form */}
                <form
                    onSubmit={handleLogin}
                    className="w-full flex flex-col gap-4"
                >

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="email admin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
                            w-full px-4 py-3
                            rounded-lg
                            bg-white
                            text-sm
                            placeholder:text-gray-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#0a1d48]/30
                        "
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full px-4 py-3 pr-12
                                rounded-lg
                                bg-white
                                text-sm
                                placeholder:text-gray-400
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#0a1d48]/30
                            "
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            👁
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`
                            mt-4
                            w-full
                            py-3
                            rounded-full
                            text-sm
                            font-medium
                            transition
                            ${isFormValid && !loading
                                ? "bg-[#0a1d48] text-white hover:opacity-90"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }
                        `}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
