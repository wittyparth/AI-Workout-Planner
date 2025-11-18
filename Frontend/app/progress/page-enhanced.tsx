"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts"
import ActivityCalendar from "react-activity-calendar"
import {
  Activity,
  Clock,
  Dumbbell,
  Flame,
  Menu,
  TrendingUp,
  Users,
  Zap,
  ArrowLeft,
  Trophy,
  Plus,
  BarChart3,
  Award,
  CalendarIcon,
  Target,
  Settings,
  Weight,
  Ruler,
  Camera,
  Star,
  Gauge,
  History,
  Calendar as CalendarLucide,
  ChevronRight,
  Eye,
  Play,
  CheckCircle,
  Flag,
  Sword,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const sidebarItems = [
  { icon: Activity, label: "Dashboard", href: "/" },
  { icon: Dumbbell, label: "Workouts", href: "/workouts" },
  { icon: Clock, label: "Timer", href: "/timer" },
  { icon: TrendingUp, label: "Progress", href: "/progress", active: true },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Zap, label: "AI Coach", href: "/ai-coach" },
]

function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("w-64 border-r bg-muted/50", className)}>
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Dumbbell className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">FitAI</span>
        </Link>
      </div>
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

function Header() {
  return (
    <header className="flex h-16 items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Progress & Analytics
            </h1>
            <p className="text-sm text-muted-foreground">Track your fitness journey and achieve your goals</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </header>
  )
}

// Enhanced mock data
const exerciseProgressData = {
  "Bench Press": [
    { date: "Jan 1", weight: 135, reps: 8, volume: 1080 },
    { date: "Jan 8", weight: 140, reps: 8, volume: 1120 },
    { date: "Jan 15", weight: 145, reps: 7, volume: 1015 },
    { date: "Jan 22", weight: 150, reps: 6, volume: 900 },
    { date: "Jan 29", weight: 155, reps: 5, volume: 775 },
    { date: "Feb 5", weight: 160, reps: 5, volume: 800 },
    { date: "Feb 12", weight: 165, reps: 4, volume: 660 },
    { date: "Feb 19", weight: 170, reps: 3, volume: 510 },
  ],
  "Squat": [
    { date: "Jan 1", weight: 185, reps: 10, volume: 1850 },
    { date: "Jan 8", weight: 195, reps: 8, volume: 1560 },
    { date: "Jan 15", weight: 205, reps: 6, volume: 1230 },
    { date: "Jan 22", weight: 215, reps: 5, volume: 1075 },
    { date: "Jan 29", weight: 225, reps: 3, volume: 675 },
    { date: "Feb 5", weight: 235, reps: 2, volume: 470 },
  ],
  "Deadlift": [
    { date: "Jan 1", weight: 225, reps: 5, volume: 1125 },
    { date: "Jan 8", weight: 235, reps: 4, volume: 940 },
    { date: "Jan 15", weight: 245, reps: 3, volume: 735 },
    { date: "Jan 22", weight: 255, reps: 2, volume: 510 },
    { date: "Jan 29", weight: 265, reps: 1, volume: 265 },
    { date: "Feb 5", weight: 275, reps: 1, volume: 275 },
  ],
}

const volumeProgressData = [
  { week: "Week 1", chest: 4200, back: 3800, legs: 5200, shoulders: 2100, arms: 2800, core: 1200 },
  { week: "Week 2", chest: 4500, back: 4100, legs: 5600, shoulders: 2300, arms: 3100, core: 1400 },
  { week: "Week 3", chest: 4300, back: 3900, legs: 5100, shoulders: 2000, arms: 2900, core: 1300 },
  { week: "Week 4", chest: 4800, back: 4300, legs: 5900, shoulders: 2500, arms: 3300, core: 1600 },
]

const workoutHistory = [
  {
    id: 1,
    name: "Upper Body Strength",
    date: "2024-02-19",
    duration: 45,
    exercises: ["Bench Press", "Pull-ups", "Shoulder Press", "Rows"],
    status: "completed",
    notes: "Great session, hit new PR on bench press!"
  },
  {
    id: 2,
    name: "HIIT Cardio",
    date: "2024-02-18",
    duration: 30,
    exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Push-ups"],
    status: "completed",
    notes: "High intensity, feeling energized"
  },
  {
    id: 3,
    name: "Lower Body Power",
    date: "2024-02-17",
    duration: 50,
    exercises: ["Squats", "Deadlifts", "Lunges", "Calf Raises"],
    status: "completed",
    notes: "Focused on form today"
  },
  {
    id: 4,
    name: "Recovery Yoga",
    date: "2024-02-16",
    duration: 35,
    exercises: ["Downward Dog", "Child's Pose", "Warrior III", "Savasana"],
    status: "completed",
    notes: "Great for recovery"
  },
  {
    id: 5,
    name: "Full Body Circuit",
    date: "2024-02-15",
    duration: 40,
    exercises: ["Burpees", "Squats", "Push-ups", "Plank"],
    status: "completed",
    notes: "Challenging but rewarding"
  },
]

