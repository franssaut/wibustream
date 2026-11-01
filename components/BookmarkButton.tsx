"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { AnimeCard } from "@/types/anime";

interface BookmarkButtonProps {
  anime: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    rating?: string;
    status?: string;
  };
}

export default function BookmarkButton({ anime }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("wibustream_bookmarks");
      if (raw) {
        const bookmarks = JSON.parse(raw);
        setIsBookmarked(bookmarks.some((b: any) => b.slug === anime.slug));
      }
    } catch (e) {
      console.error(e);
    }
  }, [anime.slug]);

  const toggleBookmark = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("wibustream_bookmarks");
      let bookmarks = raw ? JSON.parse(raw) : [];

      if (isBookmarked) {
        bookmarks = bookmarks.filter((b: any) => b.slug !== anime.slug);
        setIsBookmarked(false);
      } else {
        bookmarks.unshift({
          id: anime.id,
          title: anime.title,
          slug: anime.slug,
          thumbnail: anime.thumbnail,
          rating: anime.rating,
          status: anime.status,
          addedAt: Date.now(),
        });
        setIsBookmarked(true);
      }
      localStorage.setItem("wibustream_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
        isBookmarked
          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
          : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          Tersimpan
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Bookmark
        </>
      )}
    </button>
  );
}
