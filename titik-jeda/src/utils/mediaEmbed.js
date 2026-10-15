/**
 * Media Embed Utility for Titik Jeda
 * Supports YouTube, Spotify, SoundCloud, Vimeo, Google Drive, Direct URLs, and raw iframes.
 */

/**
 * Extracts src attribute from an iframe tag
 * @param {string} html
 * @returns {string|null}
 */
export const extractIframeSrc = (html) => {
    if (!html || typeof html !== "string") return null;
    const match = html.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : null;
};

/**
 * Checks if a string is raw iframe HTML
 * @param {string} str
 * @returns {boolean}
 */
export const isIframeHtml = (str) => {
    if (!str || typeof str !== "string") return false;
    return /<iframe\b[^>]*>/i.test(str.trim());
};

/**
 * Checks if a string is an external embed / URL
 * @param {string} str
 * @returns {boolean}
 */
export const isEmbed = (str) => {
    if (!str || typeof str !== "string") return false;
    const trimmed = str.trim();
    if (isIframeHtml(trimmed)) return true;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
        return true;
    }
    if (trimmed.startsWith("spotify:")) return true;
    return false;
};

/**
 * Extract YouTube Video ID from various YouTube URL formats
 * @param {string} url
 * @returns {string|null}
 */
export const getYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;
    let clean = url.trim();

    // If iframe tag, extract src first
    if (isIframeHtml(clean)) {
        clean = extractIframeSrc(clean) || clean;
    }

    const match = clean.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
    );
    return match ? match[1] : null;
};

/**
 * Extract Vimeo Video ID
 * @param {string} url
 * @returns {string|null}
 */
export const getVimeoId = (url) => {
    if (!url || typeof url !== "string") return null;
    let clean = url.trim();
    if (isIframeHtml(clean)) clean = extractIframeSrc(clean) || clean;
    const match = clean.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i);
    return match ? match[1] : null;
};

/**
 * Extract Google Drive file ID
 * @param {string} url
 * @returns {string|null}
 */
export const getGoogleDriveId = (url) => {
    if (!url || typeof url !== "string") return null;
    let clean = url.trim();
    if (isIframeHtml(clean)) clean = extractIframeSrc(clean) || clean;
    const match = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    return match ? match[1] : null;
};

/**
 * Parse Spotify URL into embed format
 * @param {string} url
 * @returns {{ embedUrl: string, isPlaylist: boolean }|null}
 */
export const getSpotifyEmbed = (url) => {
    if (!url || typeof url !== "string") return null;
    let clean = url.trim();
    if (isIframeHtml(clean)) clean = extractIframeSrc(clean) || clean;

    // Matches https://open.spotify.com/track/ID or album/ID or playlist/ID or episode/ID or show/ID
    const match = clean.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/i);
    if (match) {
        const type = match[1];
        const id = match[2];
        return {
            embedUrl: `https://open.spotify.com/embed/${type}/${id}`,
            isPlaylist: type === "album" || type === "playlist" || type === "show",
            type,
            id
        };
    }

    // Handles spotify:track:ID uri
    const uriMatch = clean.match(/^spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)/i);
    if (uriMatch) {
        return {
            embedUrl: `https://open.spotify.com/embed/${uriMatch[1]}/${uriMatch[2]}`,
            isPlaylist: uriMatch[1] === "album" || uriMatch[1] === "playlist" || uriMatch[1] === "show",
            type: uriMatch[1],
            id: uriMatch[2]
        };
    }

    // If it's already an embed url
    if (clean.includes("open.spotify.com/embed/")) {
        return {
            embedUrl: clean,
            isPlaylist: clean.includes("/album/") || clean.includes("/playlist/") || clean.includes("/show/"),
            type: "embed"
        };
    }

    return null;
};

/**
 * Parse SoundCloud URL into widget embed URL
 * @param {string} url
 * @returns {string|null}
 */
export const getSoundCloudEmbed = (url) => {
    if (!url || typeof url !== "string") return null;
    let clean = url.trim();
    if (isIframeHtml(clean)) clean = extractIframeSrc(clean) || clean;

    if (clean.includes("w.soundcloud.com/player/")) {
        return clean;
    }

    if (clean.includes("soundcloud.com/")) {
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(clean)}&color=%2300bfff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
    }

    return null;
};

/**
 * Main parser: Returns comprehensive info about any media source (file or embed)
 * @param {string} source
 * @param {'audio'|'video'} defaultMediaType
 */
