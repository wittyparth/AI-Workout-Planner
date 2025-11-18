"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  Pause,
  Clock,
  CheckCircle,
  ChevronLeft,
  Timer,
  Plus,
  Minus,
  Trophy,
  BarChart3,
  Target,
  X,
  SkipForward,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkoutTimer } from "./hooks/useWorkoutTimerNew";
import { Exercise } from "./types/timer-types";

// Sample workout data (would come from template or user selection)
const sampleExercises: Exercise[] = [
  {
    id: "1",
    name: "Bench Press (Barbell)",
    muscle: "Chest",
    equipment: "Barbell",
    targetMuscles: ["Chest", "Triceps", "Anterior Deltoids"],
    personalRecord: { weight: 225, reps: 8 },
    lastWorkout: {
      sets: [
        { weight: 135, reps: 12, restTime: 90 },
        { weight: 155, reps: 10, restTime: 120 },
        { weight: 175, reps: 8, restTime: 120 },
        { weight: 185, reps: 6, restTime: 90 }
      ]
    },
    tips: ["Keep core engaged", "Control the negative", "Full range of motion"],
  },
  {
    id: "2",
    name: "Incline Dumbbell Press",
    muscle: "Chest",
    equipment: "Dumbbells",
    targetMuscles: ["Upper Chest", "Triceps", "Anterior Deltoids"],
    personalRecord: { weight: 80, reps: 10 },
    lastWorkout: {
      sets: [
        { weight: 60, reps: 12, restTime: 90 },
        { weight: 65, reps: 10, restTime: 90 },
        { weight: 70, reps: 8, restTime: 90 }
      ]
    },
    tips: ["Squeeze chest at top", "45-degree angle", "Control the weight"],
  },
  {
    id: "3",
    name: "Push-ups",
    muscle: "Chest",
    equipment: "Bodyweight",
    targetMuscles: ["Chest", "Triceps", "Core"],
    personalRecord: { weight: 0, reps: 25 },
    lastWorkout: {
      sets: [
        { weight: 0, reps: 15, restTime: 60 },
        { weight: 0, reps: 12, restTime: 60 },
        { weight: 0, reps: 10, restTime: 60 }
      ]
    },
    tips: ["Perfect form over speed", "Full extension", "Engage core"],
  }
];

export default function WorkoutTimerPage() {
  const {
    state,
    currentExercise,
    currentExerciseSets,
    currentSetIndex,
    completedSets,
    totalVolume,
    workoutDuration,
    workoutProgress,
    actions,
    formatTime,
  } = useWorkoutTimer();

  // Initialize with sample exercises
  useEffect(() => {
    actions.loadTemplate({
      id: "sample",
      name: "Chest Workout",
      exercises: sampleExercises,
    });
  }, [actions]);

  const handleCompleteSet = (setIndex: number) => {
    if (currentExercise) {
      actions.completeSet(currentExercise.id, setIndex);
    }
  };

  const handleAddSet = () => {
    if (currentExercise) {
      actions.addSet(currentExercise.id);
    }
  };

  const handleRemoveSet = (setIndex: number) => {
    if (currentExercise) {
      actions.removeSet(currentExercise.id, setIndex);
    }
  };

  const handleUpdateSet = (setIndex: number, field: 'weight' | 'reps', value: number) => {
    if (currentExercise) {
      actions.updateSet(currentExercise.id, setIndex, { [field]: value });
    }
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Workout...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/workouts">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold truncate">
                  {currentExercise.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentExercise.muscle} • Exercise {state.currentExerciseIndex + 1}/{state.exercises.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={state.showStats} onOpenChange={actions.toggleStats}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Workout Stats</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{completedSets.length}</div>
                      <div className="text-xs text-muted-foreground">Sets</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{Math.round(totalVolume)}kg</div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{formatTime(workoutDuration)}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{state.exercises.length}</div>
                      <div className="text-xs text-muted-foreground">Exercises</div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Badge variant="outline" className="text-xs">
                Set {Math.max(1, currentSetIndex + 1)}/{currentExerciseSets.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${workoutProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl p-4 space-y-6">
        {/* Exercise Demo */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">{currentExercise.name}</p>
                <p className="text-sm">Exercise demonstration</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="secondary">{currentExercise.muscle}</Badge>
              <Badge variant="outline">{currentExercise.equipment}</Badge>
            </div>

            <Dialog open={state.showExerciseDetails} onOpenChange={actions.toggleExerciseDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Exercise Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentExercise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Target Muscles</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentExercise.targetMuscles.map(muscle => (
                        <Badge key={muscle} variant="secondary" className="text-xs">{muscle}</Badge>
                      ))}
                    </div>
                  </div>
                  {currentExercise.tips && (
                    <div>
                      <h4 className="font-medium mb-2">Form Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {currentExercise.tips.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {currentExercise.personalRecord && (
                    <div>
                      <h4 className="font-medium mb-2">Personal Record</h4>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">
                            {currentExercise.personalRecord.weight > 0
                              ? `${currentExercise.personalRecord.weight}kg × ${currentExercise.personalRecord.reps}`
                              : `${currentExercise.personalRecord.reps} reps`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Rest Timer */}
        {state.isResting && (
          <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="text-3xl font-bold text-orange-500">
                      {formatTime(state.restTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rest Time</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={state.isTimerRunning ? actions.pauseTimer : actions.resumeTimer}
                  >
                    {state.isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.stopRest}
                  >
                    Skip Rest
                  </Button>
                </div>
              </div>

              {/* Quick Timer Options */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground self-center">Quick set:</span>
                {[30, 60, 90, 120, 180].map(seconds => (
                  <Button
                    key={seconds}
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.startRest(seconds)}
                    className="h-8 px-3 text-xs"
                  >
                    {formatTime(seconds)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sets */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sets</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSet}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Set
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.startRest()}
                >
                  <Timer className="h-4 w-4 mr-1" />
                  Start Timer
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {currentExerciseSets.map((set, index) => {
              const lastWorkoutSet = currentExercise.lastWorkout?.sets[index];
              const isCompleted = set.completed;
              const isPersonalRecord = set.weight >= (currentExercise.personalRecord?.weight || 0) &&
                set.reps >= (currentExercise.personalRecord?.reps || 0);

              return (
                <div
                  key={set.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    isCompleted 
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200" 
                      : "bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-muted-foreground/20"
                    )}>
                      {index + 1}
                    </div>

                    {lastWorkoutSet && (
                      <div className="text-sm text-muted-foreground">
                        Previous: {lastWorkoutSet.weight > 0 ? `${lastWorkoutSet.weight}kg × ` : ''}{lastWorkoutSet.reps}
                      </div>
                    )}

                    {isPersonalRecord && !isCompleted && (
                      <Trophy className="h-4 w-4 text-yellow-600 ml-auto" />
                    )}

                    {currentExerciseSets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSet(index)}
                        className="ml-auto h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600 ml-auto">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Done</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-end">
                    {/* Weight Input */}
                    {currentExercise.equipment !== "Bodyweight" && (
                      <div className="col-span-5">
                        <Label className="text-sm text-muted-foreground">Weight (kg)</Label>
                        <div className="flex items-center gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateSet(index, 'weight', Math.max(0, set.weight - 2.5))}
                            className="h-8 w-8 p-0"
                            disabled={isCompleted}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleUpdateSet(index, 'weight', Number(e.target.value))}
                            className="text-center h-8 text-sm flex-1"
                            disabled={isCompleted}
                            step="2.5"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateSet(index, 'weight', set.weight + 2.5)}
                            className="h-8 w-8 p-0"
                            disabled={isCompleted}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reps Input */}
                    <div className={currentExercise.equipment !== "Bodyweight" ? "col-span-5" : "col-span-9"}>
                      <Label className="text-sm text-muted-foreground">Reps</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateSet(index, 'reps', Math.max(0, set.reps - 1))}
                          className="h-8 w-8 p-0"
                          disabled={isCompleted}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(index, 'reps', Number(e.target.value))}
                          className="text-center h-8 text-sm flex-1"
                          disabled={isCompleted}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateSet(index, 'reps', set.reps + 1)}
                          className="h-8 w-8 p-0"
                          disabled={isCompleted}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Complete Button */}
                    <div className="col-span-2">
                      {!isCompleted ? (
                        <Button
                          onClick={() => handleCompleteSet(index)}
                          size="sm"
                          className="w-full h-8"
                          variant={index === currentSetIndex ? "default" : "outline"}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex justify-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Rest Time Settings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Default Rest Time</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.setDefaultRestTime(Math.max(30, state.defaultRestTime - 30))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={state.defaultRestTime}
                  onChange={(e) => actions.setDefaultRestTime(Number(e.target.value))}
                  className="w-20 text-center h-8"
                  min="30"
                  max="300"
                />
                <span className="text-sm text-muted-foreground">sec</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.setDefaultRestTime(Math.min(300, state.defaultRestTime + 30))}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[60, 90, 120, 180, 240].map(seconds => (
                <Button
                  key={seconds}
                  variant={state.defaultRestTime === seconds ? "default" : "outline"}
                  size="sm"
                  onClick={() => actions.setDefaultRestTime(seconds)}
                  className="h-8 px-3 text-xs"
                >
                  {formatTime(seconds)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={actions.previousExercise}
            disabled={state.currentExerciseIndex === 0}
            className="h-12"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Exercise
          </Button>
          
          {state.currentExerciseIndex < state.exercises.length - 1 ? (
            <Button
              onClick={actions.nextExercise}
              className="h-12"
            >
              Next Exercise
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="h-12"
              asChild
            >
              <Link href="/workouts">
                🎉 Finish Workout
              </Link>
            </Button>
          )}
        </div>

        {/* Add Exercise Button */}
        <Button
          variant="outline"
          className="w-full h-12"
          asChild
        >
          <Link href="/workouts/create">
            <Plus className="h-4 w-4 mr-2" />
            Add More Exercises
          </Link>
        </Button>
      </div>
    </div>
  );
}