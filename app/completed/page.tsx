import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import { getCompletedAnime } from "@/lib/scraper";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export const revalidate = 180;

export const metadata = {
  title: "Anime Tamat (Completed) Subtitle Indonesia - WibuStream",
  description: "Daftar anime yang sudah tamat lengkap subtitle Indonesia full episode gratis.",
};

export default async function CompletedPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const data = await getCompletedAnime(page);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Anime Tamat (Completed)</h1>
            <p className="text-xs text-zinc-400">
              Koleksi anime yang sudah selesai tayang lengkap episode 1 sampai tamat • Halaman {page}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.animeList.map((anime) => (
          <AnimeCard key={anime.slug} anime={anime} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 pt-6">
        {page > 1 ? (
          <Link
            href={`/completed?page=${page - 1}`}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-600 cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </span>
        )}

        <span className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20">
          Halaman {page}
        </span>

        <Link
          href={`/completed?page=${page + 1}`}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white"
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
