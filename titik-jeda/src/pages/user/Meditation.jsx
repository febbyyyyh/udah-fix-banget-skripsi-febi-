import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../../components/user/Footer";

// FIX: ELEMEN BERWARNA CERAH (Biru Elektrik)
const TinySparkle = ({ className }) => (
  <svg
    className={`w-8 h-8 text-[#00BFFF]/40 absolute z-0 pointer-events-none ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
  </svg>
);

// FIX: ELEMEN BERWARNA CERAH (Hijau Limau)
const TinyCircle = ({ className }) => (
  <div
    className={`w-6 h-6 rounded-full border-4 border-[#ADFF2F]/60 absolute z-0 pointer-events-none ${className}`}
  />
);

// FIX: ELEMEN BERWARNA CERAH (Oranye)
const TinyTriangle = ({ className }) => (
  <svg
    className={`w-6 h-6 text-[#FF8C00]/40 absolute z-0 pointer-events-none ${className} transform rotate-45`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2L22 22H2L12 2Z" />
  </svg>
);

export default function Meditation() {
  const [meditations, setMeditations] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMed = await axios.get(
          "/api/user/meditations",
          {
            withCredentials: true,
          },
        );
        setMeditations(resMed.data);

        const resRec = await axios.get(
          "/api/user/meditation/recommendation",
          {
            withCredentials: true,
          },
        );

        if (resRec.data) {
          setRecommendations(resRec.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    /* Dikunci penuh menggunakan warna dasar putih bersih murni (#FFFFFF) tanpa gradasi warna */
    <div className="w-full min-h-screen bg-[#FFFFFF] text-[#292929] flex flex-col justify-between relative overflow-hidden">
      {/* SEBARAN ELEMEN ORNAMEN ABSTRAK BERWARNA (Dibatasi di h-[70vh] agar footer tetap clean) */}
      <div className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none z-0">
        {/* Cluster Atas Kiri & Kanan */}
        <TinySparkle className="top-36 left-8 md:left-16 animate-pulse" />
        <TinyCircle className="top-56 left-20 md:left-32 animate-bounce duration-[1500ms]" />
        <TinyTriangle className="top-40 right-12 md:right-24" />
        <TinySparkle className="top-64 right-24 md:right-40" />

        {/* Cluster Tengah Kiri & Kanan */}
        <TinyTriangle className="top-[420px] left-10 md:left-24" />
        <TinySparkle className="top-[520px] left-28 md:left-48" />
        <TinyCircle className="top-[450px] right-14 md:right-28 animate-bounce duration-[1800ms]" />
        <TinyTriangle className="top-[560px] right-28 md:right-52" />
      </div>

      <div className="w-full flex flex-col items-center pt-48 px-4 relative z-10">
        {/* TITLE & HEADER */}
        <h1 className="text-4xl md:text-5xl font-black text-center leading-tight tracking-tight uppercase">
          Put your earphones on
        </h1>

        {/* DESKRIPSI */}
        <p className="text-base sm:text-lg text-[#292929]/80 max-w-2xl text-center mt-6 leading-relaxed font-normal">
          Ambil posisi paling nyaman, tarik napas, dan biarin suaranya nemenin
          kamu buat nenangin pikiran. Pilih tipe meditasi sesuai kebutuhan kamu,
          dan temukan ketenangan di setiap sesi.
        </p>

        {/* LOADING STATE */}
        {loading ? (
          <div className="mt-24 mb-20 flex flex-col items-center">
            <div className="rounded-full h-12 w-12 border-4 border-[#F2F2F2] border-b-[#00BFFF] animate-spin"></div>
            <p className="mt-4 text-sm text-[#292929]/60 font-semibold">
              Mencari ketenangan...
            </p>
          </div>
        ) : (
          /* CARDS CONTAINER (SECTION 1) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl w-full">
            {Array.isArray(meditations) && meditations.length > 0 ? (
              meditations.map((item) => (
                <Link
                  key={item.id}
                  to={`/meditation/${item.id}`}
                  className="group relative block rounded-3xl"
                >
                  {/* Efek Bayangan Solid Belakang */}
                  <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />

                  {/* Kontainer Card Utama - Putih Bersih Konstan Khas Neo-Brutalism */}
                  <div className="relative p-12 bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer h-full transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                    <div className="w-8 h-1 bg-[#ADFF2F] rounded-full mb-4 group-hover:w-16 transition-all duration-300" />

                    <h3 className="text-2xl font-black tracking-tight text-[#292929] group-hover:text-[#00BFFF] transition-colors uppercase">
                      {item.name}
                    </h3>

                    <span className="text-xs font-black text-[#00BFFF] mt-4 uppercase tracking-widest">
                      Mulai Sesi →
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-slate-400 py-10 font-medium">
                Belum ada tipe meditasi tersedia.
              </p>
            )}
          </div>
        )}

        {/* SECTION 2 - RECOMMENDATIONS */}
        <div className="w-full max-w-5xl mt-28 mb-20">
          <h2 className="text-2xl md:text-3xl font-black mb-10 text-center md:text-left tracking-tight uppercase">
            Meditation picks based on your DASS-21 results
          </h2>

          <div className="w-full">
            {recommendations &&
            Array.isArray(recommendations.data) &&
            recommendations.data.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Badge Kategori Utama */}
                <div className="bg-[#292929] px-6 py-2.5 rounded-xl self-start border-2 border-[#292929]">
                  <p className="text-xs sm:text-sm uppercase tracking-wider text-[#FFFFFF] font-normal">
                    Rekomendasi Utama:{" "}
                    <span className="font-black text-[#ADFF2F] ml-1">
                      {recommendations.category_name}
                    </span>
                  </p>
                </div>

                {/* List Audio Card Bertumpuk */}
                {recommendations.data.map((audio) => {
                  const audioPath = audio.audio_file
                    ? "/" + String(audio.audio_file).replace(/^\/+/, "")
                    : null;
                  const targetMeditationId =
                    audio.meditation_type_id ||
                    recommendations.recommended_meditation_type_id;

                  return (
                    <Link
                      key={audio.id}
                      to={`/meditation/${targetMeditationId}`}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-[#292929] rounded-2xl translate-x-1.5 translate-y-1.5" />
                      <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-2xl p-6 flex flex-col transition-all hover:border-[#00BFFF] cursor-pointer">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-black text-lg text-[#292929] uppercase tracking-tight">
                              {audio.title}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-[#292929]/60 mt-2">
                              Kategori:{" "}
                              {audio.type_name || recommendations.category_name}
                            </p>
                          </div>
                          <span className="text-xs font-black text-[#00BFFF] uppercase tracking-wider">
                            Lihat sesi
                          </span>
                        </div>

                        {audioPath ? (
                          <audio
                            controls
                            src={
                              audioPath
                                ? audioPath.startsWith("http")
                                  ? audioPath
                                  : "/" +
                                    String(audioPath).replace(/^\/+/, "")
                                : ""
                            }
                            className="w-full bg-[#F2F2F2] rounded-xl border border-[#292929]/10"
                            onPlay={(e) => {
                              e.preventDefault();
                              window.dispatchEvent(
                                new Event("stop-relaxation-music"),
                              );
                            }}
                          />
                        ) : (
                          <div className="w-full px-4 py-6 rounded-xl bg-[#F2F2F2] border border-[#E5E7EB] text-sm text-[#292929]/70">
                            Audio belum tersedia, klik untuk lihat sesi lengkap.
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : recommendations ? (
              <div className="relative group w-full">
                <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />
                <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-10 md:p-12 flex flex-col items-center justify-center text-center">
                  <p className="text-[#292929] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                    {recommendations.message === "Belum ada hasil tes"
                      ? "Selesaikan tes DASS-21 terlebih dahulu untuk mendapatkan rekomendasi audio yang tepat untuk kondisi mentalmu saat ini."
                      : `Rekomendasi DASS ditemukan untuk kategori ${recommendations.category_name}, tetapi belum ada audio yang cocok di server. Silakan tambahkan audio pada kategori ini atau coba kategori lainnya.`}
                  </p>

                  {recommendations.message === "Belum ada hasil tes" ? (
                    <Link
                      to="/dass"
                      className="inline-block mt-8 relative group/btn"
                    >
                      <div className="absolute inset-0 bg-[#292929] rounded-xl translate-x-1 translate-y-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5" />
                      <button className="relative px-8 py-3.5 bg-[#00BFFF] border-2 border-[#292929] text-[#FFFFFF] rounded-xl text-xs font-black uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
                        Ambil Tes Sekarang
                      </button>
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : (
              /* Box Utama - Menggunakan Latar Putih Bersih Sempurna (#FFFFFF) */
              <div className="relative group w-full">
                {/* Efek Bayangan Belakang Solid */}
                <div className="absolute inset-0 bg-[#292929] rounded-3xl translate-x-2 translate-y-2" />

                <div className="relative bg-[#FFFFFF] border-4 border-[#292929] rounded-3xl p-10 md:p-12 flex flex-col items-center justify-center text-center">
                  <p className="text-[#292929] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                    Selesaikan tes DASS-21 terlebih dahulu untuk mendapatkan
                    rekomendasi audio yang tepat untuk kondisi mentalmu saat
                    ini.
                  </p>

                  {/* Tombol Aksi Menuju Kuis */}
                  <Link
                    to="/dass"
                    className="inline-block mt-8 relative group/btn"
                  >
                    <div className="absolute inset-0 bg-[#292929] rounded-xl translate-x-1 translate-y-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5" />
                    <button className="relative px-8 py-3.5 bg-[#00BFFF] border-2 border-[#292929] text-[#FFFFFF] rounded-xl text-xs font-black uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
                      Ambil Tes Sekarang
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer mengalir alami nempel putih murni */}
      <Footer />
    </div>
  );
}
