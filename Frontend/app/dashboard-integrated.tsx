"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDashboardStats, useRecentWorkouts, useTodayWorkout } from "@/hooks/useDashboard"
import {
  Activity,
  Calendar as CalendarIcon,
  Clock,
  Dumbbell,
  Flame,
  TrendingUp,
  Zap,
  Play,
  CheckCircle,
  Target,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function StatCard({ 
  title, 
  value, 
  change, 
  trend = "up", 
  icon: Icon 
}: { 
  title: string
  value: string | number
  change: string
  trend?: "up" | "down"
  icon: any
}) {
  return (
    <Card className="card-linear hover-lift group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-linear">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-linear-heading">{value}</div>
        <p className={cn(
          "text-xs flex items-center gap-1 font-linear",
          trend === "up" ? "text-green-600" : "text-red-600"
        )}>
          <TrendingUp className={cn("h-3 w-3 transition-transform", trend === "down" && "rotate-180")} />
          {change}
        </p>
      </CardContent>
    </Card>
  )
}

function DashboardContent() {
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { workouts, isLoading: workoutsLoading } = useRecentWorkouts(5)
  const { workout: todayWorkout, isLoading: todayLoading } = useTodayWorkout()

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-linear-heading">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/ai-coach">
              <Zap className="mr-2 h-4 w-4" />
              AI Workout
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Action - Today's Workout */}
      {todayWorkout ? (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground card-linear">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Today's Workout
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {todayWorkout.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm">
                {todayWorkout.exercises?.length || 0} exercises • {todayWorkout.estimatedDuration || '45'} min
              </p>
              <p className="text-xs text-primary-foreground/80">
                Status: {todayWorkout.status}
              </p>
            </div>
            <Button 
              variant="secondary" 
              asChild
            >
              <Link href={`/workouts/${todayWorkout._id}`}>
                {todayWorkout.status === 'in_progress' ? 'Continue' : 'Start Workout'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground card-linear">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              No Workout Scheduled
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Generate an AI-powered workout plan for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/ai-coach">
                <Zap className="mr-2 h-4 w-4" />
                Generate Workout
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-container">
        <StatCard
          title="Total Workouts"
          value={stats?.totalWorkouts || 0}
          change="+12% from last month"
          trend="up"
          icon={Activity}
        />
        <StatCard
          title="Total Volume"
          value={`${((stats?.totalVolume || 0) / 1000).toFixed(1)}K kg`}
          change="+8% from last month"
          trend="up"
          icon={Dumbbell}
        />
        <StatCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          change={`Best: ${stats?.longestStreak || 0} days`}
          trend="up"
          icon={Flame}
        />
        <StatCard
          title="Weekly Goal"
          value={`${stats?.weeklyGoal?.current || 0}/${stats?.weeklyGoal?.target || 4}`}
          change={`${Math.round(((stats?.weeklyGoal?.current || 0) / (stats?.weeklyGoal?.target || 4)) * 100)}% complete`}
          trend="up"
          icon={Target}
        />
      </div>

      {/* Recent Workouts */}
      <Card className="card-linear hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Workouts
          </CardTitle>
          <CardDescription>Your latest training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {workoutsLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading workouts...</p>
          ) : workouts.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No workouts yet</p>
              <Button className="mt-4" asChild>
                <Link href="/ai-coach">Create Your First Workout</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div
                  key={workout._id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString()} • {workout.exercises?.length || 0} exercises
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {workout.status === 'completed' && (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/workouts/${workout._id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-linear hover-lift cursor-pointer" asChild>
          <Link href="/progress">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Track your body metrics, photos, and strength gains
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="card-linear hover-lift cursor-pointer" asChild>
          <Link href="/templates">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Workout Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Browse and save workout templates for quick access
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="card-linear hover-lift cursor-pointer" asChild>
          <Link href="/goals">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Set and track your fitness goals with AI insights
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default function IntegratedDashboard() {
  return <DashboardContent />
}
