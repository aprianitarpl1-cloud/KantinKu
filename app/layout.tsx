import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "KantinKu",
    description: "Aplikasi Pemesanan Makanan Kantin Sekolah",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}