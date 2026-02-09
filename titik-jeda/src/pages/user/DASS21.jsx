import Footer from "../../components/user/Footer";
import questionsIcon from "../../assets/icon-1.svg";
import depressionIcon from "../../assets/icon-2.svg";
import anxietyIcon from "../../assets/icon-3.svg";
import stressIcon from "../../assets/icon-4.svg";
import { useNavigate } from "react-router-dom";

export default function DASS21() {

    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col bg-linear-to-b from-white to-[#d9e6ff]">

            {/* HERO SECTION */}
            <section className="min-h-[75vh] w-full flex flex-col items-center justify-center text-center px-6 pt-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a1d48]">
                    Understand Yourself Better with DASS-21
                </h1>

                <p className="text-gray-700 max-w-2xl mt-4 leading-relaxed">
                    Kenali tingkat stres, kecemasan, dan depresi yang kamu rasakan minggu ini
                    melalui 21 pertanyaan sederhana. Tidak ada jawaban benar atau salah —
                    cukup jujur pada diri sendiri.
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

                {/* Button */}
                <button
                    onClick={() => navigate("/dass-question")}
                    className="mt-10 bg-[#0a1d48] text-white px-10 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-[#0c275f] transition"
                >
                    Start Now
                </button>
            </section>

            <Footer />
        </div>
    );
}
