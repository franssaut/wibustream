import Link from "next/link";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600/10 text-indigo-400 mb-6">
        <Film className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-black text-white sm:text-5xl">404</h1>
      <h2 className="mt-2 text-xl font-bold text-zinc-200">
        Halaman atau Anime Tidak Ditemukan
      </h2>
      <p className="mt-2 text-sm text-zinc-400 max-w-md">
        Episode atau judul anime yang Anda cari mungkin telah dipindahkan atau belum tersedia di database.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        >
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
