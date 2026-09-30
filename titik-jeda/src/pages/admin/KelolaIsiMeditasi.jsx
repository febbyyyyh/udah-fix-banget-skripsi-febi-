import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function KelolaIsiMeditasi() {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [audioFile, setAudioFile] = useState(null);
    const [catName, setCatName] = useState("");
    const [catDesc, setCatDesc] = useState("");
    const [catCategoryType, setCatCategoryType] = useState("general");
    const [successMessage, setSuccessMessage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [formError, setFormError] = useState("");

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
                `/api/admin/meditations/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategory(res.data);
            setCatName(res.data.name);
            setCatDesc(res.data.description);
            setCatCategoryType(res.data.category_type || "general");
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAudios = async () => {
        try {
            const res = await axios.get(`/api/admin/meditations/${id}/audios?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAudios([...res.data]);
        } catch (err) {
            console.error("Gagal ambil audio:", err);
            setAudios([]);
        }
    };

    /* ================= LOGIC CRUD ================= */
    const handleSaveAudio = async () => {
        if (!title.trim()) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }

        if (showAdd && !audioFile) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        if (audioFile) formData.append("audio_file", audioFile);

        try {
            setFormError("");
            setUploadLoading(true);
            setUploadError("");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            let response;
            if (showAdd) {
                response = await axios.post(`/api/admin/meditations/${id}/audios`, formData, config);
            } else {
                response = await axios.put(`/api/admin/meditations/${id}/audios/${selectedAudio.id}`, formData, config);
            }

            if (response.status === 200 || response.status === 201) {
                setShowAdd(false);
                setShowEdit(false);
                setTitle("");
                setAudioFile(null);
                setFormError("");
                showSuccess("Audio berhasil disimpan!");
                await fetchAudios();
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Terjadi kesalahan saat menyimpan audio";
            console.error("Gagal simpan:", err.response?.data || err.message);
            setUploadError(message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDeleteAudio = async () => {
        try {
            await axios.delete(`/api/admin/meditations/${id}/audios/${selectedAudio.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDelete(false);
            fetchAudios();
            showSuccess("Audio berhasil dihapus");
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateCategory = async () => {
        if (!catName.trim() || !catDesc.trim()) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }
        setFormError("");

        try {
            await axios.put(
                `/api/admin/meditations/${id}`,
                {
                    name: catName,
                    description: catDesc,
                    category_type: catCategoryType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            await fetchCategory();
            setShowEditCategory(false);
            showSuccess("Informasi kategori berhasil diperbarui");
        } catch (err) {
            console.error("Error detail:", err.response?.data || err.message);
            alert("Gagal update kategori: " + (err.response?.data?.message || "Terjadi kesalahan"));
        }
    };

    if (!category) return null;

    const getAudioUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${cleanPath}`;
    };

    return (
        <div className="p-4 bg-[#FFFFFF] text-[#292929] min-h-screen">
            {/* Tombol Kembali */}
            <button
                onClick={() => navigate("/admin/kelola-meditasi")}
                className="mb-6 text-sm text-[#00BFFF] font-black uppercase tracking-wider hover:opacity-80 flex items-center gap-2 cursor-pointer transition-opacity"
            >
                ← Kembali ke Kelola Meditasi
            </button>

            {/* ================= INFO PLAYLIST (SUDAH DI-AKALI TANPA IKON GAMBAR) ================= */}
            <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl p-8 mb-8 max-w-5xl relative shadow-sm">
                {/* Diakali memakai button text minimalis modern */}
                <button
                    onClick={() => setShowEditCategory(true)}
                    className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-[#F2F2F2] text-[#292929]/60 hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                    Edit Info
                </button>

                <div className="flex flex-col items-start">
                    <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-3" />
                    <h3 className="font-black text-2xl tracking-tight">{category.name}</h3>
                    <p className="text-sm text-[#292929]/70 mt-2 max-w-3xl font-normal leading-relaxed">{category.description}</p>
                </div>
            </div>

            {/* ================= TABLE AUDIO ================= */}
            <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl p-8 max-w-5xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black text-lg tracking-tight">Daftar Audio Meditasi</h2>
                    <button
                        onClick={() => { setTitle(""); setAudioFile(null); setFormError(""); setUploadError(""); setShowAdd(true); }}
                        className="bg-[#00BFFF] text-[#FFFFFF] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
                    >
                        + Tambah Audio
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border-2 border-[#F2F2F2]">
                    <table className="w-full text-sm border-collapse text-left">
                        <thead className="bg-[#F2F2F2]/60 text-[#292929]/50 text-xs uppercase font-black tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-16">No</th>
                                <th className="px-6 py-4">Judul Audio</th>
                                <th className="px-6 py-4">Konten</th>
                                <th className="px-6 py-4 text-center w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#F2F2F2]">
                            {audios.map((audio, i) => (
                                <tr key={audio.id} className="hover:bg-[#F2F2F2]/20 transition-colors">
                                    <td className="px-6 py-4 text-[#292929]/40 font-bold">{i + 1}</td>
                                    <td className="px-6 py-4 font-bold text-[#292929]">{audio.title}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => { setSelectedAudio(audio); setShowPreview(true); }}
                                            className="text-[#00BFFF] font-black text-xs uppercase tracking-wider hover:underline cursor-pointer"
                                        >
                                            Preview Audio
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedAudio(audio);
                                                    setTitle(audio.title);
                                                    setAudioFile(null);
                                                    setFormError("");
                                                    setUploadError("");
                                                    setShowEdit(true);
                                                }}
                                                className="bg-[#F2F2F2] text-[#292929] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setSelectedAudio(audio); setShowDelete(true); }}
                                                className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-all cursor-pointer"
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
                    <h3 className="font-black text-xl mb-6 tracking-tight">Edit Informasi Tipe Meditasi</h3>
                    <div className="space-y-4">
                        {formError && (
                            <div className="mb-4 rounded-md bg-[#fff1f2] border border-[#fca5a5] text-[#b91c1c] px-4 py-3 text-sm font-medium">
                                {formError}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">Nama Tipe Meditasi</label>
                            <input
                                value={catName}
                                onChange={(e) => { setCatName(e.target.value); setFormError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">Deskripsi</label>
                            <textarea
                                rows="3"
                                value={catDesc}
                                onChange={(e) => { setCatDesc(e.target.value); setFormError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">Tipe Kategori DASS-21</label>
                            <select
                                value={catCategoryType}
                                onChange={(e) => setCatCategoryType(e.target.value)}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none transition-all text-sm font-medium"
                            >
                                <option value="general">General (Umum)</option>
                                <option value="depression">Depression (Depresi)</option>
                                <option value="anxiety">Anxiety (Cemas)</option>
                                <option value="stress">Stress (Stres)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => setShowEditCategory(false)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] transition-colors cursor-pointer">Batal</button>
                        <button onClick={handleUpdateCategory} className="bg-[#00BFFF] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-all cursor-pointer active:scale-95">Simpan</button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: ADD / EDIT AUDIO ================= */}
            {(showAdd || showEdit) && (
                <ModalWrapper>
                    <h3 className="font-black text-xl mb-6 tracking-tight">
                        {showAdd ? "Tambah Audio Baru" : "Edit Detail Audio"}
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">
                                Judul Audio
                            </label>
                            <input
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setFormError(""); setUploadError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none text-sm font-medium"
                                placeholder="Masukkan judul audio..."
                            />
                        </div>

                        <div className="p-5 border-2 border-dashed border-[#00BFFF]/30 bg-[#F2F2F2]/40 rounded-2xl">
                            <label className="block text-xs font-black text-[#292929]/50 uppercase tracking-wider mb-2">
                                File Audio (.mp3, .wav)
                            </label>

                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => { setAudioFile(e.target.files[0]); setFormError(""); setUploadError(""); }}
                                className="text-xs text-[#292929]/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-[#00BFFF] file:text-[#FFFFFF] file:hover:opacity-90 cursor-pointer w-full"
                            />

                            {showEdit && (
                                <p className="text-[10px] text-[#292929]/40 mt-2 italic font-medium">
                                    *Biarkan kosong jika tidak ingin mengubah file audio
                                </p>
                            )}
                            {uploadError && (
                                <p className="text-xs text-red-500 mt-3 font-medium">{uploadError}</p>
                            )}
                            {formError && (
                                <p className="text-xs text-red-500 mt-3 font-medium">{formError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => { setShowAdd(false); setShowEdit(false); }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] transition-colors ${uploadLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            disabled={uploadLoading}
                        >
                            Batal
                        </button>

                        <button
                            onClick={handleSaveAudio}
                            className={`bg-[#00BFFF] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer hover:opacity-90 ${uploadLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            disabled={uploadLoading}
                        >
                            {uploadLoading ? "Menyimpan..." : "Simpan Audio"}
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: PREVIEW ================= */}
            {showPreview && (
                <ModalWrapper>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-[#292929]">{selectedAudio.title}</h3>
                        <button onClick={() => setShowPreview(false)} className="text-[#292929]/40 hover:text-[#292929] cursor-pointer">✕</button>
                    </div>

                    <audio controls key={selectedAudio.id} className="w-full mt-4 bg-[#F2F2F2] rounded-xl">
                        <source src={`http://172.16.222.8:5000${getAudioUrl(selectedAudio.audio_file)}`} type="audio/mpeg" />
                        Browser kamu tidak mendukung pemutar audio.
                    </audio>

                    <button onClick={() => setShowPreview(false)} className="w-full mt-6 bg-[#F2F2F2] text-[#292929] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-80 cursor-pointer">
                        Tutup Preview
                    </button>
                </ModalWrapper>
            )}

            {/* ================= MODAL: DELETE ================= */}
            {showDelete && (
                <ModalWrapper>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">!</div>
                        <h3 className="font-black text-xl text-gray-800 tracking-tight">Hapus Audio?</h3>
                        <p className="text-sm text-[#292929]/60 mt-2 leading-relaxed">Audio <span className="font-bold text-[#292929]">"{selectedAudio?.title}"</span> akan dihapus secara permanen dari server.</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setShowDelete(false)} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] cursor-pointer">Batal</button>
                        <button onClick={handleDeleteAudio} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 cursor-pointer">Ya, Hapus</button>
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

/* ================= MODAL WRAPPER COMPONENT ================= */
function ModalWrapper({ children }) {
    return (
        <div className="fixed inset-0 bg-[#292929]/50 backdrop-blur-sm flex items-center justify-center z-[700] px-4 transition-all">
            <div className="bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-3xl p-8 w-full max-w-lg shadow-xl">
                {children}
            </div>
        </div>
    );
}