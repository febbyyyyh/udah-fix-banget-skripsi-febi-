import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

export default function DassResult() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Simpan skor di state lokal agar stabil
    const [scores, setScores] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrSaveData = async () => {
            setLoading(true);
            try {
                // Skenario 1: Baru selesai isi tes (Data datang dari redirect DassQuestion)
                if (state?.depression !== undefined) {
                    await axios.post("http://localhost:5000/api/user/dass/save", {
                        depression_score: state.depression,
                        anxiety_score: state.anxiety,
                        stress_score: state.stress
                    }, { withCredentials: true });

                    setScores(state); // Gunakan data dari state langsung
                }
                // Skenario 2: Klik dari Navbar (Ambil data terakhir dari DB)
                else {
                    const res = await axios.get("http://localhost:5000/api/user/dass/last-result", {
                        withCredentials: true
                    });

                    // Kita samakan format objectnya dengan state dari DassQuestion
                    setScores({
                        depression: res.data.depression,
                        anxiety: res.data.anxiety,
                        stress: res.data.stress
                    });
                }
            } catch (err) {
                console.error("Error fetching/saving DASS:", err);
                // Jika error 404 (belum ada data), arahkan ke halaman intro DASS
                if (err.response?.status === 404 || !state) {
                    navigate("/dass");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrSaveData();
    }, [state, navigate]);

    // Fungsi Kategori & Warna (Logika kamu tetap dipertahankan)
    const getCategory = (type, score) => {
        if (type === "depression") {
            if (score <= 9) return "Resiko rendah";
            if (score <= 13) return "Resiko ringan";
            if (score <= 20) return "Resiko sedang";
            if (score <= 27) return "Resiko tinggi";
            return "Resiko sangat tinggi";
        }
        if (type === "anxiety") {
            if (score <= 7) return "Resiko rendah";
            if (score <= 9) return "Resiko ringan";
            if (score <= 14) return "Resiko sedang";
            if (score <= 19) return "Resiko tinggi";
            return "Resiko sangat tinggi";
        }
        if (type === "stress") {
            if (score <= 14) return "Resiko rendah";
            if (score <= 18) return "Resiko ringan";
            if (score <= 25) return "Resiko sedang";
            if (score <= 33) return "Resiko tinggi";
            return "Resiko sangat tinggi";
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case "Resiko sangat tinggi": return "#E00F00";
            case "Resiko tinggi": return "#FF9300";
            case "Resiko sedang": return "#FACC15";
            case "Resiko ringan": return "#5CB2FF";
            default: return "#72FF6F";
        }
    };

    const getRiskBackground = (risk) => {
        switch (risk) {
            case "Resiko sangat tinggi": return "rgba(224, 15, 0, 0.15)";
            case "Resiko tinggi": return "rgba(255, 147, 0, 0.15)";
            case "Resiko sedang": return "rgba(250, 204, 21, 0.18)";
            case "Resiko ringan": return "rgba(92, 178, 255, 0.18)";
            default: return "rgba(114, 255, 111, 0.18)";
        }
    };

    // --- RENDER LOGIC ---
    if (loading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1d48]"></div>
            <p className="mt-4 text-gray-500 font-medium">Menganalisis hasil kamu...</p>
        </div>
    );

    if (!scores) return null; // Mencegah crash jika data kosong

    const cards = [
        { title: "Depresi", score: scores.depression, risk: getCategory("depression", scores.depression), affirmation: "Kamu berharga, dan perasaan ini tidak menentukan masa depanmu." },
        { title: "Kecemasan", score: scores.anxiety, risk: getCategory("anxiety", scores.anxiety), affirmation: "Tarik napas… kamu mampu menghadapi satu hal dalam satu waktu." },
        { title: "Stres", score: scores.stress, risk: getCategory("stress", scores.stress), affirmation: "Kamu pantas mendapat istirahat. Tidak apa-apa untuk berhenti sejenak." }
    ];

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen flex flex-col items-center px-6 py-20 bg-white">
                <h1 className="text-3xl md:text-4xl font-bold text-center">
                    {state ? "Your Results Are Ready" : "Your Last Results"}
                </h1>
                <p className="text-gray-600 text-center max-w-2xl mt-3">
                    {state
                        ? "Ini adalah gambaran umum kondisi emosional kamu berdasarkan pengisian 21 pertanyaan."
                        : "Berikut adalah hasil rekaman kondisi emosional terakhir kamu."}
                </p>

                {/* --- TAMBAHAN KETERANGAN DISINI --- */}
                <p className="text-xs md:text-sm text-gray-400 mt-8 mb-4 flex items-center gap-2 animate-pulse">
                    Klik kartu untuk melihat afirmasi positif
                </p>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 w-full max-w-5xl">
                    {cards.map((card, i) => (
                        <DassCard key={i} card={card} colorFn={getRiskColor} bgFn={getRiskBackground} />
                    ))}
                </div>

                {/* SECTION RETEST */}
                <div className="mt-20 p-10 bg-[#F8FBFF] border-2 border-dashed border-[#ADC7EA] rounded-[40px] text-center max-w-3xl w-full">
                    <h3 className="text-2xl font-bold text-[#0a1d48] mb-3">Ingin cek kondisi terbaru?</h3>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto text-sm md:text-base">
                        Kondisi emosional bisa berubah setiap hari. Lakukan tes ulang secara berkala untuk pantau progres kesehatan mentalmu.
                    </p>
                    <button
                        onClick={() => navigate("/dass-question")}
                        className="px-10 py-4 bg-[#0a1d48] text-white rounded-full font-bold active:scale-95 transition-all"
                    >
                        Ambil Tes Ulang Sekarang
                    </button>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mt-24 mb-8">What You Can Do Next?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-10">
                    <div onClick={() => navigate("/meditation")} className="bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl px-8 py-10 flex flex-col items-center cursor-pointer transition">
                        <img src="/src/assets/headphone.svg" className="w-20 mb-6" alt="Meditation" />
                        <p className="font-semibold text-center">Explore Meditation</p>
                    </div>
                    <div onClick={() => navigate("/education")} className="bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl px-8 py-10 flex flex-col items-center cursor-pointer transition">
                        <img src="/src/assets/video.svg" className="w-20 mb-6" alt="Education" />
                        <p className="font-semibold text-center">Open Learn & Grow</p>
                    </div>
                    <div onClick={() => window.open("https://wa.me/6281335492303", "_blank")} className="bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl px-8 py-10 flex flex-col items-center cursor-pointer transition">
                        <img src="/src/assets/call.svg" className="w-20 mb-6" alt="Counselor" />
                        <p className="font-semibold text-center">Contact Counselor</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

// Sub-component agar kode lebih bersih
function DassCard({ card, colorFn, bgFn }) {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div onClick={() => setIsFlipped(!isFlipped)} className="relative w-full h-48 cursor-pointer perspective">
            <div className={`transition-transform duration-500 relative w-full h-full transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                <div className="absolute inset-0 rounded-3xl border-2 flex flex-col items-center justify-center"
                    style={{ borderColor: colorFn(card.risk), backgroundColor: bgFn(card.risk) }}>
                    <h2 className="text-xl font-bold">{card.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorFn(card.risk) }}></span>
                        <p className="text-gray-700">{card.risk} ({card.score})</p>
                    </div>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-white flex items-center justify-center p-6 text-center rotate-y-180 backface-hidden shadow-sm border border-gray-100">
                    <p className="text-gray-800 font-medium">{card.affirmation}</p>
                </div>
            </div>
        </div>
    );
}