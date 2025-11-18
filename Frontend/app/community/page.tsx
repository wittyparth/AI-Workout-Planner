"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Users,
  Target,
  Calendar,
  Clock,
  Medal,
  Crown,
  Star,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Bookmark,
  Play,
  Activity,
  Flame,
  Eye,
  ThumbsUp,
  Download,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import "./community.css"

// Community workout interface
interface CommunityWorkout {
  id: string
  title: string
  description: string
  creator: {
    name: string
    avatar: string
    level: "Beginner" | "Intermediate" | "Advanced" | "Elite"
    followers: number
  }
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  exercises: number
  category: string
  rating: number
  reviews: number
  likes: number
  bookmarks: number
  views: number
  thumbnail: string
  tags: string[]
  isPublic: boolean
  createdAt: Date
  muscleGroups: string[]
  equipment: string[]
  caloriesBurned: number
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("workouts")
  const [likedWorkouts, setLikedWorkouts] = useState<Set<string>>(new Set())
  const [bookmarkedWorkouts, setBookmarkedWorkouts] = useState<Set<string>>(new Set())
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState("popular")

  const toggleLike = (workoutId: string) => {
    const newLiked = new Set(likedWorkouts)
    if (newLiked.has(workoutId)) {
      newLiked.delete(workoutId)
    } else {
      newLiked.add(workoutId)
    }
    setLikedWorkouts(newLiked)
  }

  const toggleBookmark = (workoutId: string) => {
    const newBookmarked = new Set(bookmarkedWorkouts)
    if (newBookmarked.has(workoutId)) {
      newBookmarked.delete(workoutId)
    } else {
      newBookmarked.add(workoutId)
    }
    setBookmarkedWorkouts(newBookmarked)
  }

  const toggleChallenge = (challengeId: string) => {
    const newJoined = new Set(joinedChallenges)
    if (newJoined.has(challengeId)) {
      newJoined.delete(challengeId)
    } else {
      newJoined.add(challengeId)
    }
    setJoinedChallenges(newJoined)
  }

  const handleStartWorkout = (workoutId: string) => {
    // Navigate to timer page with workout
    window.location.href = `/timer?workoutId=${workoutId}`
  }

