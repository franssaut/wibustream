import * as cheerio from "cheerio";
import {
  AnimeCard,
  AnimeDetail,
  EpisodeStream,
  Genre,
  HomeData,
  StreamServer,
  DownloadQuality,
} from "@/types/anime";
import { getCustomAnime } from "./admin-store";
import { parseGoogleDriveUrl } from "./utils";
import {
  MOCK_FEATURED,
  MOCK_ONGOING,
  MOCK_COMPLETED,
  MOCK_GENRES,
  MOCK_SCHEDULE,
  getMockAnimeDetail,
  getMockEpisodeStream,
  SAMPLE_FALLBACK_VIDEO,
} from "./mock-data";

const BASE_URL = process.env.ANIME_SOURCE_URL || "https://otakudesu.blog";

// In-memory cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheItem<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function clearScraperCache() {
  cache.clear();
}

function getCached<T>(key: string): T | null {
  const item = cache.get(key) as CacheItem<T> | undefined;
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchHtml(url: string, timeoutMs = 8000): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: BASE_URL,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      next: { revalidate: 180 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.text();
  } finally {
    clearTimeout(id);
  }
}

function extractSlug(url: string, type: "anime" | "episode" | "genres"): string {
  if (!url) return "";
  const match = url.match(new RegExp(`/${type}/([^/]+)`));
  return match ? match[1] : url.replace(/^\/|\/$/g, "").split("/").pop() || "";
}

/**
 * Get Home Data (Scraped Ongoing + Completed + Merged Custom Anime)
 */
export async function getHomeData(): Promise<HomeData> {
  const cacheKey = "home_data_live";
  const cached = getCached<HomeData>(cacheKey);
  if (cached) return cached;

  const customList = getCustomAnime();
  const customOngoing: AnimeCard[] = customList
    .filter((a) => a.status === "Ongoing")
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      thumbnail: a.thumbnail,
      currentEpisode:
        a.episodes && a.episodes.length > 0 && a.episodes[0].episodeNumber
          ? `Episode ${a.episodes[0].episodeNumber}`
          : "Episode 1",
      releaseDay: "Update",
      releaseDate: a.releaseDate,
      rating: a.rating,
      status: "Ongoing",
      genres: a.genres?.map((g) => g.name) || [],
    }));

  const customCompleted: AnimeCard[] = customList
    .filter((a) => a.status === "Completed")
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      thumbnail: a.thumbnail,
      currentEpisode: a.totalEpisodes ? `${a.totalEpisodes} Episode` : "Tamat",
      rating: a.rating,
      releaseDate: a.releaseDate,
      status: "Completed",
      genres: a.genres?.map((g) => g.name) || [],
    }));

  try {
    const html = await fetchHtml(`${BASE_URL}/`);
    const $ = cheerio.load(html);

    const scrapedOngoing: AnimeCard[] = [];
    const scrapedCompleted: AnimeCard[] = [];

    // Parse ongoing list
    $(".venz")
      .first()
      .find("ul li")
      .each((_, el) => {
        const item = $(el);
        const title = item.find(".jdlflm").text().trim();
        const link = item.find(".thumb a").attr("href") || "";
        const slug = extractSlug(link, "anime");
        const thumbnail = item.find(".thumbz img").attr("src") || "";
        const currentEpisode = item.find(".epz").text().trim();
        const releaseDay = item.find(".epztipe").text().trim();
        const releaseDate = item.find(".newnime").text().trim();

        if (title && slug) {
          scrapedOngoing.push({
            id: slug,
            title,
            slug,
            thumbnail,
            currentEpisode,
            releaseDay,
            releaseDate,
            status: "Ongoing",
          });
        }
      });

    // Parse completed list
    $(".venz")
      .eq(1)
      .find("ul li")
      .each((_, el) => {
        const item = $(el);
        const title = item.find(".jdlflm").text().trim();
        const link = item.find(".thumb a").attr("href") || "";
        const slug = extractSlug(link, "anime");
        const thumbnail = item.find(".thumbz img").attr("src") || "";
        const currentEpisode = item.find(".epz").text().trim();
        const rating = item.find(".epztipe").text().trim();
        const releaseDate = item.find(".newnime").text().trim();

        if (title && slug) {
          scrapedCompleted.push({
            id: slug,
            title,
            slug,
            thumbnail,
            currentEpisode,
            rating,
            releaseDate,
            status: "Completed",
          });
        }
      });

    const ongoingList = [
      ...customOngoing,
      ...(scrapedOngoing.length > 0 ? scrapedOngoing : MOCK_ONGOING),
    ];
    const completedList = [
      ...customCompleted,
      ...(scrapedCompleted.length > 0 ? scrapedCompleted : MOCK_COMPLETED),
    ];

    const featured: AnimeCard[] = ongoingList.slice(0, 4).map((anime) => ({
      ...anime,
      genres: ["Action", "Adventure", "Fantasy"],
      rating: anime.rating || "8.85",
      type: "TV Series",
    }));

    const result: HomeData = {
      featured: featured.length > 0 ? featured : MOCK_FEATURED,
      ongoing: ongoingList,
      completed: completedList,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("getHomeData fallback:", error);
    return {
      featured: [...customOngoing, ...MOCK_FEATURED].slice(0, 4),
      ongoing: [...customOngoing, ...MOCK_ONGOING],
      completed: [...customCompleted, ...MOCK_COMPLETED],
    };
  }
}

