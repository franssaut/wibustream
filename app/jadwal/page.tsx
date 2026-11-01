"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Star, Play } from "lucide-react";
import { MOCK_SCHEDULE } from "@/lib/mock-data";

export default function JadwalPage() {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const today = dayNames[new Date().getDay()];

  const [activeDay, setActiveDay] = useState<string>(today);

  const currentSchedule = MOCK_SCHEDULE.find((s) => s.day === activeDay) || MOCK_SCHEDULE[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Jadwal Rilis Anime</h1>
          <p className="text-xs text-zinc-400">
            Jadwal penayangan episode anime subtitle Indonesia setiap minggunya
          </p>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const isToday = day === today;
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "border border-white/10 bg-[#121721] text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className="rounded-full bg-rose-500/90 px-1.5 py-0.2 text-[9px] font-extrabold text-white">
                  HARI INI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Anime List for Active Day */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Tayang Hari {activeDay}</span>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            {currentSchedule.animeList.length} Anime
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSchedule.animeList.map((anime) => (
            <Link
              key={anime.slug}
              href={`/anime/${anime.slug}`}
              className="group flex gap-4 rounded-2xl border border-white/5 bg-[#121721] p-3.5 transition-all hover:border-indigo-500/40 hover:bg-white/5 hover:shadow-xl"
            >
              <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anime.thumbnail}
                  alt={anime.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <h3 className="line-clamp-2 text-sm font-bold text-zinc-200 group-hover:text-indigo-400">
                    {anime.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-indigo-600/20 px-2 py-0.5 font-bold text-indigo-400">
                      {anime.currentEpisode}
                    </span>
                    {anime.rating && (
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {anime.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <Play className="h-3.5 w-3.5 fill-indigo-400" />
                  Lihat Episode
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
