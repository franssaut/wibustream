"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Info, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AnimeCard } from "@/types/anime";

interface HeroBannerProps {
  featured: AnimeCard[];
}

export default function HeroBanner({ featured }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!featured || featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured]);

  if (!featured || featured.length === 0) return null;

  const currentAnime = featured[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#121721] shadow-2xl">
      {/* Background Backdrop Image */}
      <div className="relative h-[380px] sm:h-[450px] lg:h-[500px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentAnime.thumbnail}
          alt={currentAnime.title}
          className="h-full w-full object-cover object-center filter brightness-[0.4] transition-all duration-700 scale-105"
        />

        {/* Gradient Overlays for Cinematic Feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />

        {/* Content Details */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              TRENDING SUB INDO
            </span>

            {currentAnime.rating && (
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {currentAnime.rating}
              </span>
            )}

            {currentAnime.currentEpisode && (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-200 backdrop-blur-md">
                {currentAnime.currentEpisode}
              </span>
            )}

            {currentAnime.releaseDay && (
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/30">
                Setiap {currentAnime.releaseDay}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white line-clamp-2 leading-tight">
            {currentAnime.title}
          </h1>

          {/* Subtitle / Genres */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-300">
            {currentAnime.genres?.map((genre) => (
              <span
                key={genre}
                className="rounded-md bg-white/10 px-2 py-0.5 font-medium text-zinc-300"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/anime/${currentAnime.slug}`}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-105"
            >
              <Play className="h-4 w-4 fill-white" />
              Nonton Sekarang
            </Link>

            <Link
              href={`/anime/${currentAnime.slug}`}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-md transition-all hover:bg-white/10"
            >
              <Info className="h-4 w-4" />
              Detail Anime
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators & Arrows */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
          <button
            onClick={handlePrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1.5 px-1">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-6 bg-indigo-500" : "w-2 bg-white/30"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
