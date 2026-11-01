import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Play,
  Calendar,
  Clock,
  Tv,
  Building2,
  Share2,
  Sparkles,
  ChevronRight,
  Home,
} from "lucide-react";
import { getAnimeDetail } from "@/lib/scraper";
import EpisodeSelector from "@/components/EpisodeSelector";
import BookmarkButton from "@/components/BookmarkButton";

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 180;

export async function generateMetadata({ params }: PageProps) {
  const anime = await getAnimeDetail(params.slug);
  return {
    title: `${anime.title} Subtitle Indonesia - WibuStream`,
    description: anime.synopsis?.slice(0, 160) || `Streaming anime ${anime.title} sub indo gratis HD.`,
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const anime = await getAnimeDetail(params.slug);

  if (!anime || !anime.title) {
    notFound();
  }

  const firstEpisode = anime.episodes[anime.episodes.length - 1];
  const latestEpisode = anime.episodes[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <Link
          href={anime.status === "Completed" ? "/completed" : "/ongoing"}
          className="hover:text-white"
        >
          {anime.status === "Completed" ? "Tamat" : "Ongoing"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <span className="text-zinc-200 truncate max-w-xs">{anime.title}</span>
      </nav>

      {/* Hero Header Backdrop & Info */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121721] p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Subtle Backdrop Image */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anime.thumbnail}
            alt={anime.title}
            className="h-full w-full object-cover opacity-15 filter blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121721] via-[#121721]/80 to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="mx-auto md:mx-0 w-48 sm:w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="relative aspect-[3/4] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anime.thumbnail}
                alt={anime.title}
                className="h-full w-full object-cover"
              />
              {anime.status && (
                <div className="absolute top-2.5 left-2.5 rounded-lg bg-indigo-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                  {anime.status}
                </div>
              )}
            </div>
          </div>

          {/* Details & Synopsis */}
          <div className="flex-1 space-y-4">
            {/* Title & Japanese */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {anime.title}
              </h1>
              {anime.japaneseTitle && (
                <p className="mt-1 text-sm font-medium text-zinc-400">
                  {anime.japaneseTitle}
                </p>
              )}
            </div>

            {/* Quick Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {anime.rating && (
                <span className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 font-bold text-amber-400 border border-amber-500/20">
                  <Star className="h-4 w-4 fill-amber-400" />
                  Skor {anime.rating}
                </span>
              )}

              {anime.type && (
                <span className="flex items-center gap-1 rounded-xl bg-white/5 px-3 py-1.5 font-medium text-zinc-300 border border-white/5">
                  <Tv className="h-3.5 w-3.5 text-indigo-400" />
                  {anime.type}
                </span>
              )}

              {anime.duration && (
                <span className="flex items-center gap-1 rounded-xl bg-white/5 px-3 py-1.5 font-medium text-zinc-300 border border-white/5">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  {anime.duration}
                </span>
              )}

              {anime.studio && (
                <span className="flex items-center gap-1 rounded-xl bg-white/5 px-3 py-1.5 font-medium text-zinc-300 border border-white/5">
                  <Building2 className="h-3.5 w-3.5 text-fuchsia-400" />
                  {anime.studio}
                </span>
              )}

              {anime.releaseDate && (
                <span className="flex items-center gap-1 rounded-xl bg-white/5 px-3 py-1.5 font-medium text-zinc-300 border border-white/5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  {anime.releaseDate}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {anime.genres.map((g) => (
                <Link
                  key={g.slug}
                  href={`/genres/${g.slug}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-indigo-500/50 hover:bg-indigo-600/20 hover:text-white"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Sinopsis
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300/90 whitespace-pre-line">
                {anime.synopsis}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {latestEpisode && (
                <Link
                  href={`/episode/${latestEpisode.slug}`}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Putar Episode Terbaru
                </Link>
              )}

              {firstEpisode && firstEpisode.slug !== latestEpisode?.slug && (
                <Link
                  href={`/episode/${firstEpisode.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10 hover:text-white"
                >
                  Episode 1
                </Link>
              )}

              <BookmarkButton
                anime={{
                  id: anime.id,
                  title: anime.title,
                  slug: anime.slug,
                  thumbnail: anime.thumbnail,
                  rating: anime.rating,
                  status: anime.status,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <section className="space-y-4">
        <EpisodeSelector episodes={anime.episodes} animeTitle={anime.title} />
      </section>
    </div>
  );
}
