"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Edit,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function AdminAnimeListPage() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchAnime = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/anime");
      const data = await res.json();
      setAnimeList(data.animeList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Hapus anime "${slug}" secara permanen?`)) return;

    try {
      const res = await fetch(`/api/admin/anime?slug=${slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: `Anime ${slug} berhasil dihapus!` });
        fetchAnime();
      } else {
        setNotification({ type: "error", message: data.error || "Gagal menghapus" });
      }
    } catch (e) {
      setNotification({ type: "error", message: "Gagal menghapus anime" });
    }
  };

  // Filter list
  const filteredList = animeList.filter((anime) => {
    const matchesSearch =
      anime.title.toLowerCase().includes(search.toLowerCase()) ||
      anime.slug.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      anime.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "custom" && anime.isCustom) ||
      (sourceFilter === "scraped" && !anime.isCustom);

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Film className="h-6 w-6 text-indigo-400" />
            Kelola Anime
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Daftar seluruh anime yang tersedia di WibuStream ({animeList.length} total anime)
          </p>
        </div>

        <Link
          href="/admin/anime/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Anime Baru
        </Link>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#121721] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari judul anime atau slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0D1117] px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed (Tamat)</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0D1117] px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Semua Sumber</option>
            <option value="custom">Custom (Admin)</option>
            <option value="scraped">Scraped (Otakudesu)</option>
          </select>
        </div>
      </div>

      {/* Anime Table */}
      <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-3 pl-2">Poster & Info</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Episode</th>
                <th className="pb-3">Tipe / Studio</th>
                <th className="pb-3 text-right pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredList.map((anime) => (
                <tr key={anime.slug} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
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
                          /anime/{anime.slug}
                        </span>
                        {anime.japaneseTitle && (
                          <span className="text-[10px] text-zinc-400 truncate block">
                            {anime.japaneseTitle}
                          </span>
                        )}
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
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/anime/${anime.slug}`}
                        target="_blank"
                        className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 hover:text-white transition-colors"
                        title="Lihat Halaman Publik"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(anime.slug)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Hapus Anime"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredList.length === 0 && !isLoading && (
            <div className="p-8 text-center text-xs text-zinc-400">
              Tidak ada anime yang sesuai dengan filter pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
