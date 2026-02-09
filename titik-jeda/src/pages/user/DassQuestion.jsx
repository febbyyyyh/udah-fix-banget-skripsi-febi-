import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-10 bg-white">

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-10 px-1">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: "#285FA9" }}
                    ></div>
                </div>
            </div>

            {/* Question */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-10 leading-relaxed px-2">
                {questions[current]}
            </h1>

            {/* Options */}
            <div className="w-full max-w-2xl flex flex-col gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border text-base sm:text-lg transition-all
                            ${answers[current] === opt.value
                                ? "border-[#285FA9] bg-[#EEF4FF] shadow-sm"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Navigation */}
            <div className="w-full max-w-2xl flex justify-between mt-10">

                {current > 0 ? (
                    <button
                        onClick={prev}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border flex items-center gap-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                    >
                        <span className="text-lg">←</span> Sebelumnya
                    </button>
                ) : (
                    <div></div>
                )}

                <button
                    onClick={next}
                    disabled={answers[current] === null}
                    className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full text-white font-semibold text-sm sm:text-base transition
                        ${answers[current] === null
                            ? "bg-[#A5C0E0] cursor-not-allowed"
                            : "bg-[#285FA9] hover:bg-[#1F4C88]"
                        }
                    `}
                >
                    {current === 20 ? "Selesai" : "Selanjutnya"}
                </button>

            </div>
        </div>
    );
}
