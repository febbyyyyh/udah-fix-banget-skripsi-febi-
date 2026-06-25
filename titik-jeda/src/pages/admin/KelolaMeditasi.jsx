import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KelolaMeditasi() {
    const navigate = useNavigate();
    const [meditations, setMeditations] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("admin_token");

    useEffect(() => {
        fetchMeditations();
    }, []);

    const fetchMeditations = async () => {
        try {
            const res = await axios.get(`/api/admin/meditations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMeditations(res.data);
        } catch (error) {
            console.error("Gagal mengambil data meditasi", error);
        } finally {
            setLoading(false);
        }
    };

    // Kustom Spinner Loading Penyelaras Tema Utama
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-[#292929]">
                <div className="rounded-full h-10 w-10 border-4 border-[#F2F2F2] border-b-[#00BFFF] animate-spin"></div>
                <p className="mt-4 text-xs font-bold text-[#292929]/40 uppercase tracking-widest">
                    Memuat data meditasi...
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FFFFFF] text-[#292929]">
            {meditations.length > 0 ? (
                meditations.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#FFFFFF] rounded-3xl p-8 border-2 border-[#F2F2F2] flex flex-col justify-between h-full transition-all hover:border-[#00BFFF] shadow-sm"
                    >
                        <div>
                            {/* Gambar Cover Dihapus Total, Diganti Aksen Garis Ornamen Hijau Minimalis */}
                            <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4" />

                            {/* Judul Kategori Menggunakan font-bold Proporsional */}
                            <h3 className="text-xl font-bold tracking-tight text-[#292929] mb-3">
                                {item.name}
                            </h3>

                            {/* Deskripsi Menggunakan Teks Normal Regulasi */}
                            <p className="text-sm text-[#292929]/70 leading-relaxed line-clamp-3 font-normal">
                                {item.description}
                            </p>
                        </div>

                        {/* Tombol Kontrol Aksi Diubah ke Skema Warna Eksklusif Baru */}
                        <div className="flex justify-end mt-8">
                            <button
                                type="button"
                                onClick={() => navigate(`/admin/kelola-meditasi/${item.id}`)}
                                className="bg-[#00BFFF] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-95 cursor-pointer"
                            >
                                Edit Sesi
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                /* Kosong State Area */
                <div className="col-span-3 text-center py-16 bg-[#FFFFFF] border-2 border-dashed border-[#00BFFF] rounded-3xl p-8">
                    <p className="text-[#292929]/40 font-bold text-sm uppercase tracking-wider">Belum ada kategori meditasi terdaftar.</p>
                </div>
            )}
        </div>
    );
}