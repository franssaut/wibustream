import Link from "next/link";
import { Film, Heart, ShieldAlert, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080B10] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-500 text-white">
                <Film className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Wibu<span className="text-indigo-400">Stream</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-md">
              Platform streaming anime subtitle Indonesia gratis dan terlengkap dengan kualitas HD tanpa ribet. Tonton anime kesayanganmu kapan saja dan di mana saja.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
              <span>
                Platform streaming anime mandiri. Semua konten video dikelola langsung melalui Admin Dashboard dan layanan penyimpanan cloud seperti Google Drive.
              </span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/ongoing" className="transition-colors hover:text-white">
                  Anime Ongoing
                </Link>
              </li>
              <li>
                <Link href="/completed" className="transition-colors hover:text-white">
                  Anime Tamat
                </Link>
              </li>
              <li>
                <Link href="/jadwal" className="transition-colors hover:text-white">
                  Jadwal Rilis
                </Link>
              </li>
              <li>
                <Link href="/genres" className="transition-colors hover:text-white">
                  Daftar Genre
                </Link>
              </li>
            </ul>
          </div>

          {/* Genre Populer */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Genre Populer
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {["action", "isekai", "fantasy", "romance", "comedy", "shounen", "adventure"].map((g) => (
                <Link
                  key={g}
                  href={`/genres/${g}`}
                  className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-xs capitalize text-zinc-300 transition-colors hover:border-indigo-500/50 hover:bg-indigo-600/20 hover:text-white"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-zinc-500 sm:flex-row">
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> untuk Komunitas Pecinta Anime Indonesia.
          </p>
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} WibuStream. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
