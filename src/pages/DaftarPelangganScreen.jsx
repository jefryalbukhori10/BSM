import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

export default function DaftarPelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editAlamat, setEditAlamat] = useState("");

  const fetchData = async () => {
    const pelangganCol = collection(db, "pelanggan");
    const pelangganSnapshot = await getDocs(pelangganCol);
    const pelangganList = pelangganSnapshot.docs.map((doc, index) => ({
      id: doc.id,
      no: index + 1,
      ...doc.data(),
    }));
    setPelanggan(pelangganList);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data pelanggan tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "pelanggan", id));
      Swal.fire("Berhasil", "Data berhasil dihapus", "success");
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditNama(item.nama);
    setEditAlamat(item.alamat);
    setShowModal(true);
  };

  const handleSimpanEdit = async () => {
    if (!editNama || !editAlamat) {
      Swal.fire("Gagal", "Nama dan Alamat tidak boleh kosong.", "error");
      return;
    }

    try {
      const itemRef = doc(db, "pelanggan", selectedItem.id);
      await updateDoc(itemRef, {
        nama: editNama,
        alamat: editAlamat,
      });

      Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan.", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = pelanggan.filter((item) =>
    item.nama.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "No",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="space-x-2">
          <button
            title="Edit"
            onClick={() => handleEdit(row)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            title="Hapus"
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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
        Daftar Pelanggan
      </h2>

      <div className="w-full bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2 mb-4">
        <Link
          to="/tambah-pelanggan"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <FontAwesomeIcon icon={faPlus} />
          Tambah Pelanggan
        </Link>
        <input
          type="text"
          placeholder="Cari pelanggan..."
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
          rows: {
            style: {
              minHeight: "52px",
            },
          },
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Pelanggan</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Alamat</label>
              <input
                type="text"
                value={editAlamat}
                onChange={(e) => setEditAlamat(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded flex items-center gap-2"
              >
                <FaTimes />
                Batal
              </button>

              <button
                onClick={handleSimpanEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
              >
                <FaSave />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
