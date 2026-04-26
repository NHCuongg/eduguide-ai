import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

import { Providers } from "./providers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
