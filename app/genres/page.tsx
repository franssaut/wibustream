import Link from "next/link";
import { Sparkles, Layers } from "lucide-react";
import { getGenres } from "@/lib/scraper";

export const revalidate = 86400; // 24 hours

export const metadata = {
  title: "Daftar Genre Anime Lengkap - WibuStream",
  description: "Jelajahi anime subtitle Indonesia berdasarkan genre Action, Romance, Isekai, Fantasy, dll.",
};

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Daftar Genre Anime</h1>
          <p className="text-xs text-zinc-400">
            Pilih genre favoritmu untuk menemukan rekomendasi anime subtitle Indonesia terbaik
          </p>
        </div>
      </div>

      {/* Grid of Genres */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genres/${genre.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-[#121721] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white/5 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Layers className="h-4 w-4" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-zinc-200 capitalize group-hover:text-indigo-400 transition-colors">
              {genre.name}
            </h3>
            <span className="text-[11px] text-zinc-500 mt-1">Jelajahi →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
