import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import Swal from "sweetalert2";
import Select from "react-select";
import { FaSave, FaUndo } from "react-icons/fa";

export default function BuatTagihan() {
  const navigate = useNavigate();
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [pelangganList, setPelangganList] = useState([]);
  const [pelanggan, setPelanggan] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [alamatPelanggan, setAlamatPelanggan] = useState("");
  const [stanAwal, setStanAwal] = useState("");
  const [stanAkhir, setStanAkhir] = useState("");
  const [jumlahPakai, setJumlahPakai] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState(currentYear.toString());
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

  useEffect(() => {
    setBulan(monthOptions[currentMonthIndex]);
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
        Swal.fire("Error", "Gagal memuat data pelanggan", error);
      }
    };

    fetchPelanggan();
  }, []);

  const calculateJumlahPakai = (awal, akhir) => {
    const a = parseInt(awal, 10);
    const b = parseInt(akhir, 10);
    if (!isNaN(a) && !isNaN(b)) {
      const result = b - a;
      setJumlahPakai(result >= 0 ? result.toString() : "0");
    } else {
      setJumlahPakai("");
    }
  };

  const handleSubmit = async () => {
    if (
      !pelanggan ||
      !stanAwal ||
      !stanAkhir ||
      !jumlahPakai ||
      !bulan ||
      !tahun
    ) {
      return Swal.fire("Oops!", "Semua data wajib diisi", "warning");
    }

    if (isLoading) return;
    setIsLoading(true);

    let lebih = 0;
    let hargaLebih = 0;
    const jumlah = parseInt(jumlahPakai);

    if (jumlah > 10 && jumlah < 21) {
      lebih = jumlah - 10;
      hargaLebih = 1500 * lebih;
    } else if (jumlah > 20 && jumlah < 31) {
      lebih = jumlah - 10;
      hargaLebih = 2000 * lebih;
    } else if (jumlah > 30) {
      lebih = jumlah - 10;
      hargaLebih = 3000 * lebih;
    }

    const totalHarga = 20000 + hargaLebih;

    try {
      const newDoc = await addDoc(collection(db, "tagihan"), {
        pelangganId: pelanggan,
        bulan,
        tahun,
        stanAwal: parseInt(stanAwal),
        stanAkhir: parseInt(stanAkhir),
        jumlahPakai: jumlah,
        jumlahTagihan: totalHarga,
        lunas: false,
        lebih,
        hargaLebih,
        createdAt: Timestamp.now(),
      });

      console.log(namaPelanggan);
      console.log(alamatPelanggan);

      Swal.fire("Berhasil", "Tagihan berhasil disimpan", "success");
      navigate(`/app/print-preview?id=${newDoc.id}`);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal menyimpan tagihan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Buat options-nya
  const pelangganOptions = pelangganList.map((p) => ({
    value: p.id,
    label: p.nama,
    data: p,
  }));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-4">
      <h2 className="text-xl font-semibold mb-6 text-center">Buat Tagihan</h2>

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
        className="mb-4"
      />

      <label className="block mb-2 font-medium">Stan Meter</label>
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Stan Awal"
          className="w-full border border-gray-300 p-2 rounded"
          value={stanAwal}
          onChange={(e) => {
            setStanAwal(e.target.value);
            calculateJumlahPakai(e.target.value, stanAkhir);
          }}
        />
        <input
          type="number"
          placeholder="Stan Akhir"
          className="w-full border border-gray-300 p-2 rounded"
          value={stanAkhir}
          onChange={(e) => {
            setStanAkhir(e.target.value);
            calculateJumlahPakai(stanAwal, e.target.value);
          }}
        />
      </div>

      <label className="block mb-2 font-medium">Jumlah Pakai</label>
      <input
        type="number"
        value={jumlahPakai}
        readOnly
        className="w-full border border-gray-300 p-2 rounded mb-4 bg-gray-100"
      />

      <label className="block mb-2 font-medium">Bulan</label>
      <select
        className="w-full border border-gray-300 p-2 rounded mb-4"
        value={bulan}
        onChange={(e) => setBulan(e.target.value)}
      >
        {monthOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Tahun</label>
      <input
        type="number"
        value={tahun}
        onChange={(e) => setTahun(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-6"
      />

      <div className="flex justify-between">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={handleSubmit}
        >
          <FaSave />
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>

        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <FaUndo />
          Reset
        </button>
      </div>
    </div>
  );
}