/**
 * Get Ongoing Anime with Pagination
 */
export async function getOngoingAnime(
  page = 1
): Promise<{ animeList: AnimeCard[]; page: number }> {
  const cacheKey = `ongoing_page_${page}`;
  const cached = getCached<{ animeList: AnimeCard[]; page: number }>(cacheKey);
  if (cached) return cached;

  const customOngoing = getCustomAnime()
    .filter((a) => a.status === "Ongoing")
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      thumbnail: a.thumbnail,
      currentEpisode:
        a.episodes && a.episodes.length > 0
          ? `Episode ${a.episodes[0].episodeNumber || 1}`
          : "Episode 1",
      rating: a.rating,
      status: a.status,
      genres: a.genres?.map((g) => g.name) || [],
    }));

  try {
    const url =
      page === 1
        ? `${BASE_URL}/ongoing-anime/`
        : `${BASE_URL}/ongoing-anime/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const scrapedList: AnimeCard[] = [];
    $(".venz ul li").each((_, el) => {
      const item = $(el);
      const title = item.find(".jdlflm").text().trim();
      const link = item.find(".thumb a").attr("href") || "";
      const slug = extractSlug(link, "anime");
      const thumbnail = item.find(".thumbz img").attr("src") || "";
      const currentEpisode = item.find(".epz").text().trim();
      const releaseDay = item.find(".epztipe").text().trim();
      const releaseDate = item.find(".newnime").text().trim();

      if (title && slug) {
        scrapedList.push({
          id: slug,
          title,
          slug,
          thumbnail,
          currentEpisode,
          releaseDay,
          releaseDate,
          status: "Ongoing",
        });
      }
    });

    const combined =
      page === 1
        ? [...customOngoing, ...(scrapedList.length > 0 ? scrapedList : MOCK_ONGOING)]
        : scrapedList;

    const result = {
      animeList: combined,
      page,
    };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("getOngoingAnime fallback:", error);
    return { animeList: [...customOngoing, ...MOCK_ONGOING], page };
  }
}

/**
 * Get Completed Anime with Pagination
 */
export async function getCompletedAnime(
  page = 1
): Promise<{ animeList: AnimeCard[]; page: number }> {
  const cacheKey = `completed_page_${page}`;
  const cached = getCached<{ animeList: AnimeCard[]; page: number }>(cacheKey);
  if (cached) return cached;

  const customCompleted = getCustomAnime()
    .filter((a) => a.status === "Completed")
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      thumbnail: a.thumbnail,
      currentEpisode: a.totalEpisodes ? `${a.totalEpisodes} Episode` : "Tamat",
      rating: a.rating,
      status: a.status,
      genres: a.genres?.map((g) => g.name) || [],
    }));

  try {
    const url =
      page === 1
        ? `${BASE_URL}/complete-anime/`
        : `${BASE_URL}/complete-anime/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const scrapedList: AnimeCard[] = [];
    $(".venz ul li").each((_, el) => {
      const item = $(el);
      const title = item.find(".jdlflm").text().trim();
      const link = item.find(".thumb a").attr("href") || "";
      const slug = extractSlug(link, "anime");
      const thumbnail = item.find(".thumbz img").attr("src") || "";
      const currentEpisode = item.find(".epz").text().trim();
      const rating = item.find(".epztipe").text().trim();
      const releaseDate = item.find(".newnime").text().trim();

      if (title && slug) {
        scrapedList.push({
          id: slug,
          title,
          slug,
          thumbnail,
          currentEpisode,
          rating,
          releaseDate,
          status: "Completed",
        });
      }
    });

    const combined =
      page === 1
        ? [...customCompleted, ...(scrapedList.length > 0 ? scrapedList : MOCK_COMPLETED)]
        : scrapedList;

    const result = {
      animeList: combined,
      page,
    };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("getCompletedAnime fallback:", error);
    return { animeList: [...customCompleted, ...MOCK_COMPLETED], page };
  }
}

