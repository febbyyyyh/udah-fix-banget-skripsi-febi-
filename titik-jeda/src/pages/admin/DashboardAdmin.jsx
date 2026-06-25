import { useEffect, useState } from "react";
import axiosAdmin from "../../utils/axiosAdmin";
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

    // MENYINGKRONKAN WARNA INDIKATOR DENGAN HALAMAN HASIL USER (Biru, Hijau, Kuning, Jingga, Merah)
    const getCategoryColors = (categoryName) => {
        const cat = categoryName.toLowerCase();
        if (cat.includes('depression')) return { bg: "bg-[#75b9e4]/20", text: "text-[#75b9e4]", hex: "#75b9e4" };
        if (cat.includes('anxiety')) return { bg: "bg-[#7aef92]/20", text: "text-[#7aef92]", hex: "#7aef92" };
        if (cat.includes('stress')) return { bg: "bg-[#fff771]/30", text: "text-[#bfae00]", hex: "#fff771" };
        if (cat.includes('sangat berat')) return { bg: "bg-[#f94e67]/20", text: "text-[#f94e67]", hex: "#f94e67" };
        if (cat.includes('berat')) return { bg: "bg-[#ffba58]/20", text: "text-[#ffba58]", hex: "#ffba58" };
        return { bg: "bg-[#75b9e4]/20", text: "text-[#75b9e4]", hex: "#75b9e4" }; // Default Normal
    };

    return (
        <div className="p-4 md:p-6 bg-[#FFFFFF] min-h-screen text-[#292929]">

            {/* HERO CARD - Dirombak Total Menjadi Flat Desain Eksklusif Tanpa Gambar Ilustrasi */}
            <div className="w-full bg-[#FFFFFF] border-2 border-[#00BFFF] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[160px] shadow-sm">
                {/* Aksen ornamen garis minimalis hijau penyeimbang visual */}
                <div className="w-12 h-1.5 bg-[#ADFF2F] rounded-full mb-3" />

                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Halo, Admin!
                </h2>
                <p className="text-[#292929]/70 mt-2 max-w-xl text-sm md:text-base font-normal leading-relaxed">
                    Kelola konten meditasi, edukasi, dan pantau data perkembangan psikologis pengguna secara berkala melalui panel kontrol ini.
                </p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
                <StatCard
                    title="Total Meditasi"
                    value={loading ? "..." : stats.totalAudio}
                    subtitle="audio terbitan"
                />
                <StatCard
                    title="Total Edukasi"
                    value={loading ? "..." : stats.totalVideo}
                    subtitle="materi video"
                />
                <StatCard
                    title="Total Pengunjung"
                    value={loading ? "..." : stats.activeSessions}
                    subtitle="sesi unik (7 hari terakhir)"
                />
            </div>

            {/* ANALISIS KONDISI MENTAL (DASS PIE CHART) */}
            <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl p-6 mt-8 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold tracking-tight">Analisis Kondisi Mental</h2>
                    <p className="text-xs sm:text-sm text-[#292929]/50 font-medium">Distribusi hasil rekaman skrining DASS pengguna dalam 1 minggu terakhir</p>
                </div>

                <div className="h-[350px] w-full flex items-center justify-center">
                    {!loading && stats.dassAnalysis.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.dassAnalysis}
                                    dataKey="count"
                                    nameKey="result_category"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    stroke="none"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.dassAnalysis.map((entry, index) => {
                                        const colorConfig = getCategoryColors(entry.result_category);
                                        return (
                                            <Cell key={`cell-${index}`} fill={colorConfig.hex} />
                                        );
                                    })}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '2px solid #F2F2F2', boxShadow: 'none' }}
                                    itemStyle={{ color: '#292929', fontWeight: 'bold', fontSize: '13px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs font-bold text-[#292929]/50 uppercase tracking-wider">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-sm font-medium text-[#292929]/40 italic">
                                {loading ? "Memuat visualisasi statistik..." : "Belum ada data rekaman masuk dalam minggu ini."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* TABEL HASIL DASS TERBARU */}
            <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-3xl mt-8 overflow-hidden shadow-sm">
                <div className="p-6 border-b-2 border-[#F2F2F2]">
                    <h2 className="text-lg font-bold tracking-tight">Hasil Tes DASS Terbaru</h2>
                    <p className="text-xs sm:text-sm text-[#292929]/50 font-medium">Menampilkan 10 riwayat pemeriksaan terakhir sistem pengguna</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F2F2F2]/60 text-[#292929]/50 text-xs uppercase font-black tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Sesi ID</th>
                                <th className="px-6 py-4">Kategori Keparahan</th>
                                <th className="px-6 py-4 text-center">D</th>
                                <th className="px-6 py-4 text-center">A</th>
                                <th className="px-6 py-4 text-center">S</th>
                                <th className="px-6 py-4">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#F2F2F2]">
                            {stats.recentDass.length > 0 ? (
                                stats.recentDass.map((item, index) => {
                                    const styles = getCategoryColors(item.result_category);

                                    return (
                                        <tr key={index} className="hover:bg-[#F2F2F2]/20 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono font-bold text-[#292929]/40">
                                                {item.session_id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black ${styles.bg} ${styles.text}`}>
                                                    {item.result_category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-black text-[#75b9e4]">{item.depression_score}</td>
                                            <td className="px-6 py-4 text-center text-sm font-black text-[#7aef92]">{item.anxiety_score}</td>
                                            <td className="px-6 py-4 text-center text-sm font-black text-[#ffba58]">{item.stress_score}</td>
                                            <td className="px-6 py-4 text-sm text-[#292929]/60 font-medium">
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
                                    <td colSpan="6" className="px-6 py-12 text-center text-sm font-medium text-[#292929]/40 italic">
                                        Belum ada data transaksi tes yang terdaftar.
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

/* ==================================
    STAT CARD SUB-COMPONENT KUSTOM
================================== */
function StatCard({ title, value, subtitle }) {
    return (
        <div className="bg-[#FFFFFF] border-2 border-[#F2F2F2] rounded-2xl px-6 py-5 shadow-sm">
            <h3 className="text-xs font-black text-[#292929]/40 uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-extrabold tracking-tight">
                {value}
            </p>
            <p className="text-xs font-medium text-[#292929]/50 mt-1">{subtitle}</p>
        </div>
    );
}