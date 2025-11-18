"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started with basic fitness tracking",
      features: [
        "Basic workout tracking",
        "Exercise library access",
        "Community features",
        "Progress photos",
        "Mobile app access",
        "Email support"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "Everything you need to transform your fitness journey",
      features: [
        "All Free features",
        "AI Personal Coach",
        "Real-time form correction",
        "Advanced analytics",
        "Custom workout plans",
        "Nutrition tracking",
        "Priority support",
        "Unlimited workout history",
        "Wearable device sync",
        "Progress predictions"
      ],
      popular: true,
      cta: "Start Premium Trial"
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <AnimatedShinyText className="text-primary font-medium">
                💎 Simple, transparent pricing
              </AnimatedShinyText>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to level up your
              <br />
              <span className="text-gradient-linear">fitness journey?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your goals. Start free, upgrade when you're ready to unlock your full potential.
            </p>
          </div>
        </BlurFade>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <BlurFade key={plan.name} delay={0.2 + index * 0.1} inView>
              <div className={cn(
                "relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 transition-all duration-300 hover:border-primary/30",
                plan.popular && "border-primary/30 scale-105"
              )}>
                {plan.popular && (
                  <>
                    <BorderBeam size={300} duration={15} delay={5} />
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white border-none px-4 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  </>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-purple-500" 
                          : "bg-muted"
                      )}>
                        {plan.popular ? (
                          <Zap className="w-5 h-5 text-white" />
                        ) : (
                          <Star className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                          plan.popular 
                            ? "bg-primary text-white" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    {plan.popular ? (
                      <ShimmerButton className="w-full">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white">
                          {plan.cta}
                        </span>
                      </ShimmerButton>
                    ) : (
                      <Button variant="outline" size="lg" className="w-full">
                        {plan.cta}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Additional Info */}
        <BlurFade delay={0.5} inView>
          <div className="text-center mt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              All plans include a 14-day free trial. No credit card required for Free plan.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
