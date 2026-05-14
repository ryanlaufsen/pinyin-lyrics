import type { Metadata, Viewport } from "next";
import {
  absoluteSiteUrl,
  legalEntityName,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const cjkCharacterStyleFontHref =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&family=Noto+Sans+TC:wght@400;700;900&family=Noto+Sans+HK:wght@400;700;900&family=Noto+Sans+JP:wght@400;700;900&family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+SC:wght@400;700;900&family=Noto+Serif+TC:wght@400;700;900&family=Noto+Serif+HK:wght@400;700;900&family=Noto+Serif+JP:wght@400;700;900&family=Noto+Serif+KR:wght@400;700;900&family=Ma+Shan+Zheng&family=LXGW+WenKai+TC:wght@400;700&family=Yuji+Boku&family=Nanum+Brush+Script&family=ZCOOL+KuaiLe&family=Huninn&family=Hachi+Maru+Pop&family=Zen+Maru+Gothic:wght@400;700;900&family=Gaegu:wght@400;700&family=Caveat:wght@400;700&family=Comic+Neue:wght@400;700&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: legalEntityName }],
  creator: legalEntityName,
  publisher: legalEntityName,
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={cjkCharacterStyleFontHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
