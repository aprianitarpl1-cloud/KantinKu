
"use client";

import { Suspense, useState, use } from "react";
import { menu as daftarMenu, rupiah } from "@/data/menu";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

type CartItem = {
  id: number;
  jumlah: number;
};

export default function DetailMenu({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-500">
            Memuat menu...
          </p>
        </main>
      }
    >
      <DetailMenuContent params={params} />
    </Suspense>
  );
}

function DetailMenuContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const menuId = parseInt(resolvedParams.id, 10);

  const item = daftarMenu.find((m) => m.id === menuId);

  if (!item) {
    notFound();
  }

  const isHabis = item.stok === 0;

  const [jumlah, setJumlah] = useState<number>(1);
  const [pesanNotif, setPesanNotif] = useState<string>("");

  const handleJumlahChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseInt(e.target.value, 10);

    if (isNaN(val) || val < 1) {
      setJumlah(1);
    } else if (val > item.stok) {
      setJumlah(item.stok);
      setPesanNotif(
        `Jumlah tidak boleh melebihi stok (${item.stok}).`
      );
      setTimeout(() => setPesanNotif(""), 3000);
    } else {
      setJumlah(val);
      setPesanNotif("");
    }
  };

  const increment = () => {
    if (jumlah < item.stok) {
      setJumlah(jumlah + 1);
      setPesanNotif("");
    } else {
      setPesanNotif(
        `Jumlah maksimal mencapai stok (${item.stok}).`
      );
      setTimeout(() => setPesanNotif(""), 3000);
    }
  };

  const decrement = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
      setPesanNotif("");
    }
  };

  const handleTambahKeranjang = () => {
    try {
      const storedCart = localStorage.getItem("keranjang");

      const cart: CartItem[] = storedCart
        ? JSON.parse(storedCart)
        : [];

      const existingIndex = cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      let totalBaru = jumlah;

      if (existingIndex > -1) {
        totalBaru = cart[existingIndex].jumlah + jumlah;
      }

      if (totalBaru > item.stok) {
        const sisaBisaDitambah =
          item.stok -
          (existingIndex > -1
            ? cart[existingIndex].jumlah
            : 0);

        setPesanNotif(
          sisaBisaDitambah > 0
            ? `Gagal! Anda sudah punya ${cart[existingIndex].jumlah} di keranjang. Maksimal tambah ${sisaBisaDitambah} lagi.`
            : `Stok di keranjang sudah mencapai batas maksimal (${item.stok}).`
        );

        return;
      }

      if (existingIndex > -1) {
        cart[existingIndex].jumlah = totalBaru;
      } else {
        cart.push({
          id: item.id,
          jumlah: jumlah,
        });
      }

      localStorage.setItem("keranjang", JSON.stringify(cart));

      window.dispatchEvent(new Event("keranjang-berubah"));

      setPesanNotif("Ditambahkan ke keranjang.");
      setTimeout(() => setPesanNotif(""), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="mb-6">
          <Link
            href="/menu"
            className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors"
          >
            ← Kembali ke Katalog
          </Link>
        </div>

        <div className="mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
            {item.kategori}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {item.nama}
        </h1>

        <p className="text-pink-500 font-bold text-xl mb-4">
          {rupiah(item.harga * jumlah)}
        </p>

        {isHabis ? (
          <div className="bg-pink-50 border border-pink-100 text-pink-600 px-4 py-3 rounded-xl text-sm font-medium mb-6 text-center">
            Menu ini habis.
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">
                Stok Tersedia
              </span>
              <span className="text-sm font-bold text-gray-700">
                {item.stok} porsi
              </span>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Atur Jumlah Pesanan:
              </label>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={decrement}
                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm transition-colors"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={item.stok}
                    value={jumlah}
                    onChange={handleJumlahChange}
                    className="w-12 text-center text-sm font-semibold text-gray-800 focus:outline-none"
                  />

                  <button
                    onClick={increment}
                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-gray-500">
                  Maks: {item.stok}
                </span>
              </div>
            </div>

            {pesanNotif && (
              <div
                className={`mb-4 text-xs font-semibold p-3 rounded-xl border text-center ${
                  pesanNotif.includes("Gagal") ||
                  pesanNotif.includes("maksimal") ||
                  pesanNotif.includes("melebihi")
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-pink-50 text-pink-600 border-pink-100 animate-pulse"
                }`}
              >
                {pesanNotif}
              </div>
            )}

            <button
              onClick={handleTambahKeranjang}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-sm bg-pink-500 hover:bg-pink-600 text-white active:scale-95"
            >
              Tambah ke keranjang
            </button>
          </>
        )}
      </div>
    </main>
  );
}
