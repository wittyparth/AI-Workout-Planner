"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { BarChart3, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { VolumeData } from "../../types"

interface VolumeProgressionChartProps {
  data: VolumeData[]
}

const chartConfig = {
  totalVolume: {
    label: "Total Volume",
    color: "hsl(var(--chart-1))",
  },
  chest: {
    label: "Chest",
    color: "hsl(var(--chart-2))",
  },
  back: {
    label: "Back",
    color: "hsl(var(--chart-3))",
  },
  legs: {
    label: "Legs",
    color: "hsl(var(--chart-4))",
  },
  shoulders: {
    label: "Shoulders",
    color: "hsl(var(--chart-5))",
  },
  arms: {
    label: "Arms",
    color: "hsl(var(--chart-6))",
  },
  core: {
    label: "Core",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig

export function VolumeProgressionChart({ data }: VolumeProgressionChartProps) {
  // Calculate progression
  const firstWeek = data[0]
  const lastWeek = data[data.length - 1]
  const volumeIncrease = ((lastWeek.totalVolume - firstWeek.totalVolume) / firstWeek.totalVolume * 100).toFixed(1)

  // Current week muscle group distribution
  const currentWeek = lastWeek
  const muscleGroups = [
    { name: "Legs", volume: currentWeek.legs, color: "bg-blue-500" },
    { name: "Back", volume: currentWeek.back, color: "bg-green-500" },
    { name: "Chest", volume: currentWeek.chest, color: "bg-red-500" },
    { name: "Shoulders", volume: currentWeek.shoulders, color: "bg-yellow-500" },
    { name: "Arms", volume: currentWeek.arms, color: "bg-purple-500" },
    { name: "Core", volume: currentWeek.core, color: "bg-pink-500" },
  ].sort((a, b) => b.volume - a.volume)

  const maxVolume = muscleGroups[0].volume

  return (
    <div className="space-y-6">
      {/* Total Volume Progression */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Total Volume Progression
            </CardTitle>
            <Badge variant="default" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              +{volumeIncrease}%
            </Badge>
          </div>
          <CardDescription>
            Track your total weekly training volume over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-totalVolume)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-totalVolume)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value.toLocaleString()} lbs`, 'Total Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="totalVolume"
                  stroke="var(--color-totalVolume)"
                  fill="url(#volumeGradient)"
                  strokeWidth={3}
                  name="Total Volume"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Volume Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(currentWeek.totalVolume / 1000).toFixed(1)}k
              </div>
              <div className="text-sm text-muted-foreground">Current Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(data.reduce((sum, week) => sum + week.totalVolume, 0) / data.length / 1000).toFixed(1)}k
              </div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +{volumeIncrease}%
              </div>
              <div className="text-sm text-muted-foreground">Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Muscle Group Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Volume by Muscle Group</CardTitle>
            <CardDescription>Current week breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {muscleGroups.map((group, index) => {
                const percentage = (group.volume / currentWeek.totalVolume * 100).toFixed(1)
                const relativeWidth = (group.volume / maxVolume * 100)
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${group.color}`} />
                        <span className="font-medium">{group.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{group.volume.toLocaleString()} lbs</span>
                        <div className="text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    </div>
                    <Progress value={relativeWidth} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Weekly Volume Comparison</CardTitle>
            <CardDescription>Last 4 weeks comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.slice(-4)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value.toLocaleString()} lbs`, 'Total Volume']}
                  />
                  <Bar
                    dataKey="totalVolume"
                    fill="var(--color-totalVolume)"
                    radius={[4, 4, 0, 0]}
                    name="Total Volume"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Muscle Group Trends */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Muscle Group Volume Trends</CardTitle>
          <CardDescription>Track volume progression for each muscle group</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value.toLocaleString()} lbs`, name]}
                />
                <Area dataKey="legs" stackId="1" stroke="var(--color-legs)" fill="var(--color-legs)" fillOpacity={0.6} />
                <Area dataKey="back" stackId="1" stroke="var(--color-back)" fill="var(--color-back)" fillOpacity={0.6} />
                <Area dataKey="chest" stackId="1" stroke="var(--color-chest)" fill="var(--color-chest)" fillOpacity={0.6} />
                <Area dataKey="shoulders" stackId="1" stroke="var(--color-shoulders)" fill="var(--color-shoulders)" fillOpacity={0.6} />
                <Area dataKey="arms" stackId="1" stroke="var(--color-arms)" fill="var(--color-arms)" fillOpacity={0.6} />
                <Area dataKey="core" stackId="1" stroke="var(--color-core)" fill="var(--color-core)" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
