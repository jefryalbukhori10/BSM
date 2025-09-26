import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useLocation } from "react-router-dom";
import { FaPrint } from "react-icons/fa";

const PrintPreviewTagihanBulahLalu = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "tagihan_bulan_lalu", id));
      if (snap.exists()) setData(snap.data());
    };
    fetchData();
  }, [id]);

  const handlePrint = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "RPP" }], // cari printer RPP02N
        optionalServices: [0xffe0],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(0xffe0);
      const characteristic = await service.getCharacteristic(0xffe1);

      // format ESC/POS text
      let text = `\nKPSPAMS BATHORO SURYO MAKMUR\n`;
      text += `Dusun Sukoyuwono Desa Palaan\n`;
      text += `Kec. Ngajum Kab. Malang\n\n`;
      text += `TAGIHAN BULAN LALU\n\n`;
      text += `Nama : ${data.namaPelanggan}\n`;
      text += `Alamat : ${data.alamatPelanggan}\n\n`;

      data.tagihanList.forEach((t, i) => {
        text += `${i + 1}. ${t.bulan}  Rp${t.jumlahTagihan.toLocaleString(
          "id-ID"
        )}\n`;
      });

      text += `-----------------------------\n`;
      text += `TOTAL : Rp${data.total.toLocaleString("id-ID")}\n\n\n\n`;

      // konversi string ke Uint8Array
      const encoder = new TextEncoder();
      const value = encoder.encode(text);

      await characteristic.writeValue(value);

      alert("✅ Data terkirim ke printer RPP02N");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal print: " + err.message);
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-center font-bold text-[18px]">
        KPSPAMS BATHORO SURYO MAKMUR
      </h2>
      <p className="text-center -mt-1">Dusun Sukoyuwono Desa Palaan</p>
      <p className="text-center">Kec. Ngajum Kab. Malang</p>
      <hr className="border border-2" />
      <h2 className="text-2xl font-bold text-center mb-6">
        TAGIHAN BULAN LALU
      </h2>

      <div className="mb-4">
        <p>
          <b>Nama:</b> {data.namaPelanggan}
        </p>
        <p>
          <b>Alamat:</b> {data.alamatPelanggan}
        </p>
      </div>

      <table className="w-full border border-black border-collapse text-center">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1 w-12">No</th>
            <th className="border border-black px-2 py-1">Bulan</th>
            <th className="border border-black px-2 py-1 w-32">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {data.tagihanList.map((t, i) => (
            <tr key={i}>
              <td className="border border-black px-2 py-1">{i + 1}</td>
              <td className="border border-black px-2 py-1">{t.bulan}</td>
              <td className="border border-black px-2 py-1 text-right pr-4">
                {t.jumlahTagihan.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={2}
              className="border border-black px-2 py-2 font-bold text-center pr-4"
            >
              TOTAL
            </td>
            <td className="border border-black px-2 py-2 font-bold text-right pr-4">
              {data.total.toLocaleString("id-ID")}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-700 flex items-center justify-center gap-2 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          <FaPrint />
          Print ke RPP02N
        </button>
      </div>
    </div>
  );
};

export default PrintPreviewTagihanBulahLalu;
