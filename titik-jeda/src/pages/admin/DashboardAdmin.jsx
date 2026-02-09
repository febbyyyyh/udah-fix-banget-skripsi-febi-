import vector from "../../assets/vector-admin.svg";

export default function DashboardAdmin() {
    return (
        <>
            {/* HERO CARD */}
            <div
                className="
                    bg-[#1A62C2]
                    rounded-2xl
                    px-6 py-6
                    flex flex-col md:flex-row
                    items-start md:items-center
                    justify-between
                    text-white
                    gap-6
                "
            >
                <div className="max-w-xl text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-semibold mb-2">
                        Halo, Admin!
                    </h2>
                    <p className="text-white/90 leading-relaxed text-sm md:text-base">
                        Kelola konten meditasi, edukasi, dan pantau data
                        pengguna melalui dashboard ini.
                    </p>
                </div>

                <img
                    src={vector}
                    alt="Admin Illustration"
                    className="hidden md:block md:w-56 lg:w-64 object-contain"
                />
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
                <StatCard
                    title="Total meditasi"
                    value="12"
                    subtitle="audio meditasi"
                />
                <StatCard
                    title="Total edukasi"
                    value="9"
                    subtitle="video edukasi"
                />
                <StatCard
                    title="Pengguna aktif"
                    value="15"
                    subtitle="mahasiswa"
                />
            </div>
        </>
    );
}

/* ======================
   Stat Card Component
====================== */
function StatCard({ title, value, subtitle }) {
    return (
        <div className="bg-white rounded-2xl px-6 py-5 shadow-sm">
            <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-[#0a1d48]">
                {value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>
    );
}
