// src/pages/DaftarTagihan.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSave, FaTimes, FaPlus, FaTrashAlt } from "react-icons/fa";

export default function DaftarTagihanBulanLalu() {
  const [tagihan, setTagihan] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editTagihanList, setEditTagihanList] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "tagihan_bulan_lalu"));
    const data = [];

    snap.forEach((docSnap) => {
      const item = { id: docSnap.id, ...docSnap.data() };
      data.push(item);
    });

    const list = data.map((d, i) => ({ no: i + 1, ...d }));
    setTagihan(list);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data tagihan ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tagihan_bulan_lalu", id));
        Swal.fire("Berhasil", "Data berhasil dihapus", "success");
        fetchData();
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditTagihanList(item.tagihanList || []);
    setShowModal(true);
  };

  const handleChangeTagihan = (index, field, value) => {
    const updated = [...editTagihanList];
    updated[index][field] = field === "jumlahTagihan" ? Number(value) : value;
    setEditTagihanList(updated);
  };

  const handleAddTagihan = () => {
    setEditTagihanList([
      ...editTagihanList,
      { bulan: "", tahun: "", jumlahTagihan: 0 },
    ]);
  };

  const handleRemoveTagihan = (index) => {
    const updated = [...editTagihanList];
    updated.splice(index, 1);
    setEditTagihanList(updated);
  };

  const handleSimpanEdit = async () => {
    try {
      const total = editTagihanList.reduce(
        (sum, item) => sum + (Number(item.jumlahTagihan) || 0),
        0
      );

      const itemRef = doc(db, "tagihan_bulan_lalu", selectedItem.id);
      await updateDoc(itemRef, {
        tagihanList: editTagihanList,
        total,
      });

      Swal.fire("Berhasil", "Tagihan berhasil diperbarui", "success");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.log(error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = tagihan.filter(
    (item) =>
      item.namaPelanggan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.alamatPelanggan.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    { name: "No", selector: (row) => row.no, width: "60px" },
    { name: "Nama", selector: (row) => row.namaPelanggan, sortable: true },
    { name: "Alamat", selector: (row) => row.alamatPelanggan },
    {
      name: "Rincian Tagihan",
      cell: (row) => (
        <ul className="list-disc list-inside">
          {row.tagihanList.map((item, i) => (
            <li key={i}>
              {item.bulan} {item.tahun} : Rp{" "}
              {item.jumlahTagihan.toLocaleString("id-ID")}
            </li>
          ))}
        </ul>
      ),
      grow: 3,
    },
    {
      name: "Total",
      selector: (row) => `Rp ${row.total.toLocaleString("id-ID")}`,
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="space-x-2">
          <button
            onClick={() =>
              navigate(`/app/print-preview-bulan-lalu?id=${row.id}`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer m-1"
            title="Lihat Detail"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded cursor-pointer m-1"
            title="Edit"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded cursor-pointer m-1"
            title="Hapus"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="py-4 px-2">
      <h2 className="text-xl font-bold mb-4 bg-white p-4 rounded-xl shadow">
        Daftar Tagihan Bulan Lalu
      </h2>

      <div className="w-full bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama/alamat..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/2"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        striped
        customStyles={{
          rows: { style: { minHeight: "52px" } },
          headCells: {
            style: {
              backgroundColor: "#3360dbff",
              color: "white",
              fontWeight: "bold",
            },
          },
        }}
      />

      {/* Modal Edit */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              ✏️ Edit Tagihan - {selectedItem.namaPelanggan}
            </h3>

            {/* Tabel Tagihan */}
            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Bulan</th>
                  <th className="p-2 border">Tahun</th>
                  <th className="p-2 border">Jumlah Tagihan</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {editTagihanList.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={item.bulan}
                        onChange={(e) =>
                          handleChangeTagihan(index, "bulan", e.target.value)
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={item.tahun}
                        onChange={(e) =>
                          handleChangeTagihan(index, "tahun", e.target.value)
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={item.jumlahTagihan}
                        onChange={(e) =>
                          handleChangeTagihan(
                            index,
                            "jumlahTagihan",
                            e.target.value
                          )
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleRemoveTagihan(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleAddTagihan}
              className="mb-4 px-3 py-1 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700"
            >
              <FaPlus /> Tambah Tagihan
            </button>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded flex items-center gap-2"
              >
                <FaTimes /> Batal
              </button>
              <button
                onClick={handleSimpanEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
              >
                <FaSave /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
