import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "/api/admin/learngrow";

export default function KelolaEdukasi() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // FORM INPUT (Murni teks tanpa state file)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");

    /* ======================
            SUCCESS TOAST
       ====================== */
    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => {
            setSuccessMessage("");
        }, 2000);
    };

    /* ======================
            FETCH PLAYLIST
       ====================== */
    async function fetchPlaylists() {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await axios.get(`${API_URL}/playlists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error) {
            console.error("Gagal load playlist:", error);
            return [];
        }
    }

    /* ======================
            LOAD AWAL
       ====================== */
    useEffect(() => {
        fetchPlaylists().then(setCategories);
    }, []);

    /* ======================
            CREATE PLAYLIST
       ====================== */
    const handleCreatePlaylist = async () => {
        if (!title.trim() || !description.trim()) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }
        setFormError("");

        try {
            const token = localStorage.getItem("admin_token");

            // Kirim JSON biasa — backend menerima JSON untuk membuat playlist
            await axios.post(`${API_URL}/playlists`, {
                name: title,
                description: description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            // RESET STATE
            setShowAdd(false);
            setTitle("");
            setDescription("");
            setFormError("");

            showSuccess("Playlist berhasil ditambahkan");
            setCategories(await fetchPlaylists());
        } catch (error) {
            console.error("ERROR TAMBAH PLAYLIST:", error);
            if (error.response) {
                alert(error.response.data?.message || "Terjadi kesalahan pada server");
            } else {
                alert("Server tidak merespon");
            }
        }
    };

    /* ======================
            DELETE PLAYLIST
       ====================== */
    const handleDeletePlaylist = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            await axios.delete(`${API_URL}/playlists/${selectedPlaylist.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCategories(categories.filter((c) => c.id !== selectedPlaylist.id));
            setShowDelete(false);
            showSuccess("Playlist berhasil dihapus");
        } catch (error) {
            console.error("Gagal hapus playlist:", error);
        }
    };

    return (
        <div className="p-4 bg-[#FFFFFF] text-[#292929] min-h-screen">
            {/* BUTTON TAMBAH PLAYLIST */}
            <div className="mb-8">
                <button
                    onClick={() => {
                        setTitle("");
                        setDescription("");
                        setFormError("");
                        setShowAdd(true);
                    }}
                    className="bg-[#00BFFF] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
                >
                    + Tambah Playlist
                </button>
            </div>

            {/* GRID PLAYLIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl p-8 flex flex-col justify-between h-full shadow-sm transition-all hover:border-[#00BFFF]"
                        >
                            <div>
                                <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4" />

                                <h3 className="text-xl font-bold text-[#292929] mb-3 tracking-tight">
                                    {cat.name}
                                </h3>

                                <p className="text-sm text-[#292929]/70 leading-relaxed font-normal line-clamp-3">
                                    {cat.description}
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 mt-8">
                                <button
                                    onClick={() => navigate(`/admin/kelola-edukasi/${cat.id}`)}
                                    className="bg-[#F2F2F2] text-[#292929] text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all cursor-pointer"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedPlaylist(cat);
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
                        <p className="text-[#292929]/40 font-bold text-sm uppercase tracking-wider">Belum ada playlist edukasi terdaftar.</p>
                    </div>
                )}
            </div>

            {/* ================= MODAL: TAMBAH PLAYLIST (FORM COVER SUDAH HILANG TOTAL) ================= */}
            {showAdd && (
                <ModalWrapper>
                    <h3 className="font-black text-xl mb-6 tracking-tight text-[#292929]">
                        Tambah Playlist Baru
                    </h3>
                    {formError && (
                        <div className="mb-4 rounded-md bg-[#fff1f2] border border-[#fca5a5] text-[#b91c1c] px-4 py-3 text-sm font-medium">
                            {formError}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Input Nama */}
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">
                                Nama Playlist
                            </label>
                            <input
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setFormError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none transition-all text-sm font-medium"
                                placeholder="Masukkan nama playlist..."
                            />
                        </div>

                        {/* Input Deskripsi */}
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">
                                Deskripsi Playlist
                            </label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setFormError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
                                placeholder="Jelaskan isi singkat playlist ini..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setShowAdd(false)}
                            className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleCreatePlaylist}
                            className="bg-[#00BFFF] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-all cursor-pointer active:scale-95"
                        >
                            Simpan Playlist
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: DELETE ================= */}
            {showDelete && (
                <ModalWrapper>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">!</div>
                        <h3 className="font-black text-xl text-gray-800 tracking-tight">Hapus Playlist?</h3>
                        <p className="text-sm text-[#292929]/60 mt-2 leading-relaxed">
                            Playlist <span className="font-bold text-[#292929]">"{selectedPlaylist?.name}"</span> beserta seluruh isi video didalamnya akan dihapus permanen.
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
                            onClick={handleDeletePlaylist}
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