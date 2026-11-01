"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tv,
  PlusCircle,
  Play,
  Film,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Sparkles,
} from "lucide-react";
import { parseGoogleDriveUrl } from "@/lib/utils";

export default function AdminEpisodesPage() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [selectedAnimeSlug, setSelectedAnimeSlug] = useState<string>("");
  const [selectedAnimeDetail, setSelectedAnimeDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New episode form state
  const [epNumber, setEpNumber] = useState("");
  const [epTitle, setEpTitle] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadAnime() {
      try {
        const res = await fetch("/api/admin/anime");
        const data = await res.json();
        setAnimeList(data.animeList || []);
        if (data.animeList && data.animeList.length > 0) {
          setSelectedAnimeSlug(data.animeList[0].slug);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnime();
  }, []);

  // Fetch detail of selected anime
  useEffect(() => {
    if (!selectedAnimeSlug) return;
    async function loadDetail() {
      try {
        const res = await fetch(`/api/anime/detail/${selectedAnimeSlug}`);
        const data = await res.json();
        setSelectedAnimeDetail(data);

        // Auto pre-fill next episode number
        const nextNum = (data.episodes?.length || 0) + 1;
        setEpNumber(nextNum.toString());
        setEpTitle(`Episode ${nextNum} Subtitle Indonesia`);
      } catch (e) {
        console.error(e);
      }
    }
    loadDetail();
  }, [selectedAnimeSlug]);

  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!epNumber || !epTitle) {
      setMessage({ type: "error", text: "Nomor episode dan judul wajib diisi" });
      setIsSubmitting(false);
      return;
    }

    try {
      const epSlug = `${selectedAnimeSlug}-episode-${epNumber}`;
      const newEp = {
        title: epTitle,
        slug: epSlug,
        episodeNumber: epNumber,
        date: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      // Add to custom anime or local detail
      if (selectedAnimeDetail) {
        const updatedEpisodes = [newEp, ...(selectedAnimeDetail.episodes || [])];
        const updatedDetail = {
          ...selectedAnimeDetail,
          episodes: updatedEpisodes,
        };

        const res = await fetch("/api/admin/anime", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDetail),
        });

        const data = await res.json();
        if (data.success) {
          setMessage({
            type: "success",
            text: `Episode ${epNumber} berhasil ditambahkan!`,
          });
          setSelectedAnimeDetail(updatedDetail);
          setStreamUrl("");
          setIframeUrl("");
        } else {
          setMessage({ type: "error", text: "Gagal menyimpan episode" });
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan server" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Tv className="h-6 w-6 text-sky-400" />
          Kelola Episode Anime
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Pilih anime untuk melihat dan menambahkan episode baru, server streaming, dan link unduhan
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Select Anime */}
      <div className="rounded-3xl border border-white/5 bg-[#121721] p-5 shadow-xl">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Pilih Anime yang Dikelola
        </label>
        <select
          value={selectedAnimeSlug}
          onChange={(e) => setSelectedAnimeSlug(e.target.value)}
          className="w-full max-w-xl rounded-xl border border-white/10 bg-[#0D1117] px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
        >
          {animeList.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.title} ({a.status})
            </option>
          ))}
        </select>
      </div>

      {selectedAnimeDetail && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Episode Form */}
          <div className="lg:col-span-1 rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 pb-2 flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-indigo-400" />
              Tambah Episode Baru
            </h3>

            <form onSubmit={handleAddEpisode} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Nomor Episode
                </label>
                <input
                  type="text"
                  required
                  value={epNumber}
                  onChange={(e) => {
                    setEpNumber(e.target.value);
                    setEpTitle(`Episode ${e.target.value} Subtitle Indonesia`);
                  }}
                  placeholder="Contoh: 6"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Judul Episode
                </label>
                <input
                  type="text"
                  required
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  placeholder="Episode 6 Subtitle Indonesia"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  URL Video MP4 (Server Utama)
                </label>
                <input
                  type="url"
                  value={streamUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    const gdrive = parseGoogleDriveUrl(val);
                    if (gdrive.fileId && gdrive.embedUrl) {
                      setIframeUrl(gdrive.embedUrl);
                      if (gdrive.directUrl) setStreamUrl(gdrive.directUrl);
                    } else {
                      setStreamUrl(val);
                    }
                  }}
                  placeholder="https://...mp4 atau link Google Drive"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  URL Iframe Embed (Google Drive / DesuStream / VidHide)
                </label>
                <input
                  type="url"
                  value={iframeUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    const gdrive = parseGoogleDriveUrl(val);
                    if (gdrive.fileId && gdrive.embedUrl) {
                      setIframeUrl(gdrive.embedUrl);
                    } else {
                      setIframeUrl(val);
                    }
                  }}
                  placeholder="https://drive.google.com/file/d/.../preview"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
                {iframeUrl.includes("drive.google.com") && (
                  <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <Sparkles className="h-3 w-3" />
                    Terdeteksi Google Drive Preview Stream!
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Menyimpan..." : "+ Tambahkan Episode"}
              </button>
            </form>
          </div>

          {/* Episode List for Selected Anime */}
          <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Daftar Episode: {selectedAnimeDetail.title}
                </h3>
                <span className="text-xs text-zinc-400">
                  Total {selectedAnimeDetail.episodes?.length || 0} Episode Tersedia
                </span>
              </div>

              <Link
                href={`/anime/${selectedAnimeSlug}`}
                target="_blank"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Lihat di Web ↗
              </Link>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {selectedAnimeDetail.episodes?.map((ep: any) => (
                <div
                  key={ep.slug}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-bold">
                      {ep.episodeNumber || "Ep"}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {ep.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        /episode/{ep.slug} {ep.date && `• ${ep.date}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/episode/${ep.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 rounded-lg bg-indigo-600/20 px-2.5 py-1 text-[11px] font-semibold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <Play className="h-3 w-3 fill-indigo-400" />
                      Putar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