/**
 * Get Anime Detail by Slug
 */
export async function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  // First check custom anime
  const custom = getCustomAnime().find((a) => a.slug === slug);
  if (custom) return custom;

  const cacheKey = `anime_${slug}`;
  const cached = getCached<AnimeDetail>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchHtml(`${BASE_URL}/anime/${slug}/`);
    const $ = cheerio.load(html);

    const title =
      $(".infozingle p:contains('Judul')")
        .text()
        .replace("Judul:", "")
        .replace("Judul", "")
        .trim() ||
      $("h1.entry-title").text().trim() ||
      slug;
    const japaneseTitle = $(".infozingle p:contains('Japanese')")
      .text()
      .replace("Japanese:", "")
      .trim();
    const rating =
      $(".infozingle p:contains('Skor')").text().replace("Skor:", "").trim() ||
      "8.5";
    const status =
      $(".infozingle p:contains('Status')").text().replace("Status:", "").trim() ||
      "Ongoing";
    const type =
      $(".infozingle p:contains('Tipe')").text().replace("Tipe:", "").trim() ||
      "TV";
    const totalEpisodes =
      $(".infozingle p:contains('Total Episode')")
        .text()
        .replace("Total Episode:", "")
        .trim() || "?";
    const duration =
      $(".infozingle p:contains('Durasi')").text().replace("Durasi:", "").trim() ||
      "24 min.";
    const releaseDate =
      $(".infozingle p:contains('Tanggal Rilis')")
        .text()
        .replace("Tanggal Rilis:", "")
        .trim() || "";
    const studio =
      $(".infozingle p:contains('Studio')").text().replace("Studio:", "").trim() ||
      "";
    const thumbnail = $(".fotoanime img").attr("src") || "";

    const genres: Array<{ name: string; slug: string }> = [];
    $(".infozingle p:contains('Genre') a, .infozingle a[href*='/genres/']").each(
      (_, el) => {
        const gName = $(el).text().trim();
        const gHref = $(el).attr("href") || "";
        const gSlug = extractSlug(gHref, "genres");
        if (gName && gSlug) {
          genres.push({ name: gName, slug: gSlug });
        }
      }
    );

    const synopsis =
      $(".sinopc").text().trim() ||
      "Tidak ada sinopsis tersedia untuk anime ini.";

    // Parse episode list
    const episodes: AnimeDetail["episodes"] = [];
    $(".episodelist ul li").each((_, el) => {
      const a = $(el).find("a");
      const epTitle = a.text().trim();
      const epHref = a.attr("href") || "";
      const epSlug = extractSlug(epHref, "episode");
      const date = $(el).find(".zee-date, span:last-child").text().trim();
      const epNumber = epSlug.match(/episode-(\d+)/i)?.[1] || "";

      if (epTitle && epSlug) {
        episodes.push({
          title: epTitle,
          slug: epSlug,
          episodeNumber: epNumber,
          date,
        });
      }
    });

    const result: AnimeDetail = {
      id: slug,
      title: title || slug,
      japaneseTitle,
      slug,
      thumbnail,
      rating,
      status,
      type,
      totalEpisodes,
      duration,
      releaseDate,
      studio,
      genres:
        genres.length > 0
          ? genres
          : [
              { name: "Action", slug: "action" },
              { name: "Fantasy", slug: "fantasy" },
            ],
      synopsis,
      episodes:
        episodes.length > 0 ? episodes : getMockAnimeDetail(slug).episodes,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`getAnimeDetail fallback for ${slug}:`, error);
    return getMockAnimeDetail(slug);
  }
}

