import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/user/Footer";

export default function Education() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/user/education", {
                    withCredentials: true
                });
                setPlaylists(response.data);
            } catch (err) {
                console.error("Gagal ambil data edukasi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

    return (
        <>
            <div className="w-full flex flex-col items-center pt-14 md:pt-24 pb-6 min-h-screen">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A245A] text-center px-4">
                    Growth isn’t always pretty — and that’s okay.
                </h1>
                <p className="text-gray-600 text-center mt-3 max-w-xl px-4">
                    Yuk, pelan-pelan belajar kenal diri lewat short videos & konten reflektif
                    yang ringan tapi ngena banget.
                </p>

                {loading ? (
                    <div className="mt-20">Loading playlists...</div>
                ) : (
                    <div className="mt-14 w-[90%] max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                        {playlists.map((item) => (
                            <Link
                                key={item.id}
                                to={`/education/${item.id}`}
                                className="flex flex-col items-center rounded-2xl p-6 bg-[#F8FBFF] border border-[#ADC7EA]"
                            >
                                <img
                                    src={`http://localhost:5000/uploads/learngrow/covers/${item.cover_image}`}
                                    alt={item.name}
                                    className="w-48 h-48 object-cover rounded-xl"
                                />
                                <p className="mt-2 font-bold text-lg text-[#0A245A] text-center">
                                    {item.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}