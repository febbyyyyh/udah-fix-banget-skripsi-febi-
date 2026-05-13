import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

export default function DassResult() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [scores, setScores] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrSaveData = async () => {
            setLoading(true);
            try {
                // Skenario 1: Baru selesai tes (Simpan ke DB)
                if (state?.depression !== undefined) {
                    await axios.post("http://localhost:5000/api/user/dass/save", {
                        depression_score: state.depression,
                        anxiety_score: state.anxiety,
                        stress_score: state.stress
                    }, { withCredentials: true });
                    setScores(state);
                }
                // Skenario 2: Mengakses hasil terakhir dari database
                else {
                    const res = await axios.get("http://localhost:5000/api/user/dass/last-result", {
                        withCredentials: true
                    });
                    setScores({
                        depression: res.data.depression,
                        anxiety: res.data.anxiety,
                        stress: res.data.stress
                    });
                }
            } catch (err) {
                console.error("Error fetching/saving DASS:", err);
                if (err.response?.status === 404 || !state) {
                    navigate("/dass");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrSaveData();
    }, [state, navigate]);

    // --- LOGIKA KATEGORI ---
    const getCategory = (type, score) => {
        if (type === "depression") {
            if (score <= 9) return "Normal";
            if (score <= 13) return "Ringan";
            if (score <= 20) return "Sedang";
            if (score <= 27) return "Parah";
            return "Sangat Parah";
        }
        if (type === "anxiety") {
            if (score <= 7) return "Normal";
            if (score <= 9) return "Ringan";
            if (score <= 14) return "Sedang";
            if (score <= 19) return "Parah";
            return "Sangat Parah";
        }
        if (type === "stress") {
            if (score <= 14) return "Normal";
            if (score <= 18) return "Ringan";
            if (score <= 25) return "Sedang";
            if (score <= 33) return "Parah";
            return "Sangat Parah";
        }
    };

    // --- FUNGSI WEIGHT (INI YANG TADI KURANG SEHINGGA WHITE SCREEN) ---
    const getSeverityWeight = (type, score) => {
        const cat = getCategory(type, score);
        const weights = {
            "Normal": 1,
            "Ringan": 2,
            "Sedang": 3,
            "Parah": 4,
            "Sangat Parah": 5
        };
        return weights[cat] || 1;
    };

    // --- CARI PRIORITAS TERTINGGI ---
    const getHighestSeverity = () => {
        if (!scores) return { label: "General", type: "general" };
        const results = [
            { label: "Depression", type: "depression", weight: getSeverityWeight("depression", scores.depression) },
            { label: "Anxiety", type: "anxiety", weight: getSeverityWeight("anxiety", scores.anxiety) },
            { label: "Stress", type: "stress", weight: getSeverityWeight("stress", scores.stress) }
        ];
        // Sort descending berdasarkan weight, ambil yang pertama
        return results.sort((a, b) => b.weight - a.weight)[0];
    };

    if (loading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1d48]"></div>
            <p className="mt-4 text-gray-500 font-medium">Menganalisis hasil kamu...</p>
        </div>
    );

    if (!scores) return null;

    const topRecommendation = getHighestSeverity();

    const cards = [
        { title: "Depression", type: "depression", score: scores.depression, max: 42, affirmation: "Kamu berharga, dan perasaan ini tidak menentukan masa depanmu." },
        { title: "Anxiety", type: "anxiety", score: scores.anxiety, max: 42, affirmation: "Tarik napas… kamu mampu menghadapi satu hal dalam satu waktu." },
        { title: "Stress", type: "stress", score: scores.stress, max: 42, affirmation: "Kamu pantas mendapat istirahat. Tidak apa-apa untuk berhenti sejenak." }
    ];

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen flex flex-col items-center px-6 py-20 bg-white">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#0a1d48] tracking-tight">
                        {state ? "Your Results Are Ready" : "Your Last Results"}
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
                        {state
                            ? "Berdasarkan hasil screening, berikut adalah gambaran kondisi psikologis kamu saat ini."
                            : "Berikut adalah hasil rekaman kondisi emosional terakhir kamu."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    {cards.map((card, i) => (
                        <DassSliderCard
                            key={i}
                            card={card}
                            category={getCategory(card.type, card.score)}
                        />
                    ))}
                </div>

                {/* Next Steps Section */}
                <h2 className="text-2xl md:text-3xl font-bold mt-32 mb-10 text-[#0a1d48]">What You Can Do Next?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-20">
                    <div onClick={() => navigate("/meditation")} className="bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl px-8 py-10 flex flex-col items-center cursor-pointer">
                        <img src="/src/assets/headphone.svg" className="w-20 mb-6" alt="Meditation" />
                        <p className="font-bold text-[#0a1d48] text-center">Explore {topRecommendation.label} Meditation</p>
                    </div>

                    <div onClick={() => navigate("/education")} className="bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl px-8 py-10 flex flex-col items-center cursor-pointer">
                        <img src="/src/assets/video.svg" className="w-20 mb-6" alt="Education" />
                        <p className="font-bold text-[#0a1d48] text-center">Open Learn & Grow</p>
                    </div>

                    <div onClick={() => window.open("https://wa.me/6281335492303", "_blank")} className="bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl px-8 py-10 flex flex-col items-center cursor-pointer">
                        <img src="/src/assets/call.svg" className="w-20 mb-6" alt="Counselor" />
                        <p className="font-bold text-[#0a1d48] text-center">Contact Counselor</p>
                    </div>
                </div>

                <div className="mt-10 p-12 bg-linear-to-br from-[#F8FBFF] to-[#f0f7ff] border border-[#d0e1f9] rounded-[48px] text-center max-w-4xl w-full shadow-sm mb-20">
                    <h3 className="text-2xl font-bold text-[#0a1d48] mb-4">Ingin pantau progresmu?</h3>
                    <p className="text-gray-600 mb-8 max-w-l mx-auto">
                        Hasil ini bukan diagnosis medis, hanya screening awal. Lakukan pengecekan rutin untuk melihat perkembangan kesehatan mentalmu.
                    </p>
                    <button
                        onClick={() => navigate("/dass-question")}
                        className="px-12 py-4 bg-[#0a1d48] text-white rounded-full font-bold shadow-md hover:bg-[#0c275f] transition duration-300 cursor-pointer"
                    >
                        Ambil Tes Ulang
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

// Sub-komponen tetap sama
function DassSliderCard({ card, category }) {
    const [flipped, setFlipped] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const percentage = Math.min((card.score / card.max) * 100, 100);

    const ranges = {
        depression: [
            { label: "Normal", range: "0-9", color: "bg-[#75b9e4]" },
            { label: "Ringan", range: "10-13", color: "bg-[#7aef92]" },
            { label: "Sedang", range: "14-20", color: "bg-[#fff771]" },
            { label: "Parah", range: "21-27", color: "bg-[#ffba58]" },
            { label: "Sangat Parah", range: "28+", color: "bg-[#f94e67]" },
        ],
        anxiety: [
            { label: "Normal", range: "0-7", color: "bg-[#75b9e4]" },
            { label: "Ringan", range: "8-9", color: "bg-[#7aef92]" },
            { label: "Sedang", range: "10-14", color: "bg-[#fff771]" },
            { label: "Parah", range: "15-19", color: "bg-[#ffba58]" },
            { label: "Sangat Parah", range: "20+", color: "bg-[#f94e67]" },
        ],
        stress: [
            { label: "Normal", range: "0-14", color: "bg-[#75b9e4]" },
            { label: "Ringan", range: "15-18", color: "bg-[#7aef92]" },
            { label: "Sedang", range: "19-25", color: "bg-[#fff771]" },
            { label: "Parah", range: "26-33", color: "bg-[#ffba58]" },
            { label: "Sangat Parah", range: "34+", color: "bg-[#f94e67]" },
        ]
    };

    return (
        <div className="relative w-full h-80">
            <div onClick={() => setFlipped(!flipped)} className="group perspective w-full h-full cursor-pointer">
                <div className={`relative w-full h-full transition-all duration-700 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
                    {/* DEPAN */}
                    <div className="absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                                className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#636363] hover:bg-[#0a1d48] cursor-pointer hover:text-white transition-all shadow-sm"
                            >
                                <span className="font-serif">i</span>
                            </button>
                        </div>
                        <div className="relative py-10">
                            <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-1000 ease-out" style={{ left: `${percentage}%` }}>
                                <div className="bg-[#f0f7ff] text-[#0a1d48] text-sm font-bold px-4 py-2 rounded-2xl border border-blue-100 shadow-sm mb-1 whitespace-nowrap">
                                    {category} <span className="ml-1 opacity-50">| {card.score}</span>
                                </div>
                                <div className="w-0.5 h-3 bg-blue-200"></div>
                            </div>
                            <div className="w-full h-4 rounded-full bg-gradient-to-r from-[#75b9e4] via-[#7aef92] via-[#fff771] via-[#ffba58] to-[#f94e67]"></div>
                            <div className="flex justify-between mt-3 text-[12px] font-semibold text-gray-600 uppercase tracking-widest">
                                <span>0</span>
                                <span>42</span>
                            </div>
                        </div>
                        <div className="text-center text-xs text-gray-400 font-medium italic">Klik kartu untuk afirmasi</div>
                    </div>
                    {/* BELAKANG */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0a1d48] rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-xl">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-serif italic">"</div>
                        <p className="text-white text-lg font-medium leading-relaxed italic">{card.affirmation}</p>
                    </div>
                </div>
            </div>
            {showInfo && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center px-4 bg-[#0a1d48]/40 backdrop-blur-sm" onClick={() => setShowInfo(false)}>
                    <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-[#0a1d48]">{card.title} Scale</h4>
                            <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                        </div>
                        <div className="space-y-3">
                            {ranges[card.type].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                                        <span className="font-bold text-gray-700">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">{item.range}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowInfo(false)} className="w-full mt-6 py-4 bg-[#0a1d48] text-white rounded-2xl font-bold hover:shadow-lg transition-all">
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}