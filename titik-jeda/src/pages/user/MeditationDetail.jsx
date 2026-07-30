import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/user/Footer";

// FIX: ELEMEN BERWARNA CERAH (Biru Elektrik)
const TinySparkle = ({ className }) => (
    <svg className={`w-8 h-8 text-[#00BFFF]/40 absolute z-0 pointer-events-none ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
);

// FIX: ELEMEN BERWARNA CERAH (Hijau Limau)
const TinyCircle = ({ className }) => (
    <div className={`w-6 h-6 rounded-full border-4 border-[#ADFF2F]/60 absolute z-0 pointer-events-none ${className}`} />
);

// FIX: ELEMEN BERWARNA CERAH (Oranye)
const TinyTriangle = ({ className }) => (
    <svg className={`w-6 h-6 text-[#FF8C00]/40 absolute z-0 pointer-events-none ${className} transform rotate-45`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 22H2L12 2Z" />
    </svg>
);

export default function MeditationDetail() {
    const { id } = useParams(); // Mengambil ID dari URL
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const response = await axios.get(`/api/user/meditations/${id}/audios`, {
                    withCredentials: true
                });
                setData(response.data);
            } catch (error) {
                console.error("Gagal mengambil audio:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAudios();
    }, [id]);

    // Loading State dengan warna spinner cerah berlatar putih bersih
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#FFFFFF] flex items-center justify-center text-[#292929] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none z-0">
                    <TinySparkle className="top-36 left-8 animate-pulse" />
                    <TinyTriangle className="top-40 right-12" />
                </div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="rounded-full h-12 w-12 border-4 border-[#ADFF2F] border-b-[#00BFFF] animate-spin"></div>
                    <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#292929]/60">Menyiapkan ketenangan...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full min-h-screen bg-[#FFFFFF] flex items-center justify-center text-[#292929] relative overflow-hidden">
                <p className="font-black text-lg text-slate-400 relative z-10 uppercase tracking-wider">Konten tidak ditemukan.</p>
            </div>
        );
    }

    return (
        /* Dikunci penuh menggunakan warna dasar putih bersih murni (#FFFFFF) tanpa gradasi warna */
        <div className="w-full min-h-screen bg-[#FFFFFF] text-[#292929] flex flex-col justify-between relative overflow-hidden">

            {/* SEBARAN ELEMEN ORNAMEN ABSTRAK BERWARNA (Dibatasi ketat di area atas/tengah agar footer aman polos) */}
            <div className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none z-0">
                {/* Cluster Atas Kiri & Kanan */}
                <TinySparkle className="top-36 left-8 md:left-16 animate-pulse" />
                <TinyCircle className="top-56 left-20 md:left-32 animate-bounce duration-[1500ms]" />
                <TinyTriangle className="top-40 right-12 md:right-24" />
                <TinySparkle className="top-64 right-24 md:right-40" />

                {/* Cluster Tengah Kiri & Kanan */}
                <TinyTriangle className="top-[420px] left-10 md:left-24" />
                <TinySparkle className="top-[520px] left-28 md:left-48" />
                <TinyCircle className="top-[450px] right-14 md:right-28 animate-bounce duration-[1800ms]" />
                <TinyTriangle className="top-[560px] right-28 md:right-52" />
            </div>

            <div className="w-full flex flex-col items-center pt-48 px-4 relative z-10">

                {/* HEADER AREA */}
                <div className="w-full max-w-4xl bg-[#FFFFFF] border-4 border-[#292929] p-6 sm:p-8 rounded-3xl flex flex-col items-center md:items-start text-center md:text-left shadow-[4px_4px_0px_0px_#292929]">
                    <div className="w-12 h-1.5 bg-[#ADFF2F] rounded-full mb-4" />

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
                        {data.category.name}
                    </h1>

                    <p className="text-[#292929]/80 text-sm sm:text-base mt-4 leading-relaxed font-normal max-w-2xl">
                        {data.category.description}
                    </p>
                </div>

                {/* AUDIO LIST AREA */}
                <div className="w-full max-w-4xl mt-12 mb-20 flex flex-col gap-6">
                    {data.audios.length > 0 ? (
                        data.audios.map((audio) => (
                            <div key={audio.id} className="relative group">
                                {/* Efek Bayangan Solid Hitam di Belakang Card */}
                                <div className="absolute inset-0 bg-[#292929] rounded-2xl translate-x-1.5 translate-y-1.5" />

                                {/* Kontainer Pemutar Audio Utama dengan Border Tebal */}
                                <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-2xl p-6 flex flex-col transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-black text-lg text-[#292929] uppercase tracking-tight">
                                            {audio.title}
                                        </p>
                                    </div>
                                    <audio
                                        controls
                                        src={'http://localhost:5000/' + String(audio.audio_file || '').replace(/^\/+/, '')}
                                        className="w-full bg-[#F2F2F2] rounded-xl border border-[#292929]/10"
                                        onPlay={() => window.dispatchEvent(new Event("stop-relaxation-music"))}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Kosong State Box */
                        <div className="relative group w-full">
                            <div className="absolute inset-0 bg-[#00BFFF] rounded-3xl translate-x-2 translate-y-2" />
                            <div className="relative bg-[#FFFFFF]/40 backdrop-blur-md border-4 border-[#292929] rounded-3xl p-12 text-center">
                                <p className="text-[#292929] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                                    Belum ada audio meditasi di kategori ini.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Bagian Footer - Mengalir alami nempel putih murni tanpa sekat abu-abu penggantung */}
            <Footer />
        </div>
    );
}