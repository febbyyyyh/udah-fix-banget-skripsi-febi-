import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

/* assets */
import editIcon from "../../assets/edit-ikon.svg";

export default function KelolaIsiMeditasi() {
    const { id } = useParams();
    const navigate = useNavigate(); // Tambahkan ini
    const token = localStorage.getItem("admin_token");

    /* ================= STATE ================= */
    const [category, setCategory] = useState(null);
    const [audios, setAudios] = useState([]);
    const [selectedAudio, setSelectedAudio] = useState(null);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [audioFile, setAudioFile] = useState(null); // State untuk file audio
    const [catName, setCatName] = useState("");
    const [catDesc, setCatDesc] = useState("");
    const [catImageFile, setCatImageFile] = useState(null);
    const [previewCategoryCover, setPreviewCategoryCover] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    /* ================= EFFECT ================= */
    useEffect(() => {
        fetchCategory();
        fetchAudios();
    }, [id]);

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 2000);
    };

    /* ================= FETCH DATA ================= */
    const fetchCategory = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/admin/meditations/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Simpan data apa adanya dari database
            setCategory(res.data);
            setCatName(res.data.name);
            setCatDesc(res.data.description);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAudios = async () => {
        try {
            // Tambahkan timestamp agar browser tidak mengambil dari cache
            const res = await axios.get(`http://localhost:5000/api/admin/meditations/${id}/audios?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Data Audio Terbaru:", res.data);

            // Gunakan spread operator untuk memastikan React mendeteksi perubahan state
            setAudios([...res.data]);
        } catch (err) {
            console.error("Gagal ambil audio:", err);
            setAudios([]);
        }
    };

    /* ================= LOGIC CRUD ================= */
    const handleSaveAudio = async () => {
        if (!title) return alert("Judul wajib diisi");
        if (showAdd && !audioFile) return alert("File audio wajib diunggah");

        const formData = new FormData();
        formData.append("title", title);
        if (audioFile) formData.append("audio_file", audioFile);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            let response;
            if (showAdd) {
                response = await axios.post(`http://localhost:5000/api/admin/meditations/${id}/audios`, formData, config);
            } else {
                response = await axios.put(`http://localhost:5000/api/admin/meditations/${id}/audios/${selectedAudio.id}`, formData, config);
            }

            if (response.status === 200 || response.status === 201) {
                // Tutup semua modal dulu
                setShowAdd(false);
                setShowEdit(false);

                // Reset form
                setTitle("");
                setAudioFile(null);

                // Tampilkan sukses
                showSuccess("Data berhasil disimpan!");

                // AMBIL DATA TERBARU
                console.log("Fetching ulang data audio...");
                await fetchAudios();
            }
        } catch (err) {
            console.error("Gagal simpan:", err.response?.data || err.message);
        }
    };

    const handleDeleteAudio = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/meditations/${id}/audios/${selectedAudio.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDelete(false);
            fetchAudios();
            showSuccess("Audio berhasil dihapus");
        } catch (err) { console.error(err); }
    };

    const handleUpdateCategory = async () => {
        const formData = new FormData();
        formData.append("name", catName);
        formData.append("description", catDesc);

        if (catImageFile) {
            formData.append("cover_image", catImageFile);
        }

        try {
            const res = await axios.put(
                `http://localhost:5000/api/admin/meditations/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            // --- PERBAIKAN DI SINI ---
            // Daripada ribet manipulasi state manual yang rawan error, 
            // lebih aman panggil ulang fungsi fetch data-nya
            await fetchCategory();

            setShowEditCategory(false);
            setPreviewCategoryCover(null);
            setCatImageFile(null);

            showSuccess("Kategori berhasil diperbarui");
        } catch (err) {
            console.error("Error detail:", err.response?.data || err.message);
            alert("Gagal update kategori: " + (err.response?.data?.message || "Terjadi kesalahan"));
        }
    };

    if (!category) return null;

    const API_BASE = "http://localhost:5000";

    const getCoverUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;

        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE}${cleanPath}`;
        // Pastikan API_BASE bernilai "http://localhost:5000"
    };

    return (
        <div className="p-4">
            {/* Tombol Kembali ke KelolaMeditasi */}
            <button
                onClick={() => navigate("/admin/kelola-meditasi")}
                className="mb-4 text-sm text-[#1A62C2] font-semibold hover:underline flex items-center gap-2"
            >
                ← Kembali ke Kelola Meditasi
            </button>

            {/* ================= INFO PLAYLIST ================= */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 max-w-5xl relative border border-gray-100">
                {/* TOMBOL EDIT - Tetap pakai editIcon dari Assets */}
                <button
                    onClick={() => setShowEditCategory(true)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <img
                        src={editIcon} // PAKAI ASSETS EDIT ICON
                        className="w-5 h-5"
                        alt="Edit Icon"
                    />
                </button>

                <div className="flex gap-6 items-center">
                    {/* GAMBAR COVER - Ambil dari Database */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-blue-50">
                        <img
                            src={previewCategoryCover || getCoverUrl(category.cover_image)}
                            className="w-full h-full object-cover"
                            alt="Cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Cover"; }}
                        />
                    </div>

                    <div>
                        <h3 className="font-bold text-xl text-[#0A1D48]">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{category.description}</p>
                    </div>
                </div>
            </div>

            {/* ================= TABLE AUDIO ================= */}
            <div className="bg-white rounded-2xl p-6 shadow-sm max-w-5xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg text-[#0A1D48]">Daftar Audio Meditasi</h2>
                    <button
                        onClick={() => { setTitle(""); setAudioFile(null); setShowAdd(true); }}
                        className="bg-[#1A62C2] hover:bg-[#1551a3] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                    >
                        + Tambah Audio
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold w-16">No</th>
                                <th className="px-6 py-4 text-left font-semibold">Judul Audio</th>
                                <th className="px-6 py-4 text-left font-semibold">Konten</th>
                                <th className="px-6 py-4 text-center font-semibold w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {audios.map((audio, i) => (
                                <tr key={audio.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-[#0A1D48]">{audio.title}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => { setSelectedAudio(audio); setShowPreview(true); }}
                                            className="text-[#1A62C2] font-medium hover:underline"
                                        >
                                            Preview Audio
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedAudio(audio);
                                                    setTitle(audio.title);
                                                    setAudioFile(null); // Reset file input saat edit
                                                    setShowEdit(true);
                                                }}
                                                className="bg-blue-100 text-[#1551a3] px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setSelectedAudio(audio); setShowDelete(true); }}
                                                className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODAL: EDIT CATEGORY ================= */}
            {showEditCategory && (
                <ModalWrapper>
                    <h3 className="font-bold text-lg mb-6 text-[#0A1D48]">Edit Informasi Tipe Meditasi</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                            {/* Ganti baris ini di dalam Modal Edit Category */}
                            <div className="w-20 h-20 rounded-xl bg-white shadow-sm overflow-hidden border border-blue-100">
                                <img
                                    src={previewCategoryCover || getCoverUrl(category.cover_image)}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ganti Cover</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1551a3] file:text-white hover:file:bg-[#1551a3] cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setCatImageFile(file);
                                            setPreviewCategoryCover(URL.createObjectURL(file));
                                        }
                                    }}
                                />

                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Playlist</label>
                            <input
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Deskripsi</label>
                            <textarea
                                rows="3"
                                value={catDesc}
                                onChange={(e) => setCatDesc(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => { setShowEditCategory(false); setPreviewCategoryCover(null); }} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Batal</button>
                        <button onClick={handleUpdateCategory} className="bg-[#1551a3] text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-[#1551a3] transition-all">Simpan Perubahan</button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: ADD / EDIT AUDIO (DIPERBARUI DENGAN FILE UPLOAD) ================= */}
            {(showAdd || showEdit) && (
                <ModalWrapper>
                    <h3 className="font-bold text-lg mb-4 text-[#0A1D48]">
                        {showAdd ? "Tambah Audio Baru" : "Edit Detail Audio"}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">
                                Judul Audio
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-[#1551a3] outline-none"
                                placeholder="Masukkan judul audio..."
                            />
                        </div>

                        <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                File Audio (.mp3, .wav)
                            </label>

                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setAudioFile(e.target.files[0])}
                                className="text-sm text-gray-500 
                           file:mr-4 file:py-2 file:px-4 
                           file:rounded-full file:border-0 
                           file:text-xs file:font-semibold 
                           file:bg-[#1551a3] file:text-white 
                           hover:file:bg-[#123f86] 
                           cursor-pointer"
                            />

                            {showEdit && (
                                <p className="text-[10px] text-gray-400 mt-2 italic">
                                    *Biarkan kosong jika tidak ingin mengubah file audio
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => {
                                setShowAdd(false);
                                setShowEdit(false);
                            }}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700"
                        >
                            Batal
                        </button>

                        <button
                            onClick={handleSaveAudio}
                            className="bg-[#1551a3] hover:bg-[#123f86] 
                       text-white px-8 py-2.5 rounded-xl 
                       text-sm font-semibold shadow-lg 
                       transition-all active:scale-95"
                        >
                            Simpan
                        </button>
                    </div>
                </ModalWrapper>

            )}

            {/* ================= MODAL: PREVIEW ================= */}
            {showPreview && (
                <ModalWrapper>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[#0A1D48]">{selectedAudio.title}</h3>
                        <button onClick={() => setShowPreview(false)} className="text-gray-400">✕</button>
                    </div>

                    {/* PERBAIKAN: Gunakan getCoverUrl agar path-nya benar (http://localhost:5000/uploads/...) */}
                    <audio controls key={selectedAudio.id} className="w-full mt-4">
                        <source src={getCoverUrl(selectedAudio.audio_file)} type="audio/mpeg" />
                        Browser kamu tidak mendukung pemutar audio.
                    </audio>

                    <button onClick={() => setShowPreview(false)} className="w-full mt-6 bg-gray-100 py-3 rounded-xl font-semibold text-gray-600">
                        Tutup
                    </button>
                </ModalWrapper>
            )}

            {/* ================= MODAL: DELETE ================= */}
            {showDelete && (
                <ModalWrapper>
                    <div className="text-center p-4">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
                        <h3 className="font-bold text-lg text-gray-800">Hapus Audio?</h3>
                        <p className="text-sm text-gray-500 mt-2">Audio <span className="font-bold">"{selectedAudio?.title}"</span> akan dihapus permanen.</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setShowDelete(false)} className="flex-1 py-3 rounded-xl font-semibold text-gray-500">Batal</button>
                        <button onClick={handleDeleteAudio} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-100">Ya, Hapus</button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= TOAST SUCCESS ================= */}
            {successMessage && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 animate-bounce">
                    <div className="bg-green-600 text-white rounded-full px-8 py-3 shadow-2xl flex items-center gap-3">
                        <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                        <p className="text-sm font-bold tracking-wide">{successMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= MODAL WRAPPER COMPONENT ================= */
function ModalWrapper({ children }) {
    return (
        <div className="fixed inset-0 bg-[#0A1D48]/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                {children}
            </div>
        </div>
    );
}