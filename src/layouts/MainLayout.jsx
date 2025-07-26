import { Outlet, NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaListAlt,
  FaHistory,
  FaUsers,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { useState } from "react";

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

  return (
    <div className="min-h-screen pt-16 pb-14 bg-gray-100">
      {/* Header - fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-blue-800 text-white p-4 font-bold text-lg shadow flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-white">Bathoro Suryo Makmur</span>
        </Link>
        <button onClick={toggleFullscreen} className="text-white text-xl">
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
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
