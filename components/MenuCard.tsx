"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "@/data/menu";

type MenuCardProps = {
  item: Menu;
  rupiah: (n: number) => string;
};

export default function MenuCard({ item, rupiah }: MenuCardProps) {
  const isHabis = item.stok === 0;
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    // Membaca status favorit dari localStorage
    const savedFav = localStorage.getItem("favorit");
    if (savedFav) {
      try {
        const favList: number[] = JSON.parse(savedFav);
        if (favList.includes(item.id)) {
          setIsFavorit(true);
        }
      } catch (e) {
        console.error("Gagal membaca favorit", e);
      }
    }
  }, [item.id]);

  const toggleFavorit = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah link pindah halaman saat tombol hati diklik
    const savedFav = localStorage.getItem("favorit");
    let favList: number[] = savedFav ? JSON.parse(savedFav) : [];

    if (isFavorit) {
      favList = favList.filter((favId) => favId !== item.id);
      setIsFavorit(false);
    } else {
      favList.push(item.id);
      setIsFavorit(true);
    }

    localStorage.setItem("favorit", JSON.stringify(favList));
  };

  return (
    <div 
      className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col justify-between overflow-hidden p-5 text-center relative ${
        isHabis 
          ? "bg-gray-100 opacity-70 grayscale-[30%]" 
          : "bg-white"
      }`}
    >
      
      {/* Tombol Favorit di Pojok Kanan Atas Kartu */}
      <button
        onClick={toggleFavorit}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-100 transition-all text-xs z-10"
        title={isFavorit ? "Hapus dari Favorit" : "Tambah ke Favorit"}
      >
        {isFavorit ? "❤️" : "🤍"}
      </button>

      <div>
        {/* Kategori */}
        <div className="mb-2 flex justify-center">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-200 text-gray-600">
            {item.kategori}
          </span>
        </div>

        {/* Nama Menu */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {item.nama}
        </h3>

        {/* Harga */}
        <p className="text-pink-500 font-bold text-lg mb-3">
          {rupiah(item.harga)}
        </p>
      </div>

      {/* Bagian Bawah: Stok & Tombol Aksi */}
      <div className="pt-3 border-t border-gray-200/60 flex flex-col items-center gap-3">
        <span className={`text-xs font-medium ${isHabis ? "text-pink-600 font-bold" : "text-gray-500"}`}>
          {isHabis ? "Habis" : `Stok: ${item.stok}`}
        </span>

        {/* Tombol Nonaktif jika Habis */}
        <Link
          href={`/menu/${item.id}`}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm block text-center ${
            isHabis
              ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none shadow-none"
              : "bg-pink-500 hover:bg-pink-600 text-white active:scale-95"
          }`}
          aria-disabled={isHabis}
          tabIndex={isHabis ? -1 : undefined}
        >
          {isHabis ? "Habis" : "Pilih Menu"}
        </Link>
      </div>
    </div>
  );
}