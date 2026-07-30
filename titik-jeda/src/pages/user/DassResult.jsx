import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

// ELEMEN TAMBAHAN MONOKROM: ORNAMEN BINTANG ABSTRAK
const TinySparkle = ({ className }) => (
    <svg className={`w-8 h-8 text-[#292929]/15 absolute z-0 pointer-events-none ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
);

// ELEMEN TAMBAHAN MONOKROM: ORNAMEN LINGKARAN DONUT
const TinyCircle = ({ className }) => (
    <div className={`w-6 h-6 rounded-full border-4 border-[#292929]/15 absolute z-0 pointer-events-none ${className}`} />
);

// ELEMEN TAMBAHAN MONOKROM: ORNAMEN SEGITIGA MINI
const TinyTriangle = ({ className }) => (
    <svg className={`w-6 h-6 text-[#292929]/15 absolute z-0 pointer-events-none ${className} transform rotate-45`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 22H2L12 2Z" />
    </svg>
);

export default function DassResult() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [scores, setScores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveError, setSaveError] = useState(false);

    useEffect(() => {
        const fetchOrSaveData = async () => {
            setLoading(true);
            setSaveError(false);

            try {
                if (state?.depression !== undefined) {
                    await axios.post("/api/user/dass/save", {
                        depression_score: state.depression,
                        anxiety_score: state.anxiety,
                        stress_score: state.stress
                    }, { withCredentials: true });
                }

                const res = await axios.get("/api/user/dass/last-result", {
                    withCredentials: true
                });
                setScores({
                    depression: res.data.depression,
                    anxiety: res.data.anxiety,
                    stress: res.data.stress
                });
            } catch (err) {
                console.error("❌ Error save/verify DASS:", err);
                setSaveError(true);
                if (!state) {
                    navigate("/dass");
                } else if (state?.depression !== undefined) {
                    setScores(state);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrSaveData();
    }, [state, navigate]);

    /* PERBAIKAN UTAMA: Menggunakan struktur else if / else formal & menyelaraskan kata "Parah" menjadi "Berat" */
    const getCategory = (type, score) => {
        if (type === "depression") {
            if (score <= 9) return "Normal";
            else if (score <= 13) return "Ringan";
            else if (score <= 20) return "Sedang";
            else if (score <= 27) return "Berat";
            else return "Sangat Berat";
        }
        else if (type === "anxiety") {
            if (score <= 7) return "Normal";
            else if (score <= 9) return "Ringan";
            else if (score <= 14) return "Sedang";
            else if (score <= 19) return "Berat";
            else return "Sangat Berat";
        }
        else if (type === "stress") {
            if (score <= 14) return "Normal";
            else if (score <= 18) return "Ringan";
            else if (score <= 25) return "Sedang";
            else if (score <= 33) return "Berat";
            else return "Sangat Berat";
        }
        else {
            return "Normal";
        }
    };

    const getSeverityWeight = (type, score) => {
        const cat = getCategory(type, score);
        const weights = { "Normal": 1, "Ringan": 2, "Sedang": 3, "Berat": 4, "Sangat Berat": 5 };
        return weights[cat] || 1;
    };

    const getHighestSeverity = () => {
        if (!scores) return { label: "General", type: "general" };
        const results = [
            { label: "Depression", type: "depression", weight: getSeverityWeight("depression", scores.depression) },
            { label: "Anxiety", type: "anxiety", weight: getSeverityWeight("anxiety", scores.anxiety) },
            { label: "Stress", type: "stress", weight: getSeverityWeight("stress", scores.stress) }
        ];
        return results.sort((a, b) => b.weight - a.weight)[0];
    };

    if (loading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FFFFFF] text-[#292929]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F2F2F2] border-b-[#00BFFF]"></div>
            <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#292929]/50">Menganalisis hasil kamu...</p>
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
        <div className="bg-[#FFFFFF] min-h-screen text-[#292929] flex flex-col justify-between relative overflow-hidden">
            <Navbar />

            {/* SEBARAN ELEMEN GEOMETRI RANDOM */}
            <div className="absolute inset-x-0 top-0 h-[80vh] pointer-events-none z-0">
                <TinySparkle className="top-36 left-8 md:left-16 animate-pulse" />
                <TinyCircle className="top-56 left-20 md:left-32 animate-bounce duration-[1500ms]" />
                <TinyTriangle className="top-40 right-12 md:right-24" />
                <TinySparkle className="top-64 right-24 md:right-40" />

                <TinyTriangle className="top-[450px] left-10 md:left-24" />
                <TinySparkle className="top-[550px] left-28 md:left-48" />
                <TinyCircle className="top-[480px] right-14 md:right-28 animate-bounce duration-[1800ms]" />
                <TinyTriangle className="top-[600px] right-28 md:right-52" />
            </div>

            <div className="w-full flex flex-col items-center px-4 sm:px-6 pt-48 bg-[#FFFFFF] relative z-10">
                <div className="text-center mb-16 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                        {state ? "Your Results Are Ready" : "Your Last Results"}
                    </h1>
                    <p className="text-[#292929]/80 mt-6 text-base sm:text-lg leading-relaxed font-normal">
                        {state ? (
                            <>
                                Hasil skrining{" "}
                                <span
                                    onClick={() => navigate("/dass-info")}
                                    className="inline-block text-[#00BFFF] font-black underline decoration-4 decoration-[#ADFF2F] underline-offset-4 cursor-pointer transition-transform hover:scale-105"
                                >
                                    DASS-21
                                </span>{" "}
                                kamu sudah siap. Hasil ini hanya menjadi gambaran awal kondisi emosionalmu, bukan diagnosis medis atau label untuk dirimu. Jika kamu membutuhkan bantuan lanjutan, silakan hubungi psikolog, konselor, atau tenaga profesional.
                            </>
                        ) : (
                            <>
                                Berikut adalah riwayat hasil skrining{" "}
                                <span
                                    onClick={() => navigate("/dass-info")}
                                    className="inline-block text-[#00BFFF] font-black underline decoration-4 decoration-[#ADFF2F] underline-offset-4 cursor-pointer transition-transform hover:scale-105"
                                >
                                    DASS-21
                                </span>{" "}
                                terbarumu. Hasil ini hanya membantu kamu melihat gambaran awal kondisi emosional yang pernah kamu rekam, bukan diagnosis medis atau pengganti konsultasi profesional. Jika kamu membutuhkan bantuan lanjutan, silakan hubungi psikolog, konselor, atau tenaga profesional.
                            </>
                        )}
                    </p>
                    {saveError && (
                        <div className="mt-6 rounded-2xl border border-[#f94e67]/40 bg-[#fff1f2] px-5 py-4 text-sm text-[#b91c1c] font-medium">
                            Terjadi masalah saat menyimpan hasil. Menampilkan hasil terakhir yang tersedia.
                        </div>
                    )}
                </div>

                {/* SLIDER CARDS GRID AREA */}
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
                <h2 className="text-2xl md:text-3xl font-black mt-32 mb-10 tracking-tight uppercase">What You Can Do Next?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-20">
                    {/* Card 1 */}
                    <div onClick={() => navigate("/meditation")} className="relative group rounded-3xl">
                        <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />
                        <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer h-full transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                            <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4 group-hover:w-16 transition-all duration-300" />
                            <p className="font-black text-xl text-[#292929] group-hover:text-[#00BFFF] transition-colors uppercase">Explore {topRecommendation.label} Meditation</p>
                            <span className="text-xs font-black text-[#00BFFF] mt-4 uppercase tracking-widest">Buka Sesi →</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div onClick={() => navigate("/education")} className="relative group rounded-3xl">
                        <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />
                        <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer h-full transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                            <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4 group-hover:w-16 transition-all duration-300" />
                            <p className="font-black text-xl text-[#292929] group-hover:text-[#00BFFF] transition-colors uppercase">Open Learn & Grow</p>
                            <span className="text-xs font-black text-[#00BFFF] mt-4 uppercase tracking-widest">Lihat Materi →</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div onClick={() => window.open("https://wa.me/6281953027359", "_blank")} className="relative group rounded-3xl">
                        <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />
                        <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer h-full transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                            <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4 group-hover:w-16 transition-all duration-300" />
                            <p className="font-black text-xl text-[#292929] group-hover:text-[#00BFFF] transition-colors uppercase">Contact Counselor</p>
                            <span className="text-xs font-black text-[#00BFFF] mt-4 uppercase tracking-widest">Hubungi WA →</span>
                        </div>
                    </div>
                </div>

                {/* Footer Banner Card */}
                <div className="relative group max-w-4xl w-full mb-24">
                    <div className="absolute inset-0 bg-[#292929] rounded-[32px] translate-x-2 translate-y-2" />
                    <div className="relative p-12 bg-[#FFFFFF] border-4 border-[#292929] rounded-[32px] text-center w-full">
                        <h3 className="text-2xl font-black text-[#292929] mb-4 uppercase">Ingin pantau progresmu?</h3>
                        <p className="text-[#292929]/70 mb-8 max-w-xl mx-auto font-normal text-base">
                            Ukuran ini bukan diagnosis medis, hanya screening awal. Lakukan pengecekan rutin untuk melihat perkembangan kesehatan mentalmu.
                        </p>
                        <button
                            onClick={() => navigate("/dass-question")}
                            className="px-12 py-4 bg-[#00BFFF] border-2 border-[#292929] text-[#FFFFFF] rounded-xl font-black shadow-[3px_3px_0px_0px_#292929] hover:opacity-90 transition active:scale-95 cursor-pointer uppercase tracking-wider text-xs"
                        >
                            Ambil Tes Ulang
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function DassSliderCard({ card, category }) {
    const [flipped, setFlipped] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const percentage = Math.min((card.score / card.max) * 100, 100);

    const ranges = {
        depression: [
            { label: "Normal", range: "0-9", color: "bg-[#75b9e4]" },
            { label: "Ringan", range: "10-13", color: "bg-[#7aef92]" },
            { label: "Sedang", range: "14-20", color: "bg-[#fff771]" },
            { label: "Berat", range: "21-27", color: "bg-[#ffba58]" },
            { label: "Sangat Berat", range: "28+", color: "bg-[#f94e67]" },
        ],
        anxiety: [
            { label: "Normal", range: "0-7", color: "bg-[#75b9e4]" },
            { label: "Ringan", range: "8-9", color: "bg-[#7aef92]" },
            { label: "Sedang", range: "10-14", color: "bg-[#fff771]" },
            { label: "Berat", range: "15-19", color: "bg-[#ffba58]" },
            { label: "Sangat Berat", range: "20+", color: "bg-[#f94e67]" },
        ],
        stress: [
            { label: "Normal", range: "0-14", color: "bg-[#75b9e4]" },
            { label: "Ringan", range: "15-18", color: "bg-[#7aef92]" },
            { label: "Sedang", range: "19-25", color: "bg-[#fff771]" },
            { label: "Berat", range: "26-33", color: "bg-[#ffba58]" },
            { label: "Sangat Berat", range: "34+", color: "bg-[#f94e67]" }
        ]
    };

    return (
        <div className="relative w-full h-85 group">
            <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />
            <div onClick={() => setFlipped(!flipped)} className="perspective w-full h-full cursor-pointer relative z-10">
                <div className={`relative w-full h-full transition-all duration-700 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
                    {/* DEPAN CARD */}
                    <div className="absolute inset-0 backface-hidden bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-[#292929] uppercase tracking-tight">{card.title}</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                                className="w-8 h-8 rounded-full bg-[#F2F2F2] border-2 border-[#292929] flex items-center justify-center text-[#292929] hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all cursor-pointer shadow-sm"
                            >
                                <span className="font-serif font-black text-xs">i</span>
                            </button>
                        </div>
                        <div className="relative py-10">
                            <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-1000 ease-out" style={{ left: `${percentage}%` }}>
                                <div className="bg-[#292929] text-[#FFFFFF] text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm mb-1 whitespace-nowrap border border-[#FFFFFF]/10">
                                    {category} | {card.score}
                                </div>
                                <div className="w-0.5 h-3 bg-[#292929]"></div>
                            </div>
                            <div className="w-full h-3.5 rounded-full border-2 border-[#292929] bg-gradient-to-r from-[#75b9e4] via-[#7aef92] via-[#fff771] via-[#ffba58] to-[#f94e67] overflow-hidden shadow-inner"></div>
                            <div className="flex justify-between mt-3 text-[10px] font-black text-[#292929]/40 uppercase tracking-widest">
                                <span>0</span>
                                <span>42</span>
                            </div>
                        </div>
                        <div className="text-center text-[10px] text-[#292929]/40 font-black uppercase tracking-wider">Klik kartu untuk afirmasi</div>
                    </div>
                    {/* BELAKANG CARD */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-1.5 bg-[#00BFFF] rounded-full mb-6" />
                        <p className="text-[#292929] text-base font-medium leading-relaxed italic">"{card.affirmation}"</p>
                    </div>
                </div>
            </div>

            {/* MODAL DETIL INFO SCALE */}
            {showInfo && (
                <div className="fixed inset-0 z-[700] flex items-center justify-center px-4 bg-[#292929]/70 backdrop-blur-sm" onClick={() => setShowInfo(false)}>
                    <div className="bg-[#FFFFFF] rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-[#292929] relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-black text-[#292929] uppercase tracking-tight">{card.title} Scale</h4>
                            <button onClick={() => setShowInfo(false)} className="text-[#292929]/40 hover:text-[#292929] text-3xl font-light cursor-pointer">&times;</button>
                        </div>
                        <div className="space-y-2.5">
                            {ranges[card.type].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border-2 border-[#292929] bg-[#FFFFFF] shadow-[2px_2px_0px_0px_#292929]">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full border border-[#292929]/20 ${item.color}`}></div>
                                        <span className="font-black text-sm text-[#292929] uppercase tracking-tight">{item.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-[#292929]/50">{item.range}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowInfo(false)} className="w-full mt-6 py-3.5 bg-[#00BFFF] border-2 border-[#292929] text-[#FFFFFF] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#292929] hover:opacity-90 transition active:scale-95 cursor-pointer">
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}