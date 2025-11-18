"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Trophy, Medal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PersonalRecord } from "../../types"

interface PersonalRecordsChartProps {
  data: PersonalRecord[]
}

const chartConfig = {
  weight: {
    label: "Weight (lbs)",
    color: "hsl(var(--chart-1))",
  },
  improvement: {
    label: "Improvement (lbs)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PersonalRecordsChart({ data }: PersonalRecordsChartProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Get unique exercises and their latest PRs
  const exerciseGroups = data.reduce((acc, record) => {
    if (!acc[record.exerciseName]) {
      acc[record.exerciseName] = []
    }
    acc[record.exerciseName].push(record)
    return acc
  }, {} as Record<string, PersonalRecord[]>)

  // Get the most recent PR for each exercise
  const latestPRs = Object.entries(exerciseGroups).map(([exercise, records]) => {
    const latest = records[records.length - 1]
    const total = records.reduce((sum, record) => sum + record.improvement, 0)
    return {
      exercise,
      weight: latest.weight,
      totalImprovement: total,
      date: latest.date,
      records: records.length
    }
  })

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Personal Records Timeline
        </CardTitle>
        <CardDescription>
          Your personal best achievements across all exercises
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={latestPRs} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="exercise" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  name === 'weight' ? `${value} lbs` : `+${value} lbs`,
                  name === 'weight' ? 'Current PR' : 'Total Improvement'
                ]}
              />
              <Bar
                dataKey="weight"
                fill="var(--color-weight)"
                radius={[4, 4, 0, 0]}
                name="Current PR"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Recent PRs List */}
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Recent Personal Records
          </h4>
          <div className="space-y-2">
            {data.slice(-3).reverse().map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Medal className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="font-medium">{record.exerciseName}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(record.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{record.weight} lbs</div>
                  {record.improvement > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{record.improvement} lbs
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
