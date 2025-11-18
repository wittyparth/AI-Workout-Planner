"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Dumbbell, 
  Weight, 
  Calendar, 
  Flame,
  Target,
  Clock,
  BarChart3,
  Award
} from "lucide-react"
import { 
  ExerciseSpecificProgress, 
  BodyWeightProgress, 
  StreakData, 
  WorkoutSession 
} from "../types"

interface AnalyticsOverviewProps {
  strengthData: ExerciseSpecificProgress[]
  bodyWeightData: BodyWeightProgress[]
  streakData: StreakData
  recentSessions: WorkoutSession[]
}

export function AnalyticsOverview({ 
  strengthData, 
  bodyWeightData, 
  streakData, 
  recentSessions 
}: AnalyticsOverviewProps) {
  
  // Calculate key metrics
  const latestBodyWeight = bodyWeightData[bodyWeightData.length - 1]
  const firstBodyWeight = bodyWeightData[0]
  const weightChange = latestBodyWeight?.weight - firstBodyWeight?.weight || 0
  
  // Calculate total weekly volume from recent sessions
  const weeklyVolume = recentSessions
    .filter(session => {
      const sessionDate = new Date(session.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    })
    .reduce((sum, session) => sum + session.totalVolume, 0)

  // Calculate average calories per session
  const avgCalories = recentSessions.length > 0 
    ? Math.round(recentSessions.reduce((sum, session) => sum + session.caloriesBurned, 0) / recentSessions.length)
    : 0

  // Get strongest lift progression
  const bestProgression = strengthData.reduce((best, exercise) => 
    exercise.progression > best.progression ? exercise : best
  , strengthData[0] || { exerciseName: "N/A", progression: 0 })

  // Calculate completion rate
  const completedSessions = recentSessions.filter(session => session.completed).length
  const completionRate = recentSessions.length > 0 
    ? Math.round((completedSessions / recentSessions.length) * 100)
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Strength Progress */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Strength Progress</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{bestProgression.progression?.toFixed(1)}%</div>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            {bestProgression.exerciseName}
          </p>
          <div className="mt-3">
            <Progress value={Math.min(bestProgression.progression || 0, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Body Composition */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Body Weight</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
          </div>
          <p className={`text-xs flex items-center gap-1 mt-1 ${
            Math.abs(weightChange) < 1 ? 'text-yellow-600' : 
            weightChange < 0 ? 'text-green-600' : 'text-blue-600'
          }`}>
            {Math.abs(weightChange) < 1 ? (
              <>
                <Target className="h-3 w-3" />
                Maintaining
              </>
            ) : weightChange < 0 ? (
              <>
                <TrendingDown className="h-3 w-3" />
                Weight Loss
              </>
            ) : (
              <>
                <TrendingUp className="h-3 w-3" />
                Weight Gain
              </>
            )}
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            Current: {latestBodyWeight?.weight?.toFixed(1)} lbs
          </div>
        </CardContent>
      </Card>

      {/* Consistency */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streakData.currentStreak} days</div>
          <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            {streakData.weeklyAverage} days/week avg
          </p>
          <div className="mt-3">
            <Progress value={(streakData.currentStreak / streakData.longestStreak) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              Best: {streakData.longestStreak} days
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Volume */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Volume</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(weeklyVolume / 1000).toFixed(1)}k lbs</div>
          <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            Total lifted this week
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            {recentSessions.filter(s => {
              const sessionDate = new Date(s.date)
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return sessionDate >= weekAgo
            }).length} workouts completed
          </div>
        </CardContent>
      </Card>

      {/* Calories Burned */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Calories/Session</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCalories}</div>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <Flame className="h-3 w-3" />
            Per workout
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            {recentSessions.reduce((sum, s) => sum + s.caloriesBurned, 0).toLocaleString()} total
          </div>
        </CardContent>
      </Card>

      {/* Workout Completion Rate */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
            <Target className="h-3 w-3" />
            {completedSessions}/{recentSessions.length} completed
          </p>
          <div className="mt-3">
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Average Session Duration */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-cyan-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {recentSessions.length > 0 
              ? Math.round(recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length)
              : 0
            }m
          </div>
          <p className="text-xs text-cyan-600 flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            Per session
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round(recentSessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h total
          </div>
        </CardContent>
      </Card>

      {/* This Month's Workouts */}
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4 border-l-indigo-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streakData.monthlyTotal}</div>
          <p className="text-xs text-indigo-600 flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            Workouts completed
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            Target: {Math.ceil(streakData.weeklyAverage * 4)} workouts
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
