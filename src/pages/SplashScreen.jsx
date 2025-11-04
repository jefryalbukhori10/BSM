import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-400 to-blue-700 text-center">
      {/* Lapisan efek kabut air lembut */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/watercolor.png')] opacity-20"></div>

      {/* Efek gelembung naik */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40 blur-[1px]"
            style={{
              width: Math.random() * 30 + 15,
              height: Math.random() * 30 + 15,
              left: `${Math.random() * 100}%`,
              bottom: -40,
            }}
            animate={{
              y: ["0%", "-120vh"],
              opacity: [0.5, 0],
              x: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo dengan efek muncul dari air */}
      <motion.img
        src={logo}
        alt="Logo Aplikasi"
        className="w-28 h-28 mb-4 z-10 drop-shadow-xl"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Welcome Back animasi */}
      <motion.h2
        className="text-xl text-white font-light tracking-wide mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        💧 Welcome Back 💧
      </motion.h2>

      {/* Nama Aplikasi */}
      <motion.h1
        className="text-3xl font-bold text-white tracking-wide drop-shadow-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        BATHORO SURYO MAKMUR
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="text-sm text-blue-100 mt-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        Sistem Manajemen Tagihan Air PDAM
      </motion.p>

      {/* Versi */}
      <motion.p
        className="absolute bottom-6 text-xs text-white/70 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        Versi 2.0.0
      </motion.p>

      {/* Ombak bergoyang di bawah */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <motion.svg
          className="relative block w-[calc(120%)] h-[120px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{
            x: [0, -60, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M321.39 56.44C206.47 77.2 92.63 95.7 0 58.72V120h1200V16.48c-81.35 26.35-168.88 44.73-254.61 44.73-112.85 0-216.47-33.54-324-49.15C519.92-4.09 420.17 36.61 321.39 56.44z"
            fill="#2563eb"
          ></path>
        </motion.svg>
      </div>
    </div>
  );
};

export default SplashScreen;
