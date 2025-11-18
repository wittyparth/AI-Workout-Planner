"use client";

import { ArrowRight, Zap, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Meteors } from "@/components/magicui/meteors";
import { BorderBeam } from "@/components/magicui/border-beam";

export function CTASection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/20 to-slate-900" />
            
            <div className="container mx-auto max-w-4xl relative z-10">
                <BlurFade delay={0.1} inView>
                    <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center overflow-hidden">
                        <BorderBeam size={300} duration={15} delay={5} />
                        <Meteors number={30} />
                        
                        <div className="relative z-10 space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
                                <AnimatedShinyText className="text-primary font-medium">
                                    🚀 Ready to level up your fitness process?
                                </AnimatedShinyText>
                            </div>

                            {/* Headline */}
                            <div className="space-y-4">
                                <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                                    Ready to level up your
                                    <br />
                                    <span className="text-gradient-linear">fitness process?</span>
                                </h2>
                                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                    Join thousands who've transformed their lives with AI-powered fitness coaching. 
                                    Start your journey today.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <ShimmerButton className="px-8 py-4 text-lg font-semibold">
                                    <span className="flex items-center gap-2">
                                        <Zap className="w-5 h-5" />
                                        Start Free Trial
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                </ShimmerButton>
                                
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="px-8 py-4 text-lg bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
                                >
                                    Learn More
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
                                <div className="flex items-center justify-center gap-2 text-slate-300">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span className="text-sm">No credit card required</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-slate-300">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span className="text-sm">14-day free trial</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-slate-300">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span className="text-sm">Cancel anytime</span>
                                </div>
                            </div>

                            {/* Social Proof */}
                            <div className="pt-6">
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-400">
                                    Trusted by 50,000+ fitness enthusiasts worldwide
                                </p>
                            </div>
                        </div>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}
