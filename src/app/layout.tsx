import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fancypies.com'),
  title: "Fancy Pies | Zapatería Premium - Los Mejores Zapatos a Precios Increíbles",
  description: "Fancy Pies es tu zapatería de confianza. Encuentra zapatos deportivos, formales y casuales de alta calidad a precios accesibles. Visítanos en la Pulga 59, Local 23. ¡Corre antes que se agoten!",
  keywords: [
    "zapatería",
    "zapatos",
    "zapatillas",
    "tenis",
    "zapatos formales",
    "zapatos deportivos",
    "calzado",
    "Fancy Pies",
    "Pulga 59",
    "tienda de zapatos",
    "zapatos económicos",
    "zapatos de calidad",
    "comprar zapatos",
    "calzado premium",
    "zapatillas mujer",
    "zapatillas hombre",
  ],
  authors: [{ name: "Fancy Pies" }],
  creator: "Fancy Pies",
  publisher: "Fancy Pies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/favicon.ico", sizes: "32x32" },
      { url: "/assets/favicon.ico", sizes: "64x64" },
    ],
    apple: [{ url: "/assets/logo.webp" }],
  },
  openGraph: {
    title: "Fancy Pies | Zapatería Premium - Los Mejores Zapatos",
    description: "Encuentra los mejores zapatos deportivos, formales y casuales. Precios justos, gran variedad. ¡Visítanos en la Pulga 59!",
    url: "https://fancypies.com",
    siteName: "Fancy Pies",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/assets/hero-bg.webp",
        width: 1920,
        height: 1080,
        alt: "Fancy Pies - Zapatería Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fancy Pies | Zapatería Premium",
    description: "Los mejores zapatos a precios increíbles. ¡Visítanos en la Pulga 59, Local 23!",
    images: ["/assets/hero-bg.webp"],
    creator: "@fancypies",
  },
  alternates: {
    canonical: "https://fancypies.com",
    languages: {
      "es-MX": "https://fancypies.com",
    },
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4CAF50" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fancy Pies" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
