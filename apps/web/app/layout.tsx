import type { Metadata, Viewport } from "next";
import {
  absoluteSiteUrl,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Pinyin Lyrics" }],
  creator: "Pinyin Lyrics",
  publisher: "Pinyin Lyrics",
  keywords: [
    "pinyin lyrics",
    "CJK romanization",
    "Chinese lyrics pinyin",
    "Cantonese Jyutping lyrics",
    "Japanese romaji lyrics",
    "Korean lyrics romanization",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    type: "website",
    url: absoluteSiteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1013" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
