"use client";

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    text: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.announcement && data.announcement.enabled) {
          setAnnouncement(data.announcement);
        }
      } catch (e) {
        // Ignore
      }
    }
    loadAnnouncement();
  }, []);

  if (!announcement || !announcement.enabled || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border-b border-indigo-500/20 px-4 py-2 text-center text-xs text-indigo-200 backdrop-blur-md z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-6">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="font-medium text-white">{announcement.text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-indigo-300 hover:text-white transition-colors"
          title="Tutup pengumuman"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
