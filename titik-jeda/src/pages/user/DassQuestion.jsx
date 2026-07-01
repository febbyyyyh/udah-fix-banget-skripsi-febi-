import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ELEMEN TAMBAHAN BERWARNA: ORNAMEN BINTANG ABSTRAK (Warna Biru)
const TinySparkle = ({ className }) => (
    <svg className={`w-10 h-10 text-[#00BFFF]/30 absolute z-0 pointer-events-none ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
);

// ELEMEN TAMBAHAN BERWARNA: ORNAMEN LINGKARAN DONUT (Warna Hijau)
const TinyCircle = ({ className }) => (
    <div className={`w-8 h-8 rounded-full border-4 border-[#ADFF2F]/45 absolute z-0 pointer-events-none ${className}`} />
);

// ELEMEN TAMBAHAN BERWARNA: ORNAMEN SEGITIGA MINI (Warna Oranye)
const TinyTriangle = ({ className }) => (
    <svg className={`w-8 h-8 text-[#FF8C00]/30 absolute z-0 pointer-events-none ${className} transform rotate-45`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 22H2L12 2Z" />
    </svg>
);

export default function DassQuestion() {
    const navigate = useNavigate();

    const questions = [
        "Saya merasa sulit untuk bersantai.",
        "Saya merasakan mulut saya terasa kering.",
        "Sepertinya saya tidak dapat merasakan perasaan positif apa pun.",
        "Saya mengalami kesulitan bernafas tanpa melakukan aktivitas fisik.",
        "Saya merasa tidak mampu untuk memulai sesuatu.",
        "Saya cenderung bereaksi berlebihan pada situasi.",
        "Saya merasa gemetar (tremor).",
        "Saya merasa menggunakan banyak energi untuk cemas.",
        "Saya merasa sedih dan tertekan.",
        "Saya merasa saya tidak sabar.",
        "Saya merasa sulit untuk beristirahat setelah melakukan sesuatu.",
        "Saya merasa takut tanpa alasan yang jelas.",
        "Saya tidak bisa menikmati hal-hal yang saya lakukan.",
        "Saya merasa gelisah.",
        "Saya merasa saya tidak berharga.",
        "Saya mudah tersinggung.",
        "Saya merasa jantung saya berdebar-debar (tanpa aktivitas).",
        "Saya merasa takut akan situasi yang membuat saya cemas.",
        "Saya merasa tidak ada harapan.",
        "Saya merasa mudah marah.",
        "Saya merasa takut dan seolah akan panik."
    ];

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState(Array(21).fill(null));

    const options = [
        { value: 0, label: "0 (Tidak pernah)" },
        { value: 1, label: "1 (Kadang-kadang)" },
        { value: 2, label: "2 (Cukup sering)" },
        { value: 3, label: "3 (Sangat sering)" },
    ];

    const handleSelect = (value) => {
        const updated = [...answers];
        updated[current] = value;
        setAnswers(updated);
    };

    const next = () => {
        if (current < 20) {
            setCurrent(current + 1);
        } else {
            calculateResult();
        }
    };

    const prev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const calculateResult = () => {
        const depressionIndex = [2, 4, 9, 12, 15, 19, 20];
        const anxietyIndex = [1, 3, 6, 8, 14, 18, 21];
        const stressIndex = [5, 7, 10, 11, 13, 16, 17];

        const sum = (indexes) =>
            indexes.reduce((acc, i) => acc + (answers[i - 1] || 0), 0);

        const depression = sum(depressionIndex) * 2;
        const anxiety = sum(anxietyIndex) * 2;
        const stress = sum(stressIndex) * 2;

        navigate("/dass/result", {
            state: { depression, anxiety, stress }
        });
    };

    const progress = ((current + 1) / 21) * 100;

    return (
        /* KUNCI UTAMA: w-full h-screen overflow-hidden dipasang pada pembungkus terluar browser */
        <div className="w-full h-screen overflow-hidden bg-[#FFFFFF] relative text-[#292929]">

            {/* SEBARAN ELEMEN GEOMETRI RANDOM (Dikunci statis terhadap window view agar tidak bergeser) */}
            <TinySparkle className="top-12 left-6 sm:left-12 animate-pulse" />
            <TinyTriangle className="top-14 left-[30%] hidden md:block" />
            <TinyCircle className="top-16 right-[25%] hidden md:block" />
            <TinyTriangle className="top-20 right-6 sm:right-16" />

            <TinyCircle className="top-[250px] left-10 sm:left-24 animate-bounce duration-[2500ms]" />
            <TinySparkle className="top-[270px] left-[20%] animate-pulse hidden lg:block" />
            <TinyTriangle className="top-[220px] left-[45%] hidden md:block" />
            <TinySparkle className="top-[240px] right-[18%] animate-pulse hidden lg:block" />
            <TinyCircle className="top-[300px] right-8 sm:right-20 animate-bounce duration-[2200ms]" />

            <TinyTriangle className="bottom-48 left-4 sm:left-14" />
            <TinyCircle className="bottom-72 left-[15%] animate-bounce duration-[3000ms] hidden md:block" />
            <TinySparkle className="bottom-24 left-8 sm:left-20 animate-pulse" />

            <TinyCircle className="bottom-64 right-[12%] animate-bounce duration-[2800ms] hidden md:block" />
            <TinyTriangle className="bottom-36 right-6 sm:right-14" />
            <TinySparkle className="bottom-16 right-10 sm:right-24 animate-pulse" />

            {/* AREA KONTEN MANDIRI: Diatur overflow-y-scroll dan h-full agar scrollbar kanan SELALU TERKUNCI MUNCUL */}
            <div className="w-full h-full overflow-y-scroll flex flex-col items-center px-4 sm:px-6 pt-24 pb-16 relative z-10">

                {/* Progress Bar Area */}
                <div className="w-full max-w-2xl mb-12 px-1 relative z-10">
                    <div className="flex justify-between items-center mb-2.5 text-xs font-black uppercase tracking-widest text-[#292929]/50">
                        <span>Pertanyaan</span>
                        <span className="text-[#00BFFF]">{current + 1} dari 21</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F2F2F2] rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%`, backgroundColor: "#00BFFF" }}
                        ></div>
                    </div>
                </div>

                {/* Question Text */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-12 max-w-3xl leading-relaxed px-2 tracking-tight relative z-10">
                    {questions[current]}
                </h2>

                {/* Options Button List */}
                <div className="w-full max-w-2xl flex flex-col gap-4 relative z-10">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full text-left px-5 sm:px-7 py-4 rounded-2xl font-medium border-2 text-base sm:text-lg transition-all shadow-sm active:scale-99 cursor-pointer
                                ${answers[current] === opt.value
                                    ? "border-[#00BFFF] bg-[#FFFFFF] font-bold"
                                    : "border-transparent bg-[#F2F2F2] hover:bg-[#F2F2F2]/80"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="w-full max-w-2xl flex justify-between items-center mt-12 relative z-10">
                    {current > 0 ? (
                        <button
                            type="button"
                            onClick={prev}
                            className="px-5 py-2.5 rounded-xl border-2 border-[#F2F2F2] text-[#292929]/80 font-bold text-sm sm:text-base hover:bg-[#F2F2F2] transition flex items-center gap-2 cursor-pointer"
                        >
                            ← Sebelumnya
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        type="button"
                        onClick={next}
                        disabled={answers[current] === null}
                        className={`px-7 py-3 rounded-xl font-black text-sm sm:text-base transition shadow-sm active:scale-95
                            ${answers[current] === null
                                ? "bg-[#F2F2F2] text-[#292929]/30 cursor-not-allowed shadow-none"
                                : "bg-[#00BFFF] text-[#FFFFFF] hover:opacity-90 cursor-pointer"
                            }
                        `}
                    >
                        {current === 20 ? "Selesai" : "Selanjutnya →"}
                    </button>
                </div>

            </div>
        </div>
    );
}