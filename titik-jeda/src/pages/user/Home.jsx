import { Link, useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import axios from "axios"; // Tambahkan axios
import inhaleVideo from "../../assets/inhale-exhale.mp4";
import meditationIcon from "../../assets/self-help.svg";
import learnIcon from "../../assets/self-grow.svg";
import dassIcon from "../../assets/self-check.svg";
import { useState } from "react";
import Footer from "../../components/user/Footer";
import BreathingExercise from "../../components/user/BreathingExercise";

function FlipCard() {
    const messages = [
        "Kamu nggak harus cepet-cepet. Berproses juga bentuk dari kekuatan.",
        "Take your time, kamu sedang bertumbuh — dan itu cukup.",
        "You're doing better than you think.",
        "Kamu itu cukup. Bahkan ketika kamu merasa tidak.",
        "Healing gak harus buru-buru. Pelan juga tetap maju.",
        "You deserve rest, peace, and gentle days.",
        "Nggak apa-apa istirahat. Kamu bukan robot."
    ];

    const [message, setMessage] = useState(
        messages[Math.floor(Math.random() * messages.length)]
    );

    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        const newMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(newMsg);
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className="w-full max-w-5xl h-72 md:h-80 mt-10 cursor-pointer perspective-[1000px]"
            onClick={handleFlip}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 transform-3d ${isFlipped ? "transform-[rotateY(180deg)]" : ""}`}
            >
                {/* Kartu Depan */}
                <div
                    className="
                        absolute inset-0
                        bg-[linear-gradient(135deg,#E9F2FF_0%,#D3E4FF_50%,#C4DAFF_100%)]
                        rounded-3xl flex items-center justify-center px-12
                        text-center text-[#0a1d48] text-lg md:text-xl font-semibold leading-relaxed
                        backface-hidden
                    "
                >
                    “{message}”
                </div>

                {/* Kartu Belakang */}
                <div
                    className="
                        absolute inset-0
                        bg-[linear-gradient(135deg,#E9F2FF_0%,#D3E4FF_50%,#C4DAFF_100%)]
                        rounded-3xl flex items-center justify-center px-12
                        text-center text-[#0a1d48] text-lg md:text-xl font-semibold leading-relaxed
                        transform-[rotateY(180deg)] backface-hidden
                    "
                >
                    “{message}”
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // FUNGSI GATEKEEPER
    const handleCheckIn = async (e) => {
        e.preventDefault(); // Mencegah navigasi default Link
        setLoading(true);
        try {
            // Cek ke endpoint yang kita buat sebelumnya
            const res = await axios.get("http://localhost:5000/api/user/dass/last-result", {
                withCredentials: true
            });

            if (res.data) {
                // Jika ada data riwayat, lempar ke halaman hasil
                navigate("/dass/result");
            }
        } catch (err) {
            // Jika error 404 (tidak ada data) atau error lainnya, lempar ke halaman intro DASS
            navigate("/dass");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col">
            {/* Section 1 */}
            <section className="min-h-screen w-full bg-linear-to-b from-white to-[#d9e6ff] flex flex-col items-center pt-40 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1d48] leading-tight">
                    It's okay to feel tired. <br /> You’ve been trying.
                </h1>

                <p className="text-gray-700 max-w-xl mt-4">
                    Capek itu bukan tanda kamu gagal, kadang itu cuma tanda kamu udah berjuang terlalu lama.
                    Yuk, cek kondisi kamu lewat DASS-21.
                </p>

                {/* Tombol Check In Now dengan logic baru */}
                <button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="mt-8 bg-[#0a1d48] text-white px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-[#0c275f] transition inline-block cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Checking..." : "Check In Now"}
                </button>
            </section>

            {/* Section 2: Breathing Exercise */}
            <section className="w-full bg-white py-16 flex flex-col items-center px-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#0a1d48] text-center mb-3">
                    Take a moment to pause… and breathe with intention
                </h2>
                <BreathingExercise />
            </section>

            {/* Section 3: Card Fitur */}
            <section className="w-full bg-white flex flex-col items-center text-center pt-8 md:pt-24 pb-6 md:pb-10 px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#0a1d48] mb-6 md:mb-8">
                    Self-check, self-help, self-love — semua ada di sini.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">

                    {/* Card 1: DASS-21 juga pakai logic yang sama */}
                    <div onClick={handleCheckIn} className="block group">
                        <div className="p-8 bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl cursor-pointer text-left transition-all group-active:scale-95">
                            <img src={dassIcon} alt="DASS Icon" className="w-14 h-14 mb-4" />
                            <h3 className="text-xl font-semibold text-[#0a1d48]">DASS-21</h3>
                            <p className="italic text-gray-500 text-sm mt-1">Self-check begins with awareness.</p>
                            <p className="text-gray-700 text-sm mt-4">
                                Isi kuisioner DASS-21 buat tahu kondisi emosimu hari ini.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 & 3 tetap pakai Link biasa */}
                    <Link to="/Meditation" className="block">
                        <div className="p-8 bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl cursor-pointer text-left transition-all active:scale-95">
                            <img src={meditationIcon} alt="Meditation Icon" className="w-14 h-14 mb-4" />
                            <h3 className="text-xl font-semibold text-[#0a1d48]">Meditation</h3>
                            <p className="italic text-gray-500 text-sm mt-1">Self-help starts with a pause.</p>
                            <p className="text-gray-700 text-sm mt-4">
                                Ambil jeda sejenak, tenangkan pikiran lewat meditasi singkat.
                            </p>
                        </div>
                    </Link>

                    <Link to="/education" className="block">
                        <div className="p-8 bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl cursor-pointer text-left transition-all active:scale-95">
                            <img src={learnIcon} alt="Learn Icon" className="w-14 h-14 mb-4" />
                            <h3 className="text-xl font-semibold text-[#0a1d48]">Learn & Grow</h3>
                            <p className="italic text-gray-500 text-sm mt-1">Self-love grows with understanding.</p>
                            <p className="text-gray-700 text-sm mt-4">
                                Belajar soal mental health lewat konten visual yang ringan & relate.
                            </p>
                        </div>
                    </Link>

                </div>
            </section>

            {/* Section 4: Afirmasi Positif */}
            <section className="w-full bg-white flex flex-col items-center text-center pt-8 md:pt-24 pb-12 md:pb-20 px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#0a1d48]">
                    Need a lil’ reminder today?
                </h2>
                <p className="text-gray-600 mt-1">
                    Klik kartunya — siapa tahu kata-kata di baliknya bisa bikin kamu senyum lagi
                </p>
                <FlipCard />
            </section>

            <Footer />
        </div>
    );
}