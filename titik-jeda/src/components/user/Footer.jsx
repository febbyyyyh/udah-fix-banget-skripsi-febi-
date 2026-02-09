import logo from "../../assets/logo.svg";

export default function Footer() {
    return (
        <footer className="w-full bg-[#EAF3FF] mt-20 py-16 px-6">

            {/* Top Section */}
            <div className="
                max-w-6xl mx-auto 
                flex flex-col md:flex-row 
                justify-between 
                items-center md:items-start 
                text-center md:text-left
                gap-10 md:gap-14
            ">
                {/* Left Logo + Description */}
                <div className="max-w-md flex flex-col items-center md:items-start">

                    <img
                        src={logo}
                        alt="Titik Jeda Logo"
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                    />

                    <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base max-w-sm">
                        Titik Jeda adalah ruang kecil untuk berhenti sejenak, mendengar diri sendiri,
                        dan menemukan ketenangan di tengah rutinitas yang padat.
                    </p>
                </div>

                {/* Right Navigation */}
                <div className="flex flex-col items-center md:items-end">
                    <h3 className="font-semibold text-[#0a1d48] mb-3">
                        Our Features
                    </h3>

                    <div className="flex flex-wrap gap-6 text-gray-700 text-sm justify-center md:justify-end">
                        <a href="/" className="hover:text-[#0a1d48]">Home</a>
                        <a href="/meditation" className="hover:text-[#0a1d48]">Meditation</a>
                        <a href="/education" className="hover:text-[#0a1d48]">Learn & Grow</a>
                        <a href="/dass" className="hover:text-[#0a1d48]">DASS-21</a>
                    </div>
                </div>
            </div>

            {/* Bottom White Rounded Bar */}
            <div className="w-full mt-16 px-4">
                <div className="max-w-5xl mx-auto bg-white py-4 sm:py-6 rounded-full shadow-sm text-center text-gray-600 text-xs sm:text-sm">
                    © 2025 Made with 💙 for Gen Z.
                </div>
            </div>
        </footer>
    );
}
