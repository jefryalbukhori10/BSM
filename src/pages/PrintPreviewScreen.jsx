import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config"; // pastikan path ini sesuai
import moment from "moment";
import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import {
  FaEye,
  FaEyeSlash,
  FaFileImage,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";

const PrintPreviewScreen = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // ✅ Ambil ID dari query string
  const [tagihan, setTagihan] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const previewRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewText, setPreviewText] = useState("");

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
  // const handleDownloadPDF = async () => {
  //   const element = previewRef.current;
  //   const canvas = await html2canvas(element);
  //   const imgData = canvas.toDataURL("image/png");

  //   const imgWidth = canvas.width;
  //   const imgHeight = canvas.height;

  //   const randomIndex = Math.floor(Math.random() * 10000);

  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "px",
  //     format: [imgWidth, imgHeight],
  //   });

  //   // ⬅️ Masukkan ukuran di sini agar gambar tampil full 1 halaman
  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  //   pdf.save(
  //     `Tagihan_${pelanggan.nama}_${tagihan.bulan}_${tagihan.tahun}_Index_${randomIndex}.pdf`
  //   );
  // };

  // 🖨️ PRINT
  // const handlePrint = async () => {
  //   // const printWindow = window.open("", "_blank");
  //   // printWindow.document.write(`
  //   //   <html>
  //   //     <head>
  //   //       <title>Cetak Tagihan</title>
  //   //       <style>
  //   //         body { font-family: sans-serif; padding: 20px; }
  //   //       </style>
  //   //     </head>
  //   //     <body>
  //   //       ${previewRef.current.innerHTML}
  //   //       <script>
  //   //         window.onload = function() {
  //   //           window.print();
  //   //           window.onafterprint = function() { window.close(); };
  //   //         }
  //   //       </script>
  //   //     </body>
  //   //   </html>
  //   // `);
  //   // printWindow.document.close();

  //   const element = previewRef.current;
  //   const canvas = await html2canvas(element);
  //   const dataUrl = canvas.toDataURL("image/jpeg");

  //   const win = window.open("");
  //   win.document
  //     .write(`<html><head><title>Print</title></head><body style="margin:0;">
  //     <img src="${dataUrl}" onload="window.print(); window.close();" style="width:100%;"/>
  //   </body></html>`);
  // };

  // 🖨️ PRINT KE PRINTER BLUETOOTH
  // const handlePrint = async () => {
  //   try {
  //     const device = await navigator.bluetooth.requestDevice({
  //       filters: [{ namePrefix: "RPP" }], // cari printer RPP02N
  //       optionalServices: [0xffe0],
  //     });

  //     const server = await device.gatt.connect();
  //     const service = await server.getPrimaryService(0xffe0);
  //     const characteristic = await service.getCharacteristic(0xffe1);

  //     // 📝 Susun teks ESC/POS sesuai dengan struk di layar
  //     let text = "";
  //     text += "KPSPAMS BATHORO SURYO MAKMUR\n";
  //     text += "Dusun Sukoyuwono Desa Palaan\n";
  //     text += "Kec. Ngajum Kab. Malang\n";
  //     text += "========================================\n";
  //     text += `Nama   : ${pelanggan.nama || "-"}\n`;
  //     text += `Alamat : ${pelanggan.alamat || "-"}\n`;
  //     text += `Bulan  : ${tagihan.bulan || "-"}\n`;
  //     text += `Tahun  : ${tagihan.tahun || "-"}\n`;
  //     text += "========================================\n";

  //     text += `STAN ${tagihan.stanAwal} > ${tagihan.stanAkhir} = ${tagihan.jumlahPakai} m³\n`;

  //     // Hitungan blok tarif
  //     if (tagihan.jumlahPakai > 30) {
  //       text += `31 >   3000 x ${tagihan.lebih} m³ = Rp${Number(
  //         tagihan.hargaLebih
  //       ).toLocaleString("id-ID")}\n`;
  //     }
  //     if (tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31) {
  //       text += `21-30  2000 x ${tagihan.lebih} m³ = Rp${Number(
  //         tagihan.hargaLebih
  //       ).toLocaleString("id-ID")}\n`;
  //     }
  //     if (tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21) {
  //       text += `11-20  1500 x ${tagihan.lebih} m³ = Rp${Number(
  //         tagihan.hargaLebih
  //       ).toLocaleString("id-ID")}\n`;
  //     }

  //     text += `MINIMAL 10 m³ = Rp15.000\n`;
  //     text += `BEBAN        = Rp5.000\n`;
  //     text += "========================================\n";

  //     text += `TOTAL TAGIHAN : Rp${Number(tagihan.jumlahTagihan).toLocaleString(
  //       "id-ID"
  //     )}\n\n`;

  //     text +=
  //       "Gunakan air dengan bijak.\nPembayaran paling lambat tanggal 28.\nTiga bulan tidak membayar = pemutusan.\nBayar di Toko Zaenal.\n\n";
  //     text += `Dicetak pada ${tanggalCetak}\n\n\n\n`;

  //     // Konversi ke byte dan kirim ke printer
  //     const encoder = new TextEncoder();
  //     const value = encoder.encode(text);
  //     await characteristic.writeValue(value);

  //     alert("✅ Data terkirim ke printer RPP02N");
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Gagal print: " + err.message);
  //   }
  // };

  // const handlePrint = async () => {
  //   try {
  //     const device = await navigator.bluetooth.requestDevice({
  //       filters: [{ namePrefix: "RPP" }], // ganti sesuai merk printermu
  //       optionalServices: [0xffe0, 0x18f0, 0x1101],
  //     });

  //     const server = await device.gatt.connect();

  //     const possiblePairs = [
  //       { service: 0xffe0, char: 0xffe1 },
  //       {
  //         service: "000018f0-0000-1000-8000-00805f9b34fb",
  //         char: "00002af1-0000-1000-8000-00805f9b34fb",
  //       },
  //       {
  //         service: "00001101-0000-1000-8000-00805f9b34fb",
  //         char: "00001101-0000-1000-8000-00805f9b34fb",
  //       },
  //     ];

  //     let connected = false;
  //     let characteristic = null;

  //     for (const pair of possiblePairs) {
  //       try {
  //         const service = await server.getPrimaryService(pair.service);
  //         characteristic = await service.getCharacteristic(pair.char);
  //         connected = true;
  //         break;
  //       } catch {
  //         console.log("ds");
  //       }
  //     }

  //     if (!connected) {
  //       alert("⚠️ Tidak ada UUID yang cocok dengan printer ini.");
  //       return;
  //     }

  //     // =======================================
  //     // 🧾 FORMAT STRUK UNTUK LEBAR 6 CM
  //     // =======================================
  //     const garis = "=".repeat(32);
  //     const spasi = (str = "") => str.padEnd(32, " ");

  //     let text = "";
  //     text += " KPSPAMS BATHORO SURYO MAKMUR\n";
  //     text += " Dusun Sukoyuwono Desa Palaan\n";
  //     text += " Kec. Ngajum Kab. Malang\n";
  //     text += garis + "\n";
  //     text += `Nama   : ${pelanggan.nama || "-"}\n`;
  //     text += `Alamat : ${pelanggan.alamat || "-"}\n`;
  //     text += `Bulan  : ${tagihan.bulan || "-"}\n`;
  //     text += `Tahun  : ${tagihan.tahun || "-"}\n`;
  //     text += garis + "\n";
  //     text += `STAN ${tagihan.stanAwal} > ${tagihan.stanAkhir} = ${tagihan.jumlahPakai} m3\n`;
  //     text += "-".repeat(32) + "\n";

  //     // 👇 Format baris biaya
  //     text += " 31>      3.000 x    0 m3 =     0\n";
  //     if (tagihan.jumlahPakai > 20)
  //       text += ` 21>30   2.000 x ${tagihan.lebih
  //         .toString()
  //         .padStart(2, " ")} m3 = ${Number(tagihan.hargaLebih)
  //         .toLocaleString("id-ID")
  //         .padStart(6, " ")}\n`;
  //     else text += " 21>30   2.000 x\n";

  //     if (tagihan.jumlahPakai > 10 && tagihan.jumlahPakai <= 20)
  //       text += ` 11>20   1.500 x ${tagihan.lebih
  //         .toString()
  //         .padStart(2, " ")} m3 = ${Number(tagihan.hargaLebih)
  //         .toLocaleString("id-ID")
  //         .padStart(6, " ")}\n`;
  //     else text += " 11>20   1.500 x\n";

  //     text += " MINIMAL 10 m3 = 15.000\n";
  //     text += " BEBAN         =  5.000\n";
  //     text += garis + "\n";
  //     text += `TOTAL TAGIHAN : Rp ${Number(
  //       tagihan.jumlahTagihan
  //     ).toLocaleString("id-ID")}\n`;
  //     text += garis + "\n\n";
  //     text +=
  //       "Gunakan air dengan bijak.\nPembayaran paling lambat tgl 28.\n3 bulan menunggak = pemutusan.\nBayar di Toko Zaenal.\n\n";
  //     text += `Dicetak pada ${tanggalCetak}\n\n\n`;

  //     // Kirim ke printer
  //     const encoder = new TextEncoder();
  //     const bytes = encoder.encode(text);
  //     const chunkSize = 200;

  //     for (let i = 0; i < bytes.length; i += chunkSize) {
  //       const chunk = bytes.slice(i, i + chunkSize);
  //       await characteristic.writeValue(chunk);
  //       await new Promise((r) => setTimeout(r, 100));
  //     }

  //     alert("✅ Struk berhasil dikirim ke printer!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("❌ Gagal mencetak: " + error.message);
  //   }
  // };

  // 04/11/25
  // const handlePrint = async () => {
  //   try {
  //     const device = await navigator.bluetooth.requestDevice({
  //       filters: [{ namePrefix: "RPP" }], // ganti sesuai printer kamu
  //       optionalServices: [0xffe0, 0x18f0, 0x1101],
  //     });

  //     const server = await device.gatt.connect();

  //     const possiblePairs = [
  //       { service: 0xffe0, char: 0xffe1 },
  //       {
  //         service: "000018f0-0000-1000-8000-00805f9b34fb",
  //         char: "00002af1-0000-1000-8000-00805f9b34fb",
  //       },
  //       {
  //         service: "00001101-0000-1000-8000-00805f9b34fb",
  //         char: "00001101-0000-1000-8000-00805f9b34fb",
  //       },
  //     ];

  //     let connected = false;
  //     let characteristic = null;

  //     for (const pair of possiblePairs) {
  //       try {
  //         const service = await server.getPrimaryService(pair.service);
  //         characteristic = await service.getCharacteristic(pair.char);
  //         connected = true;
  //         break;
  //       } catch {
  //         console.log("sds");
  //       }
  //     }

  //     if (!connected) {
  //       alert("⚠️ Tidak ada UUID yang cocok dengan printer ini.");
  //       return;
  //     }

  //     // =============================
  //     // 🧾 STRUK UNTUK LEBAR 6 CM
  //     // =============================
  //     const garis = "=".repeat(32);

  //     let text = "";
  //     text += " KPSPAMS BATHORO SURYO MAKMUR\n";
  //     text += " Dusun Sukoyuwono Desa Palaan\n";
  //     text += " Kec. Ngajum Kab. Malang\n";
  //     text += garis + "\n";
  //     text += `Nama   : ${pelanggan.nama || "-"}\n`;
  //     text += `Alamat : ${pelanggan.alamat || "-"}\n`;
  //     text += `Bulan  : ${tagihan.bulan || "-"}\n`;
  //     text += `Tahun  : ${tagihan.tahun || "-"}\n`;
  //     // text += garis + "\n";

  //     // Bagian STAN
  //     text += `STAN ${tagihan.stanAwal} > ${tagihan.stanAkhir} = ${tagihan.jumlahPakai} m3\n\n`;

  //     // Baris tarif — logika sesuai React component kamu
  //     const baris = [];

  //     // 31 >
  //     baris.push({
  //       label: "31>",
  //       harga: 3000,
  //       jumlah: tagihan.jumlahPakai > 30 ? `${tagihan.lebih} m3` : "",
  //       total:
  //         tagihan.jumlahPakai > 30
  //           ? Number(tagihan.hargaLebih).toLocaleString("id-ID")
  //           : "0",
  //     });

  //     // 21 > 30
  //     baris.push({
  //       label: "21>30",
  //       harga: 2000,
  //       jumlah:
  //         tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31
  //           ? `${tagihan.lebih} m3`
  //           : "",
  //       total:
  //         tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31
  //           ? Number(tagihan.hargaLebih).toLocaleString("id-ID")
  //           : "0",
  //     });

  //     // 11 > 20
  //     baris.push({
  //       label: "11>20",
  //       harga: 1500,
  //       jumlah:
  //         tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21
  //           ? `${tagihan.lebih} m3`
  //           : "",
  //       total:
  //         tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21
  //           ? Number(tagihan.hargaLebih).toLocaleString("id-ID")
  //           : "0",
  //     });

  //     // Tambahan baris tetap
  //     baris.push({
  //       label: "MINIMAL",
  //       harga: "",
  //       jumlah: "10 m3",
  //       total: "15.000",
  //     });
  //     baris.push({ label: "BEBAN", harga: "", jumlah: "", total: "5.000" });

  //     // Format setiap baris (agar sejajar di 6cm paper)
  //     for (const b of baris) {
  //       text += `${b.label.padEnd(7, " ")} ${String(b.harga || "").padEnd(
  //         6,
  //         " "
  //       )} X ${String(b.jumlah || "").padEnd(6, " ")} = ${b.total}\n`;
  //     }

  //     text += garis + "\n";
  //     text += `TOTAL TAGIHAN : Rp ${Number(
  //       tagihan.jumlahTagihan
  //     ).toLocaleString("id-ID")}\n`;
  //     text += garis + "\n\n";
  //     text +=
  //       "Gunakan air dengan bijak.\nPembayaran paling lambat tgl 28.\n3 bulan menunggak = pemutusan.\nBayar di Toko Zaenal.\n\n";
  //     text += `Dicetak pada ${tanggalCetak}\n\n\n`;

  //     // Kirim ke printer
  //     const encoder = new TextEncoder();
  //     const bytes = encoder.encode(text);
  //     const chunkSize = 200;

  //     for (let i = 0; i < bytes.length; i += chunkSize) {
  //       const chunk = bytes.slice(i, i + chunkSize);
  //       await characteristic.writeValue(chunk);
  //       await new Promise((r) => setTimeout(r, 100));
  //     }

  //     alert("✅ Struk berhasil dikirim ke printer!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("❌ Gagal mencetak: " + error.message);
  //   }
  // };
  const handlePrint = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "RPP" }],
        optionalServices: [0xffe0, 0x18f0, 0x1101],
      });

      const server = await device.gatt.connect();

      const possiblePairs = [
        { service: 0xffe0, char: 0xffe1 },
        {
          service: "000018f0-0000-1000-8000-00805f9b34fb",
          char: "00002af1-0000-1000-8000-00805f9b34fb",
        },
        {
          service: "00001101-0000-1000-8000-00805f9b34fb",
          char: "00001101-0000-1000-8000-00805f9b34fb",
        },
      ];

      let characteristic = null;
      for (const pair of possiblePairs) {
        try {
          const service = await server.getPrimaryService(pair.service);
          characteristic = await service.getCharacteristic(pair.char);
          break;
        } catch {
          console.log("UUID tidak cocok, mencoba berikutnya...");
        }
      }

      if (!characteristic) {
        alert("⚠️ Tidak ada UUID yang cocok dengan printer ini.");
        return;
      }

      // =============================
      // 🧾 FORMAT STRUK SAMA DENGAN PREVIEW
      // =============================

      const lebarStruk = 32; // kira-kira 6 cm
      const garis = "=".repeat(lebarStruk);
      const tanggalCetak = moment().format("DD MMMM YYYY HH.mm");

      const center = (text) => {
        const pad = Math.floor((lebarStruk - text.length) / 2);
        return " ".repeat(pad > 0 ? pad : 0) + text;
      };

      let text = "";
      text += center("KPSPAMS BATHORO SURYO MAKMUR") + "\n";
      text += center("Dusun Sukoyuwono Desa Palaan") + "\n";
      text += center("Kec. Ngajum Kab. Malang") + "\n";
      text += garis + "\n";
      text += `Nama   : ${pelanggan.nama || "-"}\n`;
      text += `Alamat : ${pelanggan.alamat || "-"}\n`;
      text += `Bulan  : ${tagihan.bulan || "-"}\n`;
      text += `Tahun  : ${tagihan.tahun || "-"}\n`;
      text += garis + "\n";

      text += `STAN ${tagihan.stanAwal} > ${tagihan.stanAkhir} = ${tagihan.jumlahPakai} m³\n`;

      // Format baris tarif seperti preview
      const baris = [];

      if (tagihan.jumlahPakai > 30)
        baris.push(
          `>30     3.000 x ${tagihan.lebih.toString().padEnd(2)} = ${Number(
            tagihan.hargaLebih
          ).toLocaleString("id-ID")}`
        );
      else baris.push(`>30     3.000 x    0`);

      if (tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31)
        baris.push(
          `21>30   2.000 x ${tagihan.lebih.toString().padEnd(2)} = ${Number(
            tagihan.hargaLebih
          ).toLocaleString("id-ID")}`
        );
      else baris.push(`21>30   2.000 x    0`);

      if (tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21)
        baris.push(
          `11>20   1.500 x ${tagihan.lebih.toString().padEnd(2)} = ${Number(
            tagihan.hargaLebih
          ).toLocaleString("id-ID")}`
        );
      else baris.push(`11>20   1.500 x    0`);

      baris.push(`Min 10m³        = 15.000`);
      baris.push(`Beban           =  5.000`);

      text += baris.join("\n") + "\n";
      text += garis + "\n";
      text += `Total : Rp ${Number(tagihan.jumlahTagihan).toLocaleString(
        "id-ID"
      )}\n`;
      text += garis + "\n";
      text += `Gunakan air bijak.\nBayar max tgl 28.\n3 bln nunggak=putus.\nBayar di Toko Zaenal.\n\n`;
      text += `Dicetak: ${tanggalCetak}\n\n\n`;

      // =============================
      // Kirim ke printer (split per 200 byte)
      // =============================
      const encoder = new TextEncoder();
      const bytes = encoder.encode(text);
      const chunkSize = 200;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        await characteristic.writeValue(chunk);
        await new Promise((r) => setTimeout(r, 100));
      }

      alert("✅ Struk berhasil dikirim ke printer!");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal mencetak: " + error.message);
    }
  };

  if (!tagihan) return <div>TAGIHAN TIDAK DITEMUKAN !!!</div>;

  const tanggalCetak = moment().format("DD MMMM YYYY HH.mm");

  const handleShowPreview = () => {
    const tanggalCetak = moment().format("DD MMMM YYYY HH.mm");
    const lebarStruk = 32; // lebar karakter, biar rata semua
    const garis = "=".repeat(lebarStruk);

    // Fungsi bantu untuk membuat teks rata tengah
    const center = (text) => {
      const pad = Math.floor((lebarStruk - text.length) / 2);
      return " ".repeat(pad > 0 ? pad : 0) + text;
    };

    let text = "";
    text += center("KPSPAMS BATHORO SURYO MAKMUR") + "\n";
    text += center("Dusun Sukoyuwono Desa Palaan") + "\n";
    text += center("Kec. Ngajum Kab. Malang") + "\n";
    text += garis + "\n";
    text += `Nama   : ${pelanggan.nama || "-"}\n`;
    text += `Alamat : ${pelanggan.alamat || "-"}\n`;
    text += `Bulan  : ${tagihan.bulan || "-"}\n`;
    text += `Tahun  : ${tagihan.tahun || "-"}\n`;
    text += garis + "\n";

    text += `STAN    ${tagihan.stanAwal}   > ${tagihan.stanAkhir} = ${tagihan.jumlahPakai} m³\n`;

    // Daftar baris tarif
    const baris = [];

    if (tagihan.jumlahPakai > 30)
      baris.push(
        `>30       3.000 x ${tagihan.lebih.toString().padEnd(2)} = ${Number(
          tagihan.hargaLebih
        ).toLocaleString("id-ID")}`
      );
    else baris.push(`>30     3.000  x    0`);

    if (tagihan.jumlahPakai > 20 && tagihan.jumlahPakai < 31)
      baris.push(
        `21>30    2.000 x ${tagihan.lebih.toString().padEnd(2)} = ${Number(
          tagihan.hargaLebih
        ).toLocaleString("id-ID")}`
      );
    else baris.push(`21>30    2.000 x    0`);

    if (tagihan.jumlahPakai > 10 && tagihan.jumlahPakai < 21)
      baris.push(
        `11>20    1.500 x${tagihan.lebih.toString().padEnd(2)} = ${Number(
          tagihan.hargaLebih
        ).toLocaleString("id-ID")}`
      );
    else baris.push(`11>20    1.500 x    0`);

    baris.push(`Min 10m³        = 15.000`);
    baris.push(`Beban           =  5.000`);

    text += baris.join("\n") + "\n";
    text += garis + "\n";
    text += `Total : Rp ${Number(tagihan.jumlahTagihan).toLocaleString(
      "id-ID"
    )}\n`;
    text += garis + "\n";
    text += `Gunakan air bijak.\nBayar max tgl 28.\n3 bln nunggak=putus.\nBayar di Toko Zaenal.\n\n`;
    text += `Dicetak: ${tanggalCetak}\n`;

    setPreviewText(text);
    setShowPreview(true);
  };

  return (
    <div>
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 w-[200px]">
            <h2 className="text-center font-bold mb-2 text-xs">
              Preview Struk Tagihan
            </h2>
            <hr />
            <pre
              className="mt-2"
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                lineHeight: "1.2",
                whiteSpace: "pre",
                textAlign: "left",
              }}
            >
              {previewText}
            </pre>

            <hr className="mt-2" />
            <div className="flex justify-between mt-3 text-xs">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cetak
              </button>
            </div>
          </div>
        </div>
      )}

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
              <span>= {tagihan.jumlahPakai} m³</span>

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
          className="flex items-center justify-center gap-2 w-100 bg-red-900 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          <FaFileImage />
          JPG
        </button>
        {/* <button
          onClick={handleDownloadPDF}
          className="bg-red-700 flex items-center justify-center w-100 gap-2 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          <FaFilePdf />
          PDF
        </button> */}
        <button
          onClick={handlePrint}
          className="bg-gray-700 flex items-center justify-center w-100 gap-2 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          <FaPrint />
          Cetak
        </button>
        <button
          onClick={handleShowPreview}
          className="bg-blue-700 flex items-center justify-center w-100 gap-2 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Preview
          <FaEye />
        </button>
      </div>
    </div>
  );
};

export default PrintPreviewScreen;
