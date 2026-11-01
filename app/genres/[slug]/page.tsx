import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, Home } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import { getAnimeByGenre } from "@/lib/scraper";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export const revalidate = 180;

export async function generateMetadata({ params }: PageProps) {
  const genreTitle = params.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `Anime Genre ${genreTitle} Subtitle Indonesia - WibuStream`,
    description: `Nonton streaming anime bergenre ${genreTitle} subtitle Indonesia resolusi HD gratis.`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const data = await getAnimeByGenre(params.slug, page);

  const displayGenre =
    data.genreName ||
    params.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <Link href="/genres" className="hover:text-white">
          Genre
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <span className="text-zinc-200 capitalize">{displayGenre}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white capitalize">Genre: {displayGenre}</h1>
          <p className="text-xs text-zinc-400">
            Kumpulan anime dengan genre {displayGenre} subtitle Indonesia • Halaman {page}
          </p>
        </div>
      </div>

      {/* Grid */}
      {data.animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.animeList.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-12 text-center text-zinc-400">
          Belum ada anime untuk genre ini.
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 pt-6">
        {page > 1 ? (
          <Link
            href={`/genres/${params.slug}?page=${page - 1}`}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-600 cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </span>
        )}

        <span className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20">
          Halaman {page}
        </span>

        <Link
          href={`/genres/${params.slug}?page=${page + 1}`}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white"
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