  const communityWorkouts: CommunityWorkout[] = [
    {
      id: "cw-1",
      title: "Beast Mode Upper Body",
      description: "Intense upper body workout focusing on compound movements and progressive overload",
      creator: {
        name: "Alex Thompson",
        avatar: "/fitness-man.png",
        level: "Elite",
        followers: 12500
      },
      duration: "55 min",
      difficulty: "Advanced",
      exercises: 9,
      category: "Strength Training",
      rating: 4.9,
      reviews: 342,
      likes: 1247,
      bookmarks: 589,
      views: 8934,
      thumbnail: "/gym-upper-body-workout.jpg",
      tags: ["Push", "Chest", "Shoulders", "Triceps", "Heavy"],
      isPublic: true,
      createdAt: new Date("2024-11-25"),
      muscleGroups: ["Chest", "Shoulders", "Triceps", "Core"],
      equipment: ["Barbell", "Dumbbells", "Bench"],
      caloriesBurned: 420
    },
    {
      id: "cw-2",
      title: "30-Minute HIIT Cardio",
      description: "High-intensity interval training for maximum fat burn and endurance",
      creator: {
        name: "Sarah Chen",
        avatar: "/fitness-woman.png",
        level: "Advanced",
        followers: 8900
      },
      duration: "30 min",
      difficulty: "Intermediate",
      exercises: 8,
      category: "HIIT",
      rating: 4.8,
      reviews: 567,
      likes: 2134,
      bookmarks: 891,
      views: 15600,
      thumbnail: "/hiit-cardio-workout.png",
      tags: ["Cardio", "Fat Burn", "Quick", "No Equipment"],
      isPublic: true,
      createdAt: new Date("2024-11-28"),
      muscleGroups: ["Full Body"],
      equipment: ["None"],
      caloriesBurned: 350
    },
    {
      id: "cw-3",
      title: "Morning Flow Yoga",
      description: "Gentle yoga sequence to energize your body and mind for the day ahead",
      creator: {
        name: "Emma Wilson",
        avatar: "/fitness-woman-blonde.jpg",
        level: "Intermediate",
        followers: 5600
      },
      duration: "25 min",
      difficulty: "Beginner",
      exercises: 15,
      category: "Yoga",
      rating: 4.7,
      reviews: 289,
      likes: 1567,
      bookmarks: 723,
      views: 9800,
      thumbnail: "/morning-yoga-flow.jpg",
      tags: ["Yoga", "Flexibility", "Morning", "Mindfulness"],
      isPublic: true,
      createdAt: new Date("2024-11-30"),
      muscleGroups: ["Full Body", "Core"],
      equipment: ["Yoga Mat"],
      caloriesBurned: 150
    },
    {
      id: "cw-4",
      title: "Legs & Glutes Power",
      description: "Build strong legs and sculpted glutes with this comprehensive lower body routine",
      creator: {
        name: "Mike Rodriguez",
        avatar: "/fitness-man.png",
        level: "Advanced",
        followers: 7200
      },
      duration: "45 min",
      difficulty: "Advanced",
      exercises: 7,
      category: "Strength Training",
      rating: 4.8,
      reviews: 423,
      likes: 1890,
      bookmarks: 654,
      views: 11200,
      thumbnail: "/leg-day-workout.png",
      tags: ["Legs", "Glutes", "Squats", "Power"],
      isPublic: true,
      createdAt: new Date("2024-11-26"),
      muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
      equipment: ["Barbell", "Dumbbells"],
      caloriesBurned: 380
    },
    {
      id: "cw-5",
      title: "Bodyweight Core Blast",
      description: "No equipment needed! Strengthen your core with these effective bodyweight exercises",
      creator: {
        name: "Lisa Park",
        avatar: "/fitness-woman.png",
        level: "Intermediate",
        followers: 4300
      },
      duration: "20 min",
      difficulty: "Intermediate",
      exercises: 6,
      category: "Bodyweight",
      rating: 4.6,
      reviews: 198,
      likes: 987,
      bookmarks: 432,
      views: 6700,
      thumbnail: "/core-abs-workout.jpg",
      tags: ["Core", "Abs", "Bodyweight", "Quick"],
      isPublic: true,
      createdAt: new Date("2024-11-29"),
      muscleGroups: ["Core", "Abs"],
      equipment: ["None"],
      caloriesBurned: 180
    },
    {
      id: "cw-6",
      title: "Full Body Functional",
      description: "Functional movements that translate to real-world strength and mobility",
      creator: {
        name: "David Kim",
        avatar: "/fitness-man.png",
        level: "Intermediate",
        followers: 3200
      },
      duration: "40 min",
      difficulty: "Intermediate",
      exercises: 10,
      category: "Functional",
      rating: 4.5,
      reviews: 156,
      likes: 756,
      bookmarks: 298,
      views: 5400,
      thumbnail: "/bodyweight-workout.png",
      tags: ["Functional", "Full Body", "Mobility", "Strength"],
      isPublic: true,
      createdAt: new Date("2024-11-27"),
      muscleGroups: ["Full Body"],
      equipment: ["Kettlebell", "Resistance Band"],
      caloriesBurned: 320
    }
  ]

