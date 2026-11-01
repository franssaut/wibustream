"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Play, Trash2, RotateCcw } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface HistoryItem {
  title: string;
  animeTitle: string;
  episodeNumber: string;
  timestamp: number;
  currentTime: number;
  duration: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wibustream_history");
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const removeHistoryItem = (title: string) => {
    const updated = history.filter((h) => h.title !== title);
    setHistory(updated);
    localStorage.setItem("wibustream_history", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm("Hapus semua riwayat tontonan?")) {
      setHistory([]);
      localStorage.removeItem("wibustream_history");
    }
  };

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-zinc-400">
        Memuat riwayat...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Riwayat Tontonan</h1>
            <p className="text-xs text-zinc-400">
              Lanjutkan tontonan anime terakhir Anda dengan mudah
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Riwayat
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item) => {
            const progress =
              item.duration > 0
                ? Math.min(Math.round((item.currentTime / item.duration) * 100), 100)
                : 0;
            // Generate episode slug from title or fallback
            const slug = item.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

            return (
              <div
                key={item.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#121721] p-4 transition-all hover:border-indigo-500/40"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ditonton sampai: {formatTime(item.currentTime)}
                    {item.duration > 0 && ` / ${formatTime(item.duration)}`} ({progress}%)
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full max-w-md rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/episode/${slug}`}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    Lanjutkan
                  </Link>

                  <button
                    onClick={() => removeHistoryItem(item.title)}
                    className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Hapus dari riwayat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-bold text-white">Belum Ada Riwayat Tontonan</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
            Episode yang Anda tonton akan otomatis tersimpan di sini sehingga Anda dapat melanjutkan kapan saja.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
          >
            Mulai Nonton Anime
          </Link>
        </div>
      )}
    </div>
  );
}
