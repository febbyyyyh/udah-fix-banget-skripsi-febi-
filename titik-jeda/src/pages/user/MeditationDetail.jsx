import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/user/Footer";

export default function MeditationDetail() {
    const { id } = useParams(); // Mengambil ID dari URL
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/meditations/${id}/audios`, {
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

    if (loading) return <div className="text-center mt-20 font-medium text-gray-500">Menyiapkan ketenangan...</div>;
    if (!data) return <div className="text-center mt-20 text-red-500">Konten tidak ditemukan.</div>;

    return (
        <>
            <div className="w-full flex flex-col items-center pt-14 px-4 min-h-screen">

                {/* HEADER AREA */}
                <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-10">

                    {/* COVER IMAGE */}
                    <div className="bg-[#F8FBFF] rounded-3xl p-4 flex items-center justify-center">
                        <img
                            src={`http://localhost:5000/${data.category.cover_image}`}
                            alt={data.category.name}
                            className="w-40 h-40 md:w-36 md:h-36 object-cover rounded-2xl"
                        />
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a1d48]">
                            {data.category.name}
                        </h1>
                        <p className="text-gray-600 text-lg mt-4 leading-relaxed max-w-xl">
                            {data.category.description}
                        </p>
                    </div>
                </div>

                {/* AUDIO LIST */}
                <div className="w-full max-w-5xl mt-16 mb-20 flex flex-col gap-6">
                    {data.audios.length > 0 ? (
                        data.audios.map((audio, i) => (
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
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400">Belum ada audio meditasi di kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}