/**
 * Get Episode Stream & Downloads
 */
export async function getEpisodeStream(slug: string): Promise<EpisodeStream> {
  // Check custom anime first
  const customAnimeList = getCustomAnime();
  for (const a of customAnimeList) {
    const epIndex = (a.episodes || []).findIndex((e) => e.slug === slug);
    if (epIndex !== -1) {
      const ep = a.episodes![epIndex];
      const epNum = ep.episodeNumber || "1";

      const rawStream = (ep as any).streamUrl || SAMPLE_FALLBACK_VIDEO;
      const rawIframe = (ep as any).iframeUrl || "";

      const gdriveStream = parseGoogleDriveUrl(rawStream);
      const gdriveIframe = parseGoogleDriveUrl(rawIframe);

      const resolvedIframe =
        gdriveIframe.embedUrl ||
        gdriveStream.embedUrl ||
        rawIframe ||
        undefined;

      const resolvedVideo =
        gdriveStream.directUrl ||
        rawStream ||
        SAMPLE_FALLBACK_VIDEO;

      const servers: StreamServer[] = [];

      if (resolvedIframe) {
        servers.push({
          id: "srv-gdrive",
          name: resolvedIframe.includes("drive.google.com")
            ? "Google Drive Player (HD)"
            : "Server Embed Player",
          quality: "Multi 1080p",
          url: resolvedIframe,
          isEmbed: true,
        });
      }

      if (resolvedVideo && !resolvedVideo.includes("drive.google.com")) {
        servers.push({
          id: "srv-mp4-hd",
          name: "Server Utama (HD 720p)",
          quality: "720p",
          url: resolvedVideo,
          isEmbed: false,
        });
      }

      const prevEp = a.episodes![epIndex + 1];
      const nextEp = a.episodes![epIndex - 1];

      return {
        title: ep.title,
        slug: ep.slug,
        animeTitle: a.title,
        animeSlug: a.slug,
        episodeNumber: epNum,
        defaultStreamUrl: resolvedVideo,
        videoStreamUrl: resolvedVideo,
        iframeSrc: resolvedIframe,
        servers:
          servers.length > 0
            ? servers
            : [
                {
                  id: "srv-default",
                  name: "Server Utama (HD)",
                  quality: "720p",
                  url: SAMPLE_FALLBACK_VIDEO,
                  isEmbed: false,
                },
              ],
        downloads: [
          {
            quality: "720p HD",
            size: "~200 MB",
            links: [
              {
                server: "Google Drive",
                url: resolvedIframe || "https://drive.google.com",
              },
            ],
          },
        ],
        prevEpisodeSlug: prevEp ? prevEp.slug : null,
        nextEpisodeSlug: nextEp ? nextEp.slug : null,
        allEpisodes: (a.episodes || []).map((e) => ({
          title: e.title,
          slug: e.slug,
          episodeNumber: e.episodeNumber || "",
        })),
      };
    }
  }

  const cacheKey = `episode_${slug}`;
  const cached = getCached<EpisodeStream>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchHtml(`${BASE_URL}/episode/${slug}/`);
    const $ = cheerio.load(html);

    const title = $("h1.posttl").text().trim() || slug;
    const defaultIframe =
      $(".responsive-embed-stream iframe").attr("src") || "";

    // Resolve direct MP4 from desustream if possible
    let directMp4Url = "";
    if (defaultIframe && defaultIframe.includes("desustream")) {
      try {
        const desuHtml = await fetchHtml(defaultIframe, 4000);
        const match = desuHtml.match(
          /const\s+videoURL\s*=\s*["']([^"']+)["']/i
        );
        if (match && match[1]) {
          directMp4Url = match[1];
        }
      } catch (err) {
        console.warn("Failed resolving desustream videoURL:", err);
      }
    }

    const servers: StreamServer[] = [];
    if (directMp4Url) {
      servers.push({
        id: "direct-mp4",
        name: "Server Utama (HD)",
        quality: "720p",
        url: directMp4Url,
        isEmbed: false,
      });
    }
    if (defaultIframe) {
      servers.push({
        id: "default-iframe",
        name: "DesuStream Embed",
        quality: "Multi",
        url: defaultIframe,
        isEmbed: true,
      });
    }

    // Mirror streams
    $(".mirrorstream ul").each((_, ul) => {
      const qText = $(ul).attr("class") || "";
      const quality = qText.replace("m", "").trim() || "480p";
      $(ul)
        .find("li a")
        .each((i, a) => {
          const srvName = $(a).text().trim() || `Server ${i + 1}`;
          const content = $(a).attr("data-content");
          if (content) {
            servers.push({
              id: `mirror-${quality}-${srvName.toLowerCase()}`,
              name: `${srvName} (${quality})`,
              quality,
              url: defaultIframe,
              isEmbed: true,
            });
          }
        });
    });

    // Navigation
    const prevLink = $(
      ".flir a:contains('Previous'), a:contains('Prev')"
    ).attr("href") || "";
    const nextLink = $(".flir a:contains('Next')").attr("href") || "";
    const allEpLink =
      $(".flir a[href*='/anime/'], a[href*='/anime/']").first().attr("href") ||
      "";

    const prevEpisodeSlug = prevLink ? extractSlug(prevLink, "episode") : null;
    const nextEpisodeSlug = nextLink ? extractSlug(nextLink, "episode") : null;
    const animeSlug = allEpLink ? extractSlug(allEpLink, "anime") : "";

    let allEpisodes: Array<{
      title: string;
      slug: string;
      episodeNumber: string;
    }> = [];
    if (animeSlug) {
      try {
        const parentDetail = await getAnimeDetail(animeSlug);
        if (parentDetail && parentDetail.episodes) {
          allEpisodes = parentDetail.episodes.map((ep) => ({
            title: ep.title,
            slug: ep.slug,
            episodeNumber: ep.episodeNumber || "",
          }));
        }
      } catch (e) {
        console.warn("Failed fetching parent episodes:", e);
      }
    }

    // Downloads
    const downloads: DownloadQuality[] = [];
    $(".download ul").each((_, ul) => {
      const qTag = $(ul).find("strong").text().trim();
      const links: Array<{ server: string; url: string }> = [];
      $(ul)
        .find("a")
        .each((_, a) => {
          const serverName = $(a).text().trim();
          const href = $(a).attr("href") || "";
          if (serverName && href) {
            links.push({ server: serverName, url: href });
          }
        });
      if (links.length > 0) {
        downloads.push({
          quality: qTag || "MP4",
          links,
        });
      }
    });

    const epNumber = slug.match(/episode-(\d+)/i)?.[1] || "1";

    const result: EpisodeStream = {
      title,
      slug,
      animeTitle: title.replace(/Episode.*$/i, "").trim(),
      animeSlug,
      episodeNumber: epNumber,
      defaultStreamUrl:
        directMp4Url || defaultIframe || SAMPLE_FALLBACK_VIDEO,
      videoStreamUrl: directMp4Url || SAMPLE_FALLBACK_VIDEO,
      iframeSrc: defaultIframe || undefined,
      servers:
        servers.length > 0 ? servers : getMockEpisodeStream(slug).servers,
      downloads:
        downloads.length > 0 ? downloads : getMockEpisodeStream(slug).downloads,
      prevEpisodeSlug,
      nextEpisodeSlug,
      allEpisodes:
        allEpisodes.length > 0
          ? allEpisodes
          : getMockEpisodeStream(slug).allEpisodes,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`getEpisodeStream fallback for ${slug}:`, error);
    return getMockEpisodeStream(slug);
  }
}

