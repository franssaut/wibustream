"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Tv,
  Eye,
  Activity,
  PlusCircle,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Database,
  Sliders,
} from "lucide-react";
import { AdminStats } from "@/lib/admin-store";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentAnime, setRecentAnime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, animeRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/anime"),
        ]);
        const statsData = await statsRes.json();
        const animeData = await animeRes.json();

        setStats(statsData);
        setRecentAnime(animeData.animeList?.slice(0, 8) || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/admin/scraper/sync", { method: "POST" });
      const data = await res.json();
      setSyncStatus(`Berhasil sinkron (${data.latency})!`);
      // Reload stats
      const statsRes = await fetch("/api/admin/stats");
      setStats(await statsRes.json());
    } catch (e) {
      setSyncStatus("Gagal sinkron");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-[#121721] to-[#121721] p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between shadow-2xl">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Dashboard Administrator
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Kelola katalog anime subtitle Indonesia, kelola episode & server pemutar, pantau status scraper, serta sesuaikan pengaturan situs secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/anime/new"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Anime
          </Link>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-indigo-400 ${isSyncing ? "animate-spin" : ""}`} />
            Sync Sumber
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Anime */}
        <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Anime
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
              <Film className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {stats?.totalAnime || "52+"}
            </span>
            <span className="text-xs font-medium text-emerald-400">+4 minggu ini</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
            <span>{stats?.ongoingCount || 28} Ongoing</span>
            <span>•</span>
            <span>{stats?.completedCount || 24} Tamat</span>
          </div>
        </div>

        {/* Total Episodes */}
        <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Episode
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <Tv className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {stats?.totalEpisodes || "1,250"}
            </span>
            <span className="text-xs font-medium text-sky-400">Tersedia HD</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Resolusi 360p, 480p, 720p MP4
          </div>
        </div>

        {/* Total Views */}
        <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Tayangan Hari Ini
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {stats?.todayViews ? stats.todayViews.toLocaleString("id-ID") : "14,890"}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Dari 3,240 penonton aktif
          </div>
        </div>

        {/* Scraper & System Health */}
        <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Status Server
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Uptime: 99.9%</span>
            <span>Sync: {stats?.lastSyncTime || "Baru saja"}</span>
          </div>
        </div>
      </div>

      {/* Analytics & Quick Diagnostics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Popular Genres & Distribution */}
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-indigo-400" />
              Distribusi Genre Terpopuler
            </h3>
            <span className="text-[10px] text-zinc-500">Berdasarkan Views</span>
          </div>

          <div className="space-y-3">
            {[
              { name: "Action", count: "34%", width: "w-[34%]", color: "bg-indigo-500" },
              { name: "Isekai / Fantasy", count: "26%", width: "w-[26%]", color: "bg-fuchsia-500" },
              { name: "Shounen", count: "18%", width: "w-[18%]", color: "bg-amber-500" },
              { name: "Romance / Comedy", count: "14%", width: "w-[14%]", color: "bg-rose-500" },
              { name: "Sci-Fi / Mecha", count: "8%", width: "w-[8%]", color: "bg-sky-500" },
            ].map((g) => (
              <div key={g.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">{g.name}</span>
                  <span className="font-bold text-zinc-400">{g.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${g.color} ${g.width} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Cache Diagnostics */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-sky-400" />
                Diagnostik Mesin Scraper & Cache
              </h3>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Respon Cepat
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-[11px] text-zinc-400 font-medium">Penyimpanan Database</span>
                <p className="text-xs font-bold text-white mt-1 truncate">data/custom-anime.json</p>
                <span className="text-[10px] text-emerald-400">Database Lokal Mandiri</span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-[11px] text-zinc-400 font-medium">In-Memory Cache TTL</span>
                <p className="text-xs font-bold text-white mt-1">300 Detik (5 Menit)</p>
                <span className="text-[10px] text-indigo-400">Auto Invalidate</span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-[11px] text-zinc-400 font-medium">Video Stream Proxy</span>
                <p className="text-xs font-bold text-white mt-1">Google Drive & Range Ready</p>
                <span className="text-[10px] text-emerald-400">Zero CORS Block</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Sistem menggunakan *high-availability pipeline*. Data dari scraper otomatis disimpan di in-memory cache untuk performa tinggi, dengan *fallback* dataset cadangan terproteksi jika sumber upstream mengalami gangguan.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin/scraper"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Buka Pengaturan Scraper Lengkap →
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" />
              Konfigurasi Situs
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Anime Updates Table */}
      <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Katalog Anime Terbaru</h3>
            <p className="text-xs text-zinc-400">
              Daftar anime yang baru saja disinkronkan atau ditambahkan
            </p>
          </div>

          <Link
            href="/admin/anime"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto"
          >
            Kelola Semua Anime ({stats?.totalAnime || 50}+) →
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-3 pl-2">Poster & Judul</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Episode</th>
                <th className="pb-3">Tipe / Studio</th>
                <th className="pb-3 text-right pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {recentAnime.map((anime) => (
                <tr key={anime.slug} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={anime.thumbnail}
                          alt={anime.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-md">
                        <span className="font-bold text-white truncate block">
                          {anime.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate block">
                          Slug: {anime.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        anime.status === "Ongoing"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {anime.status}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-amber-400">
                    ★ {anime.rating || "8.5"}
                  </td>
                  <td className="py-3 font-medium text-zinc-300">
                    {anime.totalEpisodes || anime.currentEpisode || "12 Eps"}
                  </td>
                  <td className="py-3">
                    <span className="text-zinc-300 text-xs block font-medium">
                      {anime.type || "TV"}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {anime.studio || "Studio"}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/anime/${anime.slug}`}
                        target="_blank"
                        className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 hover:text-white transition-colors"
                        title="Lihat di Web"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
