"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

export default function FavoritPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [favoritIds, setFavoritIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const savedFav = localStorage.getItem("favorit");
    if (savedFav) {
      try {
        setFavoritIds(JSON.parse(savedFav));
      } catch (e) {
        console.error(e);
      }
    }

    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data menu dari server.");
        return res.json();
      })
      .then((data) => {
        setMenuList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Terjadi kesalahan.");
        setLoading(false);
      });
  }, []);

  if (!isMounted) return null;

  const favoriteMenus = menuList.filter((m) => favoritIds.includes(m.id));

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6 px-4">
      <h1 className="text-xl font-bold text-slate-900">Menu Favorit</h1>

      {loading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center text-slate-500 text-sm">
          Memuat...
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100 text-center text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {favoriteMenus.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center space-y-3">
              <p className="text-slate-500 text-sm">Belum ada menu favorit.</p>
              <Link
                href="/menu"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                Cari Menu &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {favoriteMenus.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
                      {item.kategori}
                    </span>
                    <h2 className="font-semibold text-slate-900 text-sm">{item.nama}</h2>
                    <p className="text-xs text-pink-500 font-bold">{rupiah(item.harga)}</p>
                  </div>
                  <Link
                    href={`/menu/${item.id}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded-xl transition-all"
                  >
                    Detail
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}