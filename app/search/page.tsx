import { Search, Film } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import { searchAnime } from "@/lib/scraper";

interface PageProps {
  searchParams: {
    q?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || "";
  const results = query ? await searchAnime(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              Hasil Pencarian: &ldquo;{query}&rdquo;
            </h1>
            <p className="text-xs text-zinc-400">
              Ditemukan {results.length} anime subtitle Indonesia
            </p>
          </div>
        </div>

        {/* Search input form */}
        <form method="GET" action="/search" className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari anime lainnya..."
              className="w-full rounded-xl border border-white/10 bg-[#121721] py-2.5 pl-10 pr-24 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-12 text-center">
          <Film className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-bold text-white">Tidak Ada Anime Ditemukan</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Coba periksa kembali ejaan kata kunci atau gunakan judul anime dalam Bahasa Inggris atau Jepang.
          </p>
        </div>
      )}
    </div>
  );
}
