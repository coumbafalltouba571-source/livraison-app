import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import Navbar from "@/app/components/Navbar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://livraison-app-bxgz.vercel.app";

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
  themeColor: "#2563eb",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Livraison Pro Sénégal | Livraison rapide à Dakar et Keur Massar",
    template: "%s | Livraison Pro Sénégal",
  },
  description: "Service de livraison rapide, courses, repas, colis et achats boutique à Dakar et dans toute la région. Livraison fiable, rapide et sécurisée.",
  keywords: [
    "livraison sénégal",
    "livraison dakar",
    "livreur dakar",
    "livraison keur massar",
    "livraison yoff",
    "livraison guédiawaye",
    "livraison pikine",
    "livraison rufisque",
    "livraison express sénégal",
    "service de livraison sénégal",
    "livraison pro sénégal",
  ],
  authors: [{ name: "Livraison Pro" }],
  creator: "Livraison Pro",
  publisher: "Livraison Pro",
  applicationName: "Livraison Pro Sénégal",
  manifest: "/manifest.webmanifest",
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
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: "Livraison Pro Sénégal",
    title: "Livraison Pro Sénégal | Livraison rapide à Dakar et Keur Massar",
    description: "Service de livraison rapide, courses, repas, colis et achats boutique à Dakar et dans toute la région. Livraison fiable, rapide et sécurisée.",
    images: [
      {
        url: `${SITE_URL}/logo2_app.png`,
        width: 1200,
        height: 630,
        alt: "Livraison Pro Sénégal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livraison Pro Sénégal | Livraison rapide à Dakar et Keur Massar",
    description: "Service de livraison rapide, courses, repas, colis et achats boutique à Dakar et dans toute la région. Livraison fiable, rapide et sécurisée.",
    images: [`${SITE_URL}/logo2_app.png`],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Livraison Pro Sénégal",
                  "url": SITE_URL,
                  "logo": `${SITE_URL}/logo2_app.png`,
                  "sameAs": [
                    "https://www.facebook.com/livraisonpro",
                    "https://www.instagram.com/livraisonpro",
                    "https://wa.me/221773629075"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+221773629075",
                    "contactType": "customer service",
                    "areaServed": "SN",
                    "availableLanguage": ["French"]
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "name": "Livraison Pro Sénégal",
                  "image": `${SITE_URL}/logo2_app.png`,
                  "description": "Service de livraison rapide au Sénégal",
                  "url": SITE_URL,
                  "telephone": "+221773629075",
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
                  "serviceType": "Delivery Service"
                },
                {
                  "@type": "WebSite",
                  "name": "Livraison Pro Sénégal",
                  "url": SITE_URL,
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${SITE_URL}/?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                }
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
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
