"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Activity,
  Clock,
  Dumbbell,
  Filter,
  Heart,
  Menu,
  Moon,
  Search,
  Star,
  Sun,
  Target,
  TrendingUp,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  Play,
  Bookmark,
  Share2,
  History,
  Calendar,
  Award,
  Flame,
  CheckCircle,
  XCircle,
  PauseCircle,
  RotateCcw,
  Trash2,
  MoreVertical,
  Plus,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { WorkoutHistoryEntry, LikedWorkout, BookmarkedWorkout, WorkoutFilter, SortOption } from "@/lib/types/workout-history"
import { workoutHistory, likedWorkouts, bookmarkedWorkouts } from "@/data/workouts/workout-data"
import { createdWorkouts, CreatedWorkout } from "@/data/workouts/created-workouts"

const sidebarItems = [
  { icon: Activity, label: "Dashboard", active: false, href: "/" },
  { icon: Dumbbell, label: "Workouts", active: true, href: "/workouts" },
  { icon: Clock, label: "Timer", href: "/timer" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Zap, label: "AI Coach", href: "/ai-coach" },
]

const workoutCategories = [
  "All Workouts",
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "Flexibility",
  "Bodyweight",
  "Powerlifting",
]

const workouts = [
  {
    id: 1,
    title: "Upper Body Strength",
    description: "Build muscle and strength in your chest, shoulders, and arms",
    duration: "45 min",
    difficulty: "Intermediate",
    exercises: 8,
    category: "Strength Training",
    rating: 4.8,
    reviews: 234,
    image: "/gym-upper-body-workout.jpg",
    isBookmarked: true,
  },
  {
    id: 2,
    title: "HIIT Cardio Blast",
    description: "High-intensity interval training for maximum calorie burn",
    duration: "30 min",
    difficulty: "Advanced",
    exercises: 6,
    category: "HIIT",
    rating: 4.9,
    reviews: 189,
    image: "/hiit-cardio-workout.png",
    isBookmarked: false,
  },
  {
    id: 3,
    title: "Morning Yoga Flow",
    description: "Gentle stretches and poses to start your day right",
    duration: "25 min",
    difficulty: "Beginner",
    exercises: 12,
    category: "Yoga",
    rating: 4.7,
    reviews: 156,
    image: "/morning-yoga-flow.jpg",
    isBookmarked: true,
  },
  {
    id: 4,
    title: "Full Body Bodyweight",
    description: "No equipment needed for this complete body workout",
    duration: "35 min",
    difficulty: "Intermediate",
    exercises: 10,
    category: "Bodyweight",
    rating: 4.6,
    reviews: 298,
    image: "/bodyweight-workout.png",
    isBookmarked: false,
  },
  {
    id: 5,
    title: "Leg Day Destroyer",
    description: "Intense lower body workout for strength and power",
    duration: "50 min",
    difficulty: "Advanced",
    exercises: 9,
    category: "Strength Training",
    rating: 4.8,
    reviews: 167,
    image: "/leg-day-workout.png",
    isBookmarked: false,
  },
  {
    id: 6,
    title: "Core & Abs Burner",
    description: "Target your core with these effective exercises",
    duration: "20 min",
    difficulty: "Intermediate",
    exercises: 7,
    category: "Bodyweight",
    rating: 4.5,
    reviews: 203,
    image: "/core-abs-workout.jpg",
    isBookmarked: true,
  },
]

function Sidebar({
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
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">FitFlow AI</span>
          </Link>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "h-11 transition-all duration-200",
              collapsed ? "w-8 px-0 justify-center" : "w-full justify-start gap-3",
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
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

      {onToggle && (
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" onClick={onToggle} className="w-full justify-center">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}

function Header({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="hidden md:flex">
          <Menu className="h-5 w-5" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-sm text-muted-foreground">Discover and start your perfect workout</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative overflow-hidden"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="outline" className="gap-2" asChild>
          <Link href="/workouts/create">
            <Plus className="h-4 w-4" />
            Create Workout
          </Link>
        </Button>

        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" asChild>
          <Link href="/ai-coach">
            <Zap className="h-4 w-4" />
            Generate Workout
          </Link>
        </Button>
      </div>
    </header>
  )
}

function WorkoutHistoryCard({ workout }: { workout: WorkoutHistoryEntry }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "paused":
        return <PauseCircle className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <Play className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {workout.workoutTitle}
              {getStatusIcon(workout.status)}
            </CardTitle>
            <CardDescription className="text-sm">
              {formatDate(workout.startTime)} • {workout.workoutType}
            </CardDescription>
          </div>
          <Badge className={cn("ml-2", getStatusColor(workout.status))}>
            {workout.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {workout.duration}m
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              {workout.exercisesCompleted}/{workout.totalExercises}
            </div>
            {workout.caloriesBurned && (
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                {workout.caloriesBurned} cal
              </div>
            )}
          </div>
          <span className="text-sm font-medium">
            {workout.completionPercentage}%
          </span>
        </div>

        {workout.personalRecords && workout.personalRecords.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <Award className="h-4 w-4" />
            <span>{workout.personalRecords.length} PR{workout.personalRecords.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {workout.notes && (
          <p className="text-sm text-muted-foreground italic">"{workout.notes}"</p>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href="/timer">
              <RotateCcw className="h-4 w-4 mr-1" />
              Repeat
            </Link>
          </Button>
          <Button size="sm" variant="ghost" className="px-3">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LikedWorkoutCard({ workout }: { workout: LikedWorkout }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={workout.thumbnail || "/placeholder.svg"}
          alt={workout.workoutTitle}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <Badge className={cn("absolute bottom-2 left-2", getDifficultyColor(workout.difficulty))}>
          {workout.difficulty}
        </Badge>
        <Button size="sm" variant="secondary" className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700">
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{workout.workoutTitle}</CardTitle>
        <CardDescription className="text-sm">{workout.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {workout.duration}
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {workout.exercises} exercises
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {workout.rating}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 gap-2" asChild>
            <Link href="/timer">
              <Play className="h-4 w-4" />
              Start Workout
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CreatedWorkoutCard({ workout }: { workout: CreatedWorkout }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Expert":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{workout.name}</CardTitle>
              <Badge className={cn("text-xs", getDifficultyColor(workout.difficulty))}>
                {workout.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-sm">{workout.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {workout.estimatedDuration}m
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {workout.exercises.length} exercises
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {workout.completions} completed
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Created {formatDate(workout.createdAt)}</span>
          {workout.isPublic && (
            <>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            </>
          )}
        </div>

        {workout.tags && workout.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {workout.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {workout.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{workout.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1 gap-2" asChild>
            <Link href="/timer">
              <Play className="h-4 w-4" />
              Start Workout
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BookmarkedWorkoutCard({ workout }: { workout: BookmarkedWorkout }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={workout.thumbnail || "/placeholder.svg"}
          alt={workout.workoutTitle}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <Badge className={cn("absolute bottom-2 left-2", getDifficultyColor(workout.difficulty))}>
          {workout.difficulty}
        </Badge>
        <Button size="sm" variant="secondary" className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700">
          <Bookmark className="h-4 w-4 fill-blue-500 text-blue-500" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{workout.workoutTitle}</CardTitle>
        <CardDescription className="text-sm">{workout.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {workout.duration}
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {workout.exercises} exercises
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {workout.rating}
          </div>
        </div>

        {workout.tags && workout.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {workout.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {workout.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{workout.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1 gap-2" asChild>
            <Link href="/timer">
              <Play className="h-4 w-4" />
              Start Workout
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function WorkoutsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("date-desc")
  const [activeTab, setActiveTab] = useState("history")

  // Filter and sort workout history
  const filteredHistory = workoutHistory
    .filter((workout) =>
      workout.workoutTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.workoutType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        case "date-asc":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        case "duration-desc":
          return b.duration - a.duration
        case "duration-asc":
          return a.duration - b.duration
        default:
          return 0
      }
    })

  // Filter created workouts
  const filteredCreated = createdWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter liked workouts
  const filteredLiked = likedWorkouts.filter((workout) =>
    workout.workoutTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.workoutType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter bookmarked workouts
  const filteredBookmarked = bookmarkedWorkouts.filter((workout) =>
    workout.workoutTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.workoutType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats
  const completedWorkouts = workoutHistory.filter(w => w.status === "completed").length
  const totalCaloriesBurned = workoutHistory
    .filter(w => w.status === "completed")
    .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)
  const averageWorkoutDuration = workoutHistory
    .filter(w => w.status === "completed")
    .reduce((sum, w, _, arr) => sum + w.duration / arr.length, 0)
  const personalRecordsCount = workoutHistory
    .reduce((count, w) => count + (w.personalRecords?.length || 0), 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        className="hidden md:flex"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold">My Workouts</h1>
                <p className="text-muted-foreground">Track your fitness journey, manage favorites, and review your progress</p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workouts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="duration-desc">Longest Duration</SelectItem>
                    <SelectItem value="duration-asc">Shortest Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{completedWorkouts}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Flame className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalCaloriesBurned.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Calories Burned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{Math.round(averageWorkoutDuration)}m</p>
                      <p className="text-sm text-muted-foreground">Avg Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{personalRecordsCount}</p>
                      <p className="text-sm text-muted-foreground">Personal Records</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Ready for your next workout?</h3>
                    <p className="text-sm text-muted-foreground">Create a custom workout or let AI generate one for you</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" asChild>
                      <Link href="/workouts/create">
                        <Plus className="h-4 w-4" />
                        Create Custom Workout
                      </Link>
                    </Button>
                    <Button className="gap-2" asChild>
                      <Link href="/ai-coach">
                        <Zap className="h-4 w-4" />
                        AI Generate
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History ({workoutHistory.length})
                </TabsTrigger>
                <TabsTrigger value="created" className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  My Workouts ({createdWorkouts.length})
                </TabsTrigger>
                <TabsTrigger value="liked" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Liked ({likedWorkouts.length})
                </TabsTrigger>
                <TabsTrigger value="bookmarked" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmarked ({bookmarkedWorkouts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Workout History</h2>
                    <p className="text-sm text-muted-foreground">{filteredHistory.length} workouts</p>
                  </div>

                  {filteredHistory.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredHistory.map((workout) => (
                        <WorkoutHistoryCard key={workout.id} workout={workout} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No workout history found</h3>
                      <p className="text-muted-foreground mb-4">Start your first workout to see it here</p>
                      <div className="flex gap-3 justify-center">
                        <Button variant="outline" asChild>
                          <Link href="/workouts/create">Create Custom Workout</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/ai-coach">Generate Workout</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="created" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Custom Workouts</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">{filteredCreated.length} workouts</p>
                      <Button className="gap-2" asChild>
                        <Link href="/workouts/create">
                          <Plus className="h-4 w-4" />
                          Create New
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {filteredCreated.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredCreated.map((workout) => (
                        <CreatedWorkoutCard key={workout.id} workout={workout} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No custom workouts yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first custom workout to see it here</p>
                      <div className="flex gap-3 justify-center">
                        <Button className="gap-2" asChild>
                          <Link href="/workouts/create">
                            <Plus className="h-4 w-4" />
                            Create Your First Workout
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/templates">Browse Templates</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="liked" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Liked Workouts</h2>
                    <p className="text-sm text-muted-foreground">{filteredLiked.length} workouts</p>
                  </div>

                  {filteredLiked.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredLiked.map((workout) => (
                        <LikedWorkoutCard key={workout.id} workout={workout} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No liked workouts</h3>
                      <p className="text-muted-foreground mb-4">Like workouts to save them here for quick access</p>
                      <div className="flex gap-3 justify-center">
                        <Button variant="outline" asChild>
                          <Link href="/workouts/create">Create Your Own</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/ai-coach">Discover Workouts</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookmarked" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Bookmarked Workouts</h2>
                    <p className="text-sm text-muted-foreground">{filteredBookmarked.length} workouts</p>
                  </div>

                  {filteredBookmarked.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredBookmarked.map((workout) => (
                        <BookmarkedWorkoutCard key={workout.id} workout={workout} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bookmarked workouts</h3>
                      <p className="text-muted-foreground mb-4">Bookmark workouts to save them for later</p>
                      <div className="flex gap-3 justify-center">
                        <Button variant="outline" asChild>
                          <Link href="/workouts/create">Create Custom Workout</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/ai-coach">Browse Workouts</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
