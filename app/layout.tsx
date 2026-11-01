import type { Metadata } from "next";
import "./globals.css";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";

export const metadata: Metadata = {
  title: "WibuStream - Nonton Anime Subtitle Indonesia Gratis HD",
  description:
    "Streaming dan download anime subtitle Indonesia terlengkap dan terupdate setiap hari secara gratis dengan kualitas 360p, 480p, 720p, 1080p.",
  keywords: [
    "anime sub indo",
    "streaming anime",
    "nonton anime sub indo",
    "download anime hd",
    "anime terbaru",
    "wibustream",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#0B0E14] text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
