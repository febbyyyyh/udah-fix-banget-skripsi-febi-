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
            {/* FLOATING ACTION BUTTON (FAB) UTAMA */}
            <button
                type="button"
                onClick={handleOpenToggle}
                aria-label={isOpen ? "Tutup ruang tulis" : "Buka ruang tulis"}
                style={{
                    right: "calc(var(--writing-fab-right) + var(--writing-fab-offset, 0px))",
                    bottom: "var(--writing-fab-bottom)",
                }}
                className="fixed [--writing-fab-right:1.5rem] [--writing-fab-bottom:1.5rem] md:[--writing-fab-right:2rem] md:[--writing-fab-bottom:2rem] z-[600] w-12 h-12 md:w-14 md:h-14 bg-[#FFFFFF] border-2 border-[#00BFFF] text-[#292929] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                )}
            </button>

            {/* MODAL OVERLAY FULL SCREEN */}
            {isOpen && (
                // Mengubah bg-white/70 menjadi bg-[#FFFFFF] full solid ber-z-index tinggi agar navbar tertutup total
                <div className="fixed inset-0 z-[550] bg-[#FFFFFF] overflow-y-auto text-[#292929]">
                    <div className="min-h-screen flex items-center justify-center px-4 py-16 md:py-20">
                        <div className="w-full max-w-4xl bg-[#FFFFFF] rounded-[2rem] border-2 border-[#00BFFF] overflow-hidden shadow-sm">

                            {/* Header Panel */}
                            <div className="px-6 md:px-10 py-7 border-b border-[#F2F2F2] bg-[#FFFFFF]">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs md:text-sm font-black text-[#00BFFF] tracking-wide uppercase">
                                            Writing Expression Therapy
                                        </p>
                                        <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#292929] tracking-tight">
                                            Ruang Tulis
                                        </h2>
                                        <p className="mt-3 text-sm md:text-base text-[#292929]/80 max-w-2xl leading-relaxed">
                                            Tempat singkat untuk menuliskan pikiran dan perasaan terdalam tanpa perlu terlihat rapi.
                                        </p>
                                        <p className="mt-2 text-xs md:text-sm text-[#00BFFF] font-bold">
                                            Berbasis metode expressive writing yang dikembangkan oleh psikolog James W. Pennebaker.
                                        </p>
                                    </div>

                                    {/* Tombol Close Internal */}
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="shrink-0 w-10 h-10 rounded-full bg-[#F2F2F2] text-[#292929] flex items-center justify-center hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition shadow-sm"
                                        aria-label="Tutup"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Main Body View */}
                            <div className="px-6 md:px-10 py-8">

                                {/* VIEW 1: Belum Mulai Menulis */}
                                {!hasStarted && !isCompleted && (
                                    <div className="flex flex-col items-start">
                                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F2F2F2] text-[#292929] text-xs font-bold">
                                            15 menit menulis bebas
                                        </div>

                                        <h3 className="mt-4 text-xl md:text-2xl font-black leading-snug">
                                            Tulis tentang hal yang sedang terasa berat.
                                        </h3>

                                        <p className="mt-3 text-sm md:text-base text-[#292929]/80 leading-relaxed">
                                            Pilih satu pengalaman, pikiran, atau perasaan yang akhir-akhir ini sering muncul. Tuliskan apa yang benar-benar kamu rasakan, bukan apa yang menurutmu seharusnya kamu rasakan.
                                        </p>

                                        <div className="mt-6 space-y-3.5 w-full">
                                            <div className="flex gap-4 items-center">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00BFFF] text-[#FFFFFF] text-xs font-black">1</span>
                                                <p className="text-sm font-bold text-[#292929]/90">Tulis pikiran dan perasaan terdalam.</p>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00BFFF] text-[#FFFFFF] text-xs font-black">2</span>
                                                <p className="text-sm font-bold text-[#292929]/90">Jangan berhenti untuk mengedit atau memperbaiki kalimat.</p>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00BFFF] text-[#FFFFFF] text-xs font-black">3</span>
                                                <p className="text-sm font-bold text-[#292929]/90">Tulisan ini tidak perlu dibagikan kepada siapa pun.</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                            <button
                                                type="button"
                                                onClick={handleStartWriting}
                                                className="px-6 py-3 rounded-xl bg-[#00BFFF] text-[#FFFFFF] font-black text-sm hover:opacity-90 transition shadow-sm"
                                            >
                                                Mulai Menulis
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-6 py-3 rounded-xl bg-[#F2F2F2] text-[#292929] font-black text-sm hover:opacity-80 transition"
                                            >
                                                Nanti Saja
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* VIEW 2: Sedang dalam Sesi Tulis */}
                                {hasStarted && !isCompleted && (
                                    <div>
                                        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-black">
                                                    Biarkan tulisanmu mengalir.
                                                </h3>
                                                <p className="mt-1 text-sm text-[#292929]/60 font-medium">
                                                    Tidak perlu diedit. Tidak perlu terlihat sempurna.
                                                </p>
                                            </div>

                                            {/* Timer Progress */}
                                            <div className="min-w-[160px] bg-[#F2F2F2] p-3 rounded-xl">
                                                <div className="flex items-center justify-between mb-1.5 text-xs font-black">
                                                    <span>Waktu Sisa</span>
                                                    <span className="text-[#00BFFF]">{formatTime(timeLeft)}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-[#FFFFFF] overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#00BFFF] transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 rounded-xl bg-[#F2F2F2] px-4 py-3 text-sm font-bold">
                                            Kamu bisa mulai dengan: <span className="text-[#00BFFF]">“Aku ingin menuliskan tentang…”</span>
                                        </div>

                                        <textarea
                                            ref={textAreaRef}
                                            value={writingText}
                                            onChange={(e) => setWritingText(e.target.value)}
                                            maxLength={3000}
                                            placeholder="Tumpahkan semua di sini..."
                                            className="w-full min-h-[300px] resize-none rounded-2xl border-2 border-[#F2F2F2] bg-[#FFFFFF] px-5 py-4 text-[#292929] font-medium placeholder:text-[#292929]/30 focus:outline-none focus:border-[#00BFFF] leading-relaxed shadow-sm"
                                        />

                                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <p className="text-xs font-bold text-[#292929]/50">
                                                {wordCount} kata • {writingText.length}/3000 karakter
                                            </p>

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleResetWriting}
                                                    className="px-5 py-2.5 rounded-xl border-2 border-[#F2F2F2] text-[#292929]/70 font-black text-sm hover:bg-[#F2F2F2] transition"
                                                >
                                                    Hapus Semuanya
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleFinishWriting}
                                                    disabled={!writingText.trim()}
                                                    className={`px-6 py-2.5 rounded-xl font-black text-sm transition shadow-sm ${writingText.trim()
                                                            ? "bg-[#00BFFF] text-[#FFFFFF] hover:opacity-90"
                                                            : "bg-[#F2F2F2] text-[#292929]/30 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Selesai
                                                </button>
                                            </div>
                                        </div>

                                        {/* Deteksi Kata Kunci Krisis */}
                                        {containsCrisisKeyword && (
                                            <div className="mt-6 rounded-2xl bg-[#00BFFF] p-6 text-[#FFFFFF] shadow-sm">
                                                <h4 className="text-base font-black text-[#ADFF2F]">
                                                    Kamu tidak harus menghadapi ini sendirian.
                                                </h4>
                                                <p className="mt-2 text-sm leading-relaxed font-medium">
                                                    Tulisanmu menunjukkan adanya tekanan emosional yang berat. Jika kamu merasa tidak aman atau memiliki dorongan untuk menyakiti diri sendiri, segera hubungi orang terdekat, konselor kampus, atau layanan bantuan profesional.
                                                </p>
                                                {counselorUrl && (
                                                    <a
                                                        href={counselorUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-4 inline-flex px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#292929] text-xs font-black hover:bg-[#F2F2F2] transition"
                                                    >
                                                        Hubungi Konselor
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* VIEW 3: Selesai Sesi */}
                                {isCompleted && (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-14 h-14 rounded-full bg-[#ADFF2F] text-[#292929] flex items-center justify-center shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>

                                        <h3 className="mt-5 text-2xl md:text-3xl font-black">
                                            Terima kasih sudah menulis.
                                        </h3>

                                        <p className="mt-3 max-w-xl mx-auto text-sm md:text-base text-[#292929]/70 font-medium leading-relaxed">
                                            Kamu sudah memberi ruang untuk pikiran dan perasaanmu. Tidak semua hal harus selesai sekarang. Kamu boleh berhenti sejenak.
                                        </p>

                                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsCompleted(false)}
                                                className="px-5 py-2.5 rounded-xl border-2 border-[#F2F2F2] text-[#292929] font-black text-sm hover:bg-[#F2F2F2] transition"
                                            >
                                                Lanjut Menulis
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleResetWriting}
                                                className="px-5 py-2.5 rounded-xl bg-[#ADFF2F] text-[#292929] font-black text-sm hover:opacity-90 transition shadow-sm"
                                            >
                                                Mulai Ulang
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-5 py-2.5 rounded-xl bg-[#00BFFF] text-[#FFFFFF] font-black text-sm hover:opacity-90 transition shadow-sm"
                                            >
                                                Tutup Aplikasi
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