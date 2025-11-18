"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Activity,
    Calendar,
    Clock,
    Dumbbell,
    Flame,
    Menu,
    Moon,
    Sun,
    Target,
    TrendingUp,
    Users,
    Zap,
    ChevronLeft,
    ChevronRight,
    History,
    BarChart3,
    Settings,
    Bell,
    User,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect } from "react"

const sidebarItems = [
    { icon: Activity, label: "Dashboard", active: true, href: "/" },
    { icon: Dumbbell, label: "Workouts", href: "/workouts" },
    { icon: Clock, label: "Timer", href: "/timer" },
    { icon: BarChart3, label: "Analytics", href: "/progress" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Target, label: "Goals", href: "/goals" },
    { icon: Zap, label: "AI Coach", href: "/ai-coach" },
]

function CleanSidebar({
    className,
    collapsed = false,
    onToggle,
}: { className?: string; collapsed?: boolean; onToggle?: () => void }) {
    return (
        <div
            className={cn(
                "flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
                collapsed ? "w-16" : "w-64",
                className,
            )}
        >
            {/* Logo Header */}
            <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                {!collapsed ? (
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-heading font-semibold text-sidebar-foreground">FitFlow AI</span>
                    </Link>
                ) : (
                    <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
                        <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {sidebarItems.map((item) => (
                    <Button
                        key={item.label}
                        variant={item.active ? "default" : "ghost"}
                        className={cn(
                            "h-11 transition-all duration-200 btn-clean",
                            collapsed ? "w-8 px-0 justify-center" : "w-full justify-start gap-3",
                            item.active
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                        asChild
                    >
                        <Link href={item.href} title={collapsed ? item.label : undefined}>
                            <item.icon className="h-5 w-5" />
                            {!collapsed && item.label}
                        </Link>
                    </Button>
                ))}
            </nav>

            {/* Collapse Toggle */}
            {onToggle && (
                <div className="p-4 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="w-full justify-center btn-clean"
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            )}

            {/* Streak Card */}
            {!collapsed && (
                <div className="p-4 border-t border-sidebar-border">
                    <Card className="card-clean">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Current Streak</span>
                            </div>
                            <div className="text-2xl font-bold text-primary">7 days</div>
                            <p className="text-xs text-muted-foreground">Keep going strong!</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

function CleanHeader({ onSidebarToggle, sidebarCollapsed }: { onSidebarToggle: () => void; sidebarCollapsed: boolean }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <header className="flex h-16 items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="hidden md:flex btn-clean">
                    <Menu className="h-5 w-5" />
                </Button>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden btn-clean">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <CleanSidebar />
                    </SheetContent>
                </Sheet>

                <div>
                    <h1 className="text-2xl font-heading font-semibold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Welcome back! Ready for today's workout?</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative btn-clean">
                    <Bell className="h-5 w-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative overflow-hidden btn-clean"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Button variant="ghost" size="icon" className="btn-clean">
                    <User className="h-5 w-5" />
                </Button>

                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground btn-clean" asChild>
                    <Link href="/timer">
                        <Zap className="h-4 w-4" />
                        Start Workout
                    </Link>
                </Button>
            </div>
        </header>
    )
}

function StatsCard({
    title,
    value,
    change,
    icon: Icon,
    trend,
}: {
    title: string
    value: string
    change: string
    icon: any
    trend: "up" | "down"
}) {
    return (
        <Card className="card-clean">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={cn(
                    "text-xs flex items-center gap-1",
                    trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                    <TrendingUp className={cn("h-3 w-3", trend === "down" && "rotate-180")} />
                    {change} from last week
                </p>
            </CardContent>
        </Card>
    )
}

function WorkoutCalendar() {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Mock workout data - days with workouts
    const workoutDays = [2, 5, 8, 12, 15, 18, 22, 25, 28]
    const currentStreak = 7

    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const hasWorkout = workoutDays.includes(day)
        const isToday = day === today.getDate()

        days.push(
            <div
                key={day}
                className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    isToday && "ring-2 ring-primary ring-offset-2",
                    hasWorkout ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
            >
                {day}
            </div>,
        )
    }

    return (
        <Card className="card-clean">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Workout Calendar
                </CardTitle>
                <CardDescription>
                    <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-orange-600">{currentStreak} day streak!</span>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">{days}</div>
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span>Workout completed</span>
                        </div>
                        <span className="text-muted-foreground">{workoutDays.length} workouts this month</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function WorkoutHistory() {
    const recentWorkouts = [
        {
            id: 1,
            name: "Upper Body Strength",
            date: "Today",
            duration: "45 min",
            exercises: 8,
            calories: 320,
            intensity: "high" as const,
        },
        {
            id: 2,
            name: "HIIT Cardio",
            date: "Yesterday",
            duration: "30 min",
            exercises: 6,
            calories: 280,
            intensity: "peak" as const,
        },
        {
            id: 3,
            name: "Lower Body Power",
            date: "2 days ago",
            duration: "50 min",
            exercises: 10,
            calories: 380,
            intensity: "high" as const,
        },
        {
            id: 4,
            name: "Recovery Yoga",
            date: "3 days ago",
            duration: "35 min",
            exercises: 12,
            calories: 150,
            intensity: "low" as const,
        },
        {
            id: 5,
            name: "Full Body Circuit",
            date: "4 days ago",
            duration: "40 min",
            exercises: 9,
            calories: 340,
            intensity: "medium" as const,
        },
    ]

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case "low":
                return "bg-blue-500"
            case "medium":
                return "bg-green-500"
            case "high":
                return "bg-orange-500"
            case "peak":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    return (
        <Card className="card-clean">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Workout History
                </CardTitle>
                <CardDescription>Your recent training sessions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {recentWorkouts.map((workout) => (
                        <div
                            key={workout.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("h-3 w-3 rounded-full", getIntensityColor(workout.intensity))} />
                                <div>
                                    <p className="font-medium">{workout.name}</p>
                                    <p className="text-sm text-muted-foreground">{workout.date}</p>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <p className="font-medium">{workout.duration}</p>
                                <p className="text-muted-foreground">{workout.calories} cal</p>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4 btn-clean" asChild>
                        <Link href="/workouts">View All Workouts</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function CleanDashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen bg-background">
            <CleanSidebar
                className="hidden md:flex"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CleanHeader
                    onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    sidebarCollapsed={sidebarCollapsed}
                />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatsCard title="Workouts This Week" value="4" change="+2" icon={Dumbbell} trend="up" />
                            <StatsCard title="Calories Burned" value="2,847" change="+12%" icon={Flame} trend="up" />
                            <StatsCard title="Active Minutes" value="287" change="+8%" icon={Clock} trend="up" />
                            <StatsCard title="Personal Records" value="3" change="+1" icon={Target} trend="up" />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Today's Workout */}
                            <Card className="lg:col-span-2 card-clean">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Today's Workout
                                    </CardTitle>
                                    <CardDescription>Upper Body Strength - 45 minutes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Progress</span>
                                        <span className="text-sm text-muted-foreground">0 of 3 exercises</span>
                                    </div>
                                    <Progress value={0} className="h-2" />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg gradient-primary text-white">
                                            <div>
                                                <p className="font-medium">Bench Press</p>
                                                <p className="text-sm opacity-90">4 sets × 8 reps</p>
                                            </div>
                                            <Badge className="bg-white/20 text-white">Ready</Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div>
                                                <p className="font-medium">Incline Dumbbell Press</p>
                                                <p className="text-sm text-muted-foreground">3 sets × 10 reps</p>
                                            </div>
                                            <Badge variant="outline">Pending</Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div>
                                                <p className="font-medium">Push-ups</p>
                                                <p className="text-sm text-muted-foreground">3 sets × 15 reps</p>
                                            </div>
                                            <Badge variant="outline">Pending</Badge>
                                        </div>
                                    </div>

                                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground btn-clean" asChild>
                                        <Link href="/timer">
                                            <Clock className="h-4 w-4" />
                                            Start Workout
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <div className="space-y-6">
                                <Card className="card-clean">
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 btn-clean"
                                            asChild
                                        >
                                            <Link href="/ai-coach">
                                                <Zap className="h-4 w-4" />
                                                AI Workout Generator
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 btn-clean"
                                            asChild
                                        >
                                            <Link href="/timer">
                                                <Clock className="h-4 w-4" />
                                                Start Timer
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 btn-clean"
                                            asChild
                                        >
                                            <Link href="/progress">
                                                <TrendingUp className="h-4 w-4" />
                                                View Analytics
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-3 btn-clean"
                                            asChild
                                        >
                                            <Link href="/goals">
                                                <Target className="h-4 w-4" />
                                                Set Goals
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="card-clean">
                                    <CardHeader>
                                        <CardTitle>Weekly Goal</CardTitle>
                                        <CardDescription>5 workouts this week</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>4 of 5 completed</span>
                                                <span>80%</span>
                                            </div>
                                            <Progress value={80} className="h-2" />
                                            <p className="text-xs text-muted-foreground">1 more workout to reach your goal!</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <WorkoutCalendar />
                            <WorkoutHistory />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