const personalRecords = [
  { exercise: "Bench Press", weight: 185, date: "2024-02-19", previous: 175, improvement: 10 },
  { exercise: "Squat", weight: 235, date: "2024-02-05", previous: 225, improvement: 10 },
  { exercise: "Deadlift", weight: 275, date: "2024-02-05", previous: 265, improvement: 10 },
  { exercise: "Pull-ups", reps: 15, date: "2024-02-12", previous: 12, improvement: 3 },
]

const goals = [
  {
    id: 1,
    title: "Bench Press 200 lbs",
    description: "Increase bench press to 200 lbs",
    current: 185,
    target: 200,
    deadline: "2024-03-01",
    type: "strength",
    progress: 85,
    category: "personal"
  },
  {
    id: 2,
    title: "Workout 4x per week",
    description: "Maintain consistent workout frequency",
    current: 3,
    target: 4,
    deadline: "2024-02-01",
    type: "frequency",
    progress: 75,
    category: "personal"
  },
  {
    id: 3,
    title: "30-Day Squat Challenge",
    description: "Complete the community squat challenge",
    current: 21,
    target: 30,
    deadline: "2024-03-15",
    type: "challenge",
    progress: 70,
    category: "community"
  }
]

const challenges = [
  {
    id: 1,
    title: "100 Push-ups Challenge",
    description: "Complete 100 push-ups in a single session",
    participants: 245,
    completed: true,
    completedDate: "2024-02-10",
    reward: "Strong Arms Badge",
    difficulty: "intermediate"
  },
  {
    id: 2,
    title: "7-Day Consistency Streak",
    description: "Work out for 7 consecutive days",
    participants: 189,
    completed: true,
    completedDate: "2024-02-15",
    reward: "Consistency King Badge",
    difficulty: "beginner"
  },
  {
    id: 3,
    title: "February Fitness",
    description: "Complete 20 workouts in February",
    participants: 567,
    completed: false,
    progress: 15,
    target: 20,
    deadline: "2024-02-29",
    reward: "February Warrior Badge",
    difficulty: "advanced"
  }
]

const achievements = [
  { id: 1, title: "First Workout", icon: "🎯", unlocked: true, date: "2024-01-01" },
  { id: 2, title: "Week Warrior", icon: "🔥", unlocked: true, date: "2024-01-07" },
  { id: 3, title: "Strength Milestone", icon: "💪", unlocked: true, date: "2024-01-10" },
  { id: 4, title: "Century Club", icon: "🏆", unlocked: false, progress: 47 },
  { id: 5, title: "Consistency King", icon: "👑", unlocked: true, date: "2024-02-01" },
  { id: 6, title: "PR Crusher", icon: "⚡", unlocked: true, date: "2024-02-12" },
]

const muscleGroupData = [
  { name: "Chest", percentage: 85, sessions: 3, color: "#ef4444" },
  { name: "Back", percentage: 92, sessions: 3, color: "#3b82f6" },
  { name: "Legs", percentage: 78, sessions: 2, color: "#22c55e" },
  { name: "Shoulders", percentage: 45, sessions: 1, color: "#eab308" },
  { name: "Arms", percentage: 67, sessions: 2, color: "#a855f7" },
  { name: "Core", percentage: 34, sessions: 1, color: "#f97316" },
]

// Activity calendar data
const activityData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (364 - i))
  return {
    date: date.toISOString().split('T')[0],
    count: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
    level: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
  }
})

