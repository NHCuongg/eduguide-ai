'use client'

import { motion } from "framer-motion"
import Hero from "@/components/landing/Hero"
import Navbar from "@/components/landing/Navbar"
import Features from "@/components/landing/Features"
import CTASection from "@/components/landing/CTASection"
import VideoSection from "@/components/landing/VideoSection"
import PricingSection from "@/components/landing/PricingSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import TestimonialSection from "@/components/landing/TestimonialSection"
import PrivacySection from "@/components/landing/PrivacySection"
import BlogSection from "@/components/landing/BlogSection"
import FAQSection from "@/components/landing/FAQSection"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    >
      <Navbar />

      <Hero />
      <Features />
      <VideoSection />
      <HowItWorksSection />
      <TestimonialSection />
      <PricingSection />
      <CTASection />
      <PrivacySection />
      <FAQSection />
      <BlogSection />
      <Footer />
    </motion.main>
  );
}
