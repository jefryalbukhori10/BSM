import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <FaSpinner className="text-blue-600 text-5xl mb-4" />
          </motion.div>

          {/* Teks Loading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg font-semibold text-blue-800"
          >
            Memuat Aplikasi...
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-sm text-gray-600 mt-2"
          >
            Harap tunggu sebentar 😊
          </motion.p>
        </motion.div>
      </div>
    );

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
