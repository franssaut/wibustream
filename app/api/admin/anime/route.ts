import { NextRequest, NextResponse } from "next/server";
import {
  getCustomAnime,
  addCustomAnime,
  deleteCustomAnime,
} from "@/lib/admin-store";
import { getHomeData } from "@/lib/scraper";

export async function GET(req: NextRequest) {
  try {
    const customList = getCustomAnime();
    const homeData = await getHomeData();

    const scrapedList = [...homeData.ongoing, ...homeData.completed]
      .filter((a) => !customList.some((c) => c.slug === a.slug))
      .map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        thumbnail: a.thumbnail,
        rating: a.rating || "8.5",
        status: a.status || "Ongoing",
        type: "TV",
        totalEpisodes: a.currentEpisode || "12",
        duration: "24 min.",
        releaseDate: a.releaseDate || "2026",
        studio: "Otakudesu Scraped",
        genres: (a.genres || ["Action", "Adventure"]).map((g) => ({
          name: g,
          slug: g.toLowerCase(),
        })),
        synopsis: "Anime dari sumber sinkronisasi Otakudesu.",
        episodes: [
          {
            title: `${a.title} Episode Terbaru`,
            slug: `${a.slug}-latest`,
            episodeNumber: "1",
          },
        ],
        isCustom: false,
      }));

    const customWithFlag = customList.map((a) => ({
      ...a,
      isCustom: true,
    }));

    return NextResponse.json({
      animeList: [...customWithFlag, ...scrapedList],
      totalCustom: customList.length,
      totalScraped: scrapedList.length,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Judul dan Slug wajib diisi" },
        { status: 400 }
      );
    }

    const newAnime = {
      id: body.slug,
      title: body.title,
      japaneseTitle: body.japaneseTitle || "",
      slug: body.slug,
      thumbnail:
        body.thumbnail ||
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
      rating: body.rating || "8.5",
      status: body.status || "Ongoing",
      type: body.type || "TV",
      totalEpisodes: body.totalEpisodes || "12",
      duration: body.duration || "24 min.",
      releaseDate: body.releaseDate || new Date().getFullYear().toString(),
      studio: body.studio || "Independent Studio",
      genres: Array.isArray(body.genres)
        ? body.genres.map((g: string | { name: string; slug: string }) =>
            typeof g === "string"
              ? { name: g, slug: g.toLowerCase().replace(/\s+/g, "-") }
              : g
          )
        : [{ name: "Action", slug: "action" }],
      synopsis: body.synopsis || "Sinopsis anime belum ditambahkan.",
      episodes: body.episodes || [],
    };

    addCustomAnime(newAnime);

    return NextResponse.json({
      success: true,
      message: "Anime berhasil disimpan",
      anime: newAnime,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save anime" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug wajib disertakan" }, { status: 400 });
    }

    deleteCustomAnime(slug);
    return NextResponse.json({ success: true, message: "Anime berhasil dihapus" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete anime" }, { status: 500 });
  }
}
