import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MachineViewToggle from "@/components/MachineViewToggle";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { SITE_SOCIAL_IMAGE } from "@/lib/socialShare";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Daily intelligence on AI search engines, discovery shifts, and how machines are reshaping how information is found. Independent analysis from the Paralax editorial team.",
  keywords: [
    "AI search",
    "AI engines",
    "Google AI Mode",
    "Perplexity",
    "ChatGPT search",
    "AI discovery",
    "generative search",
    "LLM search",
    "AI search news",
    "search intelligence",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Daily intelligence on AI search engines, discovery shifts, and how machines are reshaping how information is found.",
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Daily intelligence on AI search engines, discovery shifts, and how machines are reshaping how information is found.",
    images: [{ url: SITE_SOCIAL_IMAGE.url, alt: SITE_SOCIAL_IMAGE.alt }],
  },
  icons: {
    icon: ["/favicon.svg"],
    shortcut: ["/favicon.svg"],
    apple: ["/favicon.svg"],
  },
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SITE_URL + "/#organization",
      name: SITE_NAME,
      description:
        "Independent AI search intelligence publication covering how AI engines are reshaping information discovery.",
      url: SITE_URL,
      mainEntityOfPage: { "@type": "WebPage", "@id": SITE_URL },
      knowsAbout: [
        "AI Search",
        "Generative Engine Optimization",
        "AI Discovery",
        "Large Language Models",
        "Search Intelligence",
      ],
    },
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL,
      name: SITE_NAME,
      description: "Daily intelligence on AI search engines and the discovery shift.",
      publisher: { "@type": "Organization", "@id": SITE_URL + "/#organization" },
      potentialAction: [{ "@type": "ReadAction", target: SITE_URL + "/blog" }],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="paralax-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("paralax-theme");var r=document.documentElement;r.classList.remove("light","dark");if(t==="light")r.classList.add("light");else if(t==="dark")r.classList.add("dark")}catch(e){}})();`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <link rel="alternate" type="application/rss+xml" title={SITE_NAME} href={SITE_URL + "/feed.xml"} />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
      </head>
      <body className="min-h-screen bg-transparent font-sans text-nothing-primary antialiased">
        <Nav />
        <main data-human-content>{children}</main>
        <Footer />
        <MachineViewToggle />
      </body>
    </html>
  );
}
