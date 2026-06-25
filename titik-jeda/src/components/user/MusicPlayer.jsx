import React, { useState, useEffect } from "react";

// =========================================================================
// AUDIO MANAGER (MODULE SCOPE)
// Membungkus objek Audio agar aman dari deteksi linter/kompiler ketat.
// =========================================================================
const audioManager = {
    instance: typeof window !== "undefined" ? new Audio() : null,
    track: null,

    init() {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("relaxation_current_track");
            if (saved) this.track = JSON.parse(saved);
        }
    },

    play(track) {
        if (!this.instance) return Promise.resolve();
        this.instance.pause();
        this.instance.src = track.path;
        this.instance.loop = true;
        this.instance.volume = 0.4;
        this.track = track;
        localStorage.setItem("relaxation_current_track", JSON.stringify(track));
        return this.instance.play();
    },

    togglePlay() {
        if (!this.instance) return;
        if (this.instance.paused) {
            this.instance.play().catch(err => console.error(err));
        } else {
            this.instance.pause();
        }
    },

    stop() {
        if (this.instance) {
            this.instance.pause();
            this.instance.currentTime = 0;
        }
        this.track = null;
        localStorage.removeItem("relaxation_current_track");
    },

    getStatus() {
        return {
            isPlaying: this.instance ? !this.instance.paused : false,
            track: this.track
        };
    }
};

audioManager.init();

if (typeof window !== "undefined") {
    window.addEventListener("stop-relaxation-music", () => {
        audioManager.stop();
        window.dispatchEvent(new Event("relaxation-state-changed"));
    });
}

// =========================================================================
// KOMPONEN UTAMA REACT
// =========================================================================
const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    const playlist = [
        { id: 1, name: "Rain", path: "/music/rain.mp3", icon: "🌧️" },
        { id: 2, name: "Piano", path: "/music/piano.mp3", icon: "🎹" },
        { id: 3, name: "Forest", path: "/music/forest.mp3", icon: "🌲" },
    ];

    const syncUIWithGlobal = () => {
        const status = audioManager.getStatus();
        setIsPlaying(status.isPlaying);
        setCurrentTrack(status.isPlaying ? status.track : null);
    };

    useEffect(() => {
        syncUIWithGlobal();

        const handleStateChange = () => {
            syncUIWithGlobal();
        };

        window.addEventListener("relaxation-state-changed", handleStateChange);

        const audioEl = audioManager.instance;
        if (audioEl) {
            audioEl.addEventListener("play", handleStateChange);
            audioEl.addEventListener("pause", handleStateChange);
        }

        return () => {
            window.removeEventListener("relaxation-state-changed", handleStateChange);
            if (audioEl) {
                audioEl.removeEventListener("play", handleStateChange);
                audioEl.removeEventListener("pause", handleStateChange);
            }
        };
    }, []);

    const handleSelectMusic = (track) => {
        const status = audioManager.getStatus();

        if (status.track?.id === track.id) {
            audioManager.togglePlay();
        } else {
            audioManager.play(track)
                .then(() => syncUIWithGlobal())
                .catch((error) => {
                    console.error("Gagal putar musik:", error);
                    setIsPlaying(false);
                });
        }
        setShowMenu(false);
    };

    const handleStopMusic = () => {
        audioManager.stop();
        syncUIWithGlobal();
        setShowMenu(false);
    };

    return (
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[400] flex flex-col items-start text-[#292929]">
            {/* --- Mini Popup Menu --- */}
            {showMenu && (
                // Mengubah border lama menjadi border kustom #00BFFF
                <div className="absolute bottom-16 left-0 bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-2xl p-2.5 shadow-xl animate-in slide-in-from-bottom-5 duration-300 w-52">
                    <p className="text-[10px] text-[#292929]/50 font-black px-3 mb-2 tracking-widest uppercase">PILIH MUSIK RELAKSASI</p>

                    <div className="flex flex-col gap-1.5">
                        {playlist.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => handleSelectMusic(track)}
                                // Aktif menggunakan kombinasi warna kustom #00BFFF, tidak aktif menggunakan hover #F2F2F2
                                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-sm font-bold active:scale-95 ${currentTrack?.id === track.id && isPlaying
                                        ? "bg-[#00BFFF] text-[#FFFFFF]"
                                        : "hover:bg-[#F2F2F2] text-[#292929]"
                                    }`}
                            >
                                <span className="text-base select-none">{track.icon}</span>
                                <span className="flex-1 text-left">{track.name}</span>
                                {currentTrack?.id === track.id && isPlaying && (
                                    // Pulse indicator diganti warna kontras #ADFF2F
                                    <span className="w-2.5 h-2.5 bg-[#ADFF2F] rounded-full animate-pulse"></span>
                                )}
                            </button>
                        ))}

                        {isPlaying && currentTrack && (
                            <div className="mt-2 pt-2 border-t border-[#F2F2F2]">
                                <button
                                    onClick={handleStopMusic}
                                    // Button stop musik dibersihkan warna merahnya, dialihkan ke tombol abu-abu netral font hitam tebal
                                    className="flex items-center gap-3 w-full px-4 py-2.5 bg-[#F2F2F2] rounded-xl transition-all text-sm font-black text-[#292929] hover:opacity-90 active:scale-95"
                                >
                                    <span className="text-sm select-none">⏹️</span>
                                    <span className="flex-1 text-left">Stop Music</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- Tombol Floating Utama --- */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                // Border diubah menjadi #00BFFF dan teks isi memakai font gelap baru #292929
                className="w-12 h-12 md:w-14 md:h-14 bg-[#FFFFFF] border-2 border-[#00BFFF] text-[#292929] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 relative"
                title={showMenu ? "Tutup Menu" : "Pilih Musik Relaksasi"}
            >
                {isPlaying ? (
                    // Ikon disc berputar jika lagu menyala
                    <span className="text-xl md:text-2xl animate-spin" style={{ animationDuration: '4s' }}>💿</span>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                )}

                {isPlaying && (
                    // Efek radar gelombang luar diubah warnanya mengikuti aksen biru #00BFFF
                    <span className="absolute inset-0 rounded-full bg-[#00BFFF]/20 animate-ping"></span>
                )}
            </button>
        </div>
    );
};

export default MusicPlayer;