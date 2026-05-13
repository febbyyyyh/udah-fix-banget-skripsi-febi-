import React, { useRef, useState, useEffect } from "react";

const VentingCanvas = ({ isOpen, setIsOpen }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#0a1d48");
    const [isEraser, setIsEraser] = useState(false);

    const timeoutRef = useRef(null);
    const fadeIntervalRef = useRef(null);
    const autoClearRef = useRef(null);

    const colors = [
        { name: "Navy", value: "#0a1d48" },
        { name: "Blue", value: "#4A90E2" },
        { name: "Rose", value: "#FF80AB" },
        { name: "Sage", value: "#66BB6A" },
        { name: "Purple", value: "#9575CD" },
    ];

    useEffect(() => {
        if (isOpen) {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        }
        return () => stopFadeEffect();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (isEraser) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.lineWidth = 40;
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
            }
        }
    }, [color, isEraser, isOpen]);

    const startDrawing = (e) => {
        stopFadeEffect();
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            startFadeEffect();
        }, 4000);
    };

    const startFadeEffect = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        fadeIntervalRef.current = setInterval(() => {
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 60);

        autoClearRef.current = setTimeout(() => {
            clearCanvasInstantly();
        }, 3000);
    };

    const stopFadeEffect = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
        if (autoClearRef.current) {
            clearTimeout(autoClearRef.current);
            autoClearRef.current = null;
        }
    };

    const getCoordinates = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top,
            };
        }
        return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    };

    const clearCanvasInstantly = () => {
        stopFadeEffect();
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Mengecek apakah warna saat ini adalah warna kustom (tidak ada di preset)
    const isCustomColor = !colors.some(c => c.value.toLowerCase() === color.toLowerCase());

    return (
        <>
            {/* Tombol Toggle (Z-Index 310 agar di atas Canvas) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[310] w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-[#0a1d48] text-[#0a1d48] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[300] bg-white/70 backdrop-blur-md animate-in fade-in duration-500 overflow-hidden">

                    {/* Toolbar Bawah */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-white p-2 md:p-3 rounded-full shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-5 max-w-[95%] md:max-w-none">

                        {/* Container Warna */}
                        <div className="flex gap-1.5 md:gap-2 px-2 border-r border-gray-200 items-center">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => {
                                        setColor(c.value);
                                        setIsEraser(false);
                                        stopFadeEffect();
                                    }}
                                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full transition-transform hover:scale-125 ${color === c.value && !isEraser ? "ring-2 ring-offset-2 ring-[#0a1d48]" : ""}`}
                                    style={{ backgroundColor: c.value }}
                                />
                            ))}

                            {/* Color Picker Kustom */}
                            <div className="relative flex items-center ml-1">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => {
                                        setColor(e.target.value);
                                        setIsEraser(false);
                                        stopFadeEffect();
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div
                                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 transition-all ${isCustomColor && !isEraser ? "ring-2 ring-offset-2 ring-[#0a1d48] border-solid" : ""}`}
                                    style={{ backgroundColor: isCustomColor ? color : 'transparent' }}
                                >
                                    {!isCustomColor && <span className="text-gray-400 text-lg leading-none">+</span>}
                                </div>
                            </div>
                        </div>

                        {/* Eraser */}
                        <button
                            onClick={() => setIsEraser(!isEraser)}
                            className={`p-2 rounded-lg transition-all ${isEraser ? "bg-[#0a1d48] text-white shadow-inner" : "text-gray-400 hover:bg-gray-100"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                                <path d="m22 21H7" /><path d="m5 11 9 9" />
                            </svg>
                        </button>

                        {/* Trash */}
                        <button
                            onClick={clearCanvasInstantly}
                            className="p-2 text-red-400 hover:text-red-600 border-l border-gray-200 ml-1 pl-2 md:pl-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Teks Instruksi */}
                    <div className="absolute top-20 md:top-10 w-full text-center pointer-events-none select-none px-4">
                        <h3 className="text-[#0a1d48] font-semibold text-lg md:text-xl tracking-tight">Express your feelings...</h3>
                        <p className="text-gray-500 text-xs md:text-sm italic">Coretanmu akan memudar perlahan, seperti bebanmu.</p>
                    </div>

                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full cursor-crosshair touch-none"
                    />
                </div>
            )}
        </>
    );
};

export default VentingCanvas;