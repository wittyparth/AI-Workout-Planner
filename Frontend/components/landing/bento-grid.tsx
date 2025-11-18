"use client";

import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { Meteors } from "@/components/magicui/meteors";
import { Particles } from "@/components/magicui/particles";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { 
  Brain, 
  BarChart3, 
  Dumbbell, 
  Timer, 
  Users, 
  Eye, 
  Target, 
  BookOpen,
  Star,
  CheckCircle,
  TrendingUp,
  Activity
} from "lucide-react";

export function BentoGrid() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <Particles
        className="absolute inset-0"
        quantity={50}
        ease={80}
        color="#5E6AD2"
        refresh
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <AnimatedShinyText className="text-primary font-medium">
                ✨ Features that set us apart
              </AnimatedShinyText>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Experience that grows
              <br />
              <span className="text-gradient-linear">with your scale</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed to simplify operations under that accelerate your business and drive fitness goals faster.
            </p>
          </div>
        </BlurFade>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          {/* AI Personal Coach - Large Feature */}
          <BlurFade delay={0.2} inView>
            <div className="lg:col-span-2 lg:row-span-2">
              <MagicCard className="p-0 h-full border-none">
                <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 rounded-3xl p-8 h-full overflow-hidden">
                  <BorderBeam size={300} duration={15} delay={5} />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">AI Personal Coach</h3>
                        <p className="text-muted-foreground">24/7 intelligent guidance</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">Personalized workout plans</span>
                        </div>
                        <p className="text-sm text-muted-foreground">AI analyzes your fitness level and creates custom routines</p>
                      </div>

                      <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">Real-time form corrections</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Computer vision technology for perfect form</p>
                      </div>

                      <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">Adaptive training</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Workouts adapt based on your progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </div>
          </BlurFade>

          {/* Progress Analytics */}
          <BlurFade delay={0.3} inView>
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Progress Analytics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Calories burned</span>
                  <span className="font-bold text-lg text-primary">
                    <NumberTicker value={2400} />
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-3/4 transition-all duration-1000" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weekly goal</span>
                  <span className="font-bold text-lg text-primary">75%</span>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Exercise Library */}
          <BlurFade delay={0.4} inView>
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Exercise Library</h3>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  <NumberTicker value={1000} />+
                </div>
                <p className="text-sm text-muted-foreground mb-4">Exercises available</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/20 rounded-lg p-2">
                    <BookOpen className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <span>Video guides</span>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-2">
                    <Target className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <span>Muscle groups</span>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Smart Timer */}
          <BlurFade delay={0.5} inView>
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Smart Timer</h3>
              </div>
              
              <div className="relative">
                <div className="w-20 h-20 mx-auto relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#timer-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${60 * 2.51}, ${100 * 2.51}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">2:45</span>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">Rest time</p>
              </div>
            </div>
          </BlurFade>

          {/* Community */}
          <BlurFade delay={0.6} inView>
            <div className="lg:col-span-2">
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 group h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Community & Challenges</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      <NumberTicker value={50000} />+
                    </div>
                    <p className="text-xs text-muted-foreground">Active members</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      <NumberTicker value={180} />
                    </div>
                    <p className="text-xs text-muted-foreground">Challenges</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      <NumberTicker value={24} />%
                    </div>
                    <p className="text-xs text-muted-foreground">More motivation</p>
                  </div>
                </div>

                <div className="mt-4 flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-full border-2 border-card flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{i}</span>
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-bold">+</span>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Bottom Stats Section */}
        <BlurFade delay={0.7} inView>
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 rounded-3xl p-8 border border-border/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Why users prefer FitAI</h3>
              <p className="text-muted-foreground">Thousands have already started their transformation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  <NumberTicker value={24} />%
                </div>
                <p className="text-sm text-muted-foreground font-medium">Faster results</p>
                <p className="text-xs text-muted-foreground">vs traditional fitness apps</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white fill-current" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  <NumberTicker value={180} />k
                </div>
                <p className="text-sm text-muted-foreground font-medium">5-star reviews</p>
                <p className="text-xs text-muted-foreground">on app stores worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  <NumberTicker value={10} />+
                </div>
                <p className="text-sm text-muted-foreground font-medium">Million transformations</p>
                <p className="text-xs text-muted-foreground">and counting</p>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
