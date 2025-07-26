import React, { useState } from "react";
import Swal from "sweetalert2";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";

const TambahPelanggan = () => {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSimpan = async () => {
    if (!nama || !alamat) {
      Swal.fire("Warning", "Semua kolom harus diisi!", "warning");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, "pelanggan"), {
        nama,
        alamat,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        title: "Sukses!",
        text: `Pelanggan ${nama} berhasil ditambahkan!`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/app/daftar-pelanggan");
      });
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Tambah Pelanggan
        </h2>

        <label className="block text-gray-700 font-semibold mb-2">Nama</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Masukkan nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <label className="block text-gray-700 font-semibold mb-2">Alamat</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Masukkan alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />

        <button
          onClick={handleSimpan}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2 justify-center"
        >
          <FaSave />
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
};

export default TambahPelanggan;
