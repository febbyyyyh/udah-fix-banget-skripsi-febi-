import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KelolaMeditasi() {
    const navigate = useNavigate();
    const [meditations, setMeditations] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("admin_token");
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        fetchMeditations();
    }, []);

    const fetchMeditations = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/meditations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMeditations(res.data);
        } catch (error) {
            console.error("Gagal mengambil data meditasi", error);
        } finally {
            setLoading(false);
        }
    };

    const getCoverUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;

        // Pastikan tidak ada double slash jika path diawali '/'
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `http://localhost:5000${cleanPath}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 animate-pulse">
                    Memuat data meditasi...
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meditations.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50
                     flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                    <div>
                        {/* COVER */}
                        <div className="w-14 h-14 mb-4 rounded-lg overflow-hidden bg-blue-50">
                            {item.cover_image ? (
                                <img
                                    src={getCoverUrl(item.cover_image)}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                    No Cover
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-[#0a1d48] mb-2">
                            {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 line-clamp-3">
                            {item.description}
                        </p>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() =>
                                navigate(`/admin/kelola-meditasi/${item.id}`)
                            }
                            className="bg-[#1A62C2] text-white text-sm px-6 py-2 rounded-xl
                         hover:bg-[#154fa0] transition-all font-medium"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
