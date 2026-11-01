"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Bell,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { SiteSettings } from "@/lib/admin-store";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", text: "Pengaturan berhasil disimpan!" });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({ type: "error", text: "Gagal menyimpan pengaturan" });
      }
    } catch (e) {
      setNotification({ type: "error", text: "Terjadi kesalahan server" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="p-8 text-center text-xs text-zinc-400">
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-400" />
          Pengaturan Situs
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Sesuaikan identitas website, pesan pengumuman publik, dan konfigurasi server
        </p>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Website Card */}
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 pb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-sky-400" />
            Identitas Website
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Nama Website (Brand)
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Sumber Scraper Default
            </label>
            <input
              type="url"
              required
              value={settings.sourceUrl}
              onChange={(e) =>
                setSettings({ ...settings, sourceUrl: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Pengumuman Header Card */}
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              Banner Pengumuman Publik
            </h2>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement?.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: {
                      ...settings.announcement,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-zinc-300">
                Tampilkan di Web
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Isi Pesan Pengumuman
            </label>
            <textarea
              rows={2}
              value={settings.announcement?.text || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement: {
                    ...settings.announcement,
                    text: e.target.value,
                  },
                })
              }
              placeholder="Contoh: Selamat datang di WibuStream! Server streaming diperbarui ke resolusi HD."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Mode Pemeliharaan Card */}
        <div className="rounded-3xl border border-white/5 bg-[#121721] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Mode Pemeliharaan (Maintenance)</h3>
                <p className="text-xs text-zinc-400">
                  Jika aktif, pengunjung akan melihat layar pemberitahuan perbaikan sistem.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
