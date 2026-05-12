import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pinyin Lyrics",
  description: "A focused CJK lyric reader with pinyin, romaji, and Korean romanization support."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
