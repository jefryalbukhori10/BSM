import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaListAlt,
  FaHistory,
  FaUsers,
  FaExpand,
  FaCompress,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import Swal from "sweetalert2";

export default function MainLayout() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isLoggedIn");
      Swal.fire({
        icon: "success",
        title: "Logout Berhasil!",
        text: "Sampai Jumpa Kembali Admin 💧",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: "#e0f7ff",
        color: "#0369a1",
      });
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-14 bg-gray-100">
      {/* Header - fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-blue-800 text-white p-4 font-bold text-lg shadow flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-white">Bathoro Suryo Makmur</span>
        </Link>
        {/* Kanan: tombol fullscreen + logout */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleFullscreen}
            className="text-white text-xl hover:text-blue-200 transition-colors"
            title={
              isFullscreen ? "Keluar dari fullscreen" : "Masuk ke fullscreen"
            }
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-800 hover:text-white hover:border  transition-all px-3 py-1 rounded-md text-sm font-semibold shadow cursor-pointer"
            title="Logout"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Konten scrollable */}
      <main className="px-4">
        <Outlet />
      </main>

      {/* Footer - fixed di bawah */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-blue-800 text-white flex justify-around items-center h-14">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `text-sm flex flex-col items-center ${
              isActive ? "text-yellow-300" : "text-white"
            }`
          }
        >
          <FaHome /> Home
        </NavLink>
        <NavLink
          to="/app/buat-tagihan"
          className={({ isActive }) =>
            `text-sm flex flex-col items-center ${
              isActive ? "text-yellow-300" : "text-white"
            }`
          }
        >
          <FaFileAlt /> Buat
        </NavLink>
        <NavLink
          to="/app/daftar-tagihan"
          className={({ isActive }) =>
            `text-sm flex flex-col items-center ${
              isActive ? "text-yellow-300" : "text-white"
            }`
          }
        >
          <FaListAlt /> Tagihan
        </NavLink>
        <NavLink
          to="/app/history-tagihan"
          className={({ isActive }) =>
            `text-sm flex flex-col items-center ${
              isActive ? "text-yellow-300" : "text-white"
            }`
          }
        >
          <FaHistory /> History
        </NavLink>
        <NavLink
          to="/app/daftar-pelanggan"
          className={({ isActive }) =>
            `text-sm flex flex-col items-center ${
              isActive ? "text-yellow-300" : "text-white"
            }`
          }
        >
          <FaUsers /> Pelanggan
        </NavLink>
      </footer>
    </div>
  );
}
