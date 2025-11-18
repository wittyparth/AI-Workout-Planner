"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, TrendingUp, TrendingDown, Target } from "lucide-react"
import { ExerciseSpecificProgress } from "../types"

interface ExerciseSelectorProps {
  exercises: ExerciseSpecificProgress[]
  selectedExercise: string
  onExerciseChange: (exercise: string) => void
}

export function ExerciseSelector({ exercises, selectedExercise, onExerciseChange }: ExerciseSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Dropdown Selector */}
      <div className="flex items-center gap-4">
        <Dumbbell className="h-5 w-5 text-primary" />
        <Select value={selectedExercise} onValueChange={onExerciseChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise.exerciseName} value={exercise.exerciseName}>
                <div className="flex items-center gap-2">
                  <span>{exercise.exerciseName}</span>
                  <Badge variant={exercise.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                    {exercise.trend === 'up' ? '+' : exercise.trend === 'down' ? '-' : '='}{exercise.progression.toFixed(1)}%
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Exercise Cards */}
      <div className="grid gap-3 md:grid-cols-3">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.exerciseName}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedExercise === exercise.exerciseName 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onExerciseChange(exercise.exerciseName)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{exercise.exerciseName}</h4>
                {exercise.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {exercise.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {exercise.trend === 'stable' && <Target className="h-4 w-4 text-yellow-500" />}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Current Max</span>
                  <span className="font-bold text-sm">{exercise.currentMax} lbs</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <Badge 
                    variant={exercise.progression >= 10 ? 'default' : exercise.progression >= 5 ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    +{exercise.progression.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Sessions</span>
                  <span className="text-xs font-medium">{exercise.data.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
