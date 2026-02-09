import { useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

/* ================= USER PAGES ================= */
import Navbar from "./components/user/Navbar";
import Home from "./pages/user/Home";
import DASS21 from "./pages/user/DASS21";
import DassQuestion from "./pages/user/DassQuestion";
import DassResult from "./pages/user/DassResult";
import Meditation from "./pages/user/Meditation";
import MeditationDetail from "./pages/user/MeditationDetail";
import Education from "./pages/user/Education";
import EducationDetail from "./pages/user/EducationDetail";

/* ================= ADMIN PAGES ================= */
import LoginAdmin from "./pages/admin/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import KelolaMeditasi from "./pages/admin/KelolaMeditasi";
import KelolaIsiMeditasi from "./pages/admin/KelolaIsiMeditasi";
import KelolaEdukasi from "./pages/admin/KelolaEdukasi";
import KelolaIsiEdukasi from "./pages/admin/KelolaIsiEdukasi";

/* ================= ADMIN UTILS & ROUTES ================= */
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminPublicRoute from "./routes/AdminPublicRoute";
import Sidebar from "./components/admin/Sidebar";
import Topbar from "./components/admin/Topbar";

/* ================= USER LAYOUT ================= */
function UserLayout() {
  const location = useLocation();

  // 1. Logic Inisialisasi Cookie Anonymous
  useEffect(() => {
    const initAnonymousSession = async () => {
      try {
        // Mengirim request ke backend untuk cek/buat cookie session_id
        await axios.get("http://localhost:5000/api/user/init", {
          withCredentials: true, // WAJIB agar browser menerima & menyimpan cookie
        });
        console.log("✅ Anonymous session ready.");
      } catch (err) {
        console.error("❌ Failed to initialize session:", err);
      }
    };

    initAnonymousSession();
  }, []);

  const hideNavbarRoutes = ["/dass-question", "/dass/result"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/meditation/:id" element={<MeditationDetail />} />

        <Route path="/education" element={<Education />} />
        <Route path="/education/:id" element={<EducationDetail />} />

        <Route path="/dass" element={<DASS21 />} />
        <Route path="/dass-question" element={<DassQuestion />} />
        <Route path="/dass/result" element={<DassResult />} />
      </Routes>
    </>
  );
}

/* ================= ADMIN LAYOUT ================= */
function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <Routes>
            <Route path="dashboard" element={<DashboardAdmin />} />

            <Route path="kelola-meditasi" element={<KelolaMeditasi />} />
            <Route
              path="kelola-meditasi/:id"
              element={<KelolaIsiMeditasi />}
            />

            <Route path="kelola-edukasi" element={<KelolaEdukasi />} />
            <Route
              path="kelola-edukasi/:id"
              element={<KelolaIsiEdukasi />}
            />

            {/* Fallback Admin */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ================= ROOT APP ================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== ADMIN LOGIN (PUBLIC) ===== */}
        <Route
          path="/admin/login"
          element={
            <AdminPublicRoute>
              <LoginAdmin />
            </AdminPublicRoute>
          }
        />

        {/* ===== ADMIN AREA (PROTECTED) ===== */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        />

        {/* ===== USER AREA (ANONYMOUS) ===== */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  );
}