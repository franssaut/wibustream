"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Trash2, Play, Star } from "lucide-react";

interface SavedAnime {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  rating?: string;
  status?: string;
  addedAt: number;
}

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<SavedAnime[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wibustream_bookmarks");
      if (raw) {
        setBookmarks(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(updated);
    localStorage.setItem("wibustream_bookmarks", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua bookmark?")) {
      setBookmarks([]);
      localStorage.removeItem("wibustream_bookmarks");
    }
  };

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-zinc-400">
        Memuat bookmark...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Bookmark Saya</h1>
            <p className="text-xs text-zinc-400">
              Daftar anime tersimpan yang ingin Anda tonton nanti ({bookmarks.length} anime)
            </p>
          </div>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Semua
          </button>
        )}
      </div>

      {/* Grid */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {bookmarks.map((anime) => (
            <div
              key={anime.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#121721] transition-all hover:border-indigo-500/40"
            >
              <Link href={`/anime/${anime.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anime.thumbnail}
                  alt={anime.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121721] via-transparent to-transparent opacity-80" />

                {anime.rating && (
                  <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-md">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {anime.rating}
                  </span>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  </div>
                </div>
              </Link>

              <div className="flex flex-1 flex-col justify-between p-3">
                <Link href={`/anime/${anime.slug}`}>
                  <h3 className="line-clamp-2 text-xs font-semibold text-zinc-200 hover:text-indigo-400">
                    {anime.title}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-zinc-500">Tersimpan</span>
                  <button
                    onClick={() => removeBookmark(anime.slug)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Hapus dari bookmark"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-12 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-bold text-white">Belum Ada Anime Tersimpan</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
            Klik tombol bookmark pada halaman detail anime untuk menyimpannya ke daftar tontonan Anda.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
          >
            Jelajahi Anime Sekarang
          </Link>
        </div>
      )}
    </div>
  );
}
