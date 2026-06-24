import React, { useEffect, useMemo, useRef, useState } from "react";

const crisisKeywords = [
    "bunuh diri",
    "mengakhiri hidup",
    "ingin mati",
    "tidak ingin hidup",
    "menyakiti diri",
    "melukai diri",
    "self harm",
    "suicide",
    "kill myself",
];

const WRITING_DURATION = 15 * 60;

const WritingTherapy = ({ isOpen, setIsOpen, counselorUrl = "" }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [writingText, setWritingText] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WRITING_DURATION);

    const textAreaRef = useRef(null);

    const wordCount = useMemo(() => {
        if (!writingText.trim()) return 0;
        return writingText.trim().split(/\s+/).filter(Boolean).length;
    }, [writingText]);

    const containsCrisisKeyword = useMemo(() => {
        const lowerText = writingText.toLowerCase();
        return crisisKeywords.some((keyword) => lowerText.includes(keyword));
    }, [writingText]);

    const progress = useMemo(() => {
        return ((WRITING_DURATION - timeLeft) / WRITING_DURATION) * 100;
    }, [timeLeft]);

    useEffect(() => {
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        if (isOpen) {
            document.documentElement.style.setProperty(
                "--writing-fab-offset",
                `${scrollbarWidth}px`
            );
            document.body.style.overflow = "hidden";
        } else {
            document.documentElement.style.removeProperty("--writing-fab-offset");
            document.body.style.overflow = "";
        }

        return () => {
            document.documentElement.style.removeProperty("--writing-fab-offset");
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && hasStarted && textAreaRef.current) {
            const timer = setTimeout(() => {
                textAreaRef.current.focus();
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [isOpen, hasStarted]);

    useEffect(() => {
        if (!isOpen || !hasStarted || isCompleted) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, hasStarted, isCompleted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    const setFloatingButtonOffset = () => {
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        document.documentElement.style.setProperty(
            "--writing-fab-offset",
            `${scrollbarWidth}px`
        );
    };

    const clearFloatingButtonOffset = () => {
        document.documentElement.style.removeProperty("--writing-fab-offset");
    };

    const handleOpenToggle = () => {
        if (!isOpen) {
            setFloatingButtonOffset();
        } else {
            clearFloatingButtonOffset();
        }

        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        clearFloatingButtonOffset();
        setIsOpen(false);
    };

    const handleStartWriting = () => {
        setHasStarted(true);
        setIsCompleted(false);
        setTimeLeft(WRITING_DURATION);
    };

    const handleFinishWriting = () => {
        if (!writingText.trim()) return;
        setIsCompleted(true);
    };

    const handleResetWriting = () => {
        setHasStarted(false);
        setWritingText("");
        setIsCompleted(false);
        setTimeLeft(WRITING_DURATION);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpenToggle}
                aria-label={isOpen ? "Tutup ruang tulis" : "Buka ruang tulis"}
                style={{
                    right: "calc(var(--writing-fab-right) + var(--writing-fab-offset, 0px))",
                    bottom: "var(--writing-fab-bottom)",
                }}
                className="fixed [--writing-fab-right:1.5rem] [--writing-fab-bottom:1.5rem] md:[--writing-fab-right:2rem] md:[--writing-fab-bottom:2rem] z-[310] w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-[#0a1d48] text-[#0a1d48] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
                {isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[300] bg-white/70 backdrop-blur-md overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center px-4 py-20 md:py-24">
                        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-blue-100 overflow-hidden">
                            <div className="px-6 md:px-10 py-7 border-b border-blue-100 bg-gradient-to-br from-[#eef4ff] to-white">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-[#4A90E2] tracking-wide">
                                            Writing Expression Therapy
                                        </p>

                                        <h2 className="mt-2 text-2xl md:text-4xl font-bold text-[#0a1d48] tracking-tight">
                                            Ruang Tulis
                                        </h2>

                                        <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
                                            Tempat singkat untuk menuliskan pikiran dan
                                            perasaan terdalam tanpa perlu terlihat rapi.
                                        </p>

                                        <p className="mt-2 text-xs md:text-sm text-[#4A90E2] font-medium">
                                            Berbasis metode expressive writing yang dikembangkan oleh psikolog James W. Pennebaker.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="shrink-0 w-10 h-10 rounded-full bg-white text-[#0a1d48] border border-blue-100 shadow-sm flex items-center justify-center hover:bg-blue-50 transition"
                                        aria-label="Tutup"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 md:px-10 py-7 md:py-9">
                                {!hasStarted && !isCompleted && (
                                    <div>
                                        <div>
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#4A90E2] text-xs font-semibold">
                                                15 menit menulis bebas
                                            </div>

                                            <h3 className="mt-4 text-xl md:text-2xl font-bold text-[#0a1d48] leading-snug">
                                                Tulis tentang hal yang sedang terasa berat.
                                            </h3>

                                            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
                                                Pilih satu pengalaman, pikiran, atau perasaan
                                                yang akhir-akhir ini sering muncul. Tuliskan apa
                                                yang benar-benar kamu rasakan, bukan apa yang
                                                menurutmu seharusnya kamu rasakan.
                                            </p>

                                            <div className="mt-6 space-y-3">
                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a1d48] text-white text-xs font-semibold">
                                                        1
                                                    </span>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Tulis pikiran dan perasaan terdalam.
                                                    </p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a1d48] text-white text-xs font-semibold">
                                                        2
                                                    </span>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Jangan berhenti untuk mengedit atau
                                                        memperbaiki kalimat.
                                                    </p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a1d48] text-white text-xs font-semibold">
                                                        3
                                                    </span>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Tulisan ini tidak perlu dibagikan kepada
                                                        siapa pun.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-7 flex flex-col sm:flex-row gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleStartWriting}
                                                    className="px-6 py-3 rounded-full bg-[#0a1d48] text-white font-semibold text-sm hover:scale-105 transition shadow-md"
                                                >
                                                    Mulai Menulis
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleClose}
                                                    className="px-6 py-3 rounded-full bg-white border border-blue-100 text-[#0a1d48] font-semibold text-sm hover:bg-blue-50 transition"
                                                >
                                                    Nanti Saja
                                                </button>
                                            </div>
                                        </div>

                                        
                                    </div>
                                )}

                                {hasStarted && !isCompleted && (
                                    <div>
                                        <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-[#4A90E2] tracking-wide">
                                                    Pennebaker Writing Session
                                                </p>

                                                <h3 className="mt-2 text-xl md:text-2xl font-bold text-[#0a1d48]">
                                                    Biarkan tulisanmu mengalir.
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Tidak perlu diedit. Tidak perlu terlihat sempurna.
                                                </p>
                                            </div>

                                            <div className="min-w-[150px]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-slate-500">
                                                        Waktu
                                                    </span>
                                                    <span className="text-sm font-bold text-[#0a1d48]">
                                                        {formatTime(timeLeft)}
                                                    </span>
                                                </div>

                                                <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-[#0a1d48] transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 rounded-2xl bg-[#f8fbff] border border-blue-100 px-5 py-4">
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Kamu bisa mulai dengan:
                                                <span className="font-semibold text-[#0a1d48]">
                                                    {" "}
                                                    “Aku ingin menuliskan tentang…”
                                                </span>
                                            </p>
                                        </div>

                                        <textarea
                                            ref={textAreaRef}
                                            value={writingText}
                                            onChange={(e) => setWritingText(e.target.value)}
                                            maxLength={3000}
                                            placeholder="Aku ingin menuliskan tentang..."
                                            className="w-full min-h-[330px] md:min-h-[390px] resize-none rounded-[1.4rem] border border-blue-100 bg-[#fbfdff] px-5 py-5 text-[#0a1d48] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/40 focus:border-[#4A90E2] leading-relaxed shadow-inner"
                                        />

                                        <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <p className="text-xs md:text-sm text-slate-500">
                                                {wordCount} kata • {writingText.length}/3000 karakter
                                            </p>

                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleResetWriting}
                                                    className="px-5 py-3 rounded-full border border-red-100 text-red-500 font-semibold text-sm hover:bg-red-50 transition"
                                                >
                                                    Hapus
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleFinishWriting}
                                                    disabled={!writingText.trim()}
                                                    className={
                                                        writingText.trim()
                                                            ? "px-6 py-3 rounded-full font-semibold text-sm transition shadow-md bg-[#0a1d48] text-white hover:scale-105"
                                                            : "px-6 py-3 rounded-full font-semibold text-sm transition bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                                    }
                                                >
                                                    Selesai
                                                </button>
                                            </div>
                                        </div>

                                        {containsCrisisKeyword && (
                                            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                                                <h4 className="text-sm font-bold text-amber-800">
                                                    Kamu tidak harus menghadapi ini sendirian.
                                                </h4>

                                                <p className="mt-2 text-sm text-amber-800 leading-relaxed">
                                                    Tulisanmu menunjukkan adanya tekanan emosional
                                                    yang berat. Jika kamu merasa tidak aman atau
                                                    memiliki dorongan untuk menyakiti diri sendiri,
                                                    segera hubungi orang terdekat, konselor kampus,
                                                    atau layanan bantuan profesional.
                                                </p>

                                                {counselorUrl && (
                                                    <a
                                                        href={counselorUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-4 inline-flex px-5 py-2.5 rounded-full bg-amber-700 text-white text-sm font-semibold hover:bg-amber-800 transition"
                                                    >
                                                        Hubungi Konselor
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isCompleted && (
                                    <div className="text-center py-10 md:py-14">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-[#0a1d48] flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>

                                        <h3 className="mt-5 text-2xl md:text-3xl font-bold text-[#0a1d48]">
                                            Terima kasih sudah menulis.
                                        </h3>

                                        <p className="mt-3 max-w-xl mx-auto text-sm md:text-base text-slate-600 leading-relaxed">
                                            Kamu sudah memberi ruang untuk pikiran dan perasaanmu.
                                            Tidak semua hal harus selesai sekarang. Kamu boleh
                                            berhenti sejenak.
                                        </p>

                                        <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsCompleted(false)}
                                                className="px-6 py-3 rounded-full border border-blue-100 text-[#0a1d48] font-semibold text-sm hover:bg-blue-50 transition"
                                            >
                                                Lanjut Menulis
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleResetWriting}
                                                className="px-6 py-3 rounded-full bg-[#0a1d48] text-white font-semibold text-sm hover:scale-105 transition shadow-md"
                                            >
                                                Mulai Ulang
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-6 py-3 rounded-full bg-white border border-blue-100 text-[#0a1d48] font-semibold text-sm hover:bg-blue-50 transition"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WritingTherapy;