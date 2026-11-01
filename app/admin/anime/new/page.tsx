"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Film,
  PlusCircle,
  ArrowLeft,
  Image,
  Star,
  CheckCircle2,
  AlertCircle,
  Tv,
  Sparkles,
} from "lucide-react";
import { parseGoogleDriveUrl } from "@/lib/utils";

export default function NewAnimePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [japaneseTitle, setJapaneseTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
  );
  const [status, setStatus] = useState("Ongoing");
  const [type, setType] = useState("TV");
  const [rating, setRating] = useState("8.50");
  const [totalEpisodes, setTotalEpisodes] = useState("12");
  const [duration, setDuration] = useState("24 min. per ep.");
  const [releaseDate, setReleaseDate] = useState("2026");
  const [studio, setStudio] = useState("Mappa");
  const [synopsis, setSynopsis] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Action",
    "Fantasy",
  ]);

  // Episode 1 initial stream link
  const [ep1Title, setEp1Title] = useState("Episode 1 Subtitle Indonesia");
  const [ep1StreamUrl, setEp1StreamUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const availableGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Demons",
    "Drama",
    "Fantasy",
    "Game",
    "Isekai",
    "Magic",
    "Martial Arts",
    "Mecha",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Shounen",
    "Super Power",
    "Supernatural",
  ];

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug ? `${generatedSlug}-sub-indo` : "");
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!title.trim() || !slug.trim()) {
      setError("Judul dan Slug wajib diisi!");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        title,
        slug,
        japaneseTitle,
        thumbnail,
        status,
        type,
        rating,
        totalEpisodes,
        duration,
        releaseDate,
        studio,
        genres: selectedGenres,
        synopsis: synopsis || "Sinopsis anime belum ditambahkan.",
        episodes: [
          {
            title: ep1Title || `${title} Episode 1 Sub Indo`,
            slug: `${slug}-episode-1`,
            episodeNumber: "1",
            date: new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          },
        ],
      };

      const res = await fetch("/api/admin/anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Anime berhasil ditambahkan!");
        router.push("/admin/anime");
        router.refresh();
      } else {
        setError(data.error || "Gagal menyimpan anime");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <Link
            href="/admin/anime"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Daftar Anime
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-indigo-400" />
            Tambah Anime Baru
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Poster Preview & Upload */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/5 bg-[#121721] p-5 shadow-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Preview Poster Anime
              </label>

              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail}
                  alt="Poster preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  URL Gambar Poster
                </label>
                <input
                  type="url"
                  required
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Fields */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 pb-2">
                Informasi Utama
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Judul Anime *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Dandadan Sub Indo"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Slug URL (otomatis) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="dandadan-sub-indo"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Judul Jepang (Romaji/Kanji)
                  </label>
                  <input
                    type="text"
                    value={japaneseTitle}
                    onChange={(e) => setJapaneseTitle(e.target.value)}
                    placeholder="ダンダダン"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Studio Animasi
                  </label>
                  <input
                    type="text"
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    placeholder="MAPPA / Science SARU / Wit Studio"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0D1117] px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed (Tamat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Tipe
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0D1117] px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="TV">TV</option>
                    <option value="Movie">Movie</option>
                    <option value="OVA">OVA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Rating (Skor)
                  </label>
                  <input
                    type="text"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="8.75"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Total Episode
                  </label>
                  <input
                    type="text"
                    value={totalEpisodes}
                    onChange={(e) => setTotalEpisodes(e.target.value)}
                    placeholder="12"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Genre Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Genre Anime (Pilih yang sesuai)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableGenres.map((g) => {
                    const isSelected = selectedGenres.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => toggleGenre(g)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Sinopsis Bahasa Indonesia
                </label>
                <textarea
                  rows={4}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Tuliskan ringkasan jalan cerita anime di sini..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Initial Episode 1 Stream Configuration */}
            <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 pb-2">
                Episode 1 Default Stream
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Judul Episode 1
                  </label>
                  <input
                    type="text"
                    value={ep1Title}
                    onChange={(e) => setEp1Title(e.target.value)}
                    placeholder="Episode 1 Subtitle Indonesia"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    URL Video MP4 / Link Google Drive
                  </label>
                  <input
                    type="url"
                    value={ep1StreamUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      const gdrive = parseGoogleDriveUrl(val);
                      if (gdrive.fileId && gdrive.embedUrl) {
                        setEp1StreamUrl(gdrive.embedUrl);
                      } else {
                        setEp1StreamUrl(val);
                      }
                    }}
                    placeholder="https://drive.google.com/file/d/... atau video.mp4"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  {ep1StreamUrl.includes("drive.google.com") && (
                    <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Sparkles className="h-3 w-3" />
                      Terdeteksi Google Drive Stream Preview!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/admin/anime"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan & Publikasikan"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
