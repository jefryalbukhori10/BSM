import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaWater } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-200 text-center px-6">
      {/* Ilustrasi */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <FaWater className="text-blue-500 text-7xl mb-6 drop-shadow-lg" />
        </motion.div>
      </motion.div>

      {/* Judul Utama */}
      <motion.h1
        className="text-5xl font-extrabold text-blue-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        404 😅
      </motion.h1>

      {/* Pesan Bercanda */}
      <motion.p
        className="text-lg text-gray-700 mt-3 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Hayo... mau ke mana? 💦 Halaman ini nggak ada, mungkin ikut arus sungai
        😄
      </motion.p>

      {/* Deskripsi tambahan */}
      <motion.p
        className="text-gray-600 mt-2 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        Tenang aja, Admin. Yuk balik ke halaman utama sebelum basah kuyup 💧
      </motion.p>

      {/* Tombol Kembali */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Link
          to="/app"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        >
          <FaHome /> Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
