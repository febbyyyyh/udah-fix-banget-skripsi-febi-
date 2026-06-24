import { useNavigate } from "react-router-dom";

export default function DassInfo() {
    const navigate = useNavigate();

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
            label: "Parah",
            description: "Gejala tinggi dan dapat mengganggu aktivitas.",
            color: "bg-[#ffba58]",
            border: "border-[#f2a23c]"
        },
        {
            label: "Sangat Parah",
            description: "Gejala sangat tinggi dan perlu dukungan profesional.",
            color: "bg-[#f94e67]",
            border: "border-[#e43b54]"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-[#eef8ff] to-white px-6 py-10 md:px-12 relative flex flex-col items-center">
            {/* Tombol X kanan atas */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-5 right-5 z-50 w-9 h-9 rounded-full bg-[#0a1d48]/10 text-[#0a1d48] hover:bg-[#0a1d48] hover:text-white transition-colors text-2xl font-bold flex items-center justify-center"
                aria-label="Tutup"
            >
                &times;
            </button>

            {/* Header */}
            <div className="w-full max-w-3xl text-center pt-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1d48] tracking-tight">
                    DASS-21
                </h1>

                <div className="w-full h-px bg-[#0a1d48]/15 mt-12 mb-16" />
            </div>

            {/* Konten */}
            <div className="w-full max-w-3xl text-gray-700 text-sm md:text-base leading-relaxed">
                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0a1d48] mb-6">
                        Apa itu DASS-21?
                    </h2>

                    <p className="text-gray-600 leading-8 mb-5">
                        <strong className="text-[#0a1d48]">DASS</strong> awalnya hadir dalam versi 42 item atau DASS-42. Versi ini mengukur tiga kondisi emosional negatif, yaitu depresi, kecemasan, dan stres. Setiap skala berisi 14 item, sehingga proses pengisian bisa terasa lebih panjang bagi sebagian responden.
                    </p>

                    <p className="text-gray-600 leading-8">
                        <strong className="text-[#0a1d48]">DASS-21</strong> kemudian dikembangkan sebagai versi singkat dari DASS-42 oleh <strong className="text-[#0a1d48]">Peter F. Lovibond & Sydney H. Lovibond (1995)</strong>. Versi ini tetap mengukur tiga aspek yang sama, tetapi hanya menggunakan 21 item. Setiap subskala terdiri dari 7 item, sehingga lebih ringkas, praktis, dan tetap dapat digunakan untuk screening, penelitian, serta pemantauan kondisi kesehatan mental.
                    </p>
                </section>

                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0a1d48] mb-6">
                        Bagaimana DASS-21 bekerja?
                    </h2>

                    <p className="text-gray-600 leading-8 mb-8">
                        Pertanyaan DASS-21 dibagi menjadi tiga subskala. Setiap subskala
                        memiliki 7 item. Jawaban diberikan dengan skala Likert 0
                        sampai 3, sesuai seberapa sering kondisi tersebut dirasakan.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <div className="rounded-3xl bg-white border border-[#ADC7EA] p-5 shadow-sm">
                            <h3 className="font-bold text-[#0a1d48] mb-2">Depresi</h3>
                            <p className="text-sm text-gray-600">
                                7 item untuk melihat kesedihan, hilangnya minat, rendah diri, dan putus asa.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-[#ADC7EA] p-5 shadow-sm">
                            <h3 className="font-bold text-[#0a1d48] mb-2">Kecemasan</h3>
                            <p className="text-sm text-gray-600">
                                7 item untuk melihat rasa takut, panik, gelisah, dan ketegangan fisik.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-[#ADC7EA] p-5 shadow-sm">
                            <h3 className="font-bold text-[#0a1d48] mb-2">Stres</h3>
                            <p className="text-sm text-gray-600">
                                7 item untuk melihat sulit rileks, mudah tersinggung, tegang, dan reaktif.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-10">
                        <p className="font-bold text-[#0a1d48]">Skala jawaban:</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
                                <span className="font-bold text-[#0a1d48]">0</span>
                                <span className="text-gray-600"> = Tidak pernah</span>
                            </div>
                            <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
                                <span className="font-bold text-[#0a1d48]">1</span>
                                <span className="text-gray-600"> = Kadang-kadang</span>
                            </div>
                            <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
                                <span className="font-bold text-[#0a1d48]">2</span>
                                <span className="text-gray-600"> = Cukup sering</span>
                            </div>
                            <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3">
                                <span className="font-bold text-[#0a1d48]">3</span>
                                <span className="text-gray-600"> = Sangat sering atau hampir selalu</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-8">
                        Skor tiap subskala dijumlahkan lalu dikalikan 2 untuk mendapatkan
                        skor akhir. Hasilnya dikategorikan berdasarkan tingkat keparahan
                        masing-masing subskala.
                    </p>
                </section>

                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0a1d48] mb-6">
                        Tingkat hasil DASS-21
                    </h2>

                    <div className="space-y-4">
                        {severityItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-4 rounded-2xl bg-white border border-gray-100 px-5 py-4 shadow-sm"
                            >
                                <span className={`mt-1 h-4 w-4 rounded-full border ${item.color} ${item.border} shrink-0`} />
                                <div>
                                    <p className="font-bold text-[#0a1d48]">{item.label}</p>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <div className="rounded-3xl bg-[#F8FBFF] border border-[#ADC7EA] px-6 py-5">
                        <p className="text-gray-700 leading-7">
                            <strong className="text-[#0a1d48]">Penting:</strong> DASS-21 adalah alat
                            screening, bukan diagnosis klinis. Silakan konsultasikan hasil
                            dengan profesional kesehatan mental jika diperlukan.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}