export interface AnimeCard {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  currentEpisode?: string;
  releaseDay?: string;
  releaseDate?: string;
  rating?: string;
  status?: 'Ongoing' | 'Completed' | string;
  type?: string;
  genres?: string[];
}

export interface AnimeDetail {
  id: string;
  title: string;
  japaneseTitle?: string;
  slug: string;
  thumbnail: string;
  rating: string;
  status: string;
  type: string;
  totalEpisodes: string;
  duration: string;
  releaseDate: string;
  studio: string;
  genres: Array<{ name: string; slug: string }>;
  synopsis: string;
  episodes: Array<{
    title: string;
    slug: string;
    episodeNumber?: string;
    date?: string;
  }>;
  batch?: {
    slug: string;
    uploadedAt: string;
  };
}

export interface StreamServer {
  id: string;
  name: string;
  quality: string;
  url: string;
  isEmbed: boolean;
}

export interface DownloadLink {
  server: string;
  url: string;
}

export interface DownloadQuality {
  quality: string;
  size?: string;
  links: DownloadLink[];
}

export interface EpisodeStream {
  title: string;
  slug: string;
  animeTitle: string;
  animeSlug: string;
  episodeNumber: string;
  defaultStreamUrl: string;
  videoStreamUrl?: string; // Direct mp4/hls if resolved
  iframeSrc?: string;
  servers: StreamServer[];
  downloads: DownloadQuality[];
  prevEpisodeSlug?: string | null;
  nextEpisodeSlug?: string | null;
  allEpisodes: Array<{
    title: string;
    slug: string;
    episodeNumber: string;
  }>;
}

export interface Genre {
  name: string;
  slug: string;
  count?: number;
}

export interface ScheduleDay {
  day: string;
  animeList: AnimeCard[];
}

export interface HomeData {
  featured: AnimeCard[];
  ongoing: AnimeCard[];
  completed: AnimeCard[];
}
