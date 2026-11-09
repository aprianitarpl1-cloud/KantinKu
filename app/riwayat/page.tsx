"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

export default function RiwayatPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [riwayatList, setRiwayatList] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const savedRiwayat = localStorage.getItem("riwayat");
    if (savedRiwayat) {
      try {
        const parsed = JSON.parse(savedRiwayat);
        if (Array.isArray(parsed)) {
          setRiwayatList(parsed);
        }
      } catch (e) {
        console.error("Gagal memuat riwayat", e);
      }
    }
  }, []);

  // Fungsi untuk menghapus seluruh riwayat pesanan dengan konfirmasi
  const handleHapusRiwayat = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat pesanan?")) {
      localStorage.removeItem("riwayat");
      setRiwayatList([]);
    }
  };

  if (!isMounted) return null;

  const totalSemuaBelanja = riwayatList.reduce((acc, order) => acc + (order.total || 0), 0);

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900">Riwayat Pesanan</h1>
        
        {/* Tombol Hapus Riwayat (Bonus Langkah 9) */}
        {riwayatList.length > 0 && (
          <button
            onClick={handleHapusRiwayat}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-xl border border-red-100 hover:bg-red-50 transition-all"
          >
            Hapus Riwayat
          </button>
        )}
      </div>

      {riwayatList.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center space-y-3">
          <p className="text-slate-500 text-sm">Belum ada pesanan.</p>
          <Link
            href="/menu"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Mulai Belanja &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Ringkasan Pesanan & Total Belanja */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center text-xs font-medium text-slate-700">
            <span>
              Total: <strong className="text-slate-900">{riwayatList.length} pesanan</strong>
            </span>
            <span>
              Total Belanja: <strong className="text-pink-600">{rupiah(totalSemuaBelanja)}</strong>
            </span>
          </div>

          {/* Daftar Kotak Riwayat Pesanan */}
          <div className="space-y-3">
            {riwayatList.map((order, idx) => (
              <div key={order.id || idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{order.nama || "Pesanan"}</span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span className="text-slate-500">{order.tanggal || order.waktu}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-medium bg-pink-50 text-pink-700">
                    {order.deliveryType === "diantar" ? `Diantar (${order.kelas || ""})` : "Ambil Sendiri"}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.nama} x{item.jumlah}</span>
                      <span className="font-medium">{rupiah(item.subtotalItem || item.harga * item.jumlah)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-xs text-slate-900">
                  <span>Total Bayar</span>
                  <span className="text-pink-600">{rupiah(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}