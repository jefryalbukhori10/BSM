import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Pages
import SplashScreen from "../pages/SplashScreen";
import HomeScreen from "../pages/HomeScreen";
import BuatTagihanScreen from "../pages/BuatTagihanScreen";
import DaftarTagihanScreen from "../pages/DaftarTagihanScreen";
import HistoryTagihanScreen from "../pages/HistoryTagihanScreen";
import DaftarPelangganScreen from "../pages/DaftarPelangganScreen";
import TambahPelangganScreen from "../pages/TambahPelangganScreen";
import PrintPreviewScreen from "../pages/PrintPreviewScreen";
import BuatTagihanBulanLalu from "../pages/BuatTagihanBulanLalu";
import PrintPreviewTagihanBulahLalu from "../pages/PrintPreviewTagihanBulahLalu";
import DaftarTagihanBulanLalu from "../pages/DaftarTagihanBulanLalu";
import LoginScreen from "../screens/LoginScreen";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       { index: true, element: <HomeScreen /> },
//       { path: "buat-tagihan", element: <BuatTagihanScreen /> },
//       { path: "daftar-tagihan", element: <DaftarTagihanScreen /> },
//       { path: "history-tagihan", element: <HistoryTagihanScreen /> },
//       { path: "daftar-pelanggan", element: <DaftarPelangganScreen /> },
//       { path: "/tambah-pelanggan", element: <TambahPelangganScreen /> },
//       { path: "/print-preview", element: <PrintPreviewScreen /> },
//       { path: "/splash", element: <SplashScreen /> },
//     ],
//   },
// ]);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />, // tampilkan SplashScreen di root
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    element: <ProtectedRoute />, // hanya boleh diakses kalau login
    children: [
      {
        path: "/app",
        element: <MainLayout />,
        children: [
          { index: true, element: <HomeScreen /> }, // akan diakses di "/app"
          { path: "buat-tagihan", element: <BuatTagihanScreen /> },
          { path: "daftar-tagihan", element: <DaftarTagihanScreen /> },
          { path: "history-tagihan", element: <HistoryTagihanScreen /> },
          { path: "daftar-pelanggan", element: <DaftarPelangganScreen /> },
          { path: "tambah-pelanggan", element: <TambahPelangganScreen /> },
          { path: "print-preview", element: <PrintPreviewScreen /> },
          {
            path: "buat-tagihan-bulan-lalu",
            element: <BuatTagihanBulanLalu />,
          },
          {
            path: "print-preview-bulan-lalu",
            element: <PrintPreviewTagihanBulahLalu />,
          },
          {
            path: "daftar-tagihan-bulan-lalu",
            element: <DaftarTagihanBulanLalu />,
          },
        ],
      },
    ],
  },
  {
    path: "*", // menangkap semua route yang tidak cocok
    element: <NotFound />,
  },
]);