/**
 * Search Anime by Query
 */
export async function searchAnime(query: string): Promise<AnimeCard[]> {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase();

  const customMatches: AnimeCard[] = getCustomAnime()
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q)
    )
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      thumbnail: a.thumbnail,
      rating: a.rating,
      status: a.status,
      genres: a.genres?.map((g) => g.name) || [],
    }));

  const cacheKey = `search_${q}`;
  const cached = getCached<AnimeCard[]>(cacheKey);
  if (cached) return [...customMatches, ...cached];

  try {
    const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=anime`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const results: AnimeCard[] = [];
    $(".chlist li, ul li:has(h2 a)").each((_, el) => {
      const item = $(el);
      const a = item.find("h2 a");
      const title = a.text().trim();
      const link = a.attr("href") || "";
      const slug = extractSlug(link, "anime");
      const thumbnail = item.find("img").attr("src") || "";
      const rating = item
        .find(".set:contains('Rating')")
        .text()
        .replace("Rating :", "")
        .trim();
      const status = item
        .find(".set:contains('Status')")
        .text()
        .replace("Status :", "")
        .trim();

      const genres: string[] = [];
      item.find(".set:contains('Genres') a").each((_, g) => {
        genres.push($(g).text().trim());
      });

      if (title && slug) {
        results.push({
          id: slug,
          title,
          slug,
          thumbnail,
          rating,
          status,
          genres,
        });
      }
    });

    setCache(cacheKey, results);
    return [...customMatches, ...results];
  } catch (error) {
    console.warn("searchAnime fallback:", error);
    return customMatches;
  }
}

/**
 * Get All Genres
 */
export async function getGenres(): Promise<Genre[]> {
  const cacheKey = "genres_list";
  const cached = getCached<Genre[]>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchHtml(`${BASE_URL}/genre-list/`);
    const $ = cheerio.load(html);

    const genres: Genre[] = [];
    $("a[href*='/genres/']").each((_, el) => {
      const name = $(el).text().trim();
      const href = $(el).attr("href") || "";
      const slug = extractSlug(href, "genres");
      if (name && slug && !genres.some((g) => g.slug === slug)) {
        genres.push({ name, slug });
      }
    });

    const result = genres.length > 0 ? genres : MOCK_GENRES;
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    return MOCK_GENRES;
  }
}

/**
 * Get Anime by Genre with Pagination
 */
export async function getAnimeByGenre(
  genreSlug: string,
  page = 1
): Promise<{ animeList: AnimeCard[]; genreName: string }> {
  const cacheKey = `genre_${genreSlug}_page_${page}`;
  const cached =
    getCached<{ animeList: AnimeCard[]; genreName: string }>(cacheKey);
  if (cached) return cached;

  try {
    const url =
      page === 1
        ? `${BASE_URL}/genres/${genreSlug}/`
        : `${BASE_URL}/genres/${genreSlug}/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    const genreName =
      $("h1.page-title, .archive-title")
        .text()
        .replace("Genre", "")
        .trim() || genreSlug;
    const animeList: AnimeCard[] = [];

    $(".col-anime, .chlist li, .ven_outer li, .page li").each((_, el) => {
      const item = $(el);
      const a = item.find("h2 a, .col-anime-title a");
      const title = a.text().trim();
      const link = a.attr("href") || "";
      const slug = extractSlug(link, "anime");
      const thumbnail = item.find("img").attr("src") || "";
      const rating = item
        .find(".col-anime-rating, .set:contains('Rating')")
        .text()
        .replace("Rating :", "")
        .trim();

      if (title && slug) {
        animeList.push({
          id: slug,
          title,
          slug,
          thumbnail,
          rating,
        });
      }
    });

    const result = {
      animeList: animeList.length > 0 ? animeList : MOCK_ONGOING.slice(0, 6),
      genreName: genreName || genreSlug,
    };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    return {
      animeList: MOCK_ONGOING.slice(0, 6),
      genreName: genreSlug,
    };
  }
}

/**
 * Get Schedule
 */
export async function getSchedule() {
  return MOCK_SCHEDULE;
}
