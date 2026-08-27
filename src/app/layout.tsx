import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "greek"],
});

const BASE_URL = "https://1na.gr";

export const viewport: Viewport = {
  themeColor: "#213576",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Φροντιστηριακός Όμιλος ΕΝΑ | 1na.gr",
    template: "%s | Φροντιστήριο ΕΝΑ",
  },
  description:
    "Ο Φροντιστηριακός Όμιλος ΕΝΑ — η σίγουρη επιλογή για Πανελλαδικές εξετάσεις. Τμήματα Γυμνασίου, Λυκείου & ΕΠΑΛ στο Ηράκλειο Κρήτης και Αττική. 25+ χρόνια αριστείας, 5.000+ επιτυχόντες.",
  keywords: [
    "φροντιστήριο",
    "φροντιστήριο Ηράκλειο",
    "φροντιστήριο ΕΝΑ",
    "1na.gr",
    "Πανελλαδικές εξετάσεις",
    "βάσεις εισαγωγής 2025",
    "υπολογιστής μορίων",
    "μηχανογραφικό",
    "φροντιστήριο Αλιμος",
    "φροντιστήριο Αγιος Δημήτριος",
    "Γυμνάσιο",
    "Λύκειο",
    "ΕΠΑΛ",
  ],
  authors: [{ name: "Φροντιστηριακός Όμιλος ΕΝΑ", url: BASE_URL }],
  creator: "Φροντιστηριακός Όμιλος ΕΝΑ",
  publisher: "Φροντιστηριακός Όμιλος ΕΝΑ",
  category: "education",
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
  alternates: {
    canonical: BASE_URL,
    languages: {
      "el-GR": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: BASE_URL,
    siteName: "Φροντιστηριακός Όμιλος ΕΝΑ",
    title: "Φροντιστηριακός Όμιλος ΕΝΑ | 1na.gr",
    description:
      "Ο Φροντιστηριακός Όμιλος ΕΝΑ — η σίγουρη επιλογή για Πανελλαδικές εξετάσεις. 25+ χρόνια αριστείας, 5.000+ επιτυχόντες.",
    images: [
      {
        url: "/images/arxiki.jpg",
        width: 1200,
        height: 630,
        alt: "Φροντιστηριακός Όμιλος ΕΝΑ — Η Σίγουρη Επιλογή προς την Επιτυχία",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Φροντιστηριακός Όμιλος ΕΝΑ | 1na.gr",
    description:
      "Ο Φροντιστηριακός Όμιλος ΕΝΑ — η σίγουρη επιλογή για Πανελλαδικές εξετάσεις. 25+ χρόνια αριστείας.",
    images: ["/images/arxiki.jpg"],
  },
  verification: {
    // google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE", // Uncomment and add code when verifying
  },
};

/* ── JSON-LD: Local Business structured data ── */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${BASE_URL}/#organization`,
      name: "Φροντιστηριακός Όμιλος ΕΝΑ",
      alternateName: "Φροντιστήριο ΕΝΑ",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/arxiki.jpg`,
        width: 1200,
        height: 630,
      },
      description:
        "Ο Φροντιστηριακός Όμιλος ΕΝΑ παρέχει ποιοτική εκπαίδευση για Γυμνάσιο, Λύκειο & ΕΠΑΛ με στόχο την επιτυχία στις Πανελλαδικές εξετάσεις.",
      foundingDate: "1999",
      areaServed: ["Ηράκλειο Κρήτης", "Αλιμος", "Αγιος Δημήτριος"],
      location: [
        {
          "@type": "LocalBusiness",
          name: "Φροντιστηριακός Όμιλος ΕΝΑ — Κέντρο Ηρακλείου",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Γραμβούσης 5 & Καγιαμπή",
            addressLocality: "Ηράκλειο",
            addressRegion: "Κρήτη",
            addressCountry: "GR",
          },
          telephone: "+302810285726",
          email: "info@1na.gr",
          url: BASE_URL,
          priceRange: "€€",
        },
        {
          "@type": "LocalBusiness",
          name: "Φροντιστηριακός Όμιλος ΕΝΑ — Κνωσός",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Λεωφ. Κνωσού 187",
            addressLocality: "Ηράκλειο",
            addressRegion: "Κρήτη",
            addressCountry: "GR",
          },
          telephone: "+302810212333",
          email: "knwssos@1na.gr",
          url: BASE_URL,
          priceRange: "€€",
        },
        {
          "@type": "LocalBusiness",
          name: "Φροντιστηριακός Όμιλος ΕΝΑ — Άλιμος",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ησιόδου 18",
            addressLocality: "Άλιμος",
            addressRegion: "Αττική",
            addressCountry: "GR",
          },
          telephone: "+302109913433",
          email: "1isiodou@ena.edu.gr",
          url: BASE_URL,
          priceRange: "€€",
        },
      ],
      sameAs: [
        "https://www.facebook.com/1na.gr/",
        "https://www.instagram.com/frontistirio.ena/",
        "https://www.tiktok.com/@frontistrioena",
        "https://www.youtube.com/channel/UCfmVMF00ZV2bNehoGGG_SOw",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Φροντιστηριακός Όμιλος ΕΝΑ",
      inLanguage: "el",
      publisher: {
        "@id": `${BASE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/bases?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
