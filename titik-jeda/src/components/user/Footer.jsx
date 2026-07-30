import { Link } from "react-router-dom";

export default function Footer() {
    return (
        // Mengubah background utama footer menjadi abu-abu terang (#F2F2F2)
        <footer className="w-full bg-[#F2F2F2] mt-24 py-16 px-6 text-[#292929]">
            {/* Top Section */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14 items-start">

                {/* 1. Kolom Kiri: Brand & Informasi */}
                <div className="flex flex-col items-start text-left">
                    {/* Logo Terintegrasi Flat */}
                    <div className="flex items-center h-10 bg-[#00BFFF] rounded-full pr-5 overflow-hidden shadow-sm mb-4">
                        <div className="h-full aspect-square bg-[#ADFF2F] rounded-full flex items-center justify-center mr-3">
                            <span className="font-extrabold text-[#292929] text-sm select-none">II</span>
                        </div>
                        <span className="text-[#FFFFFF] text-xs font-black tracking-wide">
                            Titik Jeda
                        </span>
                    </div>

                    <p className="text-[#292929] opacity-85 leading-relaxed text-sm max-w-sm">
                        Titik Jeda adalah ruang kecil untuk berhenti sejenak, mendengar diri sendiri,
                        dan menemukan ketenangan di tengah rutinitas yang padat.
                    </p>

                    <p className="text-[#292929]/50 mt-4 leading-relaxed text-xs max-w-sm italic">
                        Disclaimer: Fitur yang tersedia dalam aplikasi ini hanya ditujukan sebagai
                        bantuan awal non-klinis.
                    </p>
                </div>

                {/* 2. Kolom Tengah: Layanan Kampus */}
                <div className="flex flex-col items-start text-left md:pl-10">
                    <h3 className="font-black text-xs uppercase tracking-widest text-[#00BFFF] mb-4 h-6 flex items-center">
                        Layanan Kampus
                    </h3>
                    <div className="mb-4">
                        <p className="font-black text-[#292929] text-sm md:text-base">
                            Unit Penunjang Akademik (UPA) Bimbingan & Konseling
                        </p>
                        <p className="text-[#292929]/60 text-xs md:text-sm mt-1 mb-3">
                            Depan Gedung Rektorat Universitas Sam Ratulangi
                        </p>
                        <a
                            href="https://wa.me/6281953027359"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#00BFFF] text-[#FFFFFF] font-bold text-xs px-4 py-2 rounded-full shadow-sm hover:opacity-90 transition active:scale-95"
                        >
                            Hubungi Konselor →
                        </a>
                    </div>

                    {/* Mini Maps dibingkus border putih agar pop-out di atas abu-abu */}
                    <div className="w-full max-w-[280px] h-32 rounded-2xl overflow-hidden shadow-sm border border-[#FFFFFF]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!3m2!1sid!2sid!4v1778669984960!5m2!1sid!2sid!6m8!1m7!1shToPhmzmz8PkwU9xL6-xuA!2m2!1d1.456226168629337!2d124.8268352714871!3f116.66719136261975!4f-7.084617788204326!5f0.4000000000000002"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allow="accelerometer; gyroscope; magnetometer"
                        ></iframe>
                    </div>
                </div>

                {/* 3. Kolom Kanan: Menu Navigasi */}
                <div className="flex flex-col items-start md:items-end text-left md:text-right">
                    <h3 className="font-black text-xs uppercase tracking-widest text-[#00BFFF] mb-4 h-6 flex items-center">
                        Menu
                    </h3>
                    <nav className="flex flex-col gap-3 text-[#292929] text-sm font-bold">
                        <Link to="/" className="hover:text-[#00BFFF] transition-colors">Home</Link>
                        <Link to="/meditation" className="hover:text-[#00BFFF] transition-colors">Meditation</Link>
                        <Link to="/education" className="hover:text-[#00BFFF] transition-colors">Learn & Grow</Link>
                        <Link to="/dass" className="hover:text-[#00BFFF] transition-colors">Screening</Link>
                    </nav>
                </div>
            </div>

            {/* Bottom Bar: Sekarang menggunakan warna putih (#FFFFFF) agar kontrasnya manis */}
            <div className="w-full mt-16 px-4">
                <div className="max-w-5xl mx-auto bg-[#FFFFFF] py-4 rounded-full text-center text-[#292929] text-xs sm:text-sm font-bold shadow-sm">
                    © 2026 Made with 💚 for Gen Z UNSRAT.
                </div>
            </div>
        </footer>
    );
}