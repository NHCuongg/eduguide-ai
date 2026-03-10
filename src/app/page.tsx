'use client'

import { Suspense } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Hero from "@/components/landing/Hero"
import Navbar from "@/components/landing/Navbar"

// Lazy-load below-fold sections to reduce initial bundle size
const Features = dynamic(() => import("@/components/landing/Features"), { ssr: true })
const VideoSection = dynamic(() => import("@/components/landing/VideoSection"), { ssr: true })
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"), { ssr: true })
const TestimonialSection = dynamic(() => import("@/components/landing/TestimonialSection"), { ssr: true })
const PricingSection = dynamic(() => import("@/components/landing/PricingSection"), { ssr: true })
const CTASection = dynamic(() => import("@/components/landing/CTASection"), { ssr: true })
const PrivacySection = dynamic(() => import("@/components/landing/PrivacySection"), { ssr: true })
const FAQSection = dynamic(() => import("@/components/landing/FAQSection"), { ssr: true })
const BlogSection = dynamic(() => import("@/components/landing/BlogSection"), { ssr: true })
const Footer = dynamic(() => import("@/components/landing/Footer"), { ssr: true })
const ScrollToTop = dynamic(() => import("@/components/landing/ScrollToTop"), { ssr: false })

function SectionFallback() {
  return <div className="w-full h-48 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
}

export default function Home() {
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
      >
        <Navbar />

        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <VideoSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <HowItWorksSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TestimonialSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTASection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PrivacySection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </motion.main>
      <ScrollToTop />
    </>
  );
}
