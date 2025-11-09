import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "../firebase/config";
import Swal from "sweetalert2";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/app");
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat Datang Admin 💧",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: "#e0f7ff",
        color: "#0369a1",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Email atau Password tidak sesuai",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        background: "#fee2e2",
        color: "#991b1b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700">
      {/* Lapisan efek air */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="wave">
              <feTurbulence
                id="turbulence"
                numOctaves="3"
                seed="2"
                baseFrequency="0.02 0.05"
              />
              <feDisplacementMap in="SourceGraphic" scale="20" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#wave)" fill="#00bfff" />
        </svg>
      </div>

      {/* Form login */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-10 w-[90%] max-w-md text-white z-10"
      >
        <div className="text-center mb-8">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-3 rounded-full shadow-md"
            whileHover={{ scale: 1.05, rotate: 3 }}
          />
          <h1 className="text-3xl font-bold tracking-wide text-white drop-shadow-md">
            Login Admin BSM
          </h1>
          <p className="text-sm text-blue-100 mt-1">
            Sistem Tagihan Air – Bathoro Suryo Makmur
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <div>
            <label className="block text-sm mb-1 text-blue-100">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-blue-100/70 text-white"
              placeholder="Masukkan email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-blue-100">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder-blue-100/70 text-white"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className={`w-full mt-4 py-2 rounded-lg font-semibold shadow-md cursor-pointer transition-all ${
              loading
                ? "bg-sky-300"
                : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </motion.button>
        </form>

        <div className="text-center mt-8 text-sm text-blue-100">
          <p>© {new Date().getFullYear()} Bathoro Suryo Makmur</p>
        </div>
      </motion.div>

      {/* Efek gelembung air */}
      <div className="absolute bottom-0 w-full flex justify-center overflow-hidden">
        <div className="relative w-[400px] h-[100px]">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-4 h-4 bg-white/60 rounded-full bottom-0 left-[10%]"
          />
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-3 h-3 bg-white/40 rounded-full bottom-0 left-[50%]"
          />
          <motion.div
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-2 h-2 bg-white/50 rounded-full bottom-0 left-[80%]"
          />
        </div>
      </div>
    </div>
  );
}
