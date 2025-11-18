"use client";

import Link from "next/link";
import { Dumbbell, Twitter, Github, Instagram, Mail } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

const footerLinks = {
    product: {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "AI Coach", href: "/ai-coach" },
            { name: "Analytics", href: "/analytics" },
            { name: "Community", href: "/community" },
            { name: "Pricing", href: "#pricing" }
        ]
    },
    company: {
        title: "Company",
        links: [
            { name: "About", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Careers", href: "/careers" },
            { name: "Press", href: "/press" },
            { name: "Contact", href: "/contact" }
        ]
    },
    support: {
        title: "Support",
        links: [
            { name: "Help Center", href: "/help" },
            { name: "Documentation", href: "/docs" },
            { name: "API Reference", href: "/api" },
            { name: "Status", href: "/status" },
            { name: "Feedback", href: "/feedback" }
        ]
    },
    legal: {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
            { name: "GDPR", href: "/gdpr" }
        ]
    }
};

const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "GitHub", href: "#", icon: Github },
    { name: "Email", href: "mailto:hello@fitai.com", icon: Mail }
];

export function Footer() {
    return (
        <footer className="bg-background border-t border-border/50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 group mb-4">
                            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Dumbbell className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xl font-bold">
                                <AnimatedShinyText className="text-foreground">
                                    FitAI
                                </AnimatedShinyText>
                            </span>
                        </Link>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Transform your fitness journey with AI-powered coaching, personalized workouts,
                            and real-time analytics.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className="p-2 rounded-lg bg-background hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="sr-only">{social.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © 2024 FitAI. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <span className="text-sm text-muted-foreground">Made with ❤️ for fitness enthusiasts</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
