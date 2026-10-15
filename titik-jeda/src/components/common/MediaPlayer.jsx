import React, { useEffect, useRef } from "react";
import { parseMediaSource } from "../../utils/mediaEmbed";

/**
 * Universal Media Player for Titik Jeda
 * Automatically handles:
 * - Local uploaded files (.mp3, .wav, .mp4)
 * - YouTube (Videos & Meditations)
 * - Spotify (Tracks, Albums, Playlists)
 * - SoundCloud
 * - Vimeo
 * - Google Drive video/audio
 * - Direct external media URLs
 * - Raw embed iframes
 */
export default function MediaPlayer({
    source,
    mediaType = "audio",
    title = "",
    autoPlay = false,
    className = "",
    onPlay,
    compact = false
}) {
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const info = parseMediaSource(source, mediaType);

    const handlePlay = (e) => {
        // Otomatis matikan background ambient music
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("stop-relaxation-music"));
        }
        if (onPlay) onPlay(e);
    };

    useEffect(() => {
        if (autoPlay && info.isEmbed) {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("stop-relaxation-music"));
            }
        }
    }, [autoPlay, info.isEmbed]);

    if (!source) {
        return (
            <div className={`p-4 rounded-2xl bg-[#F2F2F2] border-2 border-[#292929]/10 text-center text-xs font-bold text-[#292929]/40 ${className}`}>
                Media belum tersedia
            </div>
        );
    }

    /* ================= 1. SPOTIFY EMBED ================= */
    if (info.type === "spotify") {
        const height = compact ? "80" : (info.isPlaylist ? "352" : "152");
        return (
            <div className={`w-full overflow-hidden rounded-2xl border-2 border-[#292929] bg-[#121212] shadow-sm ${className}`}>
                <iframe
                    src={info.embedUrl}
                    width="100%"
                    height={height}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={title || "Spotify Player"}
                    className="w-full block"
                />
            </div>
        );
    }

    /* ================= 2. SOUNDCLOUD EMBED ================= */
    if (info.type === "soundcloud") {
        return (
            <div className={`w-full overflow-hidden rounded-2xl border-2 border-[#292929] bg-white shadow-sm ${className}`}>
                <iframe
                    width="100%"
                    height={compact ? "120" : "166"}
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={info.embedUrl}
                    title={title || "SoundCloud Player"}
                    className="w-full block"
                />
            </div>
        );
    }

    /* ================= 3. YOUTUBE EMBED ================= */
    if (info.type === "youtube") {
        const autoplayParam = autoPlay ? "1" : "0";
        const ytEmbedSrc = `${info.embedUrl}?autoplay=${autoplayParam}&rel=0&modestbranding=1&playsinline=1`;

        // Jika dalam konteks audio, kita berikan rasio yang fleksibel
        const containerClasses = mediaType === "audio" && compact
            ? "w-full h-44 rounded-2xl overflow-hidden border-2 border-[#292929] bg-black shadow-sm"
            : "w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-black shadow-sm";

        return (
            <div className={`${containerClasses} ${className}`}>
                <iframe
                    src={ytEmbedSrc}
                    title={title || "YouTube Media"}
                    className="w-full h-full block border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    /* ================= 4. VIMEO EMBED ================= */
    if (info.type === "vimeo") {
        const autoplayParam = autoPlay ? "1" : "0";
        return (
            <div className={`w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-black shadow-sm ${className}`}>
                <iframe
                    src={`${info.embedUrl}?autoplay=${autoplayParam}&title=0&byline=0&portrait=0`}
                    title={title || "Vimeo Player"}
                    className="w-full h-full block border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    /* ================= 5. GOOGLE DRIVE EMBED ================= */
    if (info.type === "gdrive") {
        return (
            <div className={`w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-black shadow-sm ${className}`}>
                <iframe
                    src={info.embedUrl}
                    title={title || "Google Drive Media"}
                    className="w-full h-full block border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            </div>
        );
    }

    /* ================= 6. RAW IFRAME / GENERIC WEB EMBED ================= */
    if (info.type === "iframe" || info.type === "generic_url") {
        return (
            <div className={`w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-[#FFFFFF] shadow-sm ${className}`}>
                <iframe
                    src={info.embedUrl}
                    title={title || "Embed Media"}
                    className="w-full h-full block border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    /* ================= 7. DIRECT AUDIO URL / LOCAL AUDIO FILE ================= */
    if (mediaType === "audio" || info.type === "direct_audio") {
        let cleanSrc = source;
        if (!source.startsWith("http://") && !source.startsWith("https://")) {
            cleanSrc = "/" + String(source).replace(/^\/+/, "");
        }

        return (
            <div className={`w-full ${className}`}>
                <audio
                    ref={audioRef}
                    controls
                    autoPlay={autoPlay}
                    src={cleanSrc}
                    className="w-full bg-[#F2F2F2] rounded-xl border border-[#292929]/10"
                    onPlay={handlePlay}
                >
                    Browser kamu tidak mendukung pemutar audio ini.
                </audio>
            </div>
        );
    }

    /* ================= 8. DIRECT VIDEO URL / LOCAL VIDEO FILE ================= */
    let cleanVideoSrc = source;
    if (!source.startsWith("http://") && !source.startsWith("https://")) {
        cleanVideoSrc = source.startsWith("/uploads/")
            ? source
            : `/uploads/learngrow/videos/${pathBasename(source)}`;
    }

    return (
        <div className={`w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-black shadow-sm ${className}`}>
            <video
                ref={videoRef}
                controls
                autoPlay={autoPlay}
                preload="metadata"
                src={cleanVideoSrc}
                className="w-full h-full object-contain"
                onPlay={handlePlay}
            >
                Browser kamu tidak mendukung pemutar video ini.
            </video>
        </div>
    );
}

function pathBasename(str) {
    if (!str) return "";
    return str.replace(/\\/g, "/").split("/").pop();
}
