"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Tv,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { StreamServer } from "@/types/anime";

interface VideoPlayerProps {
  streamUrl: string;
  iframeSrc?: string;
  servers: StreamServer[];
  title: string;
  animeTitle: string;
  episodeNumber: string;
  prevEpisodeSlug?: string | null;
  nextEpisodeSlug?: string | null;
  onEpisodeEnd?: () => void;
}

export default function VideoPlayer({
  streamUrl,
  iframeSrc,
  servers,
  title,
  animeTitle,
  episodeNumber,
  prevEpisodeSlug,
  nextEpisodeSlug,
  onEpisodeEnd,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [useIframeMode, setUseIframeMode] = useState(
    Boolean(iframeSrc && iframeSrc.includes("drive.google.com"))
  );
  const [selectedServer, setSelectedServer] = useState<StreamServer | null>(
    servers.length > 0 ? servers[0] : null
  );
  const [hasEnded, setHasEnded] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Active stream source: if server has isEmbed or is iframe, we use iframe; else MP4 via proxy
  const activeVideoUrl = selectedServer?.isEmbed
    ? null
    : selectedServer?.url
    ? `/api/stream/proxy?url=${encodeURIComponent(selectedServer.url)}`
    : streamUrl
    ? `/api/stream/proxy?url=${encodeURIComponent(streamUrl)}`
    : null;

  const activeIframeSrc = selectedServer?.isEmbed ? selectedServer.url : iframeSrc;

  // Restore saved progress
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `stream_progress_${title}`;
    const saved = localStorage.getItem(key);
    if (saved && videoRef.current) {
      const parsedTime = parseFloat(saved);
      if (parsedTime > 0 && parsedTime < (videoRef.current.duration || 10000)) {
        videoRef.current.currentTime = parsedTime;
      }
    }
  }, [title]);

  // Save progress & history
  const saveProgress = useCallback(
    (time: number) => {
      if (typeof window === "undefined" || !title) return;
      localStorage.setItem(`stream_progress_${title}`, time.toString());

      // Save to watch history
      const historyKey = "wibustream_history";
      try {
        const raw = localStorage.getItem(historyKey);
        const history = raw ? JSON.parse(raw) : [];
        const existingIdx = history.findIndex((h: any) => h.title === title);
        const item = {
          title,
          animeTitle,
          episodeNumber,
          timestamp: Date.now(),
          currentTime: time,
          duration: videoRef.current?.duration || 0,
        };
        if (existingIdx !== -1) {
          history[existingIdx] = item;
        } else {
          history.unshift(item);
        }
        localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 30)));
      } catch (e) {
        console.error("Save history error:", e);
      }
    },
    [title, animeTitle, episodeNumber]
  );

  // Auto hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Skip time
  const handleSeekDelta = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.min(Math.max(videoRef.current.currentTime + delta, 0), duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Scrubber click
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSettings(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeekDelta(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeekDelta(5);
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyL":
          e.preventDefault();
          setIsCinemaMode((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted, duration]);

  // Video time update listener
  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    if (Math.floor(cur) % 5 === 0) {
      saveProgress(cur);
    }

    // Buffer percentage
    if (videoRef.current.buffered.length > 0) {
      const buffEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered((buffEnd / (videoRef.current.duration || 1)) * 100);
    }
  };

  // When video ends
  const onEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    if (onEpisodeEnd) onEpisodeEnd();
  };

  // Countdown for next episode
  useEffect(() => {
    if (!hasEnded || !nextEpisodeSlug) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = `/episode/${nextEpisodeSlug}`;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasEnded, nextEpisodeSlug]);

  return (
    <>
      {/* Cinema Mode Backdrop */}
      {isCinemaMode && (
        <div
          onClick={() => setIsCinemaMode(false)}
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={`group relative overflow-hidden rounded-2xl bg-black shadow-2xl transition-all duration-300 ${
          isCinemaMode ? "relative z-50 ring-2 ring-indigo-500/50" : ""
        }`}
      >
        {/* Switch Between Native Video Player & Iframe Embed */}
        {!useIframeMode && activeVideoUrl ? (
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              src={activeVideoUrl}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={onEnded}
              onClick={togglePlay}
              className="h-full w-full object-contain cursor-pointer"
              playsInline
            />

            {/* Big Centered Play/Pause Button on Pause or Video Overlay */}
            {!isPlaying && !hasEnded && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600/90 text-white shadow-2xl shadow-indigo-600/60 backdrop-blur-md transition-transform hover:scale-110">
                  <Play className="h-8 w-8 fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Video Controls Bar */}
            <div
              className={`absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Progress Scrubber */}
              <div className="relative mb-3 flex items-center group/scrubber">
                {/* Buffered track */}
                <div
                  className="absolute h-1.5 rounded-full bg-white/20 transition-all group-hover/scrubber:h-2"
                  style={{ width: `${buffered}%` }}
                />
                {/* Played track */}
                <div
                  className="absolute h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all group-hover/scrubber:h-2"
                  style={{
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleScrubberChange}
                  className="relative z-10 w-full cursor-pointer opacity-0 h-4"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-white" />
                    ) : (
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    )}
                  </button>

                  {/* Skip Rewind 10s */}
                  <button
                    onClick={() => handleSeekDelta(-10)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
                    title="Mundur 10 detik"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  {/* Skip Forward 10s */}
                  <button
                    onClick={() => handleSeekDelta(10)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
                    title="Maju 10 detik"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>

                  {/* Volume Slider & Toggle */}
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-5 w-5 text-rose-400" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 cursor-pointer accent-indigo-500 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-xs font-medium text-zinc-300 ml-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Cinema / Light Mode Toggle */}
                  <button
                    onClick={() => setIsCinemaMode(!isCinemaMode)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isCinemaMode
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                    title="Mode Bioskop (Lampu)"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </button>

                  {/* Playback Speed Setting */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                      title="Pengaturan Kecepatan"
                    >
                      <Settings className="h-4 w-4" />
                    </button>

                    {showSettings && (
                      <div className="absolute bottom-10 right-0 w-36 rounded-xl border border-white/10 bg-[#121721] p-1.5 shadow-2xl backdrop-blur-md z-30">
                        <div className="text-[11px] font-semibold text-zinc-400 px-2.5 py-1 uppercase tracking-wider">
                          Kecepatan
                        </div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                              playbackSpeed === s
                                ? "bg-indigo-600 font-semibold text-white"
                                : "text-zinc-300 hover:bg-white/5"
                            }`}
                          >
                            <span>{s === 1 ? "Normal (1x)" : `${s}x`}</span>
                            {playbackSpeed === s && <Check className="h-3.5 w-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Iframe Embed Player Mode */
          <div className="relative aspect-video w-full bg-zinc-950">
            {activeIframeSrc ? (
              <iframe
                src={activeIframeSrc}
                allowFullScreen
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-zinc-400">
                <Tv className="h-12 w-12 text-zinc-600 mb-2" />
                <p className="text-sm">Server video tidak merespon.</p>
                <button
                  onClick={() => setUseIframeMode(false)}
                  className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Gunakan Server MP4 Langsung
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next Episode Countdown Overlay */}
        {hasEnded && nextEpisodeSlug && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 backdrop-blur-md z-30">
            <p className="text-sm text-zinc-400">Episode Selesai</p>
            <h3 className="mt-1 text-lg font-bold text-white text-center">
              Memutar Episode Selanjutnya dalam {countdown} detik...
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setHasEnded(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Batal
              </button>
              <Link
                href={`/episode/${nextEpisodeSlug}`}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Putar Sekarang
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Server & Player Controls Bar Below Player */}
      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#121721] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Server Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mr-1">
            <Tv className="h-3.5 w-3.5 text-indigo-400" />
            Pilih Server:
          </span>

          {servers.map((server) => {
            const isSelected = selectedServer?.id === server.id;
            return (
              <button
                key={server.id}
                onClick={() => {
                  setSelectedServer(server);
                  setUseIframeMode(server.isEmbed);
                  setHasEnded(false);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {server.name}
              </button>
            );
          })}

          {/* Toggle Iframe / MP4 fallback */}
          {iframeSrc && (
            <button
              onClick={() => setUseIframeMode(!useIframeMode)}
              className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20"
            >
              {useIframeMode ? "Beralih ke MP4 Player" : "Mode Iframe Player"}
            </button>
          )}
        </div>

        {/* Prev / Next Episode Buttons */}
        <div className="flex items-center gap-2">
          {prevEpisodeSlug ? (
            <Link
              href={`/episode/${prevEpisodeSlug}`}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev Eps
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-600 cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev Eps
            </button>
          )}

          {nextEpisodeSlug ? (
            <Link
              href={`/episode/${nextEpisodeSlug}`}
              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500"
            >
              Next Eps
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-600 cursor-not-allowed"
            >
              Next Eps
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
