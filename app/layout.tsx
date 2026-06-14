import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Livraison Pro - Gestion des Livraisons",
  description: "Plateforme moderne de gestion des livraisons à Dakar. Dashboard admin, suivi GPS en temps réel, tarification automatique.",
  keywords: "livraison, Dakar, GPS, tracking, admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <body 
        className="min-h-full flex flex-col"
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {children}
      </body>
    </html>
  );
}
