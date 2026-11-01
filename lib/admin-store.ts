import fs from "fs";
import path from "path";
import { AnimeCard, AnimeDetail, EpisodeStream } from "@/types/anime";
import { MOCK_ONGOING, MOCK_COMPLETED, MOCK_FEATURED } from "./mock-data";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  sourceUrl: string;
  maintenanceMode: boolean;
  announcement: {
    enabled: boolean;
    text: string;
    type: "info" | "warning" | "alert";
  };
  featuredSlugs: string[];
}

export interface AdminStats {
  totalAnime: number;
  ongoingCount: number;
  completedCount: number;
  totalEpisodes: number;
  todayViews: number;
  serverStatus: "Online" | "Degraded" | "Offline";
  cacheItemsCount: number;
  lastSyncTime: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const CUSTOM_ANIME_FILE = path.join(DATA_DIR, "custom-anime.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

// Ensure data folder exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial default settings
const defaultSettings: SiteSettings = {
  siteName: "WibuStream",
  tagline: "Nonton Anime Subtitle Indonesia Gratis HD",
  sourceUrl: "https://otakudesu.blog",
  maintenanceMode: false,
  announcement: {
    enabled: true,
    text: "Selamat datang di WibuStream! Streaming anime sub indo update setiap hari resolusi 360p - 720p HD.",
    type: "info",
  },
  featuredSlugs: ["solo-leveling-s2-sub-indo", "1piece-sub-indo", "blk-clver-s2-sub-indo"],
};

export function getSettings(): SiteSettings {
  ensureDataDir();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Error reading settings:", e);
  }
  return defaultSettings;
}

export function saveSettings(settings: SiteSettings) {
  ensureDataDir();
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving settings:", e);
  }
}

export function getCustomAnime(): AnimeDetail[] {
  ensureDataDir();
  try {
    if (fs.existsSync(CUSTOM_ANIME_FILE)) {
      const raw = fs.readFileSync(CUSTOM_ANIME_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading custom anime:", e);
  }
  return [];
}

export function saveCustomAnime(animeList: AnimeDetail[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(CUSTOM_ANIME_FILE, JSON.stringify(animeList, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving custom anime:", e);
  }
}

export function addCustomAnime(newAnime: AnimeDetail) {
  const list = getCustomAnime();
  const existingIdx = list.findIndex((a) => a.slug === newAnime.slug);
  if (existingIdx !== -1) {
    list[existingIdx] = newAnime;
  } else {
    list.unshift(newAnime);
  }
  saveCustomAnime(list);
  return newAnime;
}

export function deleteCustomAnime(slug: string) {
  const list = getCustomAnime();
  const filtered = list.filter((a) => a.slug !== slug);
  saveCustomAnime(filtered);
  return true;
}

export function getAdminStats(): AdminStats {
  const custom = getCustomAnime();

  return {
    totalAnime: custom.length + 50,
    ongoingCount: custom.filter((a) => a.status === "Ongoing").length + 25,
    completedCount: custom.filter((a) => a.status === "Completed").length + 25,
    totalEpisodes: 1250,
    todayViews: 14890,
    serverStatus: "Online",
    cacheItemsCount: custom.length + 50,
    lastSyncTime: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}
