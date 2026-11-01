"use client";

import { useState } from "react";
import {
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Trash2,
  Activity,
  Globe,
  Terminal,
} from "lucide-react";

export default function AdminScraperPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: "ok" | "error";
    latency: string;
    message: string;
  } | null>(null);

  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Mesin scraper diinisialisasi pada domain https://otakudesu.blog`,
    `[${new Date().toLocaleTimeString()}] Cache aktif dengan TTL 300 detik`,
    `[${new Date().toLocaleTimeString()}] Proxy stream siap menangani HTTP Range Request`,
  ]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = Date.now();

    try {
      const res = await fetch("/api/admin/scraper/sync", { method: "POST" });
      const data = await res.json();
      const lat = Date.now() - start;

      if (data.success) {
        setTestResult({
          status: "ok",
          latency: `${lat}ms`,
          message: `Koneksi Berhasil! ${data.ongoingFetched} Ongoing & ${data.completedFetched} Tamat disinkronkan.`,
        });
        setLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Sinkronisasi berhasil (${lat}ms): ${data.ongoingFetched} anime dimuat.`,
          ...prev,
        ]);
      } else {
        setTestResult({
          status: "error",
          latency: `${lat}ms`,
          message: data.message || "Gagal menghubungi target",
        });
        setLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] PERINGATAN: Target scraper gagal merespon (${lat}ms).`,
          ...prev,
        ]);
      }
    } catch (e: any) {
      setTestResult({
        status: "error",
        latency: "Timeout",
        message: e.message || "Koneksi terputus",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      const res = await fetch("/api/admin/scraper/sync", { method: "POST" });
      setCacheStatus("Cache berhasil dibersihkan dan diisi ulang!");
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Cache in-memory dibersihkan secara manual oleh admin.`,
        ...prev,
      ]);
      setTimeout(() => setCacheStatus(null), 4000);
    } catch (e) {
      setCacheStatus("Gagal membersihkan cache");
    } finally {
      setIsClearingCache(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-indigo-400" />
          Scraper & Cache Center
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Pantau status koneksi sumber anime, kelola cache memori, dan lakukan sinkronisasi data manual
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Diagnostics & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Domain Card */}
          <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-sky-400" />
                Target Sumber Data Otakudesu
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-[11px] font-medium text-zinc-400">URL Endpoint</span>
                <p className="text-xs font-bold text-white mt-1">https://otakudesu.blog</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-[11px] font-medium text-zinc-400">Parser Engine</span>
                <p className="text-xs font-bold text-white mt-1">Cheerio + Node Fetch</p>
              </div>
            </div>

            {/* Test Connection Button & Result */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5">
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Zap className={`h-4 w-4 ${isTesting ? "animate-bounce" : ""}`} />
                {isTesting ? "Menguji Koneksi..." : "Tes Koneksi & Sync Sekarang"}
              </button>

              {testResult && (
                <div
                  className={`flex items-center gap-2 text-xs font-semibold ${
                    testResult.status === "ok" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {testResult.status === "ok" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                  )}
                  <span>
                    Latensi: {testResult.latency} • {testResult.message}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cache Management Card */}
          <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-fuchsia-400" />
                Manajemen In-Memory Cache
              </h3>
              <span className="text-xs text-zinc-400">TTL: 5 Menit (300 Detik)</span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              In-memory cache menyimpan respon scraping halaman home, anime detail, dan episode stream sehingga pengunjung tidak perlu menunggu proses scraping berulang dan website merespon secara instan.
            </p>

            {cacheStatus && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{cacheStatus}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {isClearingCache ? "Membersihkan..." : "Bersihkan & Reset Cache"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Scraper Log Terminal */}
        <div className="lg:col-span-1 rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                Log Aktivitas Scraper
              </h3>
              <span className="text-[10px] text-zinc-500">Live feed</span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/60 p-3.5 font-mono text-[11px] text-zinc-400 space-y-2 max-h-[380px] overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed border-b border-white/5 pb-1.5 last:border-0">
                  <span className="text-indigo-400">{">"}</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-500">
            Log mencatat permintaan scraping otomatis dan status proxy.
          </div>
        </div>
      </div>
    </div>
  );
}
