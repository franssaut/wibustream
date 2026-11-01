"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Tv,
  RefreshCw,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
  Bell,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // If on login page, render children directly without dashboard chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/scraper/sync", { method: "POST" });
      const data = await res.json();
      alert(data.message || "Sinkronisasi selesai!");
      router.refresh();
    } catch (e) {
      alert("Gagal sinkronisasi");
    } finally {
      setIsSyncing(false);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Kelola Anime", href: "/admin/anime", icon: Film },
    { label: "Tambah Anime", href: "/admin/anime/new", icon: PlusCircle },
    { label: "Kelola Episode", href: "/admin/episodes", icon: Tv },
    { label: "Scraper & Cache", href: "/admin/scraper", icon: RefreshCw },
    { label: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080B10] text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-white/5 bg-[#0D1117] p-4 shrink-0">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-600/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                Wibu<span className="text-indigo-400">Admin</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-medium">Control Panel v1.0</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Menu Utama
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Logout */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
              Lihat Website
            </span>
            <span className="text-[10px] text-zinc-500">Live ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#0D1117]/80 px-4 sm:px-6 backdrop-blur-md">
          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="text-sm font-bold text-white">Admin Dashboard</span>
          </div>

          {/* Desktop Status Pill */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Scraper Online • Otakudesu Live Feed
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              title="Sinkronkan anime terbaru"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-400 ${isSyncing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync Scraper</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white">
                AD
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-bold text-white">Admin Master</span>
                <span className="text-[10px] text-zinc-400">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileOpen && (
          <div className="md:hidden border-b border-white/5 bg-[#0D1117] p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
