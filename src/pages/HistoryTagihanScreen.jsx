import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPrint, FaTrash } from "react-icons/fa";

const HistoryTagihanScreen = () => {
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
        const data = doc.data();
        pelangganMap[doc.id] = { nama: data.nama, alamat: data.alamat };
      });

      const tagihanSnapshot = await getDocs(collection(db, "tagihan"));
      const tagihanList = tagihanSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const pelanggan = pelangganMap[data.pelangganId];
          if (!pelanggan || data.lunas !== true) return null;
          return {
            id: doc.id,
            pelangganId: data.pelangganId,
            pelanggan: pelanggan.nama,
            alamat: pelanggan.alamat,
            bulan: data.bulan,
            tahun: data.tahun,
            tagihan: data.jumlahTagihan,
          };
        })
        .filter(Boolean);

      setTagihanData(tagihanList);
      setFilteredData(tagihanList);
    } catch (error) {
      console.error("Gagal memuat data:", error);
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

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus tagihan?",
      text: "Apakah Anda yakin ingin menghapus tagihan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tagihan", id));
        const updated = tagihanData.filter((item) => item.id !== id);
        setTagihanData(updated);
        setFilteredData(updated);
        Swal.fire("Berhasil!", "Tagihan berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal menghapus tagihan:", error);
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus tagihan.",
          "error"
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        History Tagihan Lunas
      </h2>

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
            className="bg-white rounded shadow-md p-4 flex flex-col justify-between"
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

            <div className="flex gap-4 mt-4 text-sm">
              <Link
                to={`/app/print-preview?id=${item.id}`}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200"
              >
                <FaPrint /> Preview
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"
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

export default HistoryTagihanScreen;
