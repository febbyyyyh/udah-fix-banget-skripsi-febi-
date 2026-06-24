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

// Jalankan inisialisasi awal saat file dimuat browser
audioManager.init();

// Standby mendengarkan sinyal stop dari halaman Meditation/Education
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

    // Sinkronisasi status UI dengan kondisi Audio yang nyata
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

        // Dengarkan perubahan status internal dan eksternal audio
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
            // Jika klik lagu yang sama, toggle play/pause
            audioManager.togglePlay();
        } else {
            // Putar lagu baru lewat manager
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
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[310] flex flex-col items-start">
            {/* --- Mini Popup Menu --- */}
            {showMenu && (
                <div className="absolute bottom-16 left-0 bg-white border-2 border-[#0a1d48] rounded-2xl p-2.5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 w-48">
                    <p className="text-xs text-gray-400 font-medium px-3 mb-2 tracking-wide">PILIH MUSIK RELAKSASI</p>

                    <div className="flex flex-col gap-1.5">
                        {playlist.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => handleSelectMusic(track)}
                                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-sm font-semibold active:scale-95 ${currentTrack?.id === track.id && isPlaying
                                        ? "bg-blue-100 text-[#0a1d48]"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <span className="text-base">{track.icon}</span>
                                <span className="flex-1 text-left">{track.name}</span>
                                {currentTrack?.id === track.id && isPlaying && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                )}
                            </button>
                        ))}

                        {isPlaying && currentTrack && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={handleStopMusic}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-sm font-bold text-red-500 hover:bg-red-50 active:scale-95"
                                >
                                    <span className="text-base">⏹️</span>
                                    <span className="flex-1 text-left">Stop Music</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- Tombol Utama --- */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-[#0a1d48] text-[#0a1d48] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 relative"
                title={showMenu ? "Tutup Menu" : "Pilih Musik Relaksasi"}
            >
                {isPlaying ? (
                    <span className="text-xl md:text-2xl animate-spin-slow">💿</span>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                )}

                {isPlaying && (
                    <span className="absolute inset-0 rounded-full bg-[#0a1d48]/20 animate-ping"></span>
                )}
            </button>
        </div>
    );
};

export default MusicPlayer;