import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://lazytype.omprakashbharti.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LazyType — Fast AI dictation for macOS",
  description:
    "LazyType is a free, open source Mac dictation app. Hold a key, talk, and get clean AI-polished text pasted anywhere. By SamNickGammer.",
  applicationName: "LazyType",
  authors: [{ name: "SamNickGammer", url: "https://github.com/SamNickGammer" }],
  keywords: [
    "dictation",
    "speech to text",
    "macOS",
    "voice typing",
    "AI transcription",
    "LazyType",
  ],
  openGraph: {
    title: "LazyType — Fast AI dictation for macOS",
    description:
      "Hold a key, talk, and get clean AI-polished text pasted anywhere. Free and open source.",
    url: SITE_URL,
    siteName: "LazyType",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LazyType — Fast AI dictation for macOS",
    description:
      "Hold a key, talk, and get clean AI-polished text pasted anywhere. Free and open source.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
