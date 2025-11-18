"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Flame, Target, Clock } from "lucide-react"
import { ConsistencyData, StreakData } from "../../types"
import { cn } from "@/lib/utils"

// @ts-ignore - cal-heatmap types issue
import CalHeatmap from "cal-heatmap"
import "cal-heatmap/cal-heatmap.css"

interface ConsistencyHeatmapProps {
  data: ConsistencyData[]
  streakData: StreakData
}

type DurationView = 'weekly' | 'monthly' | 'yearly'

export function ConsistencyHeatmap({ data, streakData }: ConsistencyHeatmapProps) {
  const [durationView, setDurationView] = useState<DurationView>('monthly')
  const calHeatmapRef = useRef<HTMLDivElement>(null)
  const calInstance = useRef<any>(null)

  const formatDataForCalHeatmap = () => {
    const heatmapData: { [key: string]: number } = {}
    
    data.forEach(day => {
      const date = new Date(day.date)
      const timestamp = Math.floor(date.getTime() / 1000)
      if (day.workoutCompleted) {
        // Use intensity as value (1-10 scale)
        heatmapData[timestamp] = day.intensity
      } else {
        // 0 for rest days
        heatmapData[timestamp] = 0
      }
    })
    
    return heatmapData
  }

  const initializeCalHeatmap = () => {
    if (!calHeatmapRef.current) return

    const now = new Date()
    const heatmapData = formatDataForCalHeatmap()

    // Destroy existing instance
    if (calInstance.current) {
      calInstance.current.destroy()
    }

    // Create new instance
    calInstance.current = new CalHeatmap()
    
    const config = {
      data: {
        source: heatmapData,
        type: "json"
      },
      date: {
        start: durationView === 'yearly' 
          ? new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          : durationView === 'monthly'
          ? new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      },
      scale: {
        color: {
          type: "threshold",
          range: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
          domain: [1, 3, 5, 7, 9]
        }
      },
      domain: {
        type: durationView === 'yearly' ? "year" : durationView === 'monthly' ? "month" : "week",
        gutter: 4
      },
      subDomain: {
        type: "day",
        width: durationView === 'weekly' ? 20 : 12,
        height: durationView === 'weekly' ? 20 : 12,
        gutter: 2
      },
      itemSelector: calHeatmapRef.current
    }

    try {
      calInstance.current.paint(config)
    } catch (error) {
      console.error("Error initializing cal-heatmap:", error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeCalHeatmap()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (calInstance.current) {
        try {
          calInstance.current.destroy()
        } catch (error) {
          console.error("Error destroying cal-heatmap:", error)
        }
      }
    }
  }, [durationView, data])

  const heatmapData = data.slice(durationView === 'yearly' ? -365 : durationView === 'monthly' ? -30 : -7)

  return (
    <div className="space-y-6">
      {/* Duration Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workout Consistency</CardTitle>
              <CardDescription>Your training consistency over time</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant={durationView === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDurationView('weekly')}
              >
                Week
              </Button>
              <Button
                variant={durationView === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDurationView('monthly')}
              >
                Month
              </Button>
              <Button
                variant={durationView === 'yearly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDurationView('yearly')}
              >
                Year
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cal-Heatmap Container */}
          <div className="space-y-4">
            <div 
              ref={calHeatmapRef} 
              className="cal-heatmap-container w-full overflow-auto"
              style={{ 
                minHeight: durationView === 'yearly' ? '200px' : '150px',
                background: 'transparent'
              }}
            />
            
            {/* Fallback message while loading */}
            {!calInstance.current && (
              <div className="text-center text-muted-foreground py-8">
                Loading heatmap...
              </div>
            )}
            
            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less active</span>
              <div className="flex items-center gap-2">
                <span>More active</span>
              </div>
            </div>
            
            {/* Workout intensity legend */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Intensity:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ebedf0' }} />
                <span className="text-xs">Rest</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#9be9a8' }} />
                <span className="text-xs">Light</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#40c463' }} />
                <span className="text-xs">Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#30a14e' }} />
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#216e39' }} />
                <span className="text-xs">Intense</span>
              </div>
            </div>
          </div>

          {/* Custom styles for cal-heatmap */}
          <style jsx>{`
            .cal-heatmap-container :global(.ch-domain-text) {
              font-size: 12px;
              fill: hsl(var(--muted-foreground));
            }
            .cal-heatmap-container :global(.ch-subdomain-text) {
              font-size: 10px;
              fill: hsl(var(--muted-foreground));
            }
            .cal-heatmap-container :global(.ch-tooltip) {
              background: hsl(var(--background));
              border: 1px solid hsl(var(--border));
              border-radius: 6px;
              color: hsl(var(--foreground));
              font-size: 12px;
              padding: 8px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
          `}</style>
        </CardContent>
      </Card>

      {/* Streak Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Flame className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{streakData.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Target className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{streakData.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{Math.round((heatmapData.filter(d => d.workoutCompleted).length / heatmapData.length) * 100)}%</p>
              <p className="text-xs text-muted-foreground">Consistency Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{Math.round(heatmapData.reduce((sum, d) => sum + d.duration, 0) / heatmapData.filter(d => d.workoutCompleted).length) || 0}</p>
              <p className="text-xs text-muted-foreground">Avg Duration (min)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
