import Link from "next/link";
import { Play, Star, Calendar } from "lucide-react";
import { AnimeCard as AnimeCardType } from "@/types/anime";

interface AnimeCardProps {
  anime: AnimeCardType;
  priority?: boolean;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#121721] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.thumbnail || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"}
          alt={anime.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121721] via-transparent to-black/40 opacity-70 transition-opacity group-hover:opacity-90" />

        {/* Top Badges */}
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between gap-1.5">
          {anime.currentEpisode ? (
            <span className="rounded-lg bg-indigo-600/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
              {anime.currentEpisode}
            </span>
          ) : (
            <span className="rounded-lg bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
              Sub Indo
            </span>
          )}

          {anime.rating && anime.rating !== "0" && anime.rating !== "" ? (
            <span className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-md border border-amber-500/20">
              <Star className="h-3 w-3 fill-amber-400" />
              {anime.rating}
            </span>
          ) : anime.releaseDay ? (
            <span className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-md border border-white/10">
              <Calendar className="h-3 w-3 text-sky-400" />
              {anime.releaseDay}
            </span>
          ) : null}
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/50 transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Release Date badge on bottom right of poster */}
        {anime.releaseDate && (
          <div className="absolute bottom-2 left-2.5 text-[10px] font-medium text-zinc-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
            {anime.releaseDate}
          </div>
        )}
      </div>

      {/* Title & Info */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-200 transition-colors group-hover:text-indigo-400">
          {anime.title}
        </h3>
        {anime.genres && anime.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
