
"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu } from "@/data/menu";

type MenuCardProps = {
  item: Menu;
  rupiah: (n: number) => string;
};

const subscribeFavorit = (callback: () => void) => {
  window.addEventListener("favorit-berubah", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("favorit-berubah", callback);
    window.removeEventListener("storage", callback);
  };
};

const getFavoritSnapshot = () =>
  localStorage.getItem("favorit") ?? "[]";

const getFavoritServerSnapshot = () => "[]";

export default function MenuCard({ item, rupiah }: MenuCardProps) {
  const isHabis = item.stok === 0;

  const favoritRaw = useSyncExternalStore(
    subscribeFavorit,
    getFavoritSnapshot,
    getFavoritServerSnapshot
  );

  let favoritIds: number[] = [];

  try {
    const parsed: unknown = JSON.parse(favoritRaw);

    if (Array.isArray(parsed)) {
      favoritIds = parsed.filter(
        (id): id is number => typeof id === "number"
      );
    }
  } catch {
    favoritIds = [];
  }

  const isFavorit = favoritIds.includes(item.id);

  const toggleFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let favList: number[];

    try {
      const parsed: unknown = JSON.parse(
        localStorage.getItem("favorit") ?? "[]"
      );

      favList = Array.isArray(parsed)
        ? parsed.filter(
            (id): id is number => typeof id === "number"
          )
        : [];
    } catch {
      favList = [];
    }

    const updatedFav = isFavorit
      ? favList.filter((favId) => favId !== item.id)
      : [...favList, item.id];

    localStorage.setItem(
      "favorit",
      JSON.stringify(updatedFav)
    );

    window.dispatchEvent(new Event("favorit-berubah"));
  };

  return (
    <div
      className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col justify-between overflow-hidden p-5 text-center relative ${
        isHabis
          ? "bg-gray-100 opacity-70 grayscale-[30%]"
          : "bg-white"
      }`}
    >
      <button
        onClick={toggleFavorit}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-100 transition-all text-xs z-10"
        title={
          isFavorit
            ? "Hapus dari Favorit"
            : "Tambah ke Favorit"
        }
        aria-label={
          isFavorit
            ? "Hapus dari Favorit"
            : "Tambah ke Favorit"
        }
      >
        {isFavorit ? "❤️" : "🤍"}
      </button>

      <div>
        <div className="mb-2 flex justify-center">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-200 text-gray-600">
            {item.kategori}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {item.nama}
        </h3>

        <p className="text-pink-500 font-bold text-lg mb-3">
          {rupiah(item.harga)}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-200/60 flex flex-col items-center gap-3">
        <span
          className={`text-xs font-medium ${
            isHabis
              ? "text-pink-600 font-bold"
              : "text-gray-500"
          }`}
        >
          {isHabis ? "Habis" : `Stok: ${item.stok}`}
        </span>

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
