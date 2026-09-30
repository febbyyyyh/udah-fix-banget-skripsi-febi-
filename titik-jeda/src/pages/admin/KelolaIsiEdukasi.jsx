import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axiosAdmin from "../../utils/axiosAdmin";

export default function KelolaIsiEdukasi() {
    const { id } = useParams();
    const navigate = useNavigate();

    /* ================= STATE ================= */
    const [category, setCategory] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);

    // Form States (Playlist Info - Murni Teks)
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDesc, setPlaylistDesc] = useState("");

    // Form States (Video)
    const [videoTitle, setVideoTitle] = useState("");
    const [tempVideoFile, setTempVideoFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [formError, setFormError] = useState("");

    /* ================= FETCH DATA ================= */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Detail Playlist
            const playlistRes = await axiosAdmin.get(`/admin/learngrow/playlists/${id}`);
            const data = playlistRes.data;

            setCategory(data);
            setPlaylistName(data.name);
            setPlaylistDesc(data.description);

            // 2. Daftar Video
            const videoRes = await axiosAdmin.get(`/admin/learngrow/playlists/${id}/videos`);
            setVideos(videoRes.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 2000);
    };

    /* ================= LOGIC UPDATE PLAYLIST (MURNI JSON TANPA FORMDATA FILE) ================= */
    const handleUpdateCategory = async () => {
        if (!playlistName || !playlistDesc) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }
        setFormError("");

        try {
            await axiosAdmin.put(`/admin/learngrow/playlists/${id}`, {
                name: playlistName,
                description: playlistDesc
            }, {
                headers: { "Content-Type": "application/json" }
            });

            setShowEditCategory(false);
            fetchData();
            showSuccess("Playlist berhasil diperbarui");
        } catch (error) {
            console.error("Gagal update playlist:", error);
            alert("Gagal memperbarui informasi playlist");
        }
    };

    /* ================= LOGIC CRUD VIDEO ================= */
    const handleSaveVideo = async () => {
        // Validasi yang lebih ketat
        if (!videoTitle || !videoTitle.trim()) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }

        // Jika tambah video baru, file WAJIB ada
        if (showAdd && !tempVideoFile) {
            setFormError("Gagal simpan. Semua kolom wajib diisi.");
            return;
        }

        setFormError("");

        const formData = new FormData();
        formData.append("title", videoTitle);
        formData.append("playlist_id", id);
        if (tempVideoFile) formData.append("video_file", tempVideoFile);

        try {
            setUploadLoading(true);
            setUploadError("");

            if (showAdd) {
                await axiosAdmin.post("/admin/learngrow/videos", formData);
                showSuccess("Video berhasil ditambahkan");
            } else {
                await axiosAdmin.put(`/admin/learngrow/videos/${selectedVideo.id}`, formData);
                showSuccess("Video berhasil diperbarui");
            }
            setShowAdd(false);
            setShowEdit(false);
            setVideoTitle("");
            setTempVideoFile(null);
            setFormError("");
            fetchData();
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Terjadi kesalahan saat menyimpan video";
            console.error("Gagal simpan video:", err.response?.data || err.message);
            setUploadError(message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDeleteVideo = async () => {
        try {
            await axiosAdmin.delete(`/admin/learngrow/videos/${selectedVideo.id}`);
            showSuccess("Video berhasil dihapus");
            setShowDelete(false);
            fetchData();
        } catch {
            alert("Gagal menghapus video");
        }
    };

    const getVideoUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `/uploads/learngrow/videos/${path}`;
    };

    if (loading || !category) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-[#292929]">
                <div className="rounded-full h-10 w-10 border-4 border-[#F2F2F2] border-b-[#00BFFF] animate-spin"></div>
                <p className="mt-4 text-xs font-bold text-[#292929]/40 uppercase tracking-widest">Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-[#FFFFFF] text-[#292929] min-h-screen">
            {/* Tombol Kembali */}
            <button
                onClick={() => navigate("/admin/kelola-edukasi")}
                className="mb-6 text-sm text-[#00BFFF] font-black uppercase tracking-wider hover:opacity-80 flex items-center gap-2 cursor-pointer transition-opacity"
            >
                ← Kembali ke Kelola Learn & Grow
            </button>

            {/* ================= INFO PLAYLIST (IKUTI LAYOUT KELOLAISIMEDITASI) ================= */}
            <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl p-8 mb-8 max-w-5xl relative shadow-sm">
                {/* Button Edit Info di sudut kanan atas */}
                <button
                    onClick={() => {
                        setPlaylistName(category.name);
                        setPlaylistDesc(category.description);
                        setFormError("");
                        setShowEditCategory(true);
                    }}
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

            {/* ================= TABLE VIDEO ================= */}
            <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl p-8 max-w-5xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black text-lg tracking-tight">Daftar Video Edukasi</h2>
                    <button
                        onClick={() => { setVideoTitle(""); setTempVideoFile(null); setFormError(""); setUploadError(""); setShowAdd(true); }}
                        className="bg-[#00BFFF] text-[#FFFFFF] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
                    >
                        + Tambah Video
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border-2 border-[#F2F2F2]">
                    <table className="w-full text-sm border-collapse text-left">
                        <thead className="bg-[#F2F2F2]/60 text-[#292929]/50 text-xs uppercase font-black tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-16">No</th>
                                <th className="px-6 py-4">Judul Video</th>
                                <th className="px-6 py-4">Konten</th>
                                <th className="px-6 py-4 text-center w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#F2F2F2]">
                            {videos.map((video, i) => (
                                <tr key={video.id} className="hover:bg-[#F2F2F2]/20 transition-colors">
                                    <td className="px-6 py-4 text-[#292929]/40 font-bold">{i + 1}</td>
                                    <td className="px-6 py-4 font-bold text-[#292929]">{video.title}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => { setSelectedVideo(video); setShowPreview(true); }}
                                            className="text-[#00BFFF] font-black text-xs uppercase tracking-wider hover:underline cursor-pointer"
                                        >
                                            Preview Video
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedVideo(video);
                                                    setVideoTitle(video.title);
                                                    setTempVideoFile(null);
                                                    setFormError("");
                                                    setUploadError("");
                                                    setShowEdit(true);
                                                }}
                                                className="bg-[#F2F2F2] text-[#292929] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setSelectedVideo(video); setShowDelete(true); }}
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

            {/* ================= MODAL: EDIT PLAYLIST ================= */}
            {showEditCategory && (
                <ModalWrapper>
                    <h3 className="font-black text-xl mb-6 tracking-tight">Edit Informasi Playlist Edukasi</h3>
                    {formError && (
                        <div className="mb-4 rounded-md bg-[#fff1f2] border border-[#fca5a5] text-[#b91c1c] px-4 py-3 text-sm font-medium">
                            {formError}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">Nama Playlist</label>
                            <input
                                value={playlistName}
                                onChange={(e) => { setPlaylistName(e.target.value); setFormError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">Deskripsi</label>
                            <textarea
                                rows="3"
                                value={playlistDesc}
                                onChange={(e) => { setPlaylistDesc(e.target.value); setFormError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none resize-none transition-all text-sm font-medium leading-relaxed"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => setShowEditCategory(false)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] transition-colors cursor-pointer">Batal</button>
                        <button onClick={handleUpdateCategory} className="bg-[#00BFFF] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:opacity-90 transition-all cursor-pointer active:scale-95">Simpan</button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: ADD / EDIT VIDEO ================= */}
            {(showAdd || showEdit) && (
                <ModalWrapper>
                    <h3 className="font-black text-xl mb-6 tracking-tight">
                        {showAdd ? "Tambah Video Baru" : "Edit Detail Video"}
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-black text-[#292929]/50 uppercase tracking-wider ml-1">Judul Video</label>
                            <input
                                value={videoTitle}
                                onChange={(e) => { setVideoTitle(e.target.value); setFormError(""); setUploadError(""); }}
                                className="w-full bg-[#F2F2F2] border-2 border-transparent focus:border-[#00BFFF] focus:bg-[#FFFFFF] px-4 py-3 rounded-xl mt-1 outline-none text-sm font-medium"
                                placeholder="Masukkan judul video..."
                            />
                        </div>
                        <div className="p-5 border-2 border-dashed border-[#00BFFF]/30 bg-[#F2F2F2]/40 rounded-2xl">
                            <label className="block text-xs font-black text-[#292929]/50 uppercase tracking-wider mb-2">File Video (.mp4)</label>
                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={(e) => { setTempVideoFile(e.target.files[0]); setFormError(""); setUploadError(""); }}
                                className="text-xs text-[#292929]/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-[#00BFFF] file:text-[#FFFFFF] file:hover:opacity-90 cursor-pointer w-full"
                            />
                            {showEdit && <p className="text-[10px] text-[#292929]/40 mt-2 italic font-medium">*Biarkan kosong jika tidak ingin mengubah video</p>}
                            {uploadError && <p className="text-xs text-red-500 mt-3 font-medium">{uploadError}</p>}
                            {formError && <p className="text-xs text-red-500 mt-3 font-medium">{formError}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => { setShowAdd(false); setShowEdit(false); }} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] transition-colors ${uploadLoading ? "opacity-70 cursor-not-allowed" : ""}`} disabled={uploadLoading}>Batal</button>
                        <button onClick={handleSaveVideo} className={`bg-[#00BFFF] text-[#FFFFFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer hover:opacity-90 ${uploadLoading ? "opacity-70 cursor-not-allowed" : ""}`} disabled={uploadLoading}>
                            {uploadLoading ? "Menyimpan..." : "Simpan Video"}
                        </button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: PREVIEW VIDEO ================= */}
            {showPreview && selectedVideo && (
                <ModalWrapper>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-[#292929]">{selectedVideo.title}</h3>
                        <button onClick={() => setShowPreview(false)} className="text-[#292929]/40 hover:text-[#292929] cursor-pointer">✕</button>
                    </div>

                    <div className="rounded-2xl overflow-hidden bg-black aspect-video mt-4 shadow-inner">
                        <video
                            key={selectedVideo.id}
                            controls
                            autoPlay
                            preload="auto"
                            className="w-full h-full"
                            src={`http://172.16.222.8:5000${getVideoUrl(selectedVideo.video_file)}`}
                        >
                            Browser kamu tidak mendukung pemutaran video.
                        </video>
                    </div>

                    <button
                        onClick={() => setShowPreview(false)}
                        className="w-full mt-6 bg-[#F2F2F2] text-[#292929] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-80 cursor-pointer"
                    >
                        Tutup Preview
                    </button>
                </ModalWrapper>
            )}

            {/* ================= MODAL: DELETE CONFIRMATION ================= */}
            {showDelete && (
                <ModalWrapper>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">!</div>
                        <h3 className="font-black text-xl text-gray-800 tracking-tight">Hapus Video?</h3>
                        <p className="text-sm text-[#292929]/60 mt-2 leading-relaxed">Video <span className="font-bold text-[#292929]">"{selectedVideo?.title}"</span> akan dihapus permanen dan tidak bisa dikembalikan.</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setShowDelete(false)} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#292929]/50 hover:bg-[#F2F2F2] cursor-pointer">Batal</button>
                        <button onClick={handleDeleteVideo} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 cursor-pointer">Ya, Hapus Video</button>
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