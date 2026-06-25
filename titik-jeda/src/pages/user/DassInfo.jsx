import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function DassInfo() {
    const navigate = useNavigate();

    // DIKEMBALIKAN KE WARNA UI LAMA (Sesuai permintaan)
    const severityItems = [
        {
            label: "Normal",
            description: "Gejala masih dalam rentang umum.",
            color: "bg-[#75b9e4]",
            border: "border-[#5aa3d2]"
        },
        {
            label: "Ringan",
            description: "Gejala mulai terasa, tetapi masih ringan.",
            color: "bg-[#7aef92]",
            border: "border-[#4fd86d]"
        },
        {
            label: "Sedang",
            description: "Gejala cukup terasa dan perlu diperhatikan.",
            color: "bg-[#fff771]",
            border: "border-[#e6dc45]"
        },
        {
            label: "Berat",
            description: "Gejala tinggi dan dapat mengganggu aktivitas.",
            color: "bg-[#ffba58]",
            border: "border-[#f2a23c]"
        },
        {
            label: "Sangat Berat",
            description: "Gejala sangat tinggi dan perlu dukungan profesional.",
            color: "bg-[#f94e67]",
            border: "border-[#e43b54]"
        }
    ];

    return (
        // Latar belakang tetap putih bersih sesuai tema baru
        <div className="min-h-screen w-full bg-[#FFFFFF] px-6 py-12 md:px-12 relative flex flex-col items-center text-[#292929]">

            {/* Tombol Tutup Kanan Atas */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-[#F2F2F2] text-[#292929] hover:bg-[#00BFFF] hover:text-[#FFFFFF] transition-all flex items-center justify-center shadow-sm"
                aria-label="Tutup"
            >
                <X size={20} strokeWidth={2.5} />
            </button>

            {/* Header Title */}
            <div className="w-full max-w-3xl text-center pt-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#292929]">
                    DASS-21
                </h1>
                <div className="w-full h-1 bg-[#00BFFF] rounded-full mt-8 mb-14" />
            </div>

            {/* Konten Utama */}
            <div className="w-full max-w-3xl text-sm md:text-base leading-relaxed">

                {/* Section 1: Pengertian */}
                <section className="mb-14">
                    <h2 className="text-2xl md:text-3xl font-black mb-5 text-[#292929]">
                        Apa itu DASS-21?
                    </h2>

                    <p className="text-[#292929]/90 leading-8 mb-5">
                        <strong className="text-[#00BFFF] font-black">DASS</strong> awalnya hadir dalam versi 42 item atau DASS-42. Versi ini mengukur tiga kondisi emosional negatif, yaitu depresi, kecemasan, dan stres. Setiap skala berisi 14 item, sehingga proses pengisian bisa terasa lebih panjang bagi sebagian responden.
                    </p>

                    <p className="text-[#292929]/90 leading-8">
                        <strong className="text-[#00BFFF] font-black">DASS-21</strong> kemudian dikembangkan sebagai versi singkat dari DASS-42 oleh <strong className="text-[#292929] font-bold">Peter F. Lovibond & Sydney H. Lovibond (1995)</strong>. Versi ini tetap mengukur tiga aspek yang sama, tetapi hanya menggunakan 21 item. Setiap subskala terdiri dari 7 item, sehingga lebih ringkas, praktis, dan tetap dapat digunakan untuk screening, penelitian, serta pemantauan kondisi kesehatan mental.
                    </p>
                </section>

                {/* Section 2: Cara Kerja */}
                <section className="mb-14">
                    <h2 className="text-2xl md:text-3xl font-black mb-5 text-[#292929]">
                        Bagaimana DASS-21 bekerja?
                    </h2>

                    <p className="text-[#292929]/90 leading-8 mb-8">
                        Pertanyaan DASS-21 dibagi menjadi tiga subskala. Setiap subskala memiliki 7 item. Jawaban diberikan dengan skala Likert 0 sampai 3, sesuai seberapa sering kondisi tersebut dirasakan.
                    </p>

                    {/* Tiga Card Subskala: Latar Putih, Border Biru */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                        <div className="rounded-2xl bg-[#FFFFFF] border-2 border-[#00BFFF] p-6 shadow-sm">
                            <h3 className="font-black text-lg text-[#292929] mb-2">Depresi</h3>
                            <p className="text-sm text-[#292929]/80 leading-relaxed">
                                7 item untuk melihat kesedihan, hilangnya minat, rendah diri, dan putus asa.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#FFFFFF] border-2 border-[#00BFFF] p-6 shadow-sm">
                            <h3 className="font-black text-lg text-[#292929] mb-2">Kecemasan</h3>
                            <p className="text-sm text-[#292929]/80 leading-relaxed">
                                7 item untuk melihat rasa takut, panik, gelisah, dan ketegangan fisik.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#FFFFFF] border-2 border-[#00BFFF] p-6 shadow-sm">
                            <h3 className="font-black text-lg text-[#292929] mb-2">Stres</h3>
                            <p className="text-sm text-[#292929]/80 leading-relaxed">
                                7 item untuk melihat sulit rileks, mudah tersinggung, tegang, dan reaktif.
                            </p>
                        </div>
                    </div>

                    {/* Skala Jawaban */}
                    <div className="space-y-4 mb-10">
                        <p className="font-black text-[#292929]">Skala jawaban:</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl bg-[#F2F2F2] px-5 py-3.5 font-bold">
                                <span className="text-[#00BFFF]">0</span>
                                <span className="text-[#292929]/90"> = Tidak pernah</span>
                            </div>
                            <div className="rounded-xl bg-[#F2F2F2] px-5 py-3.5 font-bold">
                                <span className="text-[#00BFFF]">1</span>
                                <span className="text-[#292929]/90"> = Kadang-kadang</span>
                            </div>
                            <div className="rounded-xl bg-[#F2F2F2] px-5 py-3.5 font-bold">
                                <span className="text-[#00BFFF]">2</span>
                                <span className="text-[#292929]/90"> = Cukup sering</span>
                            </div>
                            <div className="rounded-xl bg-[#F2F2F2] px-5 py-3.5 font-bold">
                                <span className="text-[#00BFFF]">3</span>
                                <span className="text-[#292929]/90"> = Sangat sering atau hampir selalu</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[#292929]/90 leading-8">
                        Skor tiap subskala dijumlahkan lalu dikalikan 2 untuk mendapatkan skor akhir. Hasilnya dikategorikan berdasarkan tingkat keparahan masing-masing subskala.
                    </p>
                </section>

                {/* Section 3: Tingkat Keparahan / Severity dengan Warna Klasik */}
                <section className="mb-14">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 text-[#292929]">
                        Tingkat hasil DASS-21
                    </h2>

                    <div className="space-y-3">
                        {severityItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-4 rounded-xl bg-[#FFFFFF] border-2 border-[#F2F2F2] px-5 py-4 shadow-sm"
                            >
                                {/* Menggunakan kombinasi warna dan border bawaan asli agar akurat */}
                                <span className={`h-4 w-4 rounded-full border ${item.color} ${item.border} shrink-0`} />
                                <div>
                                    <p className="font-black text-base text-[#292929]">{item.label}</p>
                                    <p className="text-sm text-[#292929]/70 font-medium">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section Important */}
                <section className="mb-6">
                    <div className="rounded-2xl bg-[#00BFFF] p-6 text-[#FFFFFF] shadow-sm">
                        <p className="leading-7 font-medium">
                            <strong className="text-[#ADFF2F] font-black">Penting:</strong> DASS-21 adalah alat screening, bukan diagnosis klinis. Silakan konsultasikan hasil dengan profesional kesehatan mental jika diperlukan.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}