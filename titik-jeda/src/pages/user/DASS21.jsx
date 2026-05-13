import { useState } from "react"; // Tambah useState
import Footer from "../../components/user/Footer";
import questionsIcon from "../../assets/icon-1.svg";
import depressionIcon from "../../assets/icon-2.svg";
import anxietyIcon from "../../assets/icon-3.svg";
import stressIcon from "../../assets/icon-4.svg";
import { useNavigate } from "react-router-dom";

export default function DASS21() {
    const navigate = useNavigate();

    // State untuk kontrol modal
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="w-full flex flex-col bg-linear-to-b from-white to-[#d9e6ff] relative">

            {/* HERO SECTION */}
            <section className="min-h-[75vh] w-full flex flex-col items-center justify-center text-center px-6 pt-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a1d48]">
                    Understand Yourself Better with DASS-21
                </h1>

                <p className="text-gray-700 max-w-2xl mt-4 leading-relaxed">
                    Kenali kondisi mentalmu melalui{" "}
                    {/* Bagian yang bisa diklik */}
                    <span
                        onClick={() => setShowModal(true)}
                        className="text-[#0a1d48] font-bold underline decoration-blue-400 underline-offset-4 cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        DASS-21
                    </span>
                    , metode screening yang digunakan untuk mengukur tingkat stres, kecemasan, dan depresi. Jawab setiap pertanyaan berdasarkan apa yang kamu rasakan selama satu minggu terakhir untuk mendapatkan gambaran kondisi emosionalmu saat ini.
                    Hasil screening ini bersifat informatif dan bukan pengganti diagnosis profesional.
                </p>

                {/* 4 CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                    <div className="p-6 bg-[#ffffff] rounded-2xl flex flex-col items-center">
                        <img src={questionsIcon} alt="21 questions" className="w-12 h-12 opacity-80" />
                        <p className="text-sm text-[#0a1d48] mt-2 font-semibold">21 Pertanyaan</p>
                    </div>

                    <div className="p-6 bg-[#ffffff] rounded-2xl flex flex-col items-center">
                        <img src={depressionIcon} alt="Depresi" className="w-12 h-12 opacity-80" />
                        <p className="text-sm text-[#0a1d48] mt-2 font-semibold">Depresi</p>
                    </div>

                    <div className="p-6 bg-[#ffffff] rounded-2xl flex flex-col items-center">
                        <img src={anxietyIcon} alt="Cemas" className="w-12 h-12 opacity-80" />
                        <p className="text-sm text-[#0a1d48] mt-2 font-semibold">Cemas</p>
                    </div>

                    <div className="p-6 bg-[#ffffff] rounded-2xl flex flex-col items-center">
                        <img src={stressIcon} alt="Stress" className="w-12 h-12 opacity-80" />
                        <p className="text-sm text-[#0a1d48] mt-2 font-semibold">Stress</p>
                    </div>
                </div>

                {/* Button Start */}
                <button
                    onClick={() => navigate("/dass-question")}
                    className="mt-10 bg-[#0a1d48] text-white px-10 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-[#0c275f]"
                >
                    Start Now
                </button>
            </section>

            {/* MODAL PENJELASAN DASS-21 */}
            {showModal && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        {/* Tombol Close */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <img src={questionsIcon} className="w-8 h-8" alt="info" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0a1d48] mb-4">Apa itu DASS-21?</h2>

                            <div className="text-gray-600 text-sm space-y-4 text-justify leading-relaxed">
                                <p>
                                    <span className="font-bold text-[#0a1d48]">DASS-21</span> adalah instrumen laporan diri yang dikembangkan untuk mengukur tiga kondisi emosional:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <div className="min-w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                                        <span><strong>Depresi:</strong> Mengukur tingkat kesedihan, keputusasaan, dan hilangnya minat.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="min-w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                                        <span><strong>Kecemasan:</strong> Mengukur respon rasa takut, panik, dan ketegangan fisik.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="min-w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                                        <span><strong>Stres:</strong> Mengukur tingkat iritabilitas, ketegangan saraf, dan kesulitan untuk rileks.</span>
                                    </li>
                                </ul>
                                <p className="text-[12px] italic text-gray-400 mt-4 border-t pt-4 text-center">
                                    DASS-21 adalah instrumen screening, bukan diagnosis medis.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full mt-8 bg-[#0a1d48] text-white py-3.5 rounded-2xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Oke, Saya Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}