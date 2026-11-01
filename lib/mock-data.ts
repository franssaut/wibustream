import { AnimeCard, AnimeDetail, EpisodeStream, Genre } from "@/types/anime";

export const MOCK_GENRES: Genre[] = [
  { name: "Action", slug: "action" },
  { name: "Adventure", slug: "adventure" },
  { name: "Comedy", slug: "comedy" },
  { name: "Demons", slug: "demons" },
  { name: "Drama", slug: "drama" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Game", slug: "game" },
  { name: "Isekai", slug: "isekai" },
  { name: "Magic", slug: "magic" },
  { name: "Martial Arts", slug: "martial-arts" },
  { name: "Mecha", slug: "mecha" },
  { name: "Military", slug: "military" },
  { name: "Mystery", slug: "mystery" },
  { name: "Psychological", slug: "psychological" },
  { name: "Romance", slug: "romance" },
  { name: "School", slug: "school" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Seinen", slug: "seinen" },
  { name: "Shounen", slug: "shounen" },
  { name: "Slice of Life", slug: "slice-of-life" },
  { name: "Super Power", slug: "super-power" },
  { name: "Supernatural", slug: "supernatural" },
  { name: "Thriller", slug: "thriller" },
];

export const MOCK_FEATURED: AnimeCard[] = [
  {
    id: "solo-leveling-s2",
    title: "Solo Leveling Season 2: Arise from the Shadow",
    slug: "solo-leveling-s2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 12",
    releaseDay: "Sabtu",
    releaseDate: "2026",
    rating: "8.95",
    status: "Ongoing",
    type: "TV",
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "one-piece",
    title: "One Piece: Egghead Arc",
    slug: "1piece-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 1120",
    releaseDay: "Minggu",
    releaseDate: "Ongoing",
    rating: "8.89",
    status: "Ongoing",
    type: "TV",
    genres: ["Action", "Adventure", "Comedy", "Shounen"],
  },
  {
    id: "jujutsu-kaisen-s2",
    title: "Jujutsu Kaisen Season 2 (Shibuya Incident)",
    slug: "jujutsu-kaisen-s2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    currentEpisode: "23 Episode",
    releaseDay: "Tamat",
    releaseDate: "2024",
    rating: "8.85",
    status: "Completed",
    type: "TV",
    genres: ["Action", "Fantasy", "Supernatural", "Shounen"],
  },
  {
    id: "black-clover-s2",
    title: "Black Clover Season 2",
    slug: "blk-clver-s2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 5",
    releaseDay: "Kamis",
    releaseDate: "2026",
    rating: "8.53",
    status: "Ongoing",
    type: "TV",
    genres: ["Action", "Comedy", "Fantasy", "Magic", "Shounen"],
  },
];

export const MOCK_ONGOING: AnimeCard[] = [
  {
    id: "solo-leveling-s2",
    title: "Solo Leveling Season 2: Arise from the Shadow",
    slug: "solo-leveling-s2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 12",
    releaseDay: "Sabtu",
    releaseDate: "01 Nov",
    rating: "8.95",
    status: "Ongoing",
  },
  {
    id: "blk-clver-s2",
    title: "Black Clover Season 2",
    slug: "blk-clver-s2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 5",
    releaseDay: "Kamis",
    releaseDate: "01 Nov",
    rating: "8.53",
    status: "Ongoing",
  },
  {
    id: "1piece",
    title: "One Piece Sub Indo",
    slug: "1piece-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 1120",
    releaseDay: "Minggu",
    releaseDate: "01 Nov",
    rating: "8.89",
    status: "Ongoing",
  },
  {
    id: "dandadan",
    title: "Dandadan",
    slug: "dandadan-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 8",
    releaseDay: "Jumat",
    releaseDate: "31 Okt",
    rating: "8.72",
    status: "Ongoing",
  },
  {
    id: "bleach-tybw-p3",
    title: "Bleach: Thousand-Year Blood War Part 3",
    slug: "bleach-sennen-kessen-hen-ketsubetsu-tan-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 6",
    releaseDay: "Sabtu",
    releaseDate: "31 Okt",
    rating: "8.88",
    status: "Ongoing",
  },
  {
    id: "re-zero-s3",
    title: "Re:Zero kara Hajimeru Isekai Seikatsu Season 3",
    slug: "re-zero-s3-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 7",
    releaseDay: "Rabu",
    releaseDate: "30 Okt",
    rating: "8.76",
    status: "Ongoing",
  },
  {
    id: "blue-lock-s2",
    title: "Blue Lock vs. U-20 Japan",
    slug: "blue-lock-vs-u-20-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 5",
    releaseDay: "Sabtu",
    releaseDate: "29 Okt",
    rating: "8.34",
    status: "Ongoing",
  },
  {
    id: "ranma-remake",
    title: "Ranma 1/2 (2024)",
    slug: "ranma-1-2-2024-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "Episode 6",
    releaseDay: "Minggu",
    releaseDate: "28 Okt",
    rating: "8.15",
    status: "Ongoing",
  },
];

export const MOCK_COMPLETED: AnimeCard[] = [
  {
    id: "frieren",
    title: "Sousou no Frieren (Beyond Journey's End)",
    slug: "sousou-no-frieren-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "28 Episode",
    releaseDay: "Tamat",
    releaseDate: "2024",
    rating: "9.34",
    status: "Completed",
  },
  {
    id: "kimetsu-hashira",
    title: "Kimetsu no Yaiba: Hashira Geiko-hen",
    slug: "kny-hashira-geiko-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "8 Episode",
    releaseDay: "Tamat",
    releaseDate: "2024",
    rating: "8.65",
    status: "Completed",
  },
  {
    id: "shingeki-kyojin-final",
    title: "Shingeki no Kyojin: The Final Season",
    slug: "shingeki-no-kyojin-the-final-season-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "28 Episode",
    releaseDay: "Tamat",
    releaseDate: "2023",
    rating: "9.05",
    status: "Completed",
  },
  {
    id: "oshi-no-ko-s2",
    title: "Oshi no Ko Season 2",
    slug: "oshi-no-ko-s2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "13 Episode",
    releaseDay: "Tamat",
    releaseDate: "2024",
    rating: "8.58",
    status: "Completed",
  },
  {
    id: "kaiju-no-8",
    title: "Kaiju No. 8",
    slug: "kaiju-no-8-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "12 Episode",
    releaseDay: "Tamat",
    releaseDate: "2024",
    rating: "8.42",
    status: "Completed",
  },
  {
    id: "mushoku-tensei-s2",
    title: "Mushoku Tensei Season 2 Part 2",
    slug: "mushoku-tensei-s2-p2-sub-indo",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    currentEpisode: "12 Episode",
    releaseDay: "Tamat",
    releaseDate: "2024",
    rating: "8.78",
    status: "Completed",
  },
];

export const MOCK_SCHEDULE = [
  {
    day: "Senin",
    animeList: [
      { id: "s1", title: "Tower of God Season 2", slug: "tower-of-god-s2-sub-indo", thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 17", rating: "7.8" },
      { id: "s2", title: "Kamierabi Season 2", slug: "kamierabi-s2-sub-indo", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 4", rating: "7.1" },
    ],
  },
  {
    day: "Selasa",
    animeList: [
      { id: "sl1", title: "Natsume Yuujinchou Shichi", slug: "natsume-yuujinchou-s7-sub-indo", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 5", rating: "8.5" },
    ],
  },
  {
    day: "Rabu",
    animeList: [
      { id: "r1", title: "Re:Zero kara Hajimeru Isekai Seikatsu S3", slug: "re-zero-s3-sub-indo", thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 7", rating: "8.7" },
    ],
  },
  {
    day: "Kamis",
    animeList: [
      { id: "k1", title: "Black Clover Season 2", slug: "blk-clver-s2-sub-indo", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 5", rating: "8.5" },
      { id: "k2", title: "Trillion Game", slug: "trillion-game-sub-indo", thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 6", rating: "7.9" },
    ],
  },
  {
    day: "Jumat",
    animeList: [
      { id: "j1", title: "Dandadan", slug: "dandadan-sub-indo", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 8", rating: "8.7" },
    ],
  },
  {
    day: "Sabtu",
    animeList: [
      { id: "sb1", title: "Solo Leveling Season 2", slug: "solo-leveling-s2-sub-indo", thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 12", rating: "8.9" },
      { id: "sb2", title: "Bleach: Thousand-Year Blood War Part 3", slug: "bleach-sennen-kessen-hen-ketsubetsu-tan-sub-indo", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 6", rating: "8.8" },
      { id: "sb3", title: "Blue Lock vs. U-20 Japan", slug: "blue-lock-vs-u-20-sub-indo", thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 5", rating: "8.3" },
    ],
  },
  {
    day: "Minggu",
    animeList: [
      { id: "m1", title: "One Piece Sub Indo", slug: "1piece-sub-indo", thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 1120", rating: "8.9" },
      { id: "m2", title: "Ranma 1/2 (2024)", slug: "ranma-1-2-2024-sub-indo", thumbnail: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&auto=format&fit=crop&q=80", currentEpisode: "Episode 6", rating: "8.1" },
    ],
  },
];

// Sample fallback streaming video (high quality open source webm/mp4 anime video)
export const SAMPLE_FALLBACK_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
export const SAMPLE_TEARS_OF_STEEL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

export function getMockAnimeDetail(slug: string): AnimeDetail {
  const isOnePiece = slug.includes("1piece") || slug.includes("one-piece");
  const isSoloLeveling = slug.includes("solo-leveling");
  const isBlackClover = slug.includes("blk-clver") || slug.includes("black-clover");
  
  if (isOnePiece) {
    return {
      id: "1piece-sub-indo",
      title: "One Piece Subtitle Indonesia",
      japaneseTitle: "ワンピース",
      slug: "1piece-sub-indo",
      thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      rating: "8.89",
      status: "Ongoing",
      type: "TV",
      totalEpisodes: "1100+",
      duration: "24 min. per ep.",
      releaseDate: "Okt 20, 1999",
      studio: "Toei Animation",
      genres: [
        { name: "Action", slug: "action" },
        { name: "Adventure", slug: "adventure" },
        { name: "Comedy", slug: "comedy" },
        { name: "Fantasy", slug: "fantasy" },
        { name: "Shounen", slug: "shounen" },
      ],
      synopsis: "Dulu, ada seorang bajak laut terkenal bernama Gol D. Roger yang telah mengarungi seluruh Grand Line. Sebelum dieksekusi oleh Pemerintah Dunia, ia mengumumkan harta karun terbesarnya bernama One Piece. Monkey D. Luffy, seorang pemuda bertubuh karet akibat buah iblis Gomu Gomu no Mi, bermimpi menjadi Raja Bajak Laut berikutnya. Bersama kru Topi Jerami, Luffy berlayar melintasi lautan penuh bahaya dan keajaiban untuk menggapai impian tertingginya.",
      episodes: [
        { title: "One Piece Episode 1120 Subtitle Indonesia", slug: "1piece-episode-1120-sub-indo", episodeNumber: "1120", date: "01 Nov 2026" },
        { title: "One Piece Episode 1119 Subtitle Indonesia", slug: "1piece-episode-1119-sub-indo", episodeNumber: "1119", date: "25 Okt 2026" },
        { title: "One Piece Episode 1118 Subtitle Indonesia", slug: "1piece-episode-1118-sub-indo", episodeNumber: "1118", date: "18 Okt 2026" },
        { title: "One Piece Episode 1117 Subtitle Indonesia", slug: "1piece-episode-1117-sub-indo", episodeNumber: "1117", date: "11 Okt 2026" },
        { title: "One Piece Episode 1116 Subtitle Indonesia", slug: "1piece-episode-1116-sub-indo", episodeNumber: "1116", date: "04 Okt 2026" },
      ],
    };
  }

  if (isBlackClover) {
    return {
      id: "blk-clver-s2-sub-indo",
      title: "Black Clover Season 2 Subtitle Indonesia",
      japaneseTitle: "ブラッククローバー 2nd Season",
      slug: "blk-clver-s2-sub-indo",
      thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
      rating: "8.53",
      status: "Ongoing",
      type: "TV",
      totalEpisodes: "24",
      duration: "23 min. per ep.",
      releaseDate: "Okt 03, 2026",
      studio: "Studio Pierrot",
      genres: [
        { name: "Action", slug: "action" },
        { name: "Comedy", slug: "comedy" },
        { name: "Fantasy", slug: "fantasy" },
        { name: "Magic", slug: "magic" },
        { name: "Shounen", slug: "shounen" },
      ],
      synopsis: "Asta dan Yuno adalah anak yatim piatu yang dibesarkan bersama di gereja desa Hage. Di dunia di mana sihir adalah segalanya, Yuno dianugerahi Grimoire daun empat legendaris, sementara Asta sama sekali tidak memiliki sihir. Namun, tekad baja Asta membangkitkan Grimoire daun lima dengan pedang Anti-Sihir. Di musim kedua ini, petualangan para Ksatria Sihir Kerajaan Clover menghadapi ancaman baru dari dimensi iblis yang semakin mengerikan.",
      episodes: [
        { title: "Black Clover Season 2 Episode 5 Sub Indo", slug: "blkclv-s2-episode-5-sub-indo", episodeNumber: "5", date: "01 Nov 2026" },
        { title: "Black Clover Season 2 Episode 4 Sub Indo", slug: "blkclv-s2-episode-4-sub-indo", episodeNumber: "4", date: "24 Okt 2026" },
        { title: "Black Clover Season 2 Episode 3 Sub Indo", slug: "blkclv-s2-episode-3-sub-indo", episodeNumber: "3", date: "17 Okt 2026" },
        { title: "Black Clover Season 2 Episode 2 Sub Indo", slug: "blkclv-s2-episode-2-sub-indo", episodeNumber: "2", date: "10 Okt 2026" },
        { title: "Black Clover Season 2 Episode 1 Sub Indo", slug: "blkclv-s2-episode-1-sub-indo", episodeNumber: "1", date: "03 Okt 2026" },
      ],
    };
  }

  // Default fallback detail
  return {
    id: slug,
    title: slug.replace(/-/g, " ").replace("sub indo", "").replace(/\b\w/g, (c) => c.toUpperCase()) + " Subtitle Indonesia",
    japaneseTitle: "アニメシリーズ",
    slug: slug,
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    rating: "8.75",
    status: "Ongoing",
    type: "TV",
    totalEpisodes: "12",
    duration: "24 min. per ep.",
    releaseDate: "2026",
    studio: "Mappa / A-1 Pictures",
    genres: [
      { name: "Action", slug: "action" },
      { name: "Fantasy", slug: "fantasy" },
      { name: "Supernatural", slug: "supernatural" },
    ],
    synopsis: "Ikuti kisah penuh aksi dan intrik dari seri anime populer ini dengan terjemahan Bahasa Indonesia berkualitas tinggi. Menampilkan pertarungan spektakuler, animasi memukau, dan alur cerita yang tak terduga di setiap episodenya.",
    episodes: [
      { title: `Episode 5 Subtitle Indonesia`, slug: `${slug}-episode-5`, episodeNumber: "5", date: "01 Nov 2026" },
      { title: `Episode 4 Subtitle Indonesia`, slug: `${slug}-episode-4`, episodeNumber: "4", date: "24 Okt 2026" },
      { title: `Episode 3 Subtitle Indonesia`, slug: `${slug}-episode-3`, episodeNumber: "3", date: "17 Okt 2026" },
      { title: `Episode 2 Subtitle Indonesia`, slug: `${slug}-episode-2`, episodeNumber: "2", date: "10 Okt 2026" },
      { title: `Episode 1 Subtitle Indonesia`, slug: `${slug}-episode-1`, episodeNumber: "1", date: "03 Okt 2026" },
    ],
  };
}

export function getMockEpisodeStream(slug: string): EpisodeStream {
  const isBlackClover = slug.includes("blkclv") || slug.includes("black-clover");
  const epNumber = slug.match(/episode-(\d+)/i)?.[1] || "1";
  
  // Real working MP4 video stream from otakudesu cdn when available, or sample anime mp4 video
  const realOdcloudMp4 = "https://cdn.odcloud.net/anime/Otakudesu.io_BlkClv.S2--05_720pv3.mp4";
  const videoUrl = isBlackClover ? realOdcloudMp4 : SAMPLE_FALLBACK_VIDEO;

  return {
    title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    slug: slug,
    animeTitle: isBlackClover ? "Black Clover Season 2" : "Solo Leveling Season 2",
    animeSlug: isBlackClover ? "blk-clver-s2-sub-indo" : "solo-leveling-s2-sub-indo",
    episodeNumber: epNumber,
    defaultStreamUrl: videoUrl,
    videoStreamUrl: videoUrl,
    iframeSrc: "https://desustream.net/dstream/odcdn/?id=TXdXSlhBdGVKMGNnWkQyZHF4NWR0a3VwZktDNkJ6MlIwUkVFZmpvZjRjWXBheWNPMFMzSjRkN0JKdVlJelJGUg==",
    servers: [
      { id: "srv-mp4-720", name: "Server Utama (HD 720p)", quality: "720p", url: videoUrl, isEmbed: false },
      { id: "srv-mp4-480", name: "Server Cepat (SD 480p)", quality: "480p", url: videoUrl, isEmbed: false },
      { id: "srv-embed-desu", name: "DesuStream Player", quality: "Multi", url: "https://desustream.net/dstream/odcdn/?id=TXdXSlhBdGVKMGNnWkQyZHF4NWR0a3VwZktDNkJ6MlIwUkVFZmpvZjRjWXBheWNPMFMzSjRkN0JKdVlJelJGUg==", isEmbed: true },
      { id: "srv-backup-vidhide", name: "Server Backup (VidHide)", quality: "720p", url: SAMPLE_TEARS_OF_STEEL, isEmbed: false },
    ],
    downloads: [
      {
        quality: "720p MP4",
        size: "~230 MB",
        links: [
          { server: "Filedons", url: "https://link.desustream.com/?id=test1" },
          { server: "Mega", url: "https://mega.nz" },
          { server: "Google Drive", url: "https://drive.google.com" },
        ],
      },
      {
        quality: "480p MP4",
        size: "~140 MB",
        links: [
          { server: "Filedons", url: "https://link.desustream.com/?id=test2" },
          { server: "VidHide", url: "https://vidhide.com" },
        ],
      },
      {
        quality: "360p MP4",
        size: "~80 MB",
        links: [
          { server: "Filedons", url: "https://link.desustream.com/?id=test3" },
        ],
      },
    ],
    prevEpisodeSlug: parseInt(epNumber) > 1 ? slug.replace(`episode-${epNumber}`, `episode-${parseInt(epNumber) - 1}`) : null,
    nextEpisodeSlug: slug.replace(`episode-${epNumber}`, `episode-${parseInt(epNumber) + 1}`),
    allEpisodes: [
      { title: `Episode 5 Sub Indo`, slug: isBlackClover ? "blkclv-s2-episode-5-sub-indo" : `${slug}-5`, episodeNumber: "5" },
      { title: `Episode 4 Sub Indo`, slug: isBlackClover ? "blkclv-s2-episode-4-sub-indo" : `${slug}-4`, episodeNumber: "4" },
      { title: `Episode 3 Sub Indo`, slug: isBlackClover ? "blkclv-s2-episode-3-sub-indo" : `${slug}-3`, episodeNumber: "3" },
      { title: `Episode 2 Sub Indo`, slug: isBlackClover ? "blkclv-s2-episode-2-sub-indo" : `${slug}-2`, episodeNumber: "2" },
      { title: `Episode 1 Sub Indo`, slug: isBlackClover ? "blkclv-s2-episode-1-sub-indo" : `${slug}-1`, episodeNumber: "1" },
    ],
  };
}
