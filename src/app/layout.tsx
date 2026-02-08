import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EduGuide AI - Master Any Subject",
  description: "Your personalized AI-powered study companion. Generate custom curriculums, flashcards, and quizzes designed to help you learn faster and retain more.",
  keywords: ["AI learning", "curriculum generator", "study cards", "edtech", "self-education"],
  authors: [{ name: "Pet Manager Team" }],
  openGraph: {
    title: "EduGuide AI - Master Any Subject",
    description: "Your personalized AI-powered study companion.",
    type: "website",
    locale: "en_US",
    siteName: "EduGuide AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduGuide AI - Master Any Subject",
    description: "Your personalized AI-powered study companion.",
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${outfit.variable} antialiased bg-background text-foreground font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
