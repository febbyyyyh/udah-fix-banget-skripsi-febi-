import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "/api/admin/learngrow";
const UPLOAD_URL = "/uploads/learngrow/covers";

export default function KelolaEdukasi() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [previewIcon, setPreviewIcon] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // FORM INPUT
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const placeholderImg = "https://via.placeholder.com/150?text=No+Cover";

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

            setCategories(res.data);
        } catch (error) {
            console.error("Gagal load playlist:", error);
        }
    }

    /* ======================
            LOAD AWAL
        ====================== */
    useEffect(() => {
        fetchPlaylists();
    }, []);

    /* ======================
            CREATE PLAYLIST
        ====================== */
    const handleCreatePlaylist = async () => {
        if (!title.trim() || !description.trim() || !file) {
            alert("Semua kolom wajib diisi.");
            return;
        }

        try {
            const token = localStorage.getItem("admin_token");

            const formData = new FormData();

            formData.append("name", title);
            formData.append("description", description);
            formData.append("cover_image", file);

            console.log("FORM DATA:");
            console.log("name:", title);
            console.log("description:", description);
            console.log("file:", file);

            await axios.post(`${API_URL}/playlists`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // RESET
            setShowAdd(false);
            setTitle("");
            setDescription("");
            setFile(null);
            setPreviewIcon(null);

            showSuccess("Playlist berhasil ditambahkan");

            fetchPlaylists();
        } catch (error) {
            console.error("ERROR TAMBAH PLAYLIST:");
            console.error(error);

            if (error.response) {
                console.error("Response:", error.response.data);

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
        <>
            {/* BUTTON TAMBAH */}
            <div className="mb-6">
                <button
                    onClick={() => {
                        setPreviewIcon(null);
                        setTitle("");
                        setDescription("");
                        setFile(null);
                        setShowAdd(true);
                    }}
                    className="bg-[#1A62C2] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#1551a3]"
                >
                    + Tambah Playlist
                </button>
            </div>

            {/* GRID PLAYLIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
                    >
                        <div>
                            <img
                                src={
                                    cat.cover_image
                                        ? `${UPLOAD_URL}/${cat.cover_image}`
                                        : placeholderImg
                                }
                                alt={cat.name}
                                className="w-14 h-14 mb-4 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = placeholderImg;
                                }}
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

            {/* ================= MODAL: TAMBAH PLAYLIST (SINKRON) ================= */}
            {showAdd && (
                <ModalWrapper>
                    <h3 className="font-bold text-lg mb-6 text-[#0A1D48]">
                        Tambah Playlist Baru
                    </h3>

                    <div className="space-y-4">
                        {/* Area Upload & Preview */}
                        <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                            <div className="w-20 h-20 rounded-xl bg-white shadow-sm overflow-hidden border border-blue-100 flex items-center justify-center shrink-0">
                                {previewIcon ? (
                                    <img
                                        src={previewIcon}
                                        className="w-full h-full object-cover"
                                        alt="Preview"
                                    />
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-bold uppercase text-center px-2">
                                        No Cover
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                    Cover Playlist
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1551a3] file:text-white cursor-pointer"
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
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Nama Playlist
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="Masukkan nama playlist..."
                            />
                        </div>

                        {/* Input Deskripsi */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Deskripsi Playlist
                            </label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all text-sm"
                                placeholder="Jelaskan isi singkat playlist ini..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => {
                                setShowAdd(false);
                                setPreviewIcon(null);
                            }}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleCreatePlaylist}
                            className="bg-[#1551a3] text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:bg-[#123f86] transition-all"
                        >
                            Simpan Playlist
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* MODAL DELETE */}
            {showDelete && (
                <ModalWrapper>
                    <p className="mb-4 text-gray-700">
                        Yakin ingin menghapus playlist{" "}
                        <strong className="text-red-600">"{selectedPlaylist?.name}"</strong>
                        ?
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
                        >
                            Batal
                        </button>

                        <button
                            onClick={handleDeletePlaylist}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Hapus
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* SUCCESS TOAST */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-2xl px-8 py-6 w-[320px] text-center shadow-2xl">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                            ✓
                        </div>

                        <p className="text-sm font-bold text-gray-800">{successMessage}</p>
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
