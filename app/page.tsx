import Link from "next/link";
import { Flame, CheckCircle2, Calendar, Sparkles, ChevronRight } from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import AnimeCard from "@/components/AnimeCard";
import { getHomeData, getSchedule, getGenres } from "@/lib/scraper";

export const revalidate = 180; // ISR 3 minutes

export default async function HomePage() {
  const homeData = await getHomeData();
  const schedule = await getSchedule();
  const genres = await getGenres();

  // Pick current day name in Indonesian
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = dayNames[new Date().getDay()];
  const todaySchedule = schedule.find((s) => s.day === currentDayName) || schedule[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-12">
      {/* Hero Banner Carousel */}
      <HeroBanner featured={homeData.featured} />

      {/* Ongoing Anime (Episode Terbaru) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Episode Terbaru (Ongoing)
              </h2>
              <p className="text-xs text-zinc-400">Update anime subtitle Indonesia hari ini</p>
            </div>
          </div>

          <Link
            href="/ongoing"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {homeData.ongoing.slice(0, 12).map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      </section>

      {/* Completed Anime (Anime Tamat) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Anime Tamat (Completed)
              </h2>
              <p className="text-xs text-zinc-400">Rekomendasi anime full episode kualitas HD</p>
            </div>
          </div>

          <Link
            href="/completed"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {homeData.completed.slice(0, 12).map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      </section>

      {/* Jadwal Rilis Preview & Genre Exploration */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Schedule Card */}
        <div className="lg:col-span-1 rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-400" />
              <h3 className="font-bold text-white">Jadwal Rilis {todaySchedule.day}</h3>
            </div>
            <Link
              href="/jadwal"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Semua Jadwal
            </Link>
          </div>

          <div className="space-y-3">
            {todaySchedule.animeList.map((anime) => (
              <Link
                key={anime.slug}
                href={`/anime/${anime.slug}`}
                className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
              >
                <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={anime.thumbnail}
                    alt={anime.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-bold text-zinc-200 group-hover:text-indigo-400">
                    {anime.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                    <span className="text-indigo-400 font-semibold">{anime.currentEpisode}</span>
                    {anime.rating && <span className="text-amber-400">★ {anime.rating}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Explore Genres Card */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fuchsia-400" />
                <h3 className="font-bold text-white">Jelajahi Berdasarkan Genre</h3>
              </div>
              <Link
                href="/genres"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Lihat 35+ Genre
              </Link>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Temukan anime favoritmu mulai dari Action yang mendebarkan, Romance yang manis, Isekai fantasi, hingga Sci-Fi futuristik.
            </p>

            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 24).map((g) => (
                <Link
                  key={g.slug}
                  href={`/genres/${g.slug}`}
                  className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-indigo-500/40 hover:bg-indigo-600/20 hover:text-white hover:scale-105"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
            <span>Update subtitle Indonesia otomatis setiap rilis</span>
            <Link
              href="/genres"
              className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Katalog Lengkap
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
