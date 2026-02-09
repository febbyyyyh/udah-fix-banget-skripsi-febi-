import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/user/Footer";

export default function EducationDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // Mengambil data playlist + videos dari endpoint yang kita buat tadi
                const response = await axios.get(`http://localhost:5000/api/user/education/${id}`, {
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

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center text-[#0A245A] font-bold">Memuat materi...</div>;
    }

    if (!data) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Materi tidak ditemukan.</p>
                <Link to="/education" className="text-[#0A245A] underline">Kembali ke Edukasi</Link>
            </div>
        );
    }

    const { playlist, videos } = data;

    return (
        <>
            {/* PAGE CONTENT */}
            <div className="w-full flex flex-col items-center pt-10 px-4 min-h-screen">
                <div className="w-full max-w-5xl">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div className="rounded-xl p-6 bg-[#F8FBFF] border-[#DDE9F8]">
                            <img
                                src={`http://localhost:5000/uploads/learngrow/covers/${playlist.cover_image}`}
                                alt={playlist.name}
                                className="w-56 h-56 object-cover rounded-lg"
                            />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-[#0A245A]">
                                {playlist.name}
                            </h1>
                            <p className="mt-4 text-gray-700 max-w-lg text-lg leading-relaxed">
                                {playlist.description}
                            </p>
                        </div>
                    </div>

                    {/* VIDEO GRID */}
                    <div className="mt-12 mb-20">
                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {videos.map((video, i) => (
                                    <div
                                        key={video.id}
                                        onClick={() => setPreview(video)}
                                        className="relative bg-[#F8FBFF] rounded-2xl overflow-hidden border border-[#DDE9F8] cursor-pointer transition hover:border-[#C7DBF4]"
                                    >
                                        {/* VIDEO THUMBNAIL (SNEAK PEEK) */}
                                        <div className="w-full h-48 bg-slate-200 overflow-hidden">
                                            <video
                                                src={`http://localhost:5000/uploads/learngrow/videos/${video.video_file}#t=0.1`}
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                        </div>

                                        {/* PLAY BUTTON ICON */}
                                        <div className="absolute inset-0 flex items-center justify-center mb-10">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#0A245A] ml-0.5" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* VIDEO TITLE */}
                                        <div className="px-4 py-4 bg-white border-t border-[#DDE9F8]">
                                            <h3 className="text-sm font-semibold text-[#0A245A] line-clamp-2">
                                                {video.title}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Belum ada video di playlist ini.</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* VIDEO PREVIEW MODAL */}
            {preview && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setPreview(null)}
                >
                    <div
                        className="relative bg-black rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light z-10 transition-colors"
                            onClick={() => setPreview(null)}
                        >
                            ✕
                        </button>

                        <div className="p-2 bg-slate-900 text-white text-center text-sm font-medium border-b border-white/10">
                            {preview.title}
                        </div>

                        <video
                            src={`http://localhost:5000/uploads/learngrow/videos/${preview.video_file}`}
                            controls
                            autoPlay
                            className="w-full max-h-[75vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}