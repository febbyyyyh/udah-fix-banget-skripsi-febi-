import React, { useEffect, useRef, useState } from "react";
import audioFile from "../../assets/breathing-audio.mp3"; // <-- tambahkan audio kamu

// Breathing Exercise
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

    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    const audioRef = useRef(null); // AUDIO REFERENCE

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

    const [phaseInfo, setPhaseInfo] = useState(() => computePhase(0));

    const getScale = (phaseName, progress) => {
        const min = 0.7;
        const max = 1.2;
        if (phaseName === "Inhale") return min + (max - min) * progress;
        if (phaseName === "Exhale") return max - (max - min) * progress;
        return 1;
    };

    const visualScale = (() => {
        const idx = phaseInfo.phaseIndex;
        const name = phaseInfo.phase;
        const prog = phaseInfo.phaseProgress;
        if (name === "Hold") {
            if (idx === 1) return 1.2;
            if (idx === 3) return 0.7;
        }
        return getScale(name, prog);
    })();

    // ========== AUDIO CONTROL ==========
    const startAudio = () => {
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    const pauseAudio = () => {
        if (audioRef.current) audioRef.current.pause();
    };

    const resetAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
    // ===================================

    const start = () => {
        setRunning(true);
        startAudio(); // AUDIO START
    };

    const pause = () => {
        setRunning(false);
        pauseAudio(); // AUDIO PAUSE
    };

    const reset = () => {
        setRunning(false);
        setElapsed(0);
        resetAudio(); // AUDIO RESET
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
                    resetAudio();
                    return totalSeconds;
                }
                return next;
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [running, totalSeconds]);

    useEffect(() => {
        setPhaseInfo(computePhase(elapsed));
    }, [elapsed]);

    const format = (s) => {
        const mm = Math.floor(s / 60).toString().padStart(2, "0");
        const ss = Math.floor(s % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    return (
        <div className="w-full flex justify-center p-4">
            {/* HIDDEN AUDIO */}
            <audio ref={audioRef} src={audioFile} preload="auto" />

            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center landscape-card">

                {/* Circle animation */}
                <div className="shrink-0 relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
                    <div
                        className="absolute rounded-full border-2 border-indigo-300/40"
                        style={{ height: "190px", width: "190px", transform: `scale(${visualScale})`, transition: "0.2s linear" }}
                    />
                    <div
                        className="rounded-full bg-indigo-100/60 backdrop-blur p-4 flex items-center justify-center text-center shadow-md"
                        style={{ height: "155px", width: "155px", transform: `scale(${visualScale})`, transition: "0.2s linear" }}
                    >
                        <div>
                            <div className="text-xl font-semibold">{phaseInfo.phase}</div>
                            <div className="text-sm text-slate-600">{phaseInfo.phaseRemaining}s</div>
                        </div>
                    </div>
                </div>

                {/* Text info */}
                <div className="flex flex-col grow gap-4 text-center md:text-left">
                    <h2 className="text-2xl font-semibold">Box Breathing (4-4-4-4)</h2>
                    <p className="text-slate-600 text-sm">A guided 5-minute breathing exercise.</p>

                    <div className="flex justify-between text-sm text-slate-700">
                        <span>Elapsed: {format(elapsed)}</span>
                        <span>Remaining: {format(remainingSeconds)}</span>
                    </div>

                    <div className="flex gap-3 mt-2">
                        {!running ? (
                            <button onClick={start} className="px-4 py-2 bg-[#0a1d48] text-white rounded-lg shadow cursor-pointer">Start</button>
                        ) : (
                            <button onClick={pause} className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow cursor-pointer">Pause</button>
                        )}
                        <button onClick={reset} className="px-4 py-2 border rounded-lg cursor-pointer">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
