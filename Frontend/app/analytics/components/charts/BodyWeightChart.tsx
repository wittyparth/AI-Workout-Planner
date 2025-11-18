"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart } from "recharts"
import { Weight, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BodyWeightProgress } from "../../types"

interface BodyWeightChartProps {
  data: BodyWeightProgress[]
}

const chartConfig = {
  weight: {
    label: "Weight (lbs)",
    color: "hsl(var(--chart-1))",
  },
  bodyFat: {
    label: "Body Fat %",
    color: "hsl(var(--chart-2))",
  },
  muscleMass: {
    label: "Muscle Mass (lbs)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function BodyWeightChart({ data }: BodyWeightChartProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Calculate trends
  const firstEntry = data[0]
  const lastEntry = data[data.length - 1]
  
  const weightChange = lastEntry.weight - firstEntry.weight
  const bodyFatChange = (lastEntry.bodyFat || 0) - (firstEntry.bodyFat || 0)
  const muscleMassChange = (lastEntry.muscleMass || 0) - (firstEntry.muscleMass || 0)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Weight and Muscle Mass Chart */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Weight className="h-5 w-5 text-primary" />
            Weight & Muscle Mass
          </CardTitle>
          <CardDescription>
            Track your weight and muscle mass changes over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-weight)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Body Weight"
                />
                <Line
                  type="monotone"
                  dataKey="muscleMass"
                  stroke="var(--color-muscleMass)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Muscle Mass"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Body Fat Percentage Chart */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-500" />
            Body Fat Percentage
          </CardTitle>
          <CardDescription>
            Monitor your body fat reduction progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-bodyFat)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-bodyFat)" stopOpacity={0.1} />
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
                  formatter={(value) => [`${value}%`, 'Body Fat']}
                />
                <Area
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="var(--color-bodyFat)"
                  fill="url(#bodyFatGradient)"
                  strokeWidth={3}
                  name="Body Fat %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Body Composition Summary</CardTitle>
          <CardDescription>Changes over the tracking period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Weight Change</h4>
              <div className="text-3xl font-bold">
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
              </div>
              <div className={`text-sm flex items-center justify-center gap-1 ${
                weightChange <= 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {weightChange <= 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {Math.abs((weightChange / firstEntry.weight) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Muscle Mass Change</h4>
              <div className="text-3xl font-bold text-green-600">
                +{muscleMassChange.toFixed(1)} lbs
              </div>
              <div className="text-sm flex items-center justify-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                {((muscleMassChange / (firstEntry.muscleMass || 1)) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Body Fat Change</h4>
              <div className="text-3xl font-bold text-green-600">
                {bodyFatChange.toFixed(1)}%
              </div>
              <div className="text-sm flex items-center justify-center gap-1 text-green-600">
                <TrendingDown className="h-4 w-4" />
                {Math.abs((bodyFatChange / (firstEntry.bodyFat || 1)) * 100).toFixed(1)}% reduction
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
