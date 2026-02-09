import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../../components/user/Footer";

// Asset internal
import med1 from "../../assets/med-1.svg";

export default function Meditation() {
    const [meditations, setMeditations] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil data tipe meditasi umum
                const resMed = await axios.get("http://localhost:5000/api/user/meditations", {
                    withCredentials: true
                });
                setMeditations(resMed.data);

                // 2. Ambil data rekomendasi berdasarkan hasil DASS-21
                const resRec = await axios.get("http://localhost:5000/api/user/meditation/recommendation", {
                    withCredentials: true
                });

                if (resRec.data && resRec.data.data) {
                    setRecommendations(resRec.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="w-full flex flex-col items-center pt-14 px-4 min-h-screen">
                {/* TITLE */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a1d48] text-center">
                    Put your earphones on
                </h1>

                {/* SUBTEXT */}
                <p className="text-gray-600 max-w-2xl text-center mt-4 leading-relaxed">
                    Ambil posisi paling nyaman, tarik napas, dan biarin suaranya nemenin kamu buat
                    nenangin pikiran. Pilih tipe meditasi sesuai kebutuhan kamu, dan temukan
                    ketenangan di setiap sesi.
                </p>

                {/* CARDS CONTAINER (TOP SECTION) */}
                {loading ? (
                    <div className="mt-20 flex flex-col items-center">
                        <div className="rounded-full h-12 w-12 border-b-2 border-[#0a1d48] animate-spin"></div>
                        <p className="mt-4 text-gray-500">Mencari ketenangan...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 max-w-6xl w-full">
                        {meditations.length > 0 ? (
                            meditations.map((item) => (
                                <Link key={item.id} to={`/meditation/${item.id}`} className="group">
                                    <div className="p-10 bg-[#F8FBFF] border border-[#ADC7EA] rounded-3xl flex flex-col items-center text-center cursor-pointer h-full">
                                        <img
                                            src={`http://localhost:5000/${item.cover_image}`}
                                            alt={item.name}
                                            className="w-24 h-24 mb-6 object-cover rounded-2xl"
                                            onError={(e) => { e.target.src = med1; }}
                                        />
                                        <h3 className="text-xl font-bold text-[#0A245A] group-hover:text-[#1a3a7a] transition-colors">{item.name}</h3>
                                        {/* Deskripsi sudah dihapus */}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="col-span-3 text-center text-gray-400">Belum ada tipe meditasi tersedia.</p>
                        )}
                    </div>
                )}

                {/* Section 2 - Recommendations (Tetap ada audionya) */}
                <div className="w-full max-w-5xl mt-28 mb-20">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1d48] mb-10 text-center md:text-left">
                        Meditation picks based on your DASS-21 results
                    </h2>

                    <div className="flex flex-col gap-6">
                        {recommendations && recommendations.data.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                <div className="bg-[#eef5ff] border border-blue-100 px-6 py-3 rounded-full self-start mb-2">
                                    <p className="text-[#0a1d48] font-semibold text-sm">
                                        Rekomendasi Utama: <span className="capitalize">{recommendations.category_name}</span>
                                    </p>
                                </div>

                                {recommendations.data.map((audio) => (
                                    <div
                                        key={audio.id}
                                        className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col transition-colors"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="font-bold text-[#0a1d48]">
                                                {audio.title}
                                            </p>
                                        </div>
                                        <audio
                                            controls
                                            src={`http://localhost:5000/${audio.audio_file}`.replace(/([^:]\/)\/+/g, "$1")}
                                            className="w-full bg-[#F5F7FA] rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#F8FBFF] border border-dashed border-[#ADC7EA] rounded-2xl p-10 text-center">
                                <p className="text-gray-500 italic">
                                    Selesaikan tes DASS-21 terlebih dahulu untuk mendapatkan rekomendasi audio yang tepat untuk kondisi mentalmu saat ini.
                                </p>
                                <Link to="/dass">
                                    <button className="mt-4 px-6 py-2 bg-[#0a1d48] text-white rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all">
                                        Ambil Tes Sekarang
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}