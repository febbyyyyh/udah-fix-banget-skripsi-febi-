import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axiosAdmin from "../../utils/axiosAdmin";

/* assets */
import editIcon from "../../assets/edit-ikon.svg";

export default function KelolaIsiEdukasi() {
    const { id } = useParams();
    const navigate = useNavigate();

    // URL Constants
    const API_BASE = "http://localhost:5000";
    const UPLOAD_URL = "http://localhost:5000/uploads/learngrow/covers";
    const PLACEHOLDER_IMG = "https://via.placeholder.com/150?text=No+Cover";

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

    // Form States (Playlist Info)
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDesc, setPlaylistDesc] = useState("");
    const [tempCoverFile, setTempCoverFile] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);

    // Form States (Video)
    const [videoTitle, setVideoTitle] = useState("");
    const [tempVideoFile, setTempVideoFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    /* ================= FETCH DATA ================= */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Ambil Detail Playlist
            const playlistRes = await axiosAdmin.get(`/admin/learngrow/playlists/${id}`);
            const data = playlistRes.data;

            setCategory(data);
            // Sinkronkan form state dengan data terbaru dari database
            setPlaylistName(data.name);
            setPlaylistDesc(data.description);
            setPreviewCover(null); // Reset preview saat data baru di-fetch

            // 2. Ambil Daftar Video
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

    /* ================= LOGIC UPDATE PLAYLIST (Sinkron dengan KelolaEdukasi) ================= */
    const handleUpdateCategory = async () => {
        if (!playlistName || !playlistDesc) return alert("Gagal simpan. Semua kolom wajib diisi.");

        const formData = new FormData();
        formData.append("name", playlistName);
        formData.append("description", playlistDesc);
        if (tempCoverFile) formData.append("cover_image", tempCoverFile);

        try {
            await axiosAdmin.put(`/admin/learngrow/playlists/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setShowEditCategory(false);
            setTempCoverFile(null);
            fetchData(); // Refresh data biar UI sinkron
            showSuccess("Playlist berhasil diperbarui");
        } catch (error) {
            console.error("Gagal update playlist:", error);
            alert("Gagal memperbarui informasi playlist");
        }
    };

    /* ================= LOGIC CRUD VIDEO ================= */
    const handleSaveVideo = async () => {
        if (!videoTitle) return alert("Gagal simpan. Semua kolom wajib diisi.");

        const formData = new FormData();
        formData.append("title", videoTitle);
        formData.append("playlist_id", id);
        if (tempVideoFile) formData.append("video_file", tempVideoFile);

        try {
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
            fetchData();
        } catch {
            alert("Gagal simpan. Semua kolom wajib diisi.");
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

    // Helper untuk menampilkan gambar yang sinkron dengan backend
    const getCoverDisplay = () => {
        if (previewCover) return previewCover; // Jika user baru pilih file
        if (category?.cover_image) return `${UPLOAD_URL}/${category.cover_image}`; // Dari server
        return; // Default
    };

    const getVideoUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_BASE}/uploads/learngrow/videos/${path}`;
    };

    if (loading || !category) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

    return (
        <div className="p-4">
            {/* Tombol Kembali ke KelolaEdukasi */}
            <button
                onClick={() => navigate("/admin/kelola-edukasi")}
                className="mb-4 text-sm text-[#1A62C2] font-semibold hover:underline flex items-center gap-2"
            >
                ← Kembali ke Kelola Learn & Grow
            </button>

            {/* ================= INFO PLAYLIST (HEADER) ================= */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 max-w-5xl relative border border-gray-100">
                <button
                    onClick={() => {
                        // Reset form state ke data category saat ini sebelum buka modal
                        setPlaylistName(category.name);
                        setPlaylistDesc(category.description);
                        setShowEditCategory(true);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <img src={editIcon} className="w-5 h-5" alt="Edit" />
                </button>

                <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img
                            src={getCoverDisplay()}
                            className="w-full h-full object-cover"
                            alt="Cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-[#0A1D48]">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{category.description}</p>
                    </div>
                </div>
            </div>

            {/* ... Bagian Table Video Tetap Sama ... */}
            <div className="bg-white rounded-2xl p-6 shadow-sm max-w-5xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg text-[#0A1D48]">Daftar Video Edukasi</h2>
                    <button
                        onClick={() => { setVideoTitle(""); setTempVideoFile(null); setShowAdd(true); }}
                        className="bg-[#1551a3] hover:bg-[#123f86] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                    >
                        + Tambah Video
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold w-16">No</th>
                                <th className="px-6 py-4 text-left font-semibold">Judul Video</th>
                                <th className="px-6 py-4 text-left font-semibold">Konten</th>
                                <th className="px-6 py-4 text-center font-semibold w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {videos.map((video, i) => (
                                <tr key={video.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-[#0A1D48]">{video.title}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => { setSelectedVideo(video); setShowPreview(true); }}
                                            className="text-[#1551a3] font-medium hover:underline"
                                        >
                                            Preview Video
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedVideo(video);
                                                    setVideoTitle(video.title);
                                                    setTempVideoFile(null);
                                                    setShowEdit(true);
                                                }}
                                                className="bg-blue-100 text-[#1551a3] px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setSelectedVideo(video); setShowDelete(true); }}
                                                className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100"
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

            {/* ================= MODAL: EDIT PLAYLIST (SINKRON) ================= */}
            {showEditCategory && (
                <ModalWrapper>
                    <h3 className="font-bold text-lg mb-6 text-[#0A1D48]">Edit Informasi Playlist Edukasi</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                            <div className="w-20 h-20 rounded-xl bg-white shadow-sm overflow-hidden border border-blue-100">
                                <img
                                    src={getCoverDisplay()}
                                    className="w-full h-full object-cover"
                                    alt="Cover"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ganti Cover</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1551a3] file:text-white cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setTempCoverFile(file);
                                            setPreviewCover(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Playlist</label>
                            <input
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Deskripsi</label>
                            <textarea
                                rows="3"
                                value={playlistDesc}
                                onChange={(e) => setPlaylistDesc(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => { setShowEditCategory(false); setPreviewCover(null); }} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100">Batal</button>
                        <button onClick={handleUpdateCategory} className="bg-[#1551a3] text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:bg-[#123f86]">Simpan Perubahan</button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: ADD / EDIT VIDEO ================= */}
            {(showAdd || showEdit) && (
                <ModalWrapper>
                    <h3 className="font-bold text-lg mb-4 text-[#0A1D48]">
                        {showAdd ? "Tambah Video Baru" : "Edit Detail Video"}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Judul Video</label>
                            <input
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="w-full border border-gray-200 px-4 py-3 rounded-xl mt-1 focus:ring-2 focus:ring-[#1551a3] outline-none"
                                placeholder="Masukkan judul video..."
                            />
                        </div>
                        <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">File Video (.mp4)</label>
                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={(e) => setTempVideoFile(e.target.files[0])}
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1551a3] file:text-white hover:file:bg-[#123f86] cursor-pointer"
                            />
                            {showEdit && <p className="text-[10px] text-gray-400 mt-2 italic">*Biarkan kosong jika tidak ingin mengubah video</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => { setShowAdd(false); setShowEdit(false); }} className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700">Batal</button>
                        <button onClick={handleSaveVideo} className="bg-[#1551a3] hover:bg-[#123f86] text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition-all">Simpan Video</button>
                    </div>
                </ModalWrapper>
            )}

            {/* ================= MODAL: PREVIEW VIDEO ================= */}
            {showPreview && selectedVideo && (
                <ModalWrapper>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[#0A1D48] leading-tight">{selectedVideo.title}</h3>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="rounded-2xl overflow-hidden bg-black aspect-video mt-4 shadow-inner">
                        <video
                            key={selectedVideo.id} // Memaksa refresh player
                            controls
                            autoPlay // Opsional: video langsung jalan saat modal buka
                            preload="auto"
                            className="w-full h-full"
                            src={getVideoUrl(selectedVideo.video_file)} // Taruh src di sini
                        >
                            Browser kamu tidak mendukung pemutaran video.
                        </video>
                    </div>

                    <button
                        onClick={() => setShowPreview(false)}
                        className="w-full mt-6 bg-gray-100 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        Tutup
                    </button>
                </ModalWrapper>
            )}

            {/* ================= MODAL: DELETE CONFIRMATION ================= */}
            {showDelete && (
                <ModalWrapper>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-xl text-[#0A1D48]">Hapus Video?</h3>
                        <p className="text-sm text-gray-500 mt-2 px-4">Video <span className="font-bold">"{selectedVideo?.title}"</span> akan dihapus permanen dan tidak bisa dikembalikan.</p>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowDelete(false)} className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Batal</button>
                            <button onClick={handleDeleteVideo} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold shadow-lg shadow-red-200 transition-all">Ya, Hapus Video</button>
                        </div>
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

function ModalWrapper({ children }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-[2px]">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">{children}</div>
        </div>
    );
}