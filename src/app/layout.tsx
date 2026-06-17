import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description =
  "University of Lagos Engineering Society Sport Festival 2026 (USF'26). All or Nothing. Live fixtures, results and standings across football, basketball, volleyball, tennis and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "USF'26 — ULES Sport Festival 2026",
    template: "%s — USF'26",
  },
  description,
  applicationName: "USF'26",
  keywords: [
    "USF26",
    "ULES Sport Festival",
    "University of Lagos",
    "UNILAG Engineering",
    "sport festival 2026",
    "fixtures",
    "results",
    "standings",
    "All or Nothing",
  ],
  authors: [{ name: "University of Lagos Engineering Society" }],
  creator: "University of Lagos Engineering Society",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "USF'26 — ULES Sport Festival 2026",
    title: "USF'26 — ULES Sport Festival 2026",
    description,
    url: siteUrl,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "USF'26 — ULES Sport Festival 2026",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0c2c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        {/* Clash Display (Fontshare) — stand-in for Base Neue until brand fonts arrive */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
