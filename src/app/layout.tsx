import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "EduGuide AI - Master Any Subject",
  description: "A study planner that turns a topic and your weekly hours into a roadmap with modules, quizzes, and flashcards.",
  keywords: ["AI learning", "curriculum generator", "study cards", "edtech", "self-education"],
  authors: [{ name: "Pet Manager Team" }],
  openGraph: {
    title: "EduGuide AI - Master Any Subject",
    description: "A study planner you'll actually use.",
    type: "website",
    locale: "en_US",
    siteName: "EduGuide AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduGuide AI - Master Any Subject",
    description: "A study planner you'll actually use.",
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={sans.variable}>
      <body className="antialiased bg-background text-foreground font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
