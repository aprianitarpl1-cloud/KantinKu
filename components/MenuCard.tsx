import Link from "next/link";
import { Menu } from "@/data/menu";

type MenuCardProps = {
  item: Menu;
  rupiah: (n: number) => string;
};

export default function MenuCard({ item, rupiah }: MenuCardProps) {
  const isHabis = item.stok === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col justify-between overflow-hidden p-5 text-center">
      <div>
        {/* Kategori */}
        <div className="mb-2 flex justify-center">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
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

      {/* Bagian Bawah: Stok & Tombol di Tengah */}
      <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-3">
        <span className={`text-xs font-medium ${isHabis ? "text-pink-500 font-bold" : "text-gray-500"}`}>
          {isHabis ? "Habis" : `Stok: ${item.stok}`}
        </span>

        {/* Tombol Pilih Menu di Tengah */}
        <Link
          href={`/menu/${item.id}`}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm block text-center ${
            isHabis
              ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
              : "bg-pink-500 hover:bg-pink-600 text-white active:scale-95"
          }`}
        >
          {isHabis ? "Habis" : "Pilih Menu"}
        </Link>
      </div>
    </div>
  );
}