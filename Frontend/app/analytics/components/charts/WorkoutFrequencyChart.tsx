"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart } from "recharts"
import { Flame, Calendar, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WorkoutSession, MonthlyStats } from "../../types"

interface WorkoutFrequencyChartProps {
  sessions: WorkoutSession[]
  monthlyStats: MonthlyStats[]
}

const chartConfig = {
  workoutsCompleted: {
    label: "Workouts Completed",
    color: "hsl(var(--chart-1))",
  },
  completionRate: {
    label: "Completion Rate %",
    color: "hsl(var(--chart-2))",
  },
  totalDuration: {
    label: "Total Duration (hours)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function WorkoutFrequencyChart({ sessions, monthlyStats }: WorkoutFrequencyChartProps) {
  // Calculate weekly frequency for the last 8 weeks
  const weeklyData = Array.from({ length: 8 }, (_, weekIndex) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (8 - weekIndex) * 7)
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekStart && sessionDate <= weekEnd
    })
    
    const completedSessions = weekSessions.filter(session => session.completed)
    const totalDuration = completedSessions.reduce((sum, session) => sum + session.duration, 0)
    
    return {
      week: `Week ${weekIndex + 1}`,
      date: weekStart.toISOString().split('T')[0],
      workouts: completedSessions.length,
      totalDuration: Math.round(totalDuration / 60 * 10) / 10, // Convert to hours
      avgDuration: completedSessions.length > 0 ? Math.round(totalDuration / completedSessions.length) : 0,
      completionRate: weekSessions.length > 0 ? Math.round((completedSessions.length / weekSessions.length) * 100) : 0
    }
  })

  // Current week stats
  const currentWeek = weeklyData[weeklyData.length - 1]
  const lastWeek = weeklyData[weeklyData.length - 2]
  const weeklyChange = currentWeek.workouts - lastWeek.workouts

  // Calculate daily frequency for this week
  const dailyFrequency = Array.from({ length: 7 }, (_, dayIndex) => {
    const today = new Date()
    const dayDate = new Date(today)
    dayDate.setDate(today.getDate() - (6 - dayIndex))
    
    const daySession = sessions.find(session => {
      const sessionDate = new Date(session.date)
      return sessionDate.toDateString() === dayDate.toDateString()
    })
    
    return {
      day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dayDate.toISOString().split('T')[0],
      hasWorkout: !!daySession?.completed,
      duration: daySession?.duration || 0,
      workoutType: daySession?.type || null
    }
  })

  return (
    <div className="space-y-6">
      {/* Current Week Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{currentWeek.workouts}</div>
              <div className="text-sm text-muted-foreground">This Week</div>
              {weeklyChange !== 0 && (
                <Badge variant={weeklyChange > 0 ? "default" : "secondary"} className="text-xs mt-1">
                  {weeklyChange > 0 ? '+' : ''}{weeklyChange} vs last week
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{currentWeek.totalDuration}h</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <CheckCircle className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{currentWeek.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Flame className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{currentWeek.avgDuration}m</div>
              <div className="text-sm text-muted-foreground">Avg Duration</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week's Daily Breakdown */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            This Week's Activity
          </CardTitle>
          <CardDescription>Daily workout completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dailyFrequency.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <div
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    day.hasWorkout
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-muted border-muted hover:border-muted-foreground'
                  }`}
                >
                  {day.hasWorkout ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {day.hasWorkout ? `${day.duration}m` : '-'}
                </div>
                {day.workoutType && (
                  <div className="text-xs text-muted-foreground truncate">
                    {day.workoutType}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Frequency Trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Weekly Workout Frequency</CardTitle>
            <CardDescription>Number of completed workouts per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}`, 'Workouts']}
                  />
                  <Bar
                    dataKey="workouts"
                    fill="var(--color-workoutsCompleted)"
                    radius={[4, 4, 0, 0]}
                    name="Workouts"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Weekly Duration Trend</CardTitle>
            <CardDescription>Total exercise time per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}h`, 'Duration']}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalDuration"
                    stroke="var(--color-totalDuration)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    name="Duration"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Statistics */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>Monthly workout statistics and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {monthlyStats.map((month, index) => (
              <div key={index} className="space-y-4 p-4 rounded-lg border bg-muted/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{month.month}</h4>
                  <Badge variant="secondary">
                    {month.completionRate}% completed
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Workouts</span>
                      <span>{month.workoutsCompleted}/{month.workoutsPlanned}</span>
                    </div>
                    <Progress value={month.completionRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{Math.round(month.totalDuration / 60)}h</div>
                      <div className="text-xs text-muted-foreground">Total Time</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{month.avgDuration}m</div>
                      <div className="text-xs text-muted-foreground">Avg Duration</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
