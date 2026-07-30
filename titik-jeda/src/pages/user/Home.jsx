import { useNavigate, Link } from "react-router-dom"; // Mengimpor alat navigasi (Link untuk tautan biasa, useNavigate untuk pindah halaman via fungsi)
import axios from "axios"; // Mengimpor HTTP client untuk menembak/mengirim request data ke API backend
import { useState } from "react"; // Mengimpor React Hook untuk membuat variabel penampung data dinamis (state) di dalam komponen
import Footer from "../../components/user/Footer"; // Mengimpor komponen UI bagian bawah/kaki halaman (Footer)
import BreathingExercise from "../../components/user/BreathingExercise"; // Mengimpor komponen fitur interaktif Latihan Pernapasan
import WritingTherapy from "../../components/user/WritingTherapy"; // Mengimpor komponen fitur interaktif Terapi Menulis (Kanvas)
import MusicPlayer from "../../components/user/MusicPlayer"; // Mengimpor komponen pemutar audio/musik relaksasi (Floating)

const affirmations = [
    "Kamu nggak harus cepet-cepet. Berproses juga bentuk dari kekuatan.",
    "Take your time, kamu sedang bertumbuh — dan itu cukup.",
    "You're doing better than you think.",
    "Kamu itu cukup. Bahkan ketika kamu merasa tidak.",
    "Healing gak harus buru-buru. Pelan juga tetap maju.",
    "You deserve rest, peace, and gentle days.",
    "Tenang, tidak semua yang kamu takutkan akan terjadi.",
    "Apa pun yang kamu rasakan hari ini, kamu tidak sendirian."
];

// ICON BINTANG NEO-BRUTALISM HERO (Functional Component)
const SparkleIcon = () => (
    <svg className="w-12 h-12 text-[#00BFFF] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
    </svg>
);

// ELEMEN ORNAMEN BERWARNA UNTUK SECTION 3
const SectionSparkle = ({ className }) => (
    <svg className={`w-10 h-10 text-[#00BFFF]/40 absolute z-0 pointer-events-none ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
);

const SectionCircle = ({ className }) => (
    <div className={`w-8 h-8 rounded-full border-4 border-[#ADFF2F]/60 absolute z-0 pointer-events-none ${className}`} />
);

const SectionTriangle = ({ className }) => (
    <svg className={`w-8 h-8 text-[#FF8C00]/40 absolute z-0 pointer-events-none ${className} transform rotate-45`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 22H2L12 2Z" />
    </svg>
);

function FlipCard({ text, onClick }) { //FlipCard (fungsi internal)
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        onClick();
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="w-full h-64 md:h-72 lg:h-80 cursor-pointer relative z-10" style={{ perspective: "1000px" }} onClick={handleFlip}>
            {/* Efek Bayangan Solid Card Flip */}
            <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-3 translate-y-3" />

            <div className={`relative w-full h-full transition-transform duration-700 border-4 border-[#292929] rounded-3xl ${isFlipped ? "rotate-y-180" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                {/* Sisi Depan */}
                <div className="absolute inset-0 bg-[#ADFF2F] rounded-[20px] flex flex-col items-center justify-center px-8 md:px-12 text-center text-[#292929] text-xl font-bold backface-hidden">
                    <span className="text-xs uppercase tracking-widest text-[#292929]/50 mb-4 font-bold">#pengingat hari ini</span>
                    “{text}”
                </div>
                {/* Sisi Belakang */}
                <div className="absolute inset-0 bg-[#00BFFF] rounded-[20px] flex flex-col items-center justify-center px-8 md:px-12 text-center text-[#FFFFFF] text-xl font-bold rotate-y-180 backface-hidden">
                    <span className="text-xs uppercase tracking-widest text-[#FFFFFF]/60 mb-4 font-bold">#mari berproses</span>
                    “{text}”
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [message, setMessage] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);

    // Fungsi untuk mengacak ulang kata-kata afirmasi pada kartu
    const randomizeMessage = () => {
        let nextMsg = affirmations[Math.floor(Math.random() * affirmations.length)]; // Mengambil satu teks acak baru
        
        // Perulangan untuk memastikan teks baru yang diacak TIDAK SAMA dengan teks yang sekarang lagi tampil
        while (nextMsg === message) {
            nextMsg = affirmations[Math.floor(Math.random() * affirmations.length)]; // Kalo sama, diacak ulang lagi
        }
        setMessage(nextMsg); // Menyimpan teks acak baru yang sudah valid ke dalam state message
    };

    // Fungsi asinkronus untuk menangani tombol klik screening (Check-In)
    const handleCheckIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.get("/api/user/dass/last-result", { withCredentials: true });
            if (res.data) navigate("/dass/result");
        } catch {
            navigate("/dass");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col relative bg-[#FFFFFF] overflow-hidden text-[#292929]">

            {/* Section 1: Hero & Affirmation */}
            <section className="min-h-screen w-full bg-gradient-to-br from-[#7dd3fc] via-[#a7f3d0] to-[#ccfbf1] flex items-center pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">

                {/* PATTERN ORNAMEN ABSTRAK LEMBUT DI LATAR BELAKANG */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 30%, #292929 15%, transparent 20%),
                        radial-gradient(circle at 75% 15%, #292929 10%, transparent 15%),
                        radial-gradient(circle at 40% 80%, #292929 12%, transparent 17%),
                        radial-gradient(circle at 85% 70%, #292929 18%, transparent 23%)
                    `,
                    backgroundSize: '100% 100%'
                }} />

                {/* Pola Garis Gelombang Pendukung Menggunakan Inline SVG Background */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M -100 200 Q 200 150 500 400 T 1100 300 T 1700 600" fill="none" stroke="#292929" strokeWidth="20" />
                    <path d="M -50 500 Q 400 300 800 700 T 1600 400" fill="none" stroke="#292929" strokeWidth="15" />
                    <path d="M 100 80 L 150 130 L 200 80 Z M 900 400 L 930 460 L 870 460 Z" fill="#292929" />
                </svg>

                {/* AREA KONTEN UTAMA */}
                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative z-10">

                    {/* SISI KIRI (CARD 1) */}
                    <div className="text-left flex flex-col items-start relative bg-[#FFFFFF]/35 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#FFFFFF]/40 shadow-sm w-full">
                        <div className="w-full">
                            <div className="mb-4">
                                <SparkleIcon />
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tighter text-[#292929] uppercase">
                                Kenali dirimu <br />
                                <span className="relative inline-block mt-2">
                                    lebih baik.
                                    <svg className="absolute -inset-x-4 -inset-y-2 w-[115%] h-[130%] text-[#ADFF2F] pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                        <path d="M5,50 C20,15 80,10 95,45 C98,75 30,95 8,70 C2,60 45,55 85,50" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-[#292929]/80 max-w-md mt-6 leading-relaxed font-normal">
                                Kenali tingkat stres, kecemasan, dan depresi yang kamu alami menggunakan screening{" "}
                                <span
                                    onClick={() => navigate("/dass-info")}
                                    className="inline-block text-[#00BFFF] font-black underline decoration-4 decoration-[#ADFF2F] underline-offset-4 cursor-pointer transition-transform hover:scale-105"
                                >
                                    DASS-21
                                </span>.
                            </p>
                        </div>

                        {/* Tombol Screening */}
                        <div className="relative mt-6 group w-fit">
                            <div className="absolute inset-0 bg-[#292929] rounded-full translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                            <div className="relative flex items-center rounded-full bg-[#FFFFFF] border-4 border-[#292929] p-1 pr-2">
                                <button
                                    onClick={handleCheckIn}
                                    disabled={loading}
                                    className="px-8 py-3.5 font-black text-sm sm:text-base text-[#292929] uppercase tracking-wider cursor-pointer bg-transparent"
                                >
                                    {loading ? "Memproses..." : "Mulai Screening"}
                                </button>
                                <button
                                    onClick={handleCheckIn}
                                    className="w-12 h-12 rounded-full bg-[#00BFFF] border-2 border-[#292929] text-[#FFFFFF] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:rotate-45"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SISI KANAN (CARD 2) */}
                    <div className="w-full flex flex-col justify-between relative bg-[#FFFFFF]/35 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#FFFFFF]/40 shadow-sm w-full">
                        <div className="w-full">
                            <div className="text-left mb-6">
                                <span className="bg-[#292929] text-[#FFFFFF] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                                    #Daily Affirmation
                                </span>
                                <h2 className="text-3xl font-black text-[#292929] tracking-tight uppercase mt-3">Butuh Pengingat Hari Ini?</h2>
                                <p className="text-sm text-[#292929]/70 mt-2 font-normal leading-relaxed">Klik kartunya. Siapa tahu kata-kata di baliknya bisa bikin kamu senyum lagi</p>
                            </div>
                        </div>
                        <div className="w-full mt-auto">
                            <FlipCard text={message} onClick={randomizeMessage} />
                        </div>
                    </div>

                </div>
            </section>

            {/* Section 2: Breathing Exercise */}
            <section className="w-full bg-[#FFFFFF] bg-[radial-gradient(circle_at_center,rgba(240,253,244,0.65)_0%,rgba(255,255,255,1)_70%)] py-20 px-4 md:px-8 relative overflow-hidden">
                <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
                    <h2 className="text-3xl font-black text-[#292929] uppercase tracking-tight text-center mb-2">
                        Ambil Jeda Sejenak
                    </h2>
                    <p className="text-[#292929]/60 text-sm sm:text-base text-center mb-12 font-normal">Ikuti latihan pernapasan sederhana untuk membantu tubuh dan pikiran lebih rileks.</p>

                    <div className="w-full max-w-4xl relative z-10">
                        <BreathingExercise />
                    </div>
                </div>
            </section>

            {/* Section 3: Fitur */}
            <section className="w-full pt-24 pb-20 px-4 md:px-8 min-h-[60vh] relative overflow-hidden bg-[#FFFFFF]">

                {/* TABURAN ORNAMEN BERWARNA DINAMIS DI SEKITAR AREA FITUR */}
                <SectionSparkle className="top-12 left-4 md:left-12 animate-pulse" />
                <SectionCircle className="top-32 left-[20%] animate-bounce duration-[2000ms] hidden md:block" />
                <SectionTriangle className="top-16 left-[45%] hidden lg:block" />
                <SectionSparkle className="top-24 right-[22%] animate-pulse hidden md:block" />
                <SectionCircle className="top-14 right-6 md:right-16 animate-bounce duration-[2500ms]" />

                <SectionTriangle className="bottom-16 left-6 md:left-14" />
                <SectionSparkle className="bottom-28 left-[35%] animate-pulse hidden md:block" />
                <SectionCircle className="bottom-20 right-[38%] animate-bounce duration-[2200ms] hidden lg:block" />
                <SectionTriangle className="bottom-32 right-20 md:right-36" />
                <SectionSparkle className="bottom-12 right-4 md:right-10 animate-pulse" />

                <div className="max-w-6xl mx-auto w-full flex flex-col items-center relative z-10">
                    <h2 className="text-3xl font-black text-[#292929] text-center mb-16 max-w-2xl uppercase tracking-tight leading-none">
                        Self-check, self-help, self-love — semua ada di sini.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {/* Feature 1 */}
                        <div onClick={handleCheckIn} className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />
                            <div className="relative p-8 bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-black uppercase text-[#292929]">Screening</h3>
                                    <p className="text-xs italic font-bold text-[#292929]/40 mt-1">Self-check begins with awareness.</p>
                                    <p className="text-[#292929]/70 text-sm mt-5 leading-relaxed font-normal">Isi kuisioner DASS-21 buat tahu kondisi emosimu hari ini.</p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-xs font-black text-[#00BFFF] uppercase tracking-wider">
                                    Coba Sekarang →
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <Link to="/Meditation" className="relative group">
                            <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />
                            <div className="relative p-8 bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-black uppercase text-[#292929]">Meditation</h3>
                                    <p className="text-xs italic font-bold text-[#292929]/40 mt-1">Self-help starts with a pause.</p>
                                    <p className="text-[#292929]/70 text-sm mt-5 leading-relaxed font-normal">Ambil jeda sejenak, tenangkan pikiran lewat meditasi singkat.</p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-xs font-black text-[#00BFFF] uppercase tracking-wider">
                                    Mulai Meditasi →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 3 */}
                        <Link to="/education" className="relative group">
                            <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />
                            <div className="relative p-8 bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-black uppercase text-[#292929]">Learn & Grow</h3>
                                    <p className="text-xs italic font-bold text-[#292929]/40 mt-1">Self-love grows with understanding.</p>
                                    <p className="text-[#292929]/70 text-sm mt-5 leading-relaxed font-normal">Belajar soal mental health lewat konten visual yang ringan & relate.</p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-xs font-black text-[#00BFFF] uppercase tracking-wider">
                                    Pelajari →
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Floating Elements Layer */}
            {!isCanvasOpen && <MusicPlayer />}
            <WritingTherapy isOpen={isCanvasOpen} setIsOpen={setIsCanvasOpen} />

            <Footer />
        </div>
    );
}