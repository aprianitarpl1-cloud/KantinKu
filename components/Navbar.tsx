
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Suspense,
  useMemo,
  useSyncExternalStore,
} from "react";

const subscribeCart = (callback: () => void) => {
  window.addEventListener("keranjang-berubah", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("keranjang-berubah", callback);
    window.removeEventListener("storage", callback);
  };
};

const getCartSnapshot = () =>
  localStorage.getItem("keranjang") ?? "[]";

const getCartServerSnapshot = () => "[]";

type CartItem = {
  id: number;
  jumlah: number;
};

function NavbarContent() {
  const pathname = usePathname();

  const cartRaw = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const jumlahKeranjang = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(cartRaw);

      if (!Array.isArray(parsed)) return 0;

      const cart = parsed as CartItem[];

      return cart.reduce(
        (acc, item) =>
          acc +
          (typeof item.jumlah === "number"
            ? item.jumlah
            : 0),
        0
      );
    } catch {
      return 0;
    }
  }, [cartRaw]);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Favorit", href: "/favorit" },
    {
      name: "Keranjang",
      href: "/keranjang",
      badge: jumlahKeranjang,
    },
    { name: "Riwayat", href: "/riwayat" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-12">
        <Link
          href="/"
          className="text-xl font-bold text-pink-500"
        >
          KantinKu
        </Link>

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
                <div className="flex items-center gap-1.5">
                  {item.name === "Keranjang" &&
                    item.badge !== undefined &&
                    item.badge > 0 && (
                      <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                        {item.badge}
                      </span>
                    )}

                  <span>{item.name}</span>
                </div>

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

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <div className="h-14 bg-white border-b border-gray-100" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
