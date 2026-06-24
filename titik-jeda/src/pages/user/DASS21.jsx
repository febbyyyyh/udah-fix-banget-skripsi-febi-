import Footer from "../../components/user/Footer";
import { useNavigate } from "react-router-dom";

const questionsIcon = "/assets/icon-1.svg";
const depressionIcon = "/assets/icon-2.svg";
const anxietyIcon = "/assets/icon-3.svg";
const stressIcon = "/assets/icon-4.svg";

export default function DASS21() {
    const navigate = useNavigate();

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
                        onClick={() => navigate("/dass-info")}
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

            <Footer />
        </div>
    );
}