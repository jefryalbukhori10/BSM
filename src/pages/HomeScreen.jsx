import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaListAlt,
  FaHistory,
  FaUsers,
  FaUserPlus,
  FaMoneyBillWave,
  FaUndoAlt,
  FaRegCalendarCheck,
  FaCalendarTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion } from "framer-motion";

export default function Home() {
  const [jumlahPelanggan, setJumlahPelanggan] = useState(0);
  const [jumlahTagihanBelumLunas, setJumlahTagihanBelumLunas] = useState(0);
  const [totalPemasukan, setTotalPemasukan] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil semua pelanggan
        const pelangganSnap = await getDocs(collection(db, "pelanggan"));
        const pelangganIds = pelangganSnap.docs.map((doc) => doc.id);
        setJumlahPelanggan(pelangganIds.length);

        // Ambil tagihan yang belum lunas
        const tagihanBelumLunasQuery = query(
          collection(db, "tagihan"),
          where("lunas", "==", false)
        );
        const tagihanBelumLunasSnap = await getDocs(tagihanBelumLunasQuery);

        // Filter tagihan yang pelangganId-nya valid
        const tagihanBelumLunasValid = tagihanBelumLunasSnap.docs.filter(
          (doc) => {
            const data = doc.data();
            return pelangganIds.includes(data.pelangganId);
          }
        );

        setJumlahTagihanBelumLunas(tagihanBelumLunasValid.length);

        // Ambil tagihan yang sudah lunas
        const tagihanLunasQuery = query(
          collection(db, "tagihan"),
          where("lunas", "==", true)
        );
        const tagihanLunasSnap = await getDocs(tagihanLunasQuery);

        // Jumlahkan nilai kolom 'jumlahTagihan'
        const total = tagihanLunasSnap.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + (data.jumlahTagihan || 0);
        }, 0);

        setTotalPemasukan(total);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-graay-100">
      {/* Tombol Buat Tagihan */}
      <div className="max-w-screen-sm mx-auto px-4 mb-6 mt-6">
        <Link to="/app/buat-tagihan">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow hover:shadow-lg transition"
          >
            <FaFileAlt size={36} className="text-blue-500" />
            <p className="text-lg font-semibold">Buat Tagihan Baru</p>
          </motion.div>
        </Link>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-screen-sm mx-auto px-4">
        <MenuCard
          icon={<FaListAlt size={30} />}
          label="Daftar Tagihan"
          to="/app/daftar-tagihan"
        />
        <MenuCard
          icon={<FaHistory size={30} />}
          label="Riwayat Tagihan"
          to="/app/history-tagihan"
        />
        <MenuCard
          icon={<FaUsers size={30} />}
          label="Daftar Pelanggan"
          to="/app/daftar-pelanggan"
        />
        <MenuCard
          icon={<FaUserPlus size={30} />}
          label="Tambah Pelanggan"
          to="/app/tambah-pelanggan"
        />
        <MenuCard
          icon={<FaRegCalendarCheck size={30} />}
          label="Buat Tagihan Bulan Lalu"
          to="/app/buat-tagihan-bulan-lalu"
        />
        <MenuCard
          icon={<FaCalendarTimes size={30} />}
          label="Daftar Tagihan Bulan Lalu"
          to="/app/daftar-tagihan-bulan-lalu"
        />
      </div>

      {/* Informasi Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-screen-sm mx-auto mt-8 px-4 mb-2">
        <InfoCard
          icon={<FaUsers size={24} />}
          title="Jumlah Pelanggan"
          value={jumlahPelanggan}
        />
        <InfoCard
          icon={<FaFileAlt size={24} />}
          title="Tagihan Belum Dibayar"
          value={jumlahTagihanBelumLunas}
        />
        <InfoCard
          icon={<FaMoneyBillWave size={24} className="text-green-500" />}
          title="Total Pemasukan"
          value={`Rp ${totalPemasukan.toLocaleString("id-ID")}`}
        />
      </div>
    </div>
  );
}

// Komponen Kartu Menu
function MenuCard({ icon, label, to }) {
  return (
    <Link to={to}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white rounded-xl aspect-square flex flex-col items-center justify-center shadow hover:shadow-md transition"
      >
        <div className="text-blue-500">{icon}</div>
        <p className="mt-2 font-medium text-center text-gray-800">{label}</p>
      </motion.div>
    </Link>
  );
}

// Komponen Kartu Informasi
function InfoCard({ icon, title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-4"
    >
      <div className="bg-blue-100 text-blue-500 rounded-full p-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}
