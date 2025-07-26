import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100 text-center px-4">
      {/* Logo */}
      <motion.img
        src={logo}
        alt="Logo Aplikasi"
        className="w-24 h-24 mb-4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Nama Aplikasi */}
      <motion.h1
        className="text-3xl font-bold text-blue-800 mb-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        BATHORO SURYO MAKMUR
      </motion.h1>

      {/* Versi */}
      <motion.p
        className="text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Versi 1.0.0
      </motion.p>
    </div>
  );
};

export default SplashScreen;
