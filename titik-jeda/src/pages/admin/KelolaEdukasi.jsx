import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/learngrow";
const UPLOAD_URL = "http://localhost:5000/uploads/learngrow/covers";

export default function KelolaEdukasi() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [previewIcon, setPreviewIcon] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // State Input Form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    // Fungsi pembantu untuk handle gambar kosong
    const placeholderImg = "https://via.placeholder.com/150?text=No+Cover";

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 2000);
    };

    /* ======================
        LOAD PLAYLIST
    ====================== */
    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await axios.get(`${API_URL}/playlists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(res.data);
        } catch (error) {
            console.error("Gagal load playlist:", error);
        }
    };

    /* ======================
        CREATE PLAYLIST
    ====================== */
    const handleCreatePlaylist = async () => {
        if (!title || !description) return alert("Isi nama dan deskripsi!");

        const formData = new FormData();
        formData.append("name", title);
        formData.append("description", description);
        if (file) formData.append("cover_image", file);

        try {
            const token = localStorage.getItem("admin_token");

            await axios.post(
                `${API_URL}/playlists`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setShowAdd(false);
            setTitle("");
            setDescription("");
            setFile(null);
            setPreviewIcon(null);

            showSuccess("Playlist berhasil ditambahkan");
            fetchPlaylists();
        } catch (error) {
            console.error("Gagal tambah playlist:", error);
            alert(error.response?.data?.message || "Terjadi kesalahan pada server");
        }
    };

    /* ======================
        DELETE PLAYLIST
    ====================== */
    const handleDeletePlaylist = async () => {
        try {
            const token = localStorage.getItem("admin_token");

            await axios.delete(
                `${API_URL}/playlists/${selectedPlaylist.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShowDelete(false);
            showSuccess("Playlist berhasil dihapus");
            setCategories(
                categories.filter(
                    (c) => c.id !== selectedPlaylist.id
                )
            );
        } catch (error) {
            console.error("Gagal hapus playlist:", error);
        }
    };

    return (
        <>
            {/* TOMBOL TAMBAH PLAYLIST */}
            <div className="mb-6">
                <button
                    onClick={() => {
                        setPreviewIcon(null);
                        setTitle("");
                        setDescription("");
                        setShowAdd(true);
                    }}
                    className="bg-[#1A62C2] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#1551a3] transition-colors"
                >
                    + Tambah Playlist
                </button>
            </div>

            {/* GRID CARD LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-gray-50"
                    >
                        <div>
                            <img
                                src={cat.cover_image ? `${UPLOAD_URL}/${cat.cover_image}` : cd1}
                                alt={cat.name}
                                className="w-14 h-14 mb-4 object-cover rounded-lg"
                                onError={(e) => { e.target.src = cd1; }}
                            />
                            <h3 className="text-lg font-semibold text-[#0A1D48] mb-2">
                                {cat.name}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {cat.description}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => navigate(`/admin/kelola-edukasi/${cat.id}`)}
                                className="bg-[#1A62C2] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1551a3]"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedPlaylist(cat);
                                    setShowDelete(true);
                                }}
                                className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ======================
                MODAL TAMBAH (UI BARU)
            ====================== */}
            {showAdd && (
                <ModalWrapper>
                    <h3 className="font-bold text-xl mb-6 text-[#0A1D48]">
                        Tambah Playlist Baru
                    </h3>

                    <div className="space-y-5">
                        {/* Area Upload & Preview */}
                        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 rounded-xl bg-white shadow-sm overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                                {previewIcon ? (
                                    <img src={previewIcon} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-bold uppercase text-center">No Cover</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Cover Playlist</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1A62C2] file:text-white hover:file:bg-[#1551a3] cursor-pointer"
                                    onChange={(e) => {
                                        const fileObj = e.target.files[0];
                                        if (fileObj) {
                                            setFile(fileObj);
                                            setPreviewIcon(URL.createObjectURL(fileObj));
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Input Nama */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Playlist</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="Masukkan nama playlist..."
                            />
                        </div>

                        {/* Input Deskripsi */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Deskripsi Playlist</label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm"
                                placeholder="Jelaskan isi singkat playlist ini..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setShowAdd(false)}
                            className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleCreatePlaylist}
                            className="bg-[#1A62C2] text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-[#1551a3] transition-all"
                        >
                            Simpan Playlist
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* ======================
                MODAL DELETE (UI LAMA)
            ====================== */}
            {showDelete && (
                <ModalWrapper>
                    <p className="mb-4 text-gray-700">
                        Yakin ingin menghapus playlist{" "}
                        <strong className="text-red-600">
                            "{selectedPlaylist?.name}"
                        </strong>
                        ?
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDeletePlaylist}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 shadow-sm"
                        >
                            Hapus
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {

            /* ======================
                SUCCESS TOAST (UI LAMA)
            ====================== */}
            {successMessage && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                    <div className="bg-white rounded-2xl px-8 py-6 w-[320px] text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                            ✓
                        </div>
                        <p className="text-sm font-bold text-gray-800 tracking-wide">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

/* ======================
    MODAL WRAPPER
====================== */
function ModalWrapper({ children }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-[2px]">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                {children}
            </div>
        </div>
    );
}