import Link from "next/link";
import { menu as daftarMenu } from "@/data/menu";

export default function Beranda() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center">
        {/* Judul & Kalimat Ajakan dengan Warna Pink Polos */}
        <div className="bg-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-lg mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Selamat Datang di KantinKu! 
          </h1>
          <p className="text-pink-100 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Nikmati berbagai pilihan makanan dan minuman lezat langsung dari kantin sekolah dengan cepat, praktis, dan tanpa antre lama.
          </p>

          {/* Tombol Menuju /menu */}
          <Link
            href="/menu"
            className="inline-block bg-white text-pink-600 font-bold px-8 py-3.5 rounded-full shadow-md hover:bg-pink-50 transition-all duration-200 active:scale-95"
          >
            Lihat Daftar Menu 
          </Link>
        </div>

        {/* Informasi Singkat */}
        <div className="text-gray-500 text-sm">
          Tersedia <span className="font-semibold text-gray-700">{daftarMenu.length} menu pilihan</span> hari ini • Buka pukul 07.00 - 15.00
        </div>
      </div>
    </main>
  );
}