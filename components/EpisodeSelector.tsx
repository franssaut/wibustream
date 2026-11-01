"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ArrowUpDown, Search, Film } from "lucide-react";

interface Episode {
  title: string;
  slug: string;
  episodeNumber?: string;
  date?: string;
}

interface EpisodeSelectorProps {
  episodes: Episode[];
  currentEpisodeSlug?: string;
  animeTitle?: string;
}

export default function EpisodeSelector({
  episodes,
  currentEpisodeSlug,
  animeTitle,
}: EpisodeSelectorProps) {
  const [search, setSearch] = useState("");
  const [isDesc, setIsDesc] = useState(true);

  if (!episodes || episodes.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#121721] p-6 text-center text-zinc-400">
        Belum ada episode yang tersedia.
      </div>
    );
  }

  // Filter episodes
  const filteredEpisodes = episodes.filter((ep) => {
    const q = search.toLowerCase();
    return (
      ep.title.toLowerCase().includes(q) ||
      ep.slug.toLowerCase().includes(q) ||
      (ep.episodeNumber && ep.episodeNumber.includes(q))
    );
  });

  const sortedEpisodes = [...filteredEpisodes].sort((a, b) => {
    const numA = parseInt(a.episodeNumber || "0", 10);
    const numB = parseInt(b.episodeNumber || "0", 10);
    return isDesc ? numB - numA : numA - numB;
  });

  return (
    <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Daftar Episode</h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-zinc-300">
            {episodes.length} Eps
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Episode */}
          <div className="relative flex-1 sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari eps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setIsDesc(!isDesc)}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
            title="Ubah urutan"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>{isDesc ? "Terbaru" : "Terlama"}</span>
          </button>
        </div>
      </div>

      {/* Grid of Episodes */}
      <div className="mt-4 max-h-[480px] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {sortedEpisodes.map((ep) => {
            const isActive = ep.slug === currentEpisodeSlug;
            return (
              <Link
                key={ep.slug}
                href={`/episode/${ep.slug}`}
                className={`group flex flex-col justify-between rounded-xl p-3 border transition-all ${
                  isActive
                    ? "border-indigo-500 bg-indigo-600/20 text-white shadow-lg shadow-indigo-500/20"
                    : "border-white/5 bg-white/5 text-zinc-300 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isActive ? "text-indigo-400" : "text-zinc-200 group-hover:text-indigo-300"
                    }`}
                  >
                    {ep.episodeNumber ? `Eps ${ep.episodeNumber}` : "Episode"}
                  </span>
                  <Play
                    className={`h-3 w-3 ${
                      isActive
                        ? "fill-indigo-400 text-indigo-400"
                        : "text-zinc-500 group-hover:text-indigo-400"
                    }`}
                  />
                </div>
                <div className="text-[11px] truncate text-zinc-400" title={ep.title}>
                  {ep.title}
                </div>
                {ep.date && (
                  <span className="text-[10px] text-zinc-500 mt-1">{ep.date}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
