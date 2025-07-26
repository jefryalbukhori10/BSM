import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config"; // pastikan path ini sesuai
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaFileImage, FaFilePdf, FaPrint } from "react-icons/fa";

const PrintPreviewScreen = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // ✅ Ambil ID dari query string
  const [tagihan, setTagihan] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const previewRef = useRef(null);

  useEffect(() => {
    const fetchTagihan = async () => {
      try {
        const docRef = doc(db, "tagihan", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const tagihanData = docSnap.data();
          setTagihan(tagihanData);

          // Ambil pelanggan berdasarkan pelangganId dari tagihan
          if (tagihanData.pelangganId) {
            const pelangganRef = doc(db, "pelanggan", tagihanData.pelangganId);
            const pelangganSnap = await getDoc(pelangganRef);

            if (pelangganSnap.exists()) {
              setPelanggan(pelangganSnap.data());
            } else {
              console.log("Pelanggan tidak ditemukan");
            }
          }
        } else {
          console.log("Tagihan tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    if (id) {
      fetchTagihan();
    }
  }, [id]);

  // 📸 DOWNLOAD JPG
  const handleDownloadJPG = async () => {
    const element = previewRef.current;
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = dataUrl;
    const randomIndex = Math.floor(Math.random() * 10000);
    link.download = `Tagihan_${pelanggan.nama}_${tagihan.bulan}_${tagihan.tahun}_Index_${randomIndex}.jpg`;
    link.click();
  };

  // 📄 DOWNLOAD PDF
  const handleDownloadPDF = async () => {
    const element = previewRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const randomIndex = Math.floor(Math.random() * 10000);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [imgWidth, imgHeight],
    });

    // ⬅️ Masukkan ukuran di sini agar gambar tampil full 1 halaman
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save(
      `Tagihan_${pelanggan.nama}_${tagihan.bulan}_${tagihan.tahun}_Index_${randomIndex}.pdf`
    );
  };

  // 🖨️ PRINT
  const handlePrint = async () => {
    // const printWindow = window.open("", "_blank");
    // printWindow.document.write(`
    //   <html>
    //     <head>
    //       <title>Cetak Tagihan</title>
    //       <style>
    //         body { font-family: sans-serif; padding: 20px; }
    //       </style>
    //     </head>
    //     <body>
    //       ${previewRef.current.innerHTML}
    //       <script>
    //         window.onload = function() {
    //           window.print();
    //           window.onafterprint = function() { window.close(); };
    //         }
    //       </script>
    //     </body>
    //   </html>
    // `);
    // printWindow.document.close();

    const element = previewRef.current;
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL("image/jpeg");

    const win = window.open("");
    win.document
      .write(`<html><head><title>Print</title></head><body style="margin:0;">
      <img src="${dataUrl}" onload="window.print(); window.close();" style="width:100%;"/>
    </body></html>`);
  };

  if (!tagihan) return <div>TAGIHAN TIDAK DITEMUKAN !!!</div>;

  const tanggalCetak = moment().format("DD MMMM YYYY HH.mm");

  return (
    <div>
      <div
        ref={previewRef}
        className="bg-white p-2 w-[400px] h-[600px] mx-auto my-4 shadow-md rounded-2xl"
      >
        <div className="w-[380px] mx-auto my-4 p-4 rounded-2xl shadow-md border text-[15px] font-[sans-serif] bg-white">
          <h2 className="text-center font-bold text-[18px]">
            KPSPAMS BATHORO SURYO MAKMUR
          </h2>
          <p className="text-center -mt-1">Dusun Sukoyuwono Desa Palaan</p>
          <p className="text-center">Kec. Ngajum Kab. Malang</p>
          <p>========================================</p>
          {/* <hr className="my-2 border-black border-1" /> */}

          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1">
            <div>
              <strong>Nama</strong>
            </div>
            <div>: {pelanggan.nama}</div>

            <div>
              <strong>Alamat</strong>
            </div>
            <div>: {pelanggan.alamat}</div>

            <div>
              <strong>Bulan</strong>
            </div>
            <div>: {tagihan.bulan}</div>

            <div>
              <strong>Tahun</strong>
            </div>
            <div>: {tagihan.tahun}</div>
          </div>

          {/* <hr className="my-2 border-black border-1" /> */}
          <p>========================================</p>

          <div className="text-sm mb-2">
            <div className="grid grid-cols-5 gap-1 mt-1">
              <span>STAN</span>
              <span>{tagihan.stanAwal}</span>
              <span>&gt;</span>
              <span>{tagihan.stanAkhir}</span>
              <span>= {tagihan.lebih} m³</span>

              <span>31 &gt;</span>
              <span>3.000</span>
              <span>X</span>
              <span>
                {tagihan.jumlahPakai > 30 ? tagihan.lebih + " m³" : ""}
              </span>
              <span>
                {tagihan.jumlahPakai > 30
                  ? Number(tagihan.hargaLebih).toLocaleString("id-ID")
                  : 0}
              </span>

              <span>21 &gt; 30</span>
              <span>2.000</span>
              <span>X</span>
              <span>
                {tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31
                  ? tagihan.lebih + " m³"
                  : ""}
              </span>
              <span>
                {tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31
                  ? Number(tagihan.hargaLebih).toLocaleString("id-ID")
                  : 0}
              </span>

              <span>11 &gt; 20</span>
              <span>1.500</span>
              <span>X</span>
              <span>
                {tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21
                  ? tagihan.lebih + " m³"
                  : ""}
              </span>
              <span>
                {tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21
                  ? Number(tagihan.hargaLebih).toLocaleString("id-ID")
                  : 0}
              </span>

              <span>MINIMAL</span>
              <span></span>
              <span></span>
              <span>10 m³</span>
              <span>15.000</span>

              <span>BEBAN</span>
              <span></span>
              <span></span>
              <span></span>
              <span>5.000</span>
            </div>
          </div>

          {/* <hr className="my-2 border-black border-1" /> */}
          <p>========================================</p>

          <div className="text-xl font-bold">
            Total Tagihan : Rp{" "}
            {Number(tagihan.jumlahTagihan).toLocaleString("id-ID")}
          </div>

          <div className="mt-2 text-xs border border-black rounded-md p-2 text-justify leading-snug italic">
            Gunakan air dengan bijak. Pembayaran paling lambat tanggal 28 setiap
            bulannya. Tiga bulan tidak membayar akan dikenakan pemutusan.
            Pembayaran bisa dilakukan di Toko Zaenal.
          </div>

          <div className="text-[11px] mt-2 italic text-right">
            Dicetak pada {tanggalCetak}
          </div>
        </div>
      </div>
      <div className="mb-4 space-x-2 w-[380px] mx-auto my-4 p-4 rounded-2xl shadow-md border text-[15px] font-[sans-serif] bg-white text-center flex">
        <button
          onClick={handleDownloadJPG}
          className="flex items-center justify-center gap-2 w-100 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <FaFileImage />
          JPG
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-red-700 flex items-center justify-center w-100 gap-2 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          <FaFilePdf />
          PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-gray-700 flex items-center justify-center w-100 gap-2 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          <FaPrint />
          Print
        </button>
      </div>
    </div>
  );
};

export default PrintPreviewScreen;
