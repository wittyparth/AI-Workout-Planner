"use client";

import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Marquee } from "@/components/magicui/marquee";
import { Meteors } from "@/components/magicui/meteors";
import { BlurFade } from "@/components/magicui/blur-fade";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Fitness Enthusiast",
        content: "FitAI transformed my workout routine completely. The AI coach feels like having a personal trainer 24/7!",
        avatar: "👩‍💼",
        rating: 5
    },
    {
        name: "Mike Chen",
        role: "Professional Athlete",
        content: "The analytics and progress tracking helped me optimize my training and achieve new personal records.",
        avatar: "🏃‍♂️",
        rating: 5
    },
    {
        name: "Emily Davis",
        role: "Busy Professional",
        content: "Finally found a fitness app that adapts to my schedule. The quick workouts are perfect for my lifestyle.",
        avatar: "💼",
        rating: 5
    },
    {
        name: "Alex Rodriguez",
        role: "Fitness Coach",
        content: "I recommend FitAI to all my clients. The exercise library and form corrections are incredibly accurate.",
        avatar: "💪",
        rating: 5
    },
    {
        name: "Lisa Thompson",
        role: "Marathon Runner",
        content: "The personalized training plans helped me shave 15 minutes off my marathon time. Incredible results!",
        avatar: "🏃‍♀️",
        rating: 5
    },
    {
        name: "David Kim",
        role: "Gym Owner",
        content: "Our gym members love the FitAI integration. It's revolutionized how we approach personal training.",
        avatar: "🏋️‍♂️",
        rating: 5
    }
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
    return (
        <Card className="w-80 mx-4 relative overflow-hidden group hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/30">
            <Meteors number={15} />
            <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {testimonial.avatar}
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                </div>

                <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.content}"
                </p>
            </CardContent>
        </Card>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-24 overflow-hidden bg-gradient-to-b from-background to-primary/5">
            <div className="container mx-auto px-4 mb-16">
                <BlurFade delay={0.25}>
                    <div className="text-center">
                        <Badge variant="outline" className="mb-6">
                            <Zap className="mr-2 h-4 w-4" />
                            Testimonials
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            <TextAnimate animation="slideUp">
                                Loved by Thousands
                            </TextAnimate>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join the community of fitness enthusiasts who have transformed their lives with FitAI
                        </p>
                    </div>
                </BlurFade>
            </div>

            <Marquee className="py-4" pauseOnHover>
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                ))}
            </Marquee>

            <Marquee className="py-4" pauseOnHover reverse>
                {testimonials.slice().reverse().map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                ))}
            </Marquee>
        </section>
    );
}
