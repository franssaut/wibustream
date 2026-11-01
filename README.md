# WibuStream - Website Streaming Video Anime Subtitle Indonesia + Admin Dashboard

Website streaming anime modern berbasis **Next.js 14 (App Router)**, **TypeScript**, dan **Tailwind CSS** dengan integrasi langsung database anime subtitle Indonesia terupdate serta **Admin Dashboard Control Panel** lengkap.

---

## 🔐 Admin Dashboard

Admin Dashboard dapat diakses di:
👉 **[http://localhost:3000/admin](http://localhost:3000/admin)** (atau login di **[http://localhost:3000/admin/login](http://localhost:3000/admin/login)**)

### Kredensial Login Default:
- **Username**: `admin`
- **Password**: `admin123`

### Fitur Admin Dashboard:
1. **Ringkasan Analitik (*Dashboard Overview*)**:
   - Total anime terkatalog, total episode, estimasi penonton harian, dan indikator status server & scraper online.
   - Grafik distribusi genre anime terpopuler.
   - Tabel update anime terbaru dengan status, rating, dan tipe sumber.
2. **Kelola Anime (*Anime Management*)**:
   - Daftar seluruh anime (Ongoing, Completed, Scraped dari Otakudesu, maupun Custom Admin).
   - Filter berdasarkan status & sumber data serta pencarian instan.
   - Hapus anime kustom secara langsung.
3. **Tambah Anime Baru (*Add Anime*)**:
   - Form lengkap: Judul Anime, Auto-generated Slug, Judul Jepang, URL Poster (dengan *live preview*), Status, Tipe (TV/Movie/OVA), Rating, Studio, Pilihan Genre dinamis, Sinopsis, dan Episode 1 default stream.
   - Anime yang ditambahkan langsung otomatis tampil di Beranda, Pencarian, dan Halaman Detail publik.
4. **Kelola Episode (*Episode Manager*)**:
   - Pilih anime dari dropdown.
   - Tambah episode baru dengan Nomor Episode, Judul, URL Video MP4, dan URL Iframe Embed.
   - Pemutar langsung (*Quick Play*) untuk verifikasi episode.
5. **Scraper & Cache Control Center**:
   - Cek latensi dan status koneksi ke target scraper (*Live Ping 200 OK*).
   - Bersihkan dan reset in-memory cache memori (TTL 5 menit).
   - Log konsol aktivitas scraping dan permintaan proxy.
6. **Pengaturan Situs (*Site Settings*)**:
   - Ubah Nama Website dan Tagline secara instan.
   - Atur Banner Pengumuman Publik di bagian atas situs (Aktif/Nonaktif, Teks Pengumuman).
   - Saklar Mode Pemeliharaan (*Maintenance Mode*).

---

## 🌟 Fitur Utama Website Publik

1. **Streaming Video Responsif & Interaktif**:
   - Custom HTML5 Video Player dengan tema bioskop gelap (*dark glassmorphism*).
   - Kontrol pemutar: Play/Pause, Forward/Rewind 10 detik, Volume slider, Fullscreen, Kecepatan putar (0.5x - 2.0x).
   - Mode Bioskop (*Cinema Light Switch*) yang meredupkan lampu halaman.
   - Pilihan Server Streaming (Server Utama HD, Server Backup, Server Embed Iframe).
   - Hitung mundur otomatis menuju episode selanjutnya saat episode selesai.
   - Penyimpanan titik tontonan terakhir (*resume playback*).

2. **Koleksi & Katalog Lengkap**:
   - **Beranda**: Hero Carousel banner anime trending, Episode Terbaru (Ongoing), Anime Tamat (Completed), dan Jadwal Rilis Hari Ini.
   - **Ongoing Anime**: Katalog anime yang sedang rilis musim ini dengan paginasi.
   - **Anime Tamat**: Koleksi anime lengkap dari episode 1 hingga tamat dengan skor & rating.
   - **Jadwal Rilis**: Jadwal tayang anime harian dari Senin hingga Minggu.
   - **Katalog 35+ Genre**: Filter anime berdasarkan Action, Romance, Isekai, Shounen, Fantasy, Comedy, Sci-Fi, dll.

3. **Pencarian Cepat (Instant Autocomplete Search)**:
   - Pencarian judul anime dengan dropdown *live preview* dan halaman hasil pencarian lengkap.

4. **Fitur Pengguna**:
   - **Bookmark / Watchlist**: Simpan anime favorit ke daftar tontonan pribadi (`localStorage`).
   - **Riwayat Tontonan (Watch History)**: Melacak episode yang pernah ditonton beserta persentase durasi tonton.
   - **Download Section**: Link unduhan episode dengan berbagai pilihan resolusi (360p, 480p, 720p HD) dan mirror server.

5. **Proxy Stream Range Support**:
   - Route handler `/api/stream/proxy` yang mendukung HTTP Range request untuk pemutaran video MP4 lancar tanpa kendala CORS/Referer restriction.

---

## 🚀 Cara Menjalankan

### Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### Mode Produksi (Production Build)
```bash
npm run build
npm start
```
Buka Dashboard Admin di [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📁 Struktur Direktori

```
StreamAnime/
├── app/
│   ├── layout.tsx                # Root layout dengan PublicLayoutWrapper
│   ├── page.tsx                  # Beranda (Hero Banner, Ongoing, Tamat, Jadwal)
│   ├── globals.css               # Styling Tailwind, scrollbar & dark theme
│   ├── anime/[slug]/             # Halaman Detail Anime & Daftar Episode
│   ├── episode/[slug]/           # Halaman Streaming Player & Link Download
│   ├── ongoing/                  # Halaman Katalog Anime Ongoing
│   ├── completed/                # Halaman Katalog Anime Tamat
│   ├── jadwal/                   # Halaman Jadwal Rilis Mingguan
│   ├── genres/                   # Halaman Katalog Semua Genre
│   ├── search/                   # Halaman Hasil Pencarian Anime
│   ├── bookmark/                 # Halaman Anime Tersimpan (Watchlist)
│   ├── history/                  # Halaman Riwayat Tontonan
│   ├── admin/                    # ADMIN DASHBOARD
│   │   ├── layout.tsx            # Admin Sidebar & Topbar Chrome
│   │   ├── page.tsx              # Dashboard Utama (Overview & Analitik)
│   │   ├── login/                # Halaman Login Admin
│   │   ├── anime/                # Kelola Seluruh Anime
│   │   │   └── new/              # Form Tambah Anime Baru
│   │   ├── episodes/             # Kelola Episode Anime
│   │   ├── scraper/              # Kontrol Scraper & In-Memory Cache
│   │   └── settings/             # Pengaturan Nama Web & Banner Pengumuman
│   └── api/
│       ├── admin/                # Admin API Handlers (Auth, Anime, Stats, Scraper, Settings)
│       ├── anime/                # Public API Handlers
│       └── stream/proxy/         # Proxy Stream Video dengan Range Requests
├── components/
│   ├── Navbar.tsx                # Header dengan navigasi & instant search
│   ├── Footer.tsx                # Footer informasi & disclaimer
│   ├── AnnouncementBanner.tsx    # Banner pengumuman publik dinamis
│   ├── HeroBanner.tsx            # Carousel anime trending
│   ├── AnimeCard.tsx             # Card anime poster & status badges
│   ├── VideoPlayer.tsx           # Custom Video Player HD & Cinema Mode
│   ├── EpisodeSelector.tsx       # Selector episode interaktif & filter
│   └── BookmarkButton.tsx        # Tombol simpan bookmark
├── lib/
│   ├── admin-store.ts            # Penyimpanan data custom anime & pengaturan
│   ├── scraper.ts                # Engine data fetcher & scraper terintegrasi
│   ├── mock-data.ts              # Dataset cadangan berkecepatan tinggi
│   └── utils.ts                  # Helper format waktu & styling
└── package.json
```
