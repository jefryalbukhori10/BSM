import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import { FaPrint, FaCheck, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const DaftarTagihanScreen = () => {
  const [tagihanData, setTagihanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = 5;

  const fetchTagihan = async () => {
    try {
      const pelangganSnapshot = await getDocs(collection(db, "pelanggan"));
      const pelangganMap = {};
      pelangganSnapshot.forEach((doc) => {
        pelangganMap[doc.id] = doc.data();
      });

      const tagihanSnapshot = await getDocs(collection(db, "tagihan"));
      const tagihanList = tagihanSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const pelanggan = pelangganMap[data.pelangganId];
          if (!pelanggan || data.lunas) return null;
          return {
            id: doc.id,
            pelanggan: pelanggan.nama,
            alamat: pelanggan.alamat,
            bulan: data.bulan,
            tahun: data.tahun,
            tagihan: data.jumlahTagihan,
            ...data,
          };
        })
        .filter(Boolean);

      setTagihanData(tagihanList);
      setFilteredData(tagihanList);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchTagihan();
  }, []);

  useEffect(() => {
    const filtered = tagihanData.filter((item) =>
      item.pelanggan.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, tagihanData]);

  const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handleSetLunas = async (id) => {
    const result = await Swal.fire({
      title: "Tandai sebagai lunas?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, "tagihan", id), { lunas: true });
        setTagihanData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Sukses!", "Tagihan ditandai lunas.", "success");
      } catch (err) {
        Swal.fire("Gagal!", "Tidak dapat update data.", "error");
        console.log(err);
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus tagihan ini?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tagihan", id));
        setTagihanData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Terhapus!", "Tagihan berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
        console.log(err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Daftar Tagihan</h2>
      <input
        type="text"
        placeholder="Cari nama pelanggan... 🔍️"
        className="w-full bg-white shadow-md rounded p-2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                {item.pelanggan}
              </h3>
              <p className="text-sm text-gray-600">
                {item.bulan} {item.tahun}
              </p>
              <p className="text-md font-bold text-blue-600 mt-2">
                Rp {Number(item.tagihan).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4 gap-2 text-sm">
              <Link
                to={`/app/print-preview?id=${item.id}`}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
              >
                <FaPrint /> Preview
              </Link>
              <button
                onClick={() => handleSetLunas(item.id)}
                className="flex items-center gap-1 bg-green-100 text-green-700 p-2 rounded hover:bg-green-200"
              >
                <FaCheck /> Lunas
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1 bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
              >
                <FaTrash /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ‹
          </button>
          <span className="text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default DaftarTagihanScreen;
