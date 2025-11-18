"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Star, Users, Trophy, Activity } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Particles } from "@/components/magicui/particles";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color="#5E6AD2"
          refresh
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <BlurFade delay={0.1} inView>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  #1 AI Fitness App
                </Badge>
              </BlurFade>

              <BlurFade delay={0.2} inView>
                <div className="space-y-4">
                  <AnimatedGradientText className="text-5xl lg:text-7xl font-bold leading-tight">
                    Transform Your Body
                  </AnimatedGradientText>
                  <h2 className="text-5xl lg:text-7xl font-bold leading-tight text-foreground">
                    with <span className="text-gradient-linear">AI-Powered</span> Fitness
                  </h2>
                </div>
              </BlurFade>

              <BlurFade delay={0.3} inView>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Get personalized workouts, real-time form corrections, and comprehensive progress tracking. 
                  Transform your fitness journey with cutting-edge AI technology.
                </p>
              </BlurFade>

              <BlurFade delay={0.4} inView>
                <div className="flex flex-col sm:flex-row gap-4">
                  <AnimatedSubscribeButton
                    buttonColor="#5E6AD2"
                    buttonTextColor="#ffffff"
                    subscribeStatus={false}
                    initialText={
                      <span className="group inline-flex items-center">
                        Start Free Trial
                        <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    }
                    changeText={
                      <span className="group inline-flex items-center">
                        <Activity className="mr-2 size-4" />
                        Let's Transform!
                      </span>
                    }
                  />
                  
                  <Button variant="outline" size="lg" className="group border-2 hover:border-primary/50">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </div>
              </BlurFade>

              {/* Stats Section */}
              <BlurFade delay={0.5} inView>
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-primary">
                      <NumberTicker value={1000000} />
                      <span>+</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Workouts Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-primary">
                      <NumberTicker value={50000} />
                      <span>+</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Happy Users</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-primary">
                      <NumberTicker value={99} />
                      <span>%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
                  </div>
                </div>
              </BlurFade>
            </div>

            {/* Right Content - App Mockup */}
            <BlurFade delay={0.6} inView>
              <div className="relative">
                {/* Main App Card */}
                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
                  <BorderBeam size={300} duration={12} delay={9} />
                  
                  {/* App Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Today's Workout</h3>
                      <p className="text-sm text-muted-foreground">Upper Body Strength</p>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${75 * 2.51}, ${100 * 2.51}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5E6AD2" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">75%</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold">24 min</p>
                      <p className="text-sm text-muted-foreground">remaining</p>
                    </div>
                  </div>

                  {/* Exercise List */}
                  <div className="space-y-3">
                    {[
                      { name: "Push-ups", sets: "3 sets", status: "completed" },
                      { name: "Bench Press", sets: "4 sets", status: "current" },
                      { name: "Incline Flys", sets: "3 sets", status: "pending" },
                    ].map((exercise, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          exercise.status === "completed" && "bg-green-500",
                          exercise.status === "current" && "bg-primary animate-pulse",
                          exercise.status === "pending" && "bg-muted-foreground/30"
                        )} />
                        <div className="flex-1">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">{exercise.sets}</p>
                        </div>
                        {exercise.status === "completed" && (
                          <Trophy className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-card border border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Community</p>
                      <p className="text-xs text-muted-foreground">2.1k online</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-card border border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Form: Perfect!</p>
                      <p className="text-xs text-green-500">AI Analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