// Add Goal Dialog Component
function AddGoalDialog() {
  const [open, setOpen] = useState(false)
  const [goalData, setGoalData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: new Date(),
    type: "personal",
    category: "strength"
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            Set a new fitness goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Bench Press 200 lbs"
              value={goalData.title}
              onChange={(e) => setGoalData({...goalData, title: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal..."
              value={goalData.description}
              onChange={(e) => setGoalData({...goalData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                placeholder="200"
                value={goalData.target}
                onChange={(e) => setGoalData({...goalData, target: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={goalData.category} onValueChange={(value) => setGoalData({...goalData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="frequency">Frequency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {goalData.deadline ? goalData.deadline.toDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={goalData.deadline}
                  onSelect={(date) => date && setGoalData({...goalData, deadline: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Create Goal</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Workout History Dialog
function WorkoutHistoryDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <History className="h-4 w-4 mr-2" />
          View All Workouts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Workout History</DialogTitle>
          <DialogDescription>
            Complete history of your workout sessions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {workoutHistory.map((workout) => (
            <Card key={workout.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{workout.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.date).toLocaleDateString()} • {workout.duration} mins
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Exercises:</p>
                    <p className="text-sm text-muted-foreground">{workout.exercises.join(", ")}</p>
                  </div>
                  {workout.notes && (
                    <div>
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm text-muted-foreground">{workout.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ProgressPage() {
  const [selectedTab, setSelectedTab] = useState("exercise")
  const [selectedExercise, setSelectedExercise] = useState("Bench Press")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Stats Overview - Same as Dashboard */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Goal</p>
                      <p className="text-2xl font-bold">3/4</p>
                      <p className="text-xs text-green-600">75% complete</p>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-2xl font-bold">8.5h</p>
                      <p className="text-xs text-blue-600">+2h this week</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="text-2xl font-bold">2,450kg</p>
                      <p className="text-xs text-purple-600">+180kg</p>
                    </div>
                    <Weight className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Streak</p>
                      <p className="text-2xl font-bold">7 days</p>
                      <p className="text-xs text-orange-600">🔥 Keep going!</p>
                    </div>
                    <Flame className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Progress Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
                <TabsTrigger value="exercise" className="text-xs md:text-sm">Exercise</TabsTrigger>
                <TabsTrigger value="volume" className="text-xs md:text-sm">Volume</TabsTrigger>
                <TabsTrigger value="goals" className="text-xs md:text-sm">Goals</TabsTrigger>
                <TabsTrigger value="consistency" className="text-xs md:text-sm">Consistency</TabsTrigger>
                <TabsTrigger value="records" className="text-xs md:text-sm">Records</TabsTrigger>
              </TabsList>

              {/* Exercise Progress Tab */}
              <TabsContent value="exercise" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Exercise Progression</CardTitle>
                        <CardDescription>Track your strength gains over time</CardDescription>
                      </div>
                      <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bench Press">Bench Press</SelectItem>
                          <SelectItem value="Squat">Squat</SelectItem>
                          <SelectItem value="Deadlift">Deadlift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <ChartContainer
                          config={{
                            weight: {
                              label: "Weight (lbs)",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={exerciseProgressData[selectedExercise as keyof typeof exerciseProgressData] || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="hsl(var(--chart-1))" 
                                strokeWidth={3}
                                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-semibold mb-3">Current Stats</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Max Weight:</span>
                              <span className="font-bold">185 lbs</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Previous Max:</span>
                              <span>175 lbs</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Improvement:</span>
                              <span className="text-green-600 font-bold">+10 lbs</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Session:</span>
                              <span>3 days ago</span>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Log Workout
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Volume & Training Tab */}
              <TabsContent value="volume" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Volume Progression</CardTitle>
                      <CardDescription>Total training volume over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          total: {
                            label: "Total Volume",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[250px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={volumeProgressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              type="monotone"
                              dataKey="chest"
                              stackId="1"
                              stroke="#ef4444"
                              fill="#ef4444"
                              fillOpacity={0.6}
                            />
                            <Area
                              type="monotone"
                              dataKey="back"
                              stackId="1"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.6}
                            />
                            <Area
                              type="monotone"
                              dataKey="legs"
                              stackId="1"
                              stroke="#22c55e"
                              fill="#22c55e"
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Training Split Analysis</CardTitle>
                      <CardDescription>Muscle group distribution this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {muscleGroupData.map((muscle) => (
                          <div key={muscle.name} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: muscle.color }}
                                />
                                <span className="font-medium">{muscle.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{muscle.sessions} sessions</span>
                                <span className="font-bold">{muscle.percentage}%</span>
                              </div>
                            </div>
                            <Progress value={muscle.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Goals & Milestones Tab */}
              <TabsContent value="goals" className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Goals & Challenges</h3>
                    <p className="text-sm text-muted-foreground">Track your fitness objectives and community challenges</p>
                  </div>
                  <AddGoalDialog />
                </div>

                {/* Personal Goals */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Personal Goals</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {goals.filter(goal => goal.category === "personal").map((goal) => (
                      <Card key={goal.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{goal.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(goal.deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              goal.type === "strength" ? "default" : 
                              goal.type === "frequency" ? "secondary" : "outline"
                            }>
                              {goal.type}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-semibold">{goal.current}/{goal.target}</span>
                            </div>
                            <Progress value={goal.progress} />
                            <p className="text-xs text-muted-foreground">
                              {goal.progress}% complete
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Community Challenges */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Community Challenges</h4>
                    <Button variant="outline" size="sm">
                      <Sword className="h-4 w-4 mr-2" />
                      Browse Challenges
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {challenges.map((challenge) => (
                      <Card key={challenge.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{challenge.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {challenge.participants} participants
                              </p>
                            </div>
                            <Badge variant={
                              challenge.difficulty === "beginner" ? "secondary" :
                              challenge.difficulty === "intermediate" ? "default" : "destructive"
                            }>
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          {challenge.completed ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-semibold">Completed!</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Completed on {new Date(challenge.completedDate!).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-primary">Reward: {challenge.reward}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-semibold">{challenge.progress}/{challenge.target}</span>
                              </div>
                              <Progress value={(challenge.progress! / challenge.target!) * 100} />
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(challenge.deadline!).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Achievement Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievement Badges</CardTitle>
                    <CardDescription>Unlock badges as you reach milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className={cn(
                          "text-center p-4 rounded-lg border-2 transition-all",
                          achievement.unlocked 
                            ? "border-primary bg-primary/5 hover:bg-primary/10" 
                            : "border-muted bg-muted/20 opacity-60"
                        )}>
                          <div className="text-2xl mb-2">{achievement.icon}</div>
                          <p className="font-medium text-xs mb-1">{achievement.title}</p>
                          {achievement.progress && !achievement.unlocked && (
                            <div className="space-y-1">
                              <Progress value={achievement.progress} className="h-1" />
                              <p className="text-xs text-muted-foreground">{achievement.progress}/100</p>
                            </div>
                          )}
                          {achievement.unlocked && achievement.date && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Consistency & Body Tab */}
              <TabsContent value="consistency" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Workout Consistency</CardTitle>
                      <CardDescription>Your training frequency over the past year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full overflow-x-auto">
                        <ActivityCalendar
                          data={activityData}
                          theme={{
                            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                          }}
                          hideColorLegend={false}
                          hideMonthLabels={false}
                          hideTotalCount={false}
                          labels={{
                            totalCount: '{{count}} workouts in the last year',
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Statistics</CardTitle>
                      <CardDescription>Key consistency metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center space-y-2">
                          <div className="text-3xl font-bold text-orange-600">7</div>
                          <div className="text-sm text-muted-foreground">Current Streak</div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-3xl font-bold">21</div>
                          <div className="text-sm text-muted-foreground">Longest Streak</div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-3xl font-bold">47</div>
                          <div className="text-sm text-muted-foreground">Total Workouts</div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-3xl font-bold text-green-600">78%</div>
                          <div className="text-sm text-muted-foreground">Consistency Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Body Weight Tracking</CardTitle>
                    <CardDescription>Monitor your weight changes over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        weight: {
                          label: "Weight (lbs)",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { date: "Jan 1", weight: 180 },
                          { date: "Jan 15", weight: 178 },
                          { date: "Feb 1", weight: 176 },
                          { date: "Feb 15", weight: 175 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="hsl(var(--chart-2))" 
                            strokeWidth={3}
                            dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Records Tab */}
              <TabsContent value="records" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Personal Records</CardTitle>
                      <CardDescription>Your latest achievements and milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {personalRecords.map((record, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Trophy className="h-8 w-8 text-yellow-600" />
                            <div className="flex-1">
                              <p className="font-semibold">{record.exercise}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(record.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {record.weight || record.reps} {record.weight ? "lbs" : "reps"}
                              </p>
                              <p className="text-sm text-green-600">
                                +{record.improvement} {record.weight ? "lbs" : "reps"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>All-Time Records</CardTitle>
                      <CardDescription>Your best performances to date</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {personalRecords.map((record, index) => (
                          <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="font-medium">{record.exercise}</span>
                            </div>
                            <span className="text-primary font-bold text-lg">
                              {record.weight || record.reps} {record.weight ? "lbs" : "reps"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href="/workouts">
                          <Eye className="h-4 w-4 mr-2" />
                          View All Records
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Workout History */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Workout History</CardTitle>
                        <CardDescription>Your recent training sessions</CardDescription>
                      </div>
                      <WorkoutHistoryDialog />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workoutHistory.slice(0, 3).map((workout) => (
                        <div key={workout.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Play className="h-8 w-8 text-primary" />
                          <div className="flex-1">
                            <p className="font-semibold">{workout.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(workout.date).toLocaleDateString()} • {workout.duration} mins
                            </p>
                          </div>
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Timeline</CardTitle>
                    <CardDescription>Your fitness journey milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative pl-6 border-l-2 border-muted">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                        <div className="pb-4">
                          <p className="font-semibold">New Bench Press PR: 185 lbs</p>
                          <p className="text-sm text-muted-foreground">Feb 19, 2024</p>
                        </div>
                      </div>
                      <div className="relative pl-6 border-l-2 border-muted">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full" />
                        <div className="pb-4">
                          <p className="font-semibold">Completed 7-day workout streak</p>
                          <p className="text-sm text-muted-foreground">Feb 15, 2024</p>
                        </div>
                      </div>
                      <div className="relative pl-6 border-l-2 border-muted">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full" />
                        <div className="pb-4">
                          <p className="font-semibold">Reached 40 total workouts</p>
                          <p className="text-sm text-muted-foreground">Feb 10, 2024</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}