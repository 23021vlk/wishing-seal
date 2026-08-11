import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "VLKify — send a birthday surprise",
  description:
    "Create a personalized, cinematic birthday greeting in minutes and share it with one link.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "VLKify",
    description: "A birthday surprise, wrapped in one link.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#170a20",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        {children}
        <a
          href="https://leelakrishnavemulapalli.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 text-[11px] text-white/35 hover:text-white/70 transition-colors whitespace-nowrap"
        >
          Created by VLK
        </a>
      </body>
    </html>
  );
}
