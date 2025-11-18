"use client";

import { Dumbbell, BarChart3, Users, Target, Timer, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BentoGrid, BentoCard } from "./bento-grid";

const features = [
    {
        icon: <Dumbbell className="h-8 w-8" />,
        title: "AI Personal Coach",
        description: "Get personalized workout plans and real-time form corrections powered by advanced AI algorithms that adapt to your progress.",
        size: "lg" as const,
        spotlight: true,
        image: "🤖"
    },
    {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Progress Analytics",
        description: "Track your fitness journey with detailed analytics and performance insights.",
        size: "sm" as const,
        beam: true,
        image: "📊"
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Community",
        description: "Connect with fitness enthusiasts and participate in challenges together.",
        size: "sm" as const,
        image: "👥"
    },
    {
        icon: <Target className="h-6 w-6" />,
        title: "Smart Goals",
        description: "Set and achieve realistic fitness goals with AI-powered recommendations.",
        size: "md" as const,
        meteors: true,
        image: "🎯"
    },
    {
        icon: <Timer className="h-6 w-6" />,
        title: "Workout Timer",
        description: "Advanced timer with rest periods, intervals, and custom workout sessions.",
        size: "sm" as const,
        image: "⏱️"
    },
    {
        icon: <Trophy className="h-6 w-6" />,
        title: "1000+ Exercises",
        description: "Access our comprehensive library of exercises with video demonstrations and detailed instructions.",
        size: "sm" as const,
        beam: true,
        image: "🏆"
    }
];

const stats = [
    { label: "Active Users", value: 50000, suffix: "+" },
    { label: "Workouts Completed", value: 2500000, suffix: "+" },
    { label: "Success Rate", value: 94, suffix: "%" },
    { label: "Expert Trainers", value: 150, suffix: "+" }
];

function FeatureCard({ feature, delay }: { feature: typeof features[0], delay: number }) {
    return (
        <BlurFade delay={delay} inView>
            <BentoCard
                size={feature.size}
                spotlight={feature.spotlight}
                beam={feature.beam}
                meteors={feature.meteors}
                className="p-6 hover:scale-[1.02] transition-transform duration-300"
            >
                <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                        </div>
                    </div>

                    <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                        {feature.description}
                    </p>

                    <div className="mt-auto">
                        <div className="w-full h-24 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-lg flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
                            <span className="text-4xl">{feature.image}</span>
                        </div>
                    </div>
                </div>
            </BentoCard>
        </BlurFade>
    );
}

function StatsSection() {
    return (
        <BlurFade delay={0.8} inView>
            <BentoCard size="xl" particles className="p-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="text-center mb-8 relative z-10">
                    <TextAnimate animation="slideUp" className="text-3xl font-bold mb-4">
                        Trusted by Thousands Worldwide
                    </TextAnimate>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                                <NumberTicker value={stat.value} />
                                {stat.suffix}
                            </div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </BentoCard>
        </BlurFade>
    );
}

export function FeaturesSection() {
    return (
        <section className="py-24 px-4" id="features">
            <div className="container mx-auto">
                <BlurFade delay={0.25}>
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-6">
                            <AnimatedGradientText>Premium Features</AnimatedGradientText>
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            <TextAnimate animation="blurInUp" by="word">
                                Everything You Need to Succeed
                            </TextAnimate>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Our comprehensive platform combines cutting-edge AI technology with proven fitness methodologies.
                        </p>
                    </div>
                </BlurFade>

                <BentoGrid className="mb-12">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            feature={feature}
                            delay={0.1 * (index + 1)}
                        />
                    ))}
                </BentoGrid>

                <StatsSection />
            </div>
        </section>
    );
}
