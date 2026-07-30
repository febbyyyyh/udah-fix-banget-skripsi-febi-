import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KelolaMeditasi() {
    const navigate = useNavigate();
    const [meditations, setMeditations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // FORM INPUT
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryType, setCategoryType] = useState("general");

    const token = localStorage.getItem("admin_token");

    useEffect(() => {
        fetchMeditations();
    }, []);

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => {
            setSuccessMessage("");
        }, 2000);
    };

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

    const handleCreateCategory = async () => {
        if (!title.trim() || !description.trim()) {
            alert("Nama dan deskripsi wajib diisi.");
            return;
        }

        try {
            const formData = {
                name: title,
                description,
                category_type: categoryType
            };

            await axios.post(`/api/admin/meditations`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            setShowAdd(false);
            setTitle("");
            setDescription("");
            setCategoryType("general");

            showSuccess("Kategori berhasil ditambahkan");
            fetchMeditations();
        } catch (error) {
            console.error("ERROR TAMBAH KATEGORI:", error);
            alert(error.response?.data?.message || "Terjadi kesalahan pada server");
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`/api/admin/meditations/${selectedCategory.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMeditations(meditations.filter((c) => c.id !== selectedCategory.id));
            setShowDelete(false);
            showSuccess("Kategori berhasil dihapus");
        } catch (error) {
            console.error("Gagal hapus kategori:", error);
            alert("Gagal menghapus kategori");
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
        <div className="p-4 bg-[#FFFFFF] text-[#292929] min-h-screen">
            {/* BUTTON TAMBAH KATEGORI */}
            <div className="mb-8">
                <button
                    onClick={() => {
                        setTitle("");
                        setDescription("");
                        setCategoryType("general");
                        setShowAdd(true);
                    }}
                    className="bg-[#00BFFF] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
                >
                    + Tambah Kategori
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {meditations.length > 0 ? (
                    meditations.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#FFFFFF] rounded-3xl p-8 border-2 border-[#F2F2F2] flex flex-col justify-between h-full transition-all hover:border-[#00BFFF] shadow-sm"
                        >
                            <div>
                                <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4" />
                                <h3 className="text-xl font-bold tracking-tight text-[#292929] mb-3">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-[#292929]/70 leading-relaxed line-clamp-3 font-normal">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 mt-8">
                                <button
                                    onClick={() => navigate(`/admin/kelola-meditasi/${item.id}`)}
                                    className="bg-[#F2F2F2] text-[#292929] text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all cursor-pointer"
                                >
                                    Edit Sesi
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(item);
                                        setShowDelete(true);
                                    }}
                                    className="bg-red-50 text-red-500 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-16 bg-[#FFFFFF] border-2 border-dashed border-[#00BFFF] rounded-3xl p-8">
                        <p className="text-[#292929]/40 font-bold text-sm uppercase tracking-wider">Belum ada kategori meditasi terdaftar.</p>
                    </div>
                )}
            </div>

            {/* ================= MODAL: TAMBAH KATEGORI ================= */}
            {showAdd && (
                <ModalWrapper>
                    <h3 className="font-black text-xl mb-6 tracking-tight text-[#292929]">
                        Tambah Kategori Meditasi Baru
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">
                                Nama Kategori
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none transition-all text-sm font-medium"
                                placeholder="Masukkan nama kategori..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">
                                Deskripsi
                            </label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
                                placeholder="Jelaskan isi singkat kategori ini..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">
                                Tipe Kategori DASS-21
                            </label>
                            <select
                                value={categoryType}
                                onChange={(e) => setCategoryType(e.target.value)}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none transition-all text-sm font-medium"
                            >
                                <option value="general">General (Umum)</option>
                                <option value="depression">Depression (Depresi)</option>
                                <option value="anxiety">Anxiety (Kecemasan)</option>
                                <option value="stress">Stress (Stres)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setShowAdd(false)}
                            className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleCreateCategory}
                            className="bg-[#00BFFF] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-all cursor-pointer active:scale-95"
                        >
                            Simpan Kategori
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: DELETE ================= */}
            {showDelete && (
                <ModalWrapper>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">!</div>
                        <h3 className="font-black text-xl text-gray-800 tracking-tight">Hapus Kategori?</h3>
                        <p className="text-sm text-[#292929]/60 mt-2 leading-relaxed">
                            Kategori <span className="font-bold text-[#292929]">"{selectedCategory?.name}"</span> beserta seluruh isi audio didalamnya akan dihapus permanen.
                        </p>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDeleteCategory}
                            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= TOAST SUCCESS ================= */}
            {successMessage && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[800]">
                    <div className="bg-[#292929] text-[#FFFFFF] rounded-xl px-6 py-3 shadow-md flex items-center gap-3">
                        <span className="bg-[#ADFF2F] text-[#292929] w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">✓</span>
                        <p className="text-xs font-bold uppercase tracking-wider">{successMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function ModalWrapper({ children }) {
    return (
        <div className="fixed inset-0 bg-[#292929]/50 flex items-center justify-center z-[700] px-4 backdrop-blur-sm transition-all">
            <div className="bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-3xl p-8 w-full max-w-lg shadow-xl">
                {children}
            </div>
        </div>
    );
}