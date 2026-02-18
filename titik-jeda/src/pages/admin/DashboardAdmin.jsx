import { useEffect, useState } from "react";
import axiosAdmin from "../../utils/axiosAdmin";
import vector from "../../assets/vector-admin.svg";
// Import Recharts untuk grafik
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function DashboardAdmin() {
    const [stats, setStats] = useState({
        totalAudio: 0,
        totalVideo: 0,
        activeSessions: 0,
        dassAnalysis: [],
        recentDass: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosAdmin.get("/admin/dashboard-stats");
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Gagal mengambil statistik:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Warna untuk Pie Chart agar terlihat modern dan kontras
    const COLORS = ["#1A62C2", "#FF8042", "#FFBB28", "#00C49F", "#FF4560"];

    return (
        <div className="p-4 md:p-6">
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
                    value={loading ? "..." : stats.totalAudio}
                    subtitle="audio meditasi"
                />
                <StatCard
                    title="Total edukasi"
                    value={loading ? "..." : stats.totalVideo}
                    subtitle="video edukasi"
                />
                <StatCard
                    title="Total Pengunjung"
                    value={loading ? "..." : stats.activeSessions}
                    subtitle="sesi unik (7 hari terakhir)"
                />
            </div>

            {/* ANALISIS KONDISI MENTAL (DASS) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#0A1D48]">Analisis Kondisi Mental</h2>
                    <p className="text-sm text-gray-400">Distribusi hasil tes DASS pengguna dalam 1 minggu terakhir</p>
                </div>

                <div className="h-[350px] w-full flex flex-col items-center justify-center">
                    {!loading && stats.dassAnalysis.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.dassAnalysis}
                                    dataKey="count"
                                    nameKey="result_category"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60} // Membuatnya jadi Doughnut Chart agar lebih elegan
                                    outerRadius={100}
                                    paddingAngle={5}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.dassAnalysis.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-400 italic">
                                {loading ? "Memuat data..." : "Belum ada data tes DASS masuk dalam minggu ini."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* TABEL HASIL DASS TERBARU */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-[#0A1D48]">Hasil Tes DASS Terbaru</h2>
                    <p className="text-sm text-gray-400">Menampilkan 10 riwayat pemeriksaan terakhir</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Sesi ID</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4 text-center">D</th>
                                <th className="px-6 py-4 text-center">A</th>
                                <th className="px-6 py-4 text-center">S</th>
                                <th className="px-6 py-4">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentDass.length > 0 ? (
                                stats.recentDass.map((item, index) => {
                                    // Logika penentuan warna badge
                                    let badgeColor = "bg-gray-100 text-gray-600"; // Default (Normal)

                                    if (item.result_category.toLowerCase().includes('depression')) {
                                        badgeColor = "bg-blue-100 text-[#1A62C2]"; // Biru Depresi
                                    } else if (item.result_category.toLowerCase().includes('anxiety')) {
                                        badgeColor = "bg-orange-100 text-[#FF8042]"; // Orange Cemas
                                    } else if (item.result_category.toLowerCase().includes('stress')) {
                                        badgeColor = "bg-yellow-100 text-[#FFBB28]"; // Kuning Stres
                                    } else if (item.result_category.toLowerCase() === 'normal') {
                                        badgeColor = "bg-green-100 text-[#00C49F]"; // Hijau Normal
                                    }

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-400">
                                                {item.session_id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${badgeColor}`}>
                                                    {item.result_category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{item.depression_score}</td>
                                            <td className="px-6 py-4 text-center text-sm font-semibold text-orange-400">{item.anxiety_score}</td>
                                            <td className="px-6 py-4 text-center text-sm font-semibold text-yellow-400">{item.stress_score}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(item.created_at).toLocaleString('id-ID', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                                        Belum ada data tes tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ======================
    Stat Card Component
====================== */
function StatCard({ title, value, subtitle }) {
    return (
        <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-50">
            <h3 className="text-sm text-gray-500 mb-1 capitalize">{title}</h3>
            <p className="text-3xl font-bold text-[#0a1d48]">
                {value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>
    );
}