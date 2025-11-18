"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    Menu,
    Settings,
    Bell,
    User,
    Zap,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

interface AppHeaderProps {
    title: string;
    description?: string;
    onSidebarToggle?: () => void;
    showSidebar?: boolean;
    children?: React.ReactNode;
}

export function AppHeader({
    title,
    description,
    onSidebarToggle,
    showSidebar = false,
    children
}: AppHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                {showSidebar && onSidebarToggle && (
                    <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="hidden md:flex btn-linear">
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                {showSidebar && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden btn-linear">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            {children}
                        </SheetContent>
                    </Sheet>
                )}

                <div>
                    <h1 className="text-2xl font-linear-heading font-semibold">{title}</h1>
                    {description && (
                        <p className="text-sm text-muted-foreground font-linear">{description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative btn-linear">
                    <Bell className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" className="btn-linear">
                    <Settings className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" className="btn-linear">
                    <User className="h-5 w-5" />
                </Button>

                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground btn-linear font-linear" asChild>
                    <Link href="/timer">
                        <Zap className="h-4 w-4" />
                        Start Workout
                    </Link>
                </Button>
            </div>
        </header>
    )
}
