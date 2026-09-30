import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/user/Footer";

// ELEMEN TAMBAHAN: ORNAMEN BINTANG LEBIH PEKAT & BESAR
const TinySparkle = ({ className }) => (
    <svg className={`w-8 h-8 text-[#00BFFF]/60 absolute z-0 pointer-events-none ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
);

// ELEMEN TAMBAHAN: ORNAMEN LINGKARAN DONUT LEBIH JELAS
const TinyCircle = ({ className }) => (
    <div className={`w-6 h-6 rounded-full border-4 border-[#ADFF2F]/70 absolute z-0 pointer-events-none ${className}`} />
);

// ELEMEN TAMBAHAN: ORNAMEN SEGITIGA MINI LEBIH KELIHATAN
const TinyTriangle = ({ className }) => (
    <svg className={`w-6 h-6 text-[#292929]/25 absolute z-0 pointer-events-none ${className} transform rotate-45`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 22H2L12 2Z" />
    </svg>
);

export default function EducationDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);

    // Otomatis matikan musik relaksasi ketika modal preview video dibuka (karena autoPlay)
    useEffect(() => {
        if (preview) {
            window.dispatchEvent(new Event("stop-relaxation-music"));
        }
    }, [preview]);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`/api/user/education/${id}`, {
                    withCredentials: true
                });
                setData(response.data);
            } catch (err) {
                console.error("Error fetching education detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // Loading State dengan warna spinner cerah tanpa unsur gelap
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#FFFFFF] flex items-center justify-center text-[#292929] relative overflow-hidden">
                <div className="flex flex-col items-center relative z-10">
                    <div className="rounded-full h-12 w-12 border-4 border-[#ADFF2F] border-b-[#00BFFF] animate-spin"></div>
                    <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#292929]/60">Memuat materi...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center text-[#292929] relative overflow-hidden">
                <p className="text-[#292929]/50 mb-4 font-black uppercase tracking-wider">Materi tidak ditemukan.</p>
                <Link to="/education" className="text-[#00BFFF] font-black uppercase tracking-wide underline decoration-4 decoration-[#ADFF2F] underline-offset-4">Kembali ke Edukasi</Link>
            </div>
        );
    }

    const { playlist, videos } = data;

    return (
        /* Dikunci penuh menggunakan warna dasar putih bersih (#FFFFFF) */
        <div className="w-full min-h-screen bg-[#FFFFFF] text-[#292929] flex flex-col justify-between relative overflow-hidden">

            {/* SEBARAN ELEMEN ORNAMEN TAMBAHAN (Dibatasi ketat di area atas/tengah agar tidak masuk ke footer) */}
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
                <div className="w-full max-w-5xl">

                    {/* HEADER */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        {/* Aksen garis dekoratif pengganti visual cover */}
                        <div className="w-12 h-1.5 bg-[#ADFF2F] rounded-full mb-4" />

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase">
                            {playlist.name}
                        </h1>

                        <p className="mt-5 text-[#292929]/80 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                            {playlist.description}
                        </p>
                    </div>

                    {/* VIDEO GRID (MODIFIKASI: Card Menggunakan Konsep Bertumpuk Solid Neo-Brutalism) */}
                    <div className="mt-16 mb-20">
                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {videos.map((video) => (
                                    <div
                                        key={video.id}
                                        onClick={() => setPreview(video)}
                                        className="relative group rounded-2xl cursor-pointer"
                                    >
                                        {/* Efek Bayangan Solid Belakang */}
                                        <div className="absolute inset-0 bg-[#292929] rounded-2xl translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />

                                        {/* Kontainer Card Utama - Dikunci Putih Bersih */}
                                        <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">

                                            {/* VIDEO THUMBNAIL WRAPPER */}
                                            <div className="w-full h-48 bg-[#F2F2F2] overflow-hidden relative border-b-4 border-[#292929]">
                                                <video
                                                    src={`http://172.16.222.8:5000/uploads/learngrow/videos/${video.video_file}#t=0.1`}
                                                    className="w-full h-full object-cover pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
                                                />

                                                {/* PLAY BUTTON ICON OVERLAY */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-[#FFFFFF] border-2 border-[#292929] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#00BFFF] ml-0.5" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* VIDEO TITLE PANEL */}
                                            <div className="px-5 py-5 bg-[#FFFFFF]">
                                                <h3 className="text-sm font-black text-[#292929] line-clamp-2 leading-relaxed group-hover:text-[#00BFFF] transition-colors uppercase">
                                                    {video.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Kosong State Box */
                            <div className="relative group w-full">
                                <div className="absolute inset-0 bg-[#00BFFF] rounded-3xl translate-x-2 translate-y-2" />
                                <div className="relative bg-[#FFFFFF]/40 backdrop-blur-md border-4 border-[#292929] rounded-3xl p-12 text-center">
                                    <p className="text-[#292929] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                                        Belum ada video di playlist ini.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Alami Menempel Rapi tanpa Ornamen/Warna Abu-Abu Tambahan */}
            <Footer />

            {/* VIDEO PREVIEW MODAL */}
            {preview && (
                <div
                    className="fixed inset-0 bg-[#292929]/80 backdrop-blur-sm flex items-center justify-center z-[600] p-4"
                    onClick={() => setPreview(null)}
                >
                    <div
                        className="relative bg-[#292929] border-4 border-[#FFFFFF] rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tombol Close Pojok Atas */}
                        <button
                            className="absolute top-4 right-4 text-[#FFFFFF]/70 hover:text-[#FFFFFF] text-2xl font-light z-10 transition-colors"
                            onClick={() => setPreview(null)}
                        >
                            ✕
                        </button>

                        {/* Title Bar Video Modal */}
                        <div className="p-4 bg-[#292929] text-[#FFFFFF] text-center text-sm font-black border-b-4 border-[#FFFFFF]/10 tracking-wide uppercase">
                            {preview.title}
                        </div>

                        {/* Video Frame */}
                        <video
                            src={`http://172.16.222.8:5000/uploads/learngrow/videos/${preview.video_file}`}
                            controls
                            autoPlay
                            className="w-full max-h-[70vh] object-contain bg-black"
                            onPlay={() => window.dispatchEvent(new Event("stop-relaxation-music"))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}