import { useState, useEffect } from "react";
import Footer from "../../components/user/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DASS21() {
    const navigate = useNavigate();
    const [hasLastResult, setHasLastResult] = useState(false);
    const [checking, setChecking] = useState(true);

    // Cek apakah user sudah punya riwayat tes terakhir di DB
    useEffect(() => {
        const checkLastResult = async () => {
            try {
                const res = await axios.get("/api/user/dass/last-result", {
                    withCredentials: true
                });
                // Jika data ditemukan dan skor tidak kosong, set true
                if (res.data && res.data.depression !== undefined) {
                    setHasLastResult(true);
                }
            } catch (err) {
                // Jika 404 atau error, biarkan false (artinya belum pernah tes)
                console.warn("Gagal memeriksa hasil DASS terakhir:", err);
                setHasLastResult(false);
            } finally {
                setChecking(false);
            }
        };
        checkLastResult();
    }, []);

    const handleButtonClick = () => {
        if (hasLastResult) {
            navigate("/dass/result"); // Jika sudah ada hasil, langsung ke halaman hasil
        } else {
            navigate("/dass-question"); // Jika belum, baru isi kuisioner
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#FFFFFF] text-[#292929] flex flex-col justify-between">

            {/* HERO SECTION */}
            <section className="min-h-[85vh] w-full flex flex-col items-center justify-center text-center px-6 pt-48 pb-16">

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl">
                    Understand Yourself Better with DASS-21
                </h1>

                <p className="text-[#292929]/80 max-w-2xl text-center mt-6 text-base sm:text-lg leading-relaxed">
                    Kenali kondisi mentalmu melalui{" "}
                    {/* Menggunakan inline-block, scale, dan transisi halus persis seperti di Home & Hasil */}
                    <span
                        onClick={() => navigate("/dass-info")}
                        className="inline-block text-[#00BFFF] font-bold underline decoration-[#ADFF2F] underline-offset-4 cursor-pointer transition-all duration-200 hover:text-[#00BFFF]/80 hover:scale-105 active:scale-95"
                    >
                        DASS-21
                    </span>
                    , metode screening yang digunakan untuk mengukur tingkat stres, kecemasan, dan depresi. Jawab setiap pertanyaan berdasarkan apa yang kamu rasakan selama satu minggu terakhir untuk mendapatkan gambaran kondisi emosionalmu saat ini.
                </p>
                <p className="text-[#292929]/50 max-w-2xl text-center mt-3 text-xs sm:text-sm italic font-medium">
                    Hasil screening ini bersifat informatif dan bukan pengganti diagnosis profesional.
                </p>

                {/* 4 METRICS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-3xl">
                    <div className="p-5 bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-sm select-none">
                        <span className="text-3xl font-black text-[#00BFFF]">21</span>
                        <div className="w-5 h-0.5 bg-[#ADFF2F] rounded-full my-2" />
                        <p className="text-xs font-bold text-[#292929] uppercase tracking-wider">Pertanyaan</p>
                        <p className="text-[11px] text-[#292929]/50 mt-0.5">Screening awal</p>
                    </div>

                    <div className="p-5 bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-sm select-none">
                        <span className="text-3xl font-black text-[#292929]">D</span>
                        <div className="w-5 h-0.5 bg-[#ADFF2F] rounded-full my-2" />
                        <p className="text-xs font-bold text-[#292929] uppercase tracking-wider">Depresi</p>
                        <p className="text-[11px] text-[#292929]/50 mt-0.5">Skala emosional</p>
                    </div>

                    <div className="p-5 bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-sm select-none">
                        <span className="text-3xl font-black text-[#292929]">A</span>
                        <div className="w-5 h-0.5 bg-[#ADFF2F] rounded-full my-2" />
                        <p className="text-xs font-bold text-[#292929] uppercase tracking-wider">Anxiety</p>
                        <p className="text-[11px] text-[#292929]/50 mt-0.5">Kecemasan</p>
                    </div>

                    <div className="p-5 bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-2xl flex flex-col items-center justify-center min-h-[140px] shadow-sm select-none">
                        <span className="text-3xl font-black text-[#292929]">S</span>
                        <div className="w-5 h-0.5 bg-[#ADFF2F] rounded-full my-2" />
                        <p className="text-xs font-bold text-[#292929] uppercase tracking-wider">Stress</p>
                        <p className="text-[11px] text-[#292929]/50 mt-0.5">Ketegangan</p>
                    </div>
                </div>

                {/* DYNAMIC ACTION BUTTON */}
                {checking ? (
                    <div className="mt-12 h-12 w-12 border-4 border-[#F2F2F2] border-b-[#00BFFF] rounded-full animate-spin"></div>
                ) : (
                    <button
                        onClick={handleButtonClick}
                        className="mt-12 bg-[#00BFFF] text-[#FFFFFF] px-10 py-3.5 rounded-xl text-base font-black shadow-sm hover:opacity-90 transition active:scale-95 cursor-pointer"
                    >
                        {hasLastResult ? "Lihat Hasil Terakhir" : "Start Now"}
                    </button>
                )}
            </section>

            <Footer />
        </div>
    );
}