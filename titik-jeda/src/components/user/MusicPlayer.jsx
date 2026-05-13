import React, { useState, useRef } from "react";

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    // Ref audio tunggal untuk mengontrol pemutaran
    const audioRef = useRef(new Audio());

    const playlist = [
        { id: 1, name: "Lofi Rain", path: "/music/rain.mp3", icon: "🌧️" },
        { id: 2, name: "Deep Piano", path: "/music/piano.mp3", icon: "🎹" },
        { id: 3, name: "Forest Night", path: "/music/forest.mp3", icon: "🌲" },
    ];

    const handleSelectMusic = (track) => {
        if (currentTrack?.id === track.id) {
            // Toggle play/pause jika klik lagu yang sama
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            // Putar lagu baru
            audioRef.current.pause();
            audioRef.current.src = track.path;
            audioRef.current.loop = true;
            audioRef.current.volume = 0.4;

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setCurrentTrack(track);
                    })
                    .catch((error) => {
                        console.error("Gagal putar musik:", error);
                        setIsPlaying(false);
                    });
            }
        }
        setShowMenu(false);
    };

    // Fungsi baru untuk Stop total
    const handleStopMusic = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset ke awal
        setIsPlaying(false);
        setCurrentTrack(null);
        setShowMenu(false);
    };

    return (
        // Gunakan items-start agar posisi button tetap di koordinat left-8
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[310] flex flex-col items-start">

            {/* --- Mini Popup Menu --- */}
            {showMenu && (
                // Ubah mb-4 menjadi absolute bottom-16 agar tidak menggeser button di bawahnya
                <div className="absolute bottom-16 left-0 bg-white border-2 border-[#0a1d48] rounded-2xl p-2.5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 w-48">
                    <p className="text-xs text-gray-400 font-medium px-3 mb-2 tracking-wide">PILIH MUSIK RELAX</p>

                    <div className="flex flex-col gap-1.5">
                        {playlist.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => handleSelectMusic(track)}
                                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-sm font-semibold active:scale-95 ${currentTrack?.id === track.id
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

                        {currentTrack && (
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
                // Ukuran sedikit mengecil di mobile (w-12 h-12) agar tidak terlalu memenuhi layar
                className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-[#0a1d48] text-[#0a1d48] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 relative"
                title={showMenu ? "Tutup Menu" : "Pilih Musik Relax"}
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