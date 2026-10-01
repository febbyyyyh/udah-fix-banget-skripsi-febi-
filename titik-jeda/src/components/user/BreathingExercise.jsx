import React, { useEffect, useRef, useState } from "react";
const audioFile = "/assets/breathing-audio.mp3";

export default function BreathingExercise({
    totalSeconds = 300,
    cycle = [
        { name: "Inhale", duration: 4 },
        { name: "Hold", duration: 4 },
        { name: "Exhale", duration: 4 },
        { name: "Hold", duration: 4 },
    ],
}) {
    const totalCycleSec = cycle.reduce((s, p) => s + p.duration, 0);
    const rafRef = useRef(null);
    const lastTsRef = useRef(null);
    const audioRef = useRef(null);

    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    const remainingSeconds = Math.max(0, Math.round(totalSeconds - elapsed));

    const computePhase = (t) => {
        const cycleIndex = Math.floor(t / totalCycleSec);
        const cycleElapsed = t - cycleIndex * totalCycleSec;
        let acc = 0;
        for (let i = 0; i < cycle.length; i++) {
            const p = cycle[i];
            if (cycleElapsed >= acc && cycleElapsed < acc + p.duration) {
                return {
                    phaseIndex: i,
                    phase: p.name,
                    phaseProgress: (cycleElapsed - acc) / p.duration,
                    phaseRemaining: Math.ceil(p.duration - (cycleElapsed - acc)),
                };
            }
            acc += p.duration;
        }
        const last = cycle[cycle.length - 1];
        return { phaseIndex: cycle.length - 1, phase: last.name, phaseProgress: 1, phaseRemaining: 0 };
    };

    const phaseInfo = computePhase(elapsed);

    const getScale = (phaseName, progress) => {
        const min = 0.75;
        const max = 1.25;
        if (phaseName === "Inhale") return min + (max - min) * progress;
        if (phaseName === "Exhale") return max - (max - min) * progress;
        return 1;
    };

    const visualScale = (() => {
        const idx = phaseInfo.phaseIndex;
        const name = phaseInfo.phase;
        const prog = phaseInfo.phaseProgress;
        if (name === "Hold") {
            if (idx === 1) return 1.25;
            if (idx === 3) return 0.75;
        }
        return getScale(name, prog);
    })();

    const start = () => {
        setRunning(true);
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => { });
        }
    };

    const pause = () => {
        setRunning(false);
        if (audioRef.current) audioRef.current.pause();
    };

    const reset = () => {
        setRunning(false);
        setElapsed(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        if (!running) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            lastTsRef.current = null;
            return;
        }

        const loop = (ts) => {
            if (!lastTsRef.current) lastTsRef.current = ts;
            const delta = (ts - lastTsRef.current) / 1000;
            lastTsRef.current = ts;

            setElapsed((prev) => {
                const next = prev + delta;
                if (next >= totalSeconds) {
                    setRunning(false);
                    return totalSeconds;
                }
                return next;
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [running, totalSeconds]);

    const format = (s) => {
        const mm = Math.floor(s / 60).toString().padStart(2, "0");
        const ss = Math.floor(s % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    return (
        <div className="w-full flex justify-center">
            <audio ref={audioRef} src={audioFile} preload="auto" />

            {/* CARD UTAMA: Sekarang diubah menjadi BG Biru (#00BFFF) Full dan Tanpa Border */}
            <div className="w-full max-w-5xl bg-[#00BFFF] rounded-[2rem] shadow-md p-6 sm:p-10 flex flex-col sm:flex-row gap-8 items-center text-[#FFFFFF]">

                {/* Animation Circle Container */}
                <div className="shrink-0 relative h-48 w-48 flex items-center justify-center">
                    <div
                        className="absolute rounded-full transition-transform"
                        style={{
                            height: "150px",
                            width: "150px",
                            transform: `scale(${visualScale})`,
                            transition: "0.2s linear",
                            backgroundColor: "#ADFF2F", // Efek denyut luar menggunakan hijau cerah
                            opacity: 0.4
                        }}
                    />
                    <div
                        className="rounded-full bg-[#FFFFFF] flex items-center justify-center text-center border-4 border-[#ADFF2F] z-10"
                        style={{
                            height: "125px",
                            width: "125px",
                            transform: `scale(${visualScale})`,
                            transition: "0.2s linear",
                        }}
                    >
                        <div>
                            {/* Teks di dalam lingkaran dibuat hitam (#292929) agar terbaca jelas di atas warna putih */}
                            <div className="text-lg font-black text-[#292929]">{phaseInfo.phase}</div>
                            <div className="text-xs font-bold text-[#292929]/70 mt-0.5">{phaseInfo.phaseRemaining}s</div>
                        </div>
                    </div>
                </div>

                {/* Info & Controls */}
                <div className="flex flex-col grow gap-4 text-center sm:text-left w-full">
                    <div>
                        <h3 className="text-2xl font-black text-[#FFFFFF]">Box Breathing (4-4-4-4)</h3>
                        <p className="text-[#FFFFFF]/80 text-xs font-bold mt-1">A guided 5-minute breathing exercise for deep relaxation.</p>
                    </div>

                    {/* Garis pembatas disesuaikan menggunakan opacity putih agar menyatu dengan elegan */}
                    <div className="flex justify-between border-y border-[#FFFFFF]/20 py-3 text-xs font-black text-[#FFFFFF]">
                        <span>Elapsed: {format(elapsed)}</span>
                        <span>Remaining: {format(remainingSeconds)}</span>
                    </div>

                    <div className="flex justify-center sm:justify-start gap-3 mt-1">
                        {!running ? (
                            // Tombol Start menggunakan warna putih bersih agar sangat kontras dengan background biru
                            <button onClick={start} className="px-6 py-2.5 bg-[#FFFFFF] text-[#292929] font-black text-sm rounded-xl shadow-sm hover:bg-[#F2F2F2] transition active:scale-95">
                                Start
                            </button>
                        ) : (
                            // Tombol Pause menggunakan Hijau Cerah (#ADFF2F)
                            <button onClick={pause} className="px-6 py-2.5 bg-[#ADFF2F] text-[#292929] font-black text-sm rounded-xl shadow-sm hover:opacity-90 transition active:scale-95">
                                Pause
                            </button>
                        )}
                        {/* Tombol Reset menggunakan background abu-abu tombol (#F2F2F2) */}
                        <button onClick={reset} className="px-6 py-2.5 bg-[#F2F2F2] text-[#292929] font-black text-sm rounded-xl shadow-sm hover:opacity-90 transition active:scale-95">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}