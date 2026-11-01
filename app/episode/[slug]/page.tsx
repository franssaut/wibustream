import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, Film, Info, ArrowLeft } from "lucide-react";
import { getEpisodeStream, getAnimeDetail } from "@/lib/scraper";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeSelector from "@/components/EpisodeSelector";
import DownloadSection from "@/components/DownloadSection";

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 180;

export async function generateMetadata({ params }: PageProps) {
  const episode = await getEpisodeStream(params.slug);
  return {
    title: `Nonton ${episode.title} Subtitle Indonesia - WibuStream`,
    description: `Streaming & download gratis anime ${episode.title} sub indo full HD lengkap dengan server cepat.`,
  };
}

export default async function EpisodeStreamPage({ params }: PageProps) {
  const episode = await getEpisodeStream(params.slug);

  if (!episode || !episode.title) {
    notFound();
  }

  // Fetch parent anime detail for the full episode list & thumbnail
  const animeDetail = episode.animeSlug
    ? await getAnimeDetail(episode.animeSlug)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        {episode.animeSlug && (
          <>
            <Link href={`/anime/${episode.animeSlug}`} className="hover:text-white">
              {episode.animeTitle || "Anime"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          </>
        )}
        <span className="text-zinc-200 truncate max-w-xs">{episode.title}</span>
      </nav>

      {/* Episode Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {episode.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Subtitle Indonesia • Kualitas HD Resolusi 360p - 720p MP4
          </p>
        </div>

        {episode.animeSlug && (
          <Link
            href={`/anime/${episode.animeSlug}`}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/10 hover:text-white self-start md:self-auto"
          >
            <Info className="h-4 w-4 text-indigo-400" />
            Semua Info & Sinopsis
          </Link>
        )}
      </div>

      {/* Video Streaming Player */}
      <div className="space-y-4">
        <VideoPlayer
          streamUrl={episode.videoStreamUrl || episode.defaultStreamUrl}
          iframeSrc={episode.iframeSrc}
          servers={episode.servers}
          title={episode.title}
          animeTitle={episode.animeTitle}
          episodeNumber={episode.episodeNumber}
          prevEpisodeSlug={episode.prevEpisodeSlug}
          nextEpisodeSlug={episode.nextEpisodeSlug}
        />
      </div>

      {/* Two Column Layout: Downloads & Episodes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Download Links & Parent Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Download Options */}
          <DownloadSection
            downloads={episode.downloads}
            animeTitle={episode.animeTitle}
            episodeNumber={episode.episodeNumber}
          />

          {/* Anime Synopsis Snippet */}
          {animeDetail && (
            <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={animeDetail.thumbnail}
                    alt={animeDetail.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{animeDetail.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span className="text-amber-400">★ {animeDetail.rating}</span>
                    <span>•</span>
                    <span>{animeDetail.status}</span>
                    <span>•</span>
                    <span>{animeDetail.type}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                {animeDetail.synopsis}
              </p>
              <div className="mt-3">
                <Link
                  href={`/anime/${animeDetail.slug}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Baca sinopsis lengkap →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Other Episodes */}
        <div className="lg:col-span-1">
          <EpisodeSelector
            episodes={animeDetail ? animeDetail.episodes : episode.allEpisodes}
            currentEpisodeSlug={episode.slug}
            animeTitle={episode.animeTitle}
          />
        </div>
      </div>
    </div>
  );
}
