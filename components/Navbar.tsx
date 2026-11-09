"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [jumlahKeranjang, setJumlahKeranjang] = useState<number>(0);

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
    hitungKeranjang();
    window.addEventListener("keranjang-berubah", hitungKeranjang);
    return () => {
      window.removeEventListener("keranjang-berubah", hitungKeranjang);
    };
  }, []);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Favorit", href: "/favorit" },
    { name: "Keranjang", href: "/keranjang", badge: jumlahKeranjang },
    { name: "Riwayat", href: "/riwayat" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      {/* Menggunakan gap yang rapi agar logo dan menu berdekatan di sebelah kiri */}
      <div className="max-w-6xl mx-auto flex items-center gap-12">
        {/* Logo KantinKu */}
        <Link href="/" className="text-xl font-bold text-pink-500">
          KantinKu
        </Link>

        {/* Menu Navigasi (Bergeser ke kiri mengikuti logo) */}
        <div className="flex gap-6 text-sm font-medium items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 transition-colors flex items-center ${
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "text-gray-600 hover:text-pink-500"
                }`}
              >
                {/* Badge di sebelah kiri tulisan Keranjang */}
                <div className="flex items-center gap-1.5">
                  {item.name === "Keranjang" && item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                      {item.badge}
                    </span>
                  )}
                  <span>{item.name}</span>
                </div>

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