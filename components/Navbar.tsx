"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Film,
  Calendar,
  Bookmark,
  Clock,
  Menu,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { AnimeCard as AnimeCardType } from "@/types/anime";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeCardType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/anime/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0E14]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Wibu<span className="text-indigo-400">Stream</span>
              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                SUB INDO
              </span>
            </span>
            <span className="text-[10px] font-medium text-zinc-400 -mt-0.5">
              Nonton Anime Gratis HD
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-300">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/ongoing"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Flame className="h-4 w-4 text-amber-400" />
            Ongoing
          </Link>
          <Link
            href="/completed"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Tamat
          </Link>
          <Link
            href="/jadwal"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Calendar className="h-4 w-4 text-sky-400" />
            Jadwal Rilis
          </Link>
          <Link
            href="/genres"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Sparkles className="h-4 w-4 text-fuchsia-400" />
            Genre
          </Link>
          <Link
            href="/bookmark"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bookmark className="h-4 w-4 text-rose-400" />
            Bookmark
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Clock className="h-4 w-4 text-indigo-400" />
            Riwayat
          </Link>
        </nav>

        {/* Search Bar */}
        <div ref={searchRef} className="relative hidden sm:block w-72 lg:w-80">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari anime sub indo..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-400 transition-all focus:border-indigo-500 focus:bg-[#121721] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {isSearching && (
                <div className="absolute right-3.5 h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
              )}
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showResults && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#121721]/95 p-2 shadow-2xl backdrop-blur-xl z-50">
              {searchResults.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {searchResults.map((anime) => (
                    <Link
                      key={anime.slug}
                      href={`/anime/${anime.slug}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
                    >
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={anime.thumbnail || "/placeholder.jpg"}
                          alt={anime.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-xs font-semibold text-white">
                          {anime.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          {anime.rating && (
                            <span className="text-amber-400 font-medium">★ {anime.rating}</span>
                          )}
                          {anime.currentEpisode && <span>{anime.currentEpisode}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="mt-1 w-full rounded-lg bg-indigo-600/20 py-2 text-center text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-600/30"
                  >
                    Lihat semua hasil untuk &ldquo;{searchQuery}&rdquo;
                  </button>
                </div>
              ) : !isSearching ? (
                <div className="p-4 text-center text-xs text-zinc-400">
                  Tidak ada anime yang ditemukan
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/5 bg-[#0B0E14] px-4 py-4 lg:hidden">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari anime sub indo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-300">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/ongoing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              <Flame className="h-4 w-4 text-amber-400" />
              Ongoing Anime
            </Link>
            <Link
              href="/completed"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Anime Tamat
            </Link>
            <Link
              href="/jadwal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              <Calendar className="h-4 w-4 text-sky-400" />
              Jadwal Rilis
            </Link>
            <Link
              href="/genres"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-fuchsia-400" />
              Daftar Genre
            </Link>
            <Link
              href="/bookmark"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              <Bookmark className="h-4 w-4 text-rose-400" />
              Bookmark Saya
            </Link>
            <Link
              href="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5 hover:text-white"
            >
              <Clock className="h-4 w-4 text-indigo-400" />
              Riwayat Tontonan
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
