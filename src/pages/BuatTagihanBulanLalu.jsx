import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import Swal from "sweetalert2";
import Select from "react-select";
import { FaSave, FaUndo, FaTrash, FaPlusCircle } from "react-icons/fa";

export default function BuatTagihanBulanLalu() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [pelangganList, setPelangganList] = useState([]);
  const [pelanggan, setPelanggan] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [alamatPelanggan, setAlamatPelanggan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const monthOptions = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const [tagihanList, setTagihanList] = useState([
    { bulan: "", tahun: currentYear.toString(), jumlahTagihan: "" },
  ]);

  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pelanggan"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          nama: doc.data().nama,
          alamat: doc.data().alamat,
        }));
        setPelangganList(list);
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Gagal memuat data pelanggan", "error");
      }
    };
    fetchPelanggan();
  }, []);

  const handleAddRow = () => {
    setTagihanList([
      ...tagihanList,
      { bulan: "", tahun: currentYear.toString(), jumlahTagihan: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newList = tagihanList.filter((_, i) => i !== index);
    setTagihanList(newList);
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleChange = (index, field, value) => {
    const newList = [...tagihanList];
    if (field === "jumlahTagihan") {
      // Hanya ambil angka (hapus titik/koma/karakter non-digit)
      const numericValue = value.replace(/\D/g, "");
      newList[index][field] = numericValue;
    } else {
      newList[index][field] = value;
    }
    setTagihanList(newList);
  };

  const handleSubmit = async () => {
    if (!pelanggan) {
      return Swal.fire("Oops!", "Pilih pelanggan dulu", "warning");
    }

    if (tagihanList.some((t) => !t.bulan || !t.tahun || !t.jumlahTagihan)) {
      return Swal.fire("Oops!", "Semua data tagihan wajib diisi", "warning");
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      // hitung total
      const totalTagihan = tagihanList.reduce(
        (sum, t) => sum + parseInt(t.jumlahTagihan || 0),
        0
      );

      // simpan sekali saja, bukan per row
      const newDoc = await addDoc(collection(db, "tagihan_bulan_lalu"), {
        pelangganId: pelanggan,
        namaPelanggan,
        alamatPelanggan,
        tagihanList: tagihanList.map((t) => ({
          bulan: t.bulan,
          tahun: t.tahun,
          jumlahTagihan: parseInt(t.jumlahTagihan),
        })),
        total: totalTagihan, // tambahkan total
        lunas: false,
        createdAt: Timestamp.now(),
      });

      Swal.fire("Berhasil", "Tagihan berhasil disimpan", "success");
      navigate(`/app/print-preview-bulan-lalu?id=${newDoc.id}`);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal menyimpan tagihan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const pelangganOptions = pelangganList.map((p) => ({
    value: p.id,
    label: p.nama,
    data: p,
  }));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-4">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Buat Tagihan Bulan Lalu
      </h2>

      {/* Pilih pelanggan */}
      <label className="block mb-2 font-medium">Pilih Pelanggan</label>
      <Select
        options={pelangganOptions}
        value={pelangganOptions.find((opt) => opt.value === pelanggan) || null}
        onChange={(selected) => {
          if (selected) {
            setPelanggan(selected.value);
            setNamaPelanggan(selected.data.nama);
            setAlamatPelanggan(selected.data.alamat);
          } else {
            setPelanggan("");
            setNamaPelanggan("");
            setAlamatPelanggan("");
          }
        }}
        isClearable
        placeholder="Pilih pelanggan..."
        className="mb-6"
      />

      {/* Daftar Tagihan Dinamis */}
      {tagihanList.map((t, index) => (
        <div
          key={index}
          className="border border-gray-300 p-4 rounded mb-4 relative"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Bulan */}
            <div>
              <label className="block mb-2 font-medium">Bulan</label>
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={t.bulan}
                onChange={(e) => handleChange(index, "bulan", e.target.value)}
              >
                <option value="">-- Pilih Bulan --</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Tahun */}
            <div>
              <label className="block mb-2 font-medium">Tahun</label>
              <input
                type="number"
                value={t.tahun}
                onChange={(e) => handleChange(index, "tahun", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Jumlah Tagihan */}
          <div className="mt-3">
            <label className="block mb-2 font-medium">
              Jumlah Tagihan (Rp)
            </label>
            <input
              type="text"
              value={formatRupiah(t.jumlahTagihan)}
              onChange={(e) =>
                handleChange(index, "jumlahTagihan", e.target.value)
              }
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Rp 0"
            />
          </div>

          {/* Tombol hapus row */}
          {tagihanList.length > 1 && (
            <button
              onClick={() => handleRemoveRow(index)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 cursor-pointer"
            >
              <FaTrash />
            </button>
          )}
        </div>
      ))}

      {/* Tombol tambah row */}
      <button
        onClick={handleAddRow}
        className="flex items-center gap-2 bg-green-800 text-white px-3 py-2 rounded hover:bg-green-700 mb-6 cursor-pointer"
      >
        <FaPlusCircle /> Tambah Tagihan
      </button>

      {/* Tombol simpan */}
      <div className="flex justify-between">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
          onClick={handleSubmit}
        >
          <FaSave />
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>

        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          <FaUndo />
          Reset
        </button>
      </div>
    </div>
  );
}