  const categories = ["All", "Strength Training", "HIIT", "Yoga", "Bodyweight", "Functional", "Cardio"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  // Filter workouts based on search and filters
  const filteredWorkouts = communityWorkouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || workout.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || workout.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Sort workouts
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime()
      case "rating":
        return b.rating - a.rating
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration)
      default:
        return 0
    }
  })

  const challenges = [
    {
      id: "1",
      title: "30-Day Push-Up Challenge",
      description: "Build upper body strength with progressive push-up training",
      participants: 1247,
      duration: "30 days",
      difficulty: "Beginner",
      reward: "Push-Up Master Badge",
      progress: 67,
      daysLeft: 10,
    },
    {
      id: "2",
      title: "10K Steps Daily",
      description: "Walk 10,000 steps every day for better cardiovascular health",
      participants: 892,
      duration: "21 days",
      difficulty: "Easy",
      reward: "Step Counter Badge",
      progress: 45,
      daysLeft: 12,
    },
    {
      id: "3",
      title: "Plank Master",
      description: "Increase your plank hold time from 30 seconds to 5 minutes",
      participants: 634,
      duration: "28 days",
      difficulty: "Intermediate",
      reward: "Core Strength Badge",
      progress: 23,
      daysLeft: 22,
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Alex Thompson", points: 2847, streak: 45, badge: "Champion" },
    { rank: 2, name: "Sarah Chen", points: 2634, streak: 38, badge: "Elite" },
    { rank: 3, name: "Mike Rodriguez", points: 2521, streak: 42, badge: "Elite" },
    { rank: 4, name: "Emma Wilson", points: 2398, streak: 29, badge: "Advanced" },
    { rank: 5, name: "David Kim", points: 2287, streak: 33, badge: "Advanced" },
    { rank: 6, name: "Lisa Park", points: 2156, streak: 25, badge: "Intermediate" },
    { rank: 7, name: "You", points: 1987, streak: 18, badge: "Intermediate" },
    { rank: 8, name: "John Smith", points: 1876, streak: 22, badge: "Intermediate" },
  ]

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Community Workouts</h1>
          <p className="text-muted-foreground">Discover, share, and get inspired by community workouts</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Share Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Workout title" />
              <Textarea placeholder="Describe your workout..." />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Share Workout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workouts" className="gap-2">
            <Activity className="h-4 w-4" />
            Workouts
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Target className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="filters-container flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workouts, creators, or tags..." 
                  className="pl-10 search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 filter-select">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40 filter-select">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 filter-select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="stats-grid grid grid-cols-4 gap-4">
              <Card className="stats-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{communityWorkouts.length}</div>
                  <div className="text-sm text-muted-foreground">Total Workouts</div>
                </CardContent>
              </Card>
              <Card className="stats-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-500">{communityWorkouts.reduce((sum, w) => sum + w.likes, 0).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Likes</div>
                </CardContent>
              </Card>
              <Card className="stats-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">{communityWorkouts.reduce((sum, w) => sum + w.views, 0).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </CardContent>
              </Card>
              <Card className="stats-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500">{Math.round(communityWorkouts.reduce((sum, w) => sum + w.rating, 0) / communityWorkouts.length * 10) / 10}</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results summary */}
          {(searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All") && (
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {sortedWorkouts.length} of {communityWorkouts.length} workouts
                </span>
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategory}
                  </Badge>
                )}
                {selectedDifficulty !== "All" && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedDifficulty}
                  </Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedDifficulty("All")
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Workout Cards */}
          <div className="workout-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedWorkouts.map((workout) => (
              <Card key={workout.id} className="workout-card overflow-hidden">
                <div className="relative">
                  <img
                    src={workout.thumbnail || "/placeholder.svg"}
                    alt={workout.title}
                    className="workout-thumbnail w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`difficulty-badge ${
                      workout.difficulty === "Beginner" ? "difficulty-beginner" :
                      workout.difficulty === "Intermediate" ? "difficulty-intermediate" :
                      "difficulty-advanced"
                    }`}>
                      {workout.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {workout.duration}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="creator-badge">
                      {workout.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors cursor-pointer">{workout.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{workout.description}</p>
                    </div>
                  </div>

                  {/* Creator info */}
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="creator-avatar h-8 w-8">
                      <AvatarImage src={workout.creator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {workout.creator.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">{workout.creator.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {workout.creator.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{workout.creator.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Workout details */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span>{workout.exercises} exercises</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="h-4 w-4" />
                      <span>{workout.caloriesBurned} cal</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{workout.views.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {workout.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs tag-badge cursor-pointer">
                        {tag}
                      </Badge>
                    ))}
                    {workout.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs tag-badge cursor-pointer">
                        +{workout.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Rating and stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{workout.rating}</span>
                      <span className="text-muted-foreground">({workout.reviews})</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{workout.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        <span>{workout.bookmarks}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 action-button"
                      onClick={() => handleStartWorkout(workout.id)}
                    >
                      <Link href={`/timer?workoutId=${workout.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleLike(workout.id)}
                      className={`action-button like-button ${likedWorkouts.has(workout.id) ? "liked" : ""}`}
                    >
                      <Heart className={`h-4 w-4 ${likedWorkouts.has(workout.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleBookmark(workout.id)}
                      className={`action-button bookmark-button ${bookmarkedWorkouts.has(workout.id) ? "bookmarked" : ""}`}
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarkedWorkouts.has(workout.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="action-button">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedWorkouts.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <div className="max-w-sm mx-auto">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No workouts found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All" 
                    ? "Try adjusting your search or filters to find more workouts" 
                    : "Be the first to share a workout with the community!"}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                      setSelectedDifficulty("All")
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Share Workout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Your Workout</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Workout title" />
                        <Textarea placeholder="Describe your workout..." />
                        <div className="grid grid-cols-2 gap-4">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="strength">Strength Training</SelectItem>
                              <SelectItem value="cardio">Cardio</SelectItem>
                              <SelectItem value="hiit">HIIT</SelectItem>
                              <SelectItem value="yoga">Yoga</SelectItem>
                              <SelectItem value="bodyweight">Bodyweight</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Share Workout</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Active Challenges</h2>
              <p className="text-muted-foreground">Join challenges to stay motivated and earn rewards</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Challenge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Challenge</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Challenge title" />
                  <Textarea placeholder="Challenge description" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Duration (days)" type="number" />
                  <Button className="w-full">Create Challenge</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            challenge.difficulty === "Easy"
                              ? "secondary"
                              : challenge.difficulty === "Beginner"
                                ? "default"
                                : challenge.difficulty === "Intermediate"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {challenge.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{challenge.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {challenge.participants}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-pretty">{challenge.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{challenge.reward}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={joinedChallenges.has(challenge.id) ? "secondary" : "default"}
                    onClick={() => toggleChallenge(challenge.id)}
                  >
                    {joinedChallenges.has(challenge.id) ? "Joined" : "Join Challenge"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Global Leaderboard</h2>
              <p className="text-muted-foreground">See how you rank against other fitness enthusiasts</p>
            </div>
            <Select defaultValue="weekly">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <CardContent className="p-4 text-center">
                <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold">Your Rank</h3>
                <p className="text-2xl font-bold">#7</p>
                <p className="text-sm text-muted-foreground">1,987 points</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Weekly Change</h3>
                <p className="text-2xl font-bold text-green-500">+3</p>
                <p className="text-sm text-muted-foreground">positions up</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Current Streak</h3>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">days active</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${user.name === "You" ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1
                            ? "bg-yellow-500 text-white"
                            : user.rank === 2
                              ? "bg-gray-400 text-white"
                              : user.rank === 3
                                ? "bg-orange-600 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.rank <= 3 ? (
                          user.rank === 1 ? (
                            <Crown className="h-4 w-4" />
                          ) : user.rank === 2 ? (
                            <Medal className="h-4 w-4" />
                          ) : (
                            <Trophy className="h-4 w-4" />
                          )
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${user.name === "You" ? "text-primary" : ""}`}>
                            {user.name}
                          </span>
                          <Badge
                            variant={
                              user.badge === "Champion"
                                ? "default"
                                : user.badge === "Elite"
                                  ? "secondary"
                                  : user.badge === "Advanced"
                                    ? "outline"
                                    : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.streak} day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{user.points.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