export const parseMediaSource = (source, defaultMediaType = "audio") => {
    if (!source || typeof source !== "string") {
        return {
            isEmbed: false,
            type: "none",
            provider: "Kosong",
            sourceUrl: "",
            embedUrl: "",
            thumbnailUrl: null,
            badgeColor: "bg-gray-100 text-gray-600",
            icon: "❓"
        };
    }

    const trimmed = source.trim();

    // 1. YouTube
    const ytId = getYouTubeId(trimmed);
    if (ytId) {
        return {
            isEmbed: true,
            type: "youtube",
            provider: "YouTube",
            id: ytId,
            sourceUrl: trimmed,
            embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
            badgeColor: "bg-red-50 text-red-600 border-red-200",
            icon: "▶️"
        };
    }

    // 2. Spotify
    const spotify = getSpotifyEmbed(trimmed);
    if (spotify) {
        return {
            isEmbed: true,
            type: "spotify",
            provider: "Spotify",
            sourceUrl: trimmed,
            embedUrl: spotify.embedUrl,
            isPlaylist: spotify.isPlaylist,
            thumbnailUrl: null,
            badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
            icon: "🟢"
        };
    }

    // 3. SoundCloud
    const soundCloudUrl = getSoundCloudEmbed(trimmed);
    if (soundCloudUrl) {
        return {
            isEmbed: true,
            type: "soundcloud",
            provider: "SoundCloud",
            sourceUrl: trimmed,
            embedUrl: soundCloudUrl,
            thumbnailUrl: null,
            badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
            icon: "☁️"
        };
    }

    // 4. Google Drive
    const gDriveId = getGoogleDriveId(trimmed);
    if (gDriveId) {
        return {
            isEmbed: true,
            type: "gdrive",
            provider: "Google Drive",
            id: gDriveId,
            sourceUrl: trimmed,
            embedUrl: `https://drive.google.com/file/d/${gDriveId}/preview`,
            thumbnailUrl: null,
            badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
            icon: "📁"
        };
    }

    // 5. Vimeo
    const vimeoId = getVimeoId(trimmed);
    if (vimeoId) {
        return {
            isEmbed: true,
            type: "vimeo",
            provider: "Vimeo",
            id: vimeoId,
            sourceUrl: trimmed,
            embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
            thumbnailUrl: null,
            badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-200",
            icon: "🎬"
        };
    }

    // 6. Raw Iframe tag
    if (isIframeHtml(trimmed)) {
        const extractedSrc = extractIframeSrc(trimmed);
        return {
            isEmbed: true,
            type: "iframe",
            provider: "Embed Iframe",
            sourceUrl: trimmed,
            embedUrl: extractedSrc || "",
            rawIframe: trimmed,
            thumbnailUrl: null,
            badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
            icon: "🔲"
        };
    }

    // 7. Direct Audio / Video URL
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const lower = trimmed.toLowerCase();
        const isDirectAudio = lower.endsWith(".mp3") || lower.endsWith(".wav") || lower.endsWith(".ogg") || lower.endsWith(".m4a") || lower.endsWith(".aac");
        const isDirectVideo = lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogv") || lower.endsWith(".mov");

        if (isDirectAudio) {
            return {
                isEmbed: true,
                type: "direct_audio",
                provider: "Direct Audio URL",
                sourceUrl: trimmed,
                embedUrl: trimmed,
                thumbnailUrl: null,
                badgeColor: "bg-teal-50 text-teal-600 border-teal-200",
                icon: "🎵"
            };
        }

        if (isDirectVideo) {
            return {
                isEmbed: true,
                type: "direct_video",
                provider: "Direct Video URL",
                sourceUrl: trimmed,
                embedUrl: trimmed,
                thumbnailUrl: null,
                badgeColor: "bg-teal-50 text-teal-600 border-teal-200",
                icon: "🎥"
            };
        }

        // Generic web embed URL
        return {
            isEmbed: true,
            type: "generic_url",
            provider: "Web Embed",
            sourceUrl: trimmed,
            embedUrl: trimmed,
            thumbnailUrl: null,
            badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-200",
            icon: "🔗"
        };
    }

    // 8. Uploaded Local File
    const cleanUploadPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return {
        isEmbed: false,
        type: "upload",
        provider: defaultMediaType === "video" ? "File Video (.mp4)" : "File Audio",
        sourceUrl: trimmed,
        embedUrl: cleanUploadPath,
        thumbnailUrl: null,
        badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
        icon: defaultMediaType === "video" ? "🎞️" : "🎧"
    };
};

/**
 * Normalizes input embed string. If user pastes an iframe tag, extract the URL.
 * If user pastes standard URL, keep it clean.
 * @param {string} input
 * @returns {string}
 */
export const normalizeEmbedInput = (input) => {
    if (!input || typeof input !== "string") return "";
    const trimmed = input.trim();
    if (isIframeHtml(trimmed)) {
        const src = extractIframeSrc(trimmed);
        if (src) return src;
    }
    return trimmed;
};
