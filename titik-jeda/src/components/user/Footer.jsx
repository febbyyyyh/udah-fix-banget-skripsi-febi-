import logo from "../../assets/logo.svg";

export default function Footer() {
    return (
        <footer className="w-full bg-[#EAF3FF] mt-20 py-16 px-6">
            {/* Top Section */}
            <div className="
                max-w-6xl mx-auto 
                grid grid-cols-1 md:grid-cols-3
                gap-10 md:gap-14
                items-start
            ">
                {/* 1. Kolom Kiri: Titik Jeda */}
                <div className="flex flex-col items-start text-left">
                    {/* Placeholder judul agar sejajar dengan kolom lain */}
                    <div className="mb-6 h-6 hidden md:block"></div>

                    <img
                        src={logo}
                        alt="Titik Jeda Logo"
                        className="w-20 h-auto sm:w-24 md:w-28"
                        style={{ display: 'block' }}
                    />
                    <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base max-w-sm">
                        Titik Jeda adalah ruang kecil untuk berhenti sejenak, mendengar diri sendiri,
                        dan menemukan ketenangan di tengah rutinitas yang padat.
                    </p>
                </div>

                {/* 2. Kolom Tengah: Layanan Kampus */}
                <div className="flex flex-col items-start text-left md:pl-10">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6 h-6 flex items-center">
                        Layanan Kampus
                    </h3>
                    <div className="mb-4">
                        <p className="font-bold text-[#0a1d48] text-sm md:text-base">
                            Unit Penunjang Akademik (UPA) Bimbingan & Konseling
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm mb-2">
                            Depan Gedung Rektorat Universitas Sam Ratulangi
                        </p>
                        <a
                            href="https://wa.me/6281335492303"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1"
                        >
                            Hubungi Konselor <span className="text-xs">→</span>
                        </a>
                    </div>

                    {/* Mini Maps */}
                    <div className="w-full max-w-[280px] h-32 rounded-xl overflow-hidden shadow-sm border border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!3m2!1sid!2sid!4v1778669984960!5m2!1sid!2sid!6m8!1m7!1shToPhmzmz8PkwU9xL6-xuA!2m2!1d1.456226168629337!2d124.8268352714871!3f116.66719136261975!4f-7.084617788204326!5f0.4000000000000002"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                {/* 3. Kolom Kanan: Menu */}
                <div className="flex flex-col items-start md:items-end text-left md:text-right">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6 h-6 flex items-center">
                        Menu
                    </h3>
                    <nav className="flex flex-col gap-3 text-gray-700 text-sm font-medium">
                        <a href="/" className="hover:text-[#0a1d48] transition-colors">Home</a>
                        <a href="/meditation" className="hover:text-[#0a1d48] transition-colors">Meditation</a>
                        <a href="/education" className="hover:text-[#0a1d48] transition-colors">Learn & Grow</a>
                        <a href="/dass" className="hover:text-[#0a1d48] transition-colors">Screening</a>
                    </nav>
                </div>
            </div>

            {/* Bottom White Rounded Bar */}
            <div className="w-full mt-16 px-4">
                <div className="max-w-5xl mx-auto bg-white py-4 sm:py-6 rounded-full shadow-sm text-center text-gray-600 text-xs sm:text-sm font-medium">
                    © 2025 Made with 💙 for Gen Z UNSRAT.
                </div>
            </div>
        </footer>
    );
}