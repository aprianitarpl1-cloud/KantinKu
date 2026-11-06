"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [jumlahKeranjang, setJumlahKeranjang] = useState<number>(0);

  // Fungsi untuk menghitung total item di keranjang dari localStorage
  const hitungKeranjang = () => {
    try {
      const stored = localStorage.getItem("keranjang");
      if (stored) {
        const cart: { id: number; jumlah: number }[] = JSON.parse(stored);
        const total = cart.reduce((acc, item) => acc + item.jumlah, 0);
        setJumlahKeranjang(total);
      } else {
        setJumlahKeranjang(0);
      }
    } catch (e) {
      setJumlahKeranjang(0);
    }
  };

  useEffect(() => {
    // Hitung saat pertama kali dimuat
    hitungKeranjang();

    // Dengar event "keranjang-berubah" agar lencana di navbar langsung terupdate (Langkah 15)
    window.addEventListener("keranjang-berubah", hitungKeranjang);
    return () => {
      window.removeEventListener("keranjang-berubah", hitungKeranjang);
    };
  }, []);

  // Daftar menu navigasi
  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Favorit", href: "/favorit" },
    { name: "Keranjang", href: "/keranjang", badge: jumlahKeranjang },
    { name: "Riwayat", href: "/riwayat" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo KantinKu */}
        <Link href="/" className="text-xl font-bold text-pink-500">
          KantinKu
        </Link>

        {/* Menu Navigasi yang Dinamis */}
        <div className="flex gap-6 text-sm font-medium items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "text-gray-600 hover:text-pink-500"
                }`}
              >
                <span>{item.name}</span>
                
                {/* Lencana/Badge Keranjang (Langkah 15) */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}

                {/* Garis bawah pink aktif */}
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-pink-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}