import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

export default function Education() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get("/api/user/education", {
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
        /* Dikunci penuh menggunakan warna dasar putih bersih (#FFFFFF) */
        <div className="w-full min-h-screen bg-[#FFFFFF] text-[#292929] flex flex-col justify-between relative overflow-hidden">

            {/* SEBARAN ELEMEN ORNAMEN TAMBAHAN (Dibatasi ketat di area atas/tengah agar tidak mengotori footer) */}
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

                {/* TITLE & HEADER */}
                <h1 className="text-4xl md:text-5xl font-black text-center leading-tight tracking-tight px-4 uppercase">
                    Growth isn’t always pretty — and that’s okay.
                </h1>

                {/* DESKRIPSI */}
                <p className="text-[#292929]/80 text-center mt-6 text-base sm:text-lg max-w-2xl px-4 leading-relaxed font-normal">
                    Yuk, pelan-pelan belajar kenal diri lewat short videos & konten reflektif
                    yang ringan tapi ngena banget.
                </p>

                {/* LOADING STATE */}
                {loading ? (
                    <div className="mt-24 mb-20 flex flex-col items-center">
                        <div className="rounded-full h-12 w-12 border-4 border-[#F2F2F2] border-b-[#00BFFF] animate-spin"></div>
                        <p className="mt-4 text-sm text-[#292929]/60 font-semibold">Menyiapkan materi belajar...</p>
                    </div>
                ) : (
                    /* PLAYLISTS CONTAINER - Menggunakan Neo-Brutalism Stacked Card Style */
                    <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {/* FIX: Ditambahkan validasi Array.isArray agar kebal dari Whitescreen */}
                        {Array.isArray(playlists) && playlists.length > 0 ? (
                            playlists.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/education/${item.id}`}
                                    className="group relative block rounded-3xl"
                                >
                                    {/* Efek Bayangan Solid Belakang */}
                                    <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />

                                    {/* Kontainer Card Utama - Dikunci Putih Bersih (bg-[#FFFFFF]) */}
                                    <div className="relative p-12 bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer h-full transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">

                                        {/* Aksen dekoratif garis minimalis hijau */}
                                        <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4 group-hover:w-16 transition-all duration-300" />

                                        <h3 className="text-2xl font-black tracking-tight text-[#292929] group-hover:text-[#00BFFF] transition-colors uppercase">
                                            {item.name}
                                        </h3>

                                        <span className="text-xs font-black text-[#00BFFF] mt-4 uppercase tracking-wider">
                                            Buka Materi →
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="relative group col-span-3 w-full">
                                <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />
                                <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-12 text-center">
                                    <p className="col-span-3 text-center font-black text-[#292929]/40 uppercase tracking-wider">
                                        Belum ada materi edukasi tersedia.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Alami tanpa Ornamen Mengganggu */}
            <Footer />
        </div>
    );
}