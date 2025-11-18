"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { Flame, Activity, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CalorieData } from "../../types"

interface CaloriesBurnedChartProps {
  data: CalorieData[]
}

const chartConfig = {
  caloriesBurned: {
    label: "Calories Burned",
    color: "hsl(var(--chart-1))",
  },
  duration: {
    label: "Duration (min)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function CaloriesBurnedChart({ data }: CaloriesBurnedChartProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Calculate totals and averages
  const totalCalories = data.reduce((sum, session) => sum + session.caloriesBurned, 0)
  const avgCalories = Math.round(totalCalories / data.length)
  const totalDuration = data.reduce((sum, session) => sum + session.duration, 0)
  const avgDuration = Math.round(totalDuration / data.length)

  // Group by workout type
  const workoutTypeStats = data.reduce((acc, session) => {
    if (!acc[session.workoutType]) {
      acc[session.workoutType] = {
        totalCalories: 0,
        totalDuration: 0,
        sessions: 0,
        avgCaloriesPerMin: 0
      }
    }
    
    acc[session.workoutType].totalCalories += session.caloriesBurned
    acc[session.workoutType].totalDuration += session.duration
    acc[session.workoutType].sessions += 1
    acc[session.workoutType].avgCaloriesPerMin = 
      acc[session.workoutType].totalCalories / acc[session.workoutType].totalDuration
    
    return acc
  }, {} as Record<string, any>)

  const workoutTypeData = Object.entries(workoutTypeStats).map(([type, stats]) => ({
    workoutType: type,
    ...stats,
    avgCalories: Math.round(stats.totalCalories / stats.sessions),
    avgCaloriesPerMin: Math.round(stats.avgCaloriesPerMin * 10) / 10
  })).sort((a, b) => b.totalCalories - a.totalCalories)

  // Intensity analysis
  const intensityData = data.map(session => ({
    ...session,
    caloriesPerMin: Math.round((session.caloriesBurned / session.duration) * 10) / 10,
    intensityScore: session.intensity === 'High' ? 3 : session.intensity === 'Medium' ? 2 : 1
  }))

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Flame className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Calories</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Activity className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{avgCalories}</div>
              <div className="text-sm text-muted-foreground">Avg per Workout</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Zap className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {Math.round((totalCalories / totalDuration) * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">Calories/Min</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Activity className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{Math.round(totalDuration / 60)}h</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Calories Burned */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Daily Calories Burned
          </CardTitle>
          <CardDescription>
            Track your calorie expenditure across workout sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-caloriesBurned)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-caloriesBurned)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
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
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value, name, props) => [
                    `${value} calories`,
                    `${props.payload.workoutType} (${props.payload.duration}min)`
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="caloriesBurned"
                  stroke="var(--color-caloriesBurned)"
                  fill="url(#caloriesGradient)"
                  strokeWidth={3}
                  name="Calories Burned"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Workout Type Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Calories by Workout Type</CardTitle>
            <CardDescription>Comparison across different workout types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workoutTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="workoutType" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}`, 'Avg Calories']}
                  />
                  <Bar
                    dataKey="avgCalories"
                    fill="var(--color-caloriesBurned)"
                    radius={[4, 4, 0, 0]}
                    name="Average Calories"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Workout Type Efficiency</CardTitle>
            <CardDescription>Calories burned per minute by workout type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workoutTypeData.map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    workout.avgCaloriesPerMin > 6 ? 'bg-red-500' :
                    workout.avgCaloriesPerMin > 4 ? 'bg-orange-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{workout.workoutType}</div>
                    <div className="text-sm text-muted-foreground">
                      {workout.sessions} sessions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{workout.avgCaloriesPerMin}</div>
                  <div className="text-sm text-muted-foreground">cal/min</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Recent Workout Sessions</CardTitle>
          <CardDescription>Detailed breakdown of your recent calorie burns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.slice().reverse().map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">
                      {session.caloriesBurned}
                    </div>
                    <div className="text-xs text-muted-foreground">calories</div>
                  </div>
                  <div>
                    <div className="font-medium">{session.workoutType}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(session.date)} • {session.duration} minutes
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    session.intensity === 'High' ? 'destructive' :
                    session.intensity === 'Medium' ? 'default' :
                    'secondary'
                  }>
                    {session.intensity}
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium">
                      {Math.round((session.caloriesBurned / session.duration) * 10) / 10}
                    </div>
                    <div className="text-xs text-muted-foreground">cal/min</div>
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
