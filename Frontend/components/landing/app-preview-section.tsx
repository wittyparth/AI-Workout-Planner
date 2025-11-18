"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Smartphone, Download, Star, ArrowRight } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";

export function AppPreviewSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <BlurFade delay={0.1} inView>
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <AnimatedShinyText className="text-primary font-medium">
                  📱 Download the app
                </AnimatedShinyText>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Maximize your returns with a
                  <br />
                  <span className="text-gradient-linear">fitness app that delivers</span>
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your phone into a personal trainer. Get AI-powered workouts, 
                  real-time form corrections, and comprehensive progress tracking right in your pocket.
                </p>
              </div>

              {/* App Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">Native Experience</h3>
                  <p className="text-sm text-muted-foreground">Optimized for iOS and Android</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">Offline Access</h3>
                  <p className="text-sm text-muted-foreground">Train anywhere, anytime</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <h3 className="font-semibold mb-1">5-Star Rated</h3>
                  <p className="text-sm text-muted-foreground">180k+ reviews</p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 bg-black hover:bg-black/90 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-black text-xs font-bold">📱</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </div>
                </Button>

                <Button size="lg" variant="outline" className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">▶</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* App Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    <NumberTicker value={4.9} />★
                  </div>
                  <p className="text-sm text-muted-foreground">App Store Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    <NumberTicker value={2} />M+
                  </div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    <NumberTicker value={150} />K+
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Right Content - Phone Mockup */}
          <BlurFade delay={0.3} inView>
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative mx-auto max-w-sm">
                <div className="relative bg-card border-8 border-border rounded-[3rem] overflow-hidden shadow-2xl">
                  <BorderBeam size={250} duration={12} delay={3} />
                  
                  {/* Phone Screen */}
                  <div className="relative bg-gradient-to-b from-background to-background/95 aspect-[9/19.5] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-2 text-xs">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-primary rounded-sm"></div>
                        <div className="w-6 h-3 border border-foreground/30 rounded-sm">
                          <div className="w-4 h-full bg-primary rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="px-6 py-4 space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">Good morning, Alex!</h3>
                          <p className="text-sm text-muted-foreground">Ready to crush today's workout?</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                      </div>

                      {/* Progress Card */}
                      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-4 border border-primary/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Today's Progress</span>
                          <span className="text-xs text-primary font-bold">85%</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2 mb-3">
                          <div className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full w-4/5"></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>2 of 3 workouts</span>
                          <span>45 min left</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-medium">Start Workout</span>
                        </div>
                        <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Star className="w-4 h-4 text-white fill-current" />
                          </div>
                          <span className="text-xs font-medium">View Progress</span>
                        </div>
                      </div>

                      {/* Weekly Stats */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">This Week</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Workouts completed</span>
                          <span className="font-bold text-primary">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Calories burned</span>
                          <span className="font-bold text-primary">2,450</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Current streak</span>
                          <span className="font-bold text-primary">12 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-6 top-1/4 bg-card border border-border/50 rounded-xl p-3 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Live Tracking</span>
                  </div>
                </div>

                <div className="absolute -left-6 bottom-1/4 bg-card border border-border/50 rounded-xl p-3 shadow-lg backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">98%</div>
                    <div className="text-xs text-muted-foreground">Form Score</div>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
