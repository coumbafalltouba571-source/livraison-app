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
  metadataBase: new URL("https://livraisonpro-senegal.com"),
  title: "Livraison SN - Livraison rapide à Dakar et Keur Massar",
  description: "Service de livraison rapide, courses, repas, colis et achats boutique à Dakar. Disponible 24h/24.",
  keywords: "livraison sénégal, livraison dakar, livreur dakar, livraison keur massar, livraison yoff, livraison guédiawaye, livraison pikine, livraison rufisque, livraison express sénégal, service de livraison sénégal, livraison pro sénégal",
  authors: [{ name: "Livraison Pro" }],
  creator: "Livraison Pro",
  publisher: "Livraison Pro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://livraisonpro-senegal.com",
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://livraisonpro-senegal.com",
    siteName: "Livraison Pro Sénégal",
    title: "Livraison SN - Livraison rapide à Dakar et Keur Massar",
    description: "Service de livraison rapide, courses, repas, colis et achats boutique à Dakar. Disponible 24h/24.",
    images: [
      {
        url: "https://livraisonpro-senegal.com/logo2_app.png",
        width: 1200,
        height: 630,
        alt: "Livraison Pro Sénégal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livraison SN - Livraison rapide à Dakar et Keur Massar",
    description: "Service de livraison rapide, courses, repas, colis et achats boutique à Dakar. Disponible 24h/24.",
    images: ["https://livraisonpro-senegal.com/logo2_app.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "Livraison",
  classification: "Service de Livraison",
  verification: {
    google: "lMa-CgLKm7W2d21OXryG32bZ2WHvr7N7untNs5zrOYQ",
  },
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
        height: "auto",
        overflow: "visible",
      }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Livraison Pro Sénégal",
              "image": "https://livraisonpro-senegal.com/logo2_app.png",
              "description": "Service de livraison rapide au Sénégal",
              "url": "https://livraisonpro-senegal.com",
              "telephone": "+221 77 XXX XXXX",
              "email": "contact@livraisonpro-senegal.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Dakar",
                "addressLocality": "Dakar",
                "addressRegion": "Dakar",
                "postalCode": "00000",
                "addressCountry": "SN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 14.7167,
                "longitude": -17.4674
              },
              "areaServed": {
                "@type": "Place",
                "name": "Sénégal"
              },
              "priceRange": "AFCFA",
              "serviceType": "Delivery Service",
              "sameAs": [
                "https://www.facebook.com/livraisonpro",
                "https://www.instagram.com/livraisonpro",
                "https://wa.me/221XXX"
              ]
            }),
          }}
        />
      </head>
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
