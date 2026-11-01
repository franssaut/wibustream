import { DownloadQuality } from "@/types/anime";
import { Download, ExternalLink, HardDrive } from "lucide-react";

interface DownloadSectionProps {
  downloads: DownloadQuality[];
  animeTitle?: string;
  episodeNumber?: string;
}

export default function DownloadSection({
  downloads,
  animeTitle,
  episodeNumber,
}: DownloadSectionProps) {
  if (!downloads || downloads.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-[#121721] p-5 shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
        <Download className="h-5 w-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">Download Episode</h3>
        {episodeNumber && (
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300">
            Eps {episodeNumber}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {downloads.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs">
                HD
              </span>
              <div>
                <span className="text-xs font-bold text-white">{item.quality}</span>
                {item.size && (
                  <span className="text-[11px] text-zinc-400 ml-2">({item.size})</span>
                )}
              </div>
            </div>

            {/* Server Links */}
            <div className="flex flex-wrap items-center gap-2">
              {item.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-indigo-500/50 hover:bg-indigo-600/20 hover:text-white"
                >
                  <HardDrive className="h-3 w-3 text-indigo-400" />
                  <span>{link.server}</span>
                  <ExternalLink className="h-3 w-3 text-zinc-500" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
