"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navigation = [
        { name: "Features", href: "#features" },
        { name: "Solutions", href: "#solutions" },
        { name: "Company", href: "#company" },
        { name: "Learn", href: "#learn" },
    ];

    return (
        <BlurFade delay={0.1}>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
                        : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                            </div>
                            <span className="text-2xl font-bold">
                                <AnimatedShinyText className="text-foreground">
                                    FitAI
                                </AnimatedShinyText>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <ShimmerButton className="px-6 py-2 text-sm">
                                    <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white">
                                        Sign Up
                                    </span>
                                </ShimmerButton>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-xl">
                            <div className="px-6 py-8 space-y-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block text-foreground hover:text-primary transition-colors text-lg font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-6 space-y-4 border-t border-border/50">
                                    <Link href="/auth/login" className="block">
                                        <Button variant="outline" size="lg" className="w-full justify-center">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register" className="block">
                                        <Button size="lg" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </BlurFade>
    );
}
