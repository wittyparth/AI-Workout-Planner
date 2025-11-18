"use client";

import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { BentoGrid } from "@/components/landing/bento-grid";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { AppPreviewSection } from "@/components/landing/app-preview-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Header />
            <HeroSection />
            <BentoGrid />
            <TestimonialsSection />
            <PricingSection />
            <AppPreviewSection />
            <CTASection />
            <Footer />
        </div>
    );
}
