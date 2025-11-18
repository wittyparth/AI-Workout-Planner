"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Dumbbell,
    Play,
    Pause,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Weight,
    Timer as TimerIcon,
    X,
    Trophy,
} from "lucide-react"
import { useActiveWorkout } from "@/hooks/useWorkout"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface WorkoutTrackerProps {
    workoutId: string
    onComplete?: () => void
}

export default function WorkoutTracker({ workoutId, onComplete }: WorkoutTrackerProps) {
    const {
        activeWorkout,
        isActive,
        currentExerciseIndex,
        startTime,
        startWorkout,
        logSet,
        completeWorkout,
        cancelWorkout,
        nextExercise,
        previousExercise,
    } = useActiveWorkout()

    const [elapsedTime, setElapsedTime] = useState(0)
    const [currentSet, setCurrentSet] = useState(1)
    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")
    const [rpe, setRpe] = useState("")
    const [restTimer, setRestTimer] = useState<number | null>(null)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showCompleteDialog, setShowCompleteDialog] = useState(false)

    const currentExercise = activeWorkout?.exercises?.[currentExerciseIndex]
    const totalExercises = activeWorkout?.exercises?.length || 0
    const progress = totalExercises > 0 ? ((currentExerciseIndex + 1) / totalExercises) * 100 : 0

    // Timer for elapsed time
    useEffect(() => {
        if (!isActive || !startTime) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [isActive, startTime])

    // Rest timer countdown
    useEffect(() => {
        if (restTimer === null || restTimer <= 0) return

        const interval = setInterval(() => {
            setRestTimer((prev) => (prev && prev > 0 ? prev - 1 : null))
        }, 1000)

        return () => clearInterval(interval)
    }, [restTimer])

    // Auto-start workout if not active
    useEffect(() => {
        if (workoutId && !isActive) {
            startWorkout(workoutId)
        }
    }, [workoutId, isActive, startWorkout])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleLogSet = async () => {
        if (!currentExercise || !weight || !reps) {
            toast.error("Please enter weight and reps")
            return
        }

        try {
            await logSet(currentExercise.exerciseId, {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                rpe: rpe ? parseInt(rpe) : undefined,
            })

            // Start rest timer if configured
            if (currentExercise.restTime) {
                setRestTimer(currentExercise.restTime)
            }

            // Reset inputs and move to next set
            setWeight("")
            setReps("")
            setRpe("")

            if (currentSet < (currentExercise.sets || 3)) {
                setCurrentSet(prev => prev + 1)
            } else {
                // All sets complete, move to next exercise
                if (currentExerciseIndex < totalExercises - 1) {
                    nextExercise()
                    setCurrentSet(1)
                } else {
                    // Workout complete
                    setShowCompleteDialog(true)
                }
            }
        } catch (error) {
            console.error("Failed to log set:", error)
        }
    }

    const handleComplete = async () => {
        try {
            await completeWorkout()
            setShowCompleteDialog(false)
            onComplete?.()
        } catch (error) {
            console.error("Failed to complete workout:", error)
        }
    }

    const handleCancel = () => {
        cancelWorkout()
        setShowCancelDialog(false)
        onComplete?.()
    }

    if (!activeWorkout || !currentExercise) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Dumbbell className="h-12 w-12 animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading workout...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto p-6 space-y-6">
            {/* Header with Timer */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">{activeWorkout.name}</CardTitle>
                            <CardDescription className="text-primary-foreground/80 mt-1">
                                Exercise {currentExerciseIndex + 1} of {totalExercises}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold flex items-center gap-2">
                                <Clock className="h-6 w-6" />
                                {formatTime(elapsedTime)}
                            </div>
                            <p className="text-sm text-primary-foreground/80">Elapsed Time</p>
                        </div>
                    </div>
                    <div className="w-full bg-primary-foreground/20 rounded-full h-2 mt-4">
                        <div
                            className="bg-primary-foreground h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </CardHeader>
            </Card>

            {/* Rest Timer */}
            {restTimer !== null && restTimer > 0 && (
                <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardContent className="py-6">
                        <div className="text-center">
                            <TimerIcon className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <div className="text-4xl font-bold text-orange-500 mb-1">
                                {formatTime(restTimer)}
                            </div>
                            <p className="text-sm text-muted-foreground">Rest Time Remaining</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => setRestTimer(null)}
                            >
                                Skip Rest
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Current Exercise */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl">{currentExercise.name || "Exercise"}</CardTitle>
                            <CardDescription>
                                {currentExercise.muscleGroup} • Set {currentSet} of {currentExercise.sets || 3}
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            {currentExercise.reps || currentExercise.targetReps} reps
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Exercise Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <Dumbbell className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">{currentExercise.equipment || "Bodyweight"}</div>
                            <div className="text-xs text-muted-foreground">Equipment</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <Weight className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">{currentExercise.sets || 3} sets</div>
                            <div className="text-xs text-muted-foreground">Total Sets</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <TimerIcon className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">{currentExercise.restTime || 60}s</div>
                            <div className="text-xs text-muted-foreground">Rest Time</div>
                        </div>
                    </div>

                    {/* Log Set Form */}
                    <div className="space-y-4 p-4 border rounded-lg bg-accent/50">
                        <h3 className="font-medium">Log Set {currentSet}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    placeholder="0"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reps">Reps</Label>
                                <Input
                                    id="reps"
                                    type="number"
                                    placeholder={currentExercise.reps?.toString() || "0"}
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rpe">RPE (Optional)</Label>
                                <Input
                                    id="rpe"
                                    type="number"
                                    placeholder="1-10"
                                    min="1"
                                    max="10"
                                    value={rpe}
                                    onChange={(e) => setRpe(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button onClick={handleLogSet} className="w-full" size="lg">
                            <Check className="mr-2 h-4 w-4" />
                            Log Set
                        </Button>
                    </div>

                    {/* Previous Sets */}
                    {activeWorkout.completedSets?.filter((s: any) => s.exerciseId === currentExercise.exerciseId).length > 0 && (
                        <div className="space-y-2">
                            <Label>Completed Sets</Label>
                            <div className="space-y-2">
                                {activeWorkout.completedSets
                                    .filter((s: any) => s.exerciseId === currentExercise.exerciseId)
                                    .map((set: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-2 border rounded">
                                            <span className="text-sm">Set {idx + 1}</span>
                                            <span className="text-sm font-medium">
                                                {set.weight}kg × {set.reps} reps
                                                {set.rpe && ` @ RPE ${set.rpe}`}
                                            </span>
                                            <Check className="h-4 w-4 text-green-500" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={previousExercise}
                            disabled={currentExerciseIndex === 0}
                            className="flex-1"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={nextExercise}
                            disabled={currentExerciseIndex === totalExercises - 1}
                            className="flex-1"
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex-1"
                >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Workout
                </Button>
                <Button
                    onClick={() => setShowCompleteDialog(true)}
                    className="flex-1"
                >
                    <Trophy className="mr-2 h-4 w-4" />
                    Complete Workout
                </Button>
            </div>

            {/* Cancel Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Workout?</DialogTitle>
                        <DialogDescription>
                            Your progress will not be saved. Are you sure you want to cancel?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                            Continue Workout
                        </Button>
                        <Button variant="destructive" onClick={handleCancel}>
                            Yes, Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Complete Dialog */}
            <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            Complete Workout?
                        </DialogTitle>
                        <DialogDescription>
                            Great job! You've completed {currentExerciseIndex + 1} of {totalExercises} exercises.
                            Total time: {formatTime(elapsedTime)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                            Continue Workout
                        </Button>
                        <Button onClick={handleComplete}>
                            Complete Workout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
