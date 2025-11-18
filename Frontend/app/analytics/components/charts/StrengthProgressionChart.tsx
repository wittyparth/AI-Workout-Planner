"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, Dumbbell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExerciseSpecificProgress } from "../../types"

interface StrengthProgressionChartProps {
  data: ExerciseSpecificProgress[]
  selectedExercise?: string
}

const chartConfig = {
  weight: {
    label: "Weight (lbs)",
    color: "hsl(var(--chart-1))",
  },
  estimatedMax: {
    label: "Estimated 1RM (lbs)",
    color: "hsl(var(--chart-2))",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function StrengthProgressionChart({ data, selectedExercise = "Bench Press" }: StrengthProgressionChartProps) {
  const exerciseData = data.find(exercise => exercise.exerciseName === selectedExercise)
  
  if (!exerciseData) {
    return <div>No data available for {selectedExercise}</div>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            {exerciseData.exerciseName} Progression
          </CardTitle>
          <Badge variant={exerciseData.trend === 'up' ? 'default' : 'secondary'} className="gap-1">
            <TrendingUp className="h-3 w-3" />
            +{exerciseData.progression}%
          </Badge>
        </div>
        <CardDescription>
          Weight and estimated 1RM progression over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={exerciseData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-weight)"
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Working Weight"
              />
              <Line
                type="monotone"
                dataKey="estimatedMax"
                stroke="var(--color-estimatedMax)"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                name="Estimated 1RM"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {exerciseData.data[exerciseData.data.length - 1]?.weight} lbs
            </div>
            <div className="text-sm text-muted-foreground">Current Weight</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {exerciseData.currentMax} lbs
            </div>
            <div className="text-sm text-muted-foreground">Est. 1RM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{exerciseData.progression}%
            </div>
            <div className="text-sm text-muted-foreground">Improvement</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
