import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WorkoutSession } from "../types/workout"

interface WorkoutProgressProps {
    currentExerciseIndex: number
    totalExercises: number
    completedSets: number
    totalSets: number
    totalWorkoutTime: number
    workoutSession: WorkoutSession
    formatTime: (seconds: number) => string
}

export function WorkoutProgress({
    currentExerciseIndex,
    totalExercises,
    completedSets,
    totalSets,
    totalWorkoutTime,
    workoutSession,
    formatTime
}: WorkoutProgressProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Workout Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Exercise</span>
                        <span className="text-sm font-medium">{currentExerciseIndex + 1} / {totalExercises}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sets</span>
                        <span className="text-sm font-medium">{completedSets} / {totalSets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Time</span>
                        <span className="text-sm font-medium">{formatTime(totalWorkoutTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Rest Time</span>
                        <span className="text-sm font-medium">{formatTime(workoutSession.totalRestTime)}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Overall Progress</span>
                        <span>{Math.round((currentExerciseIndex / totalExercises) * 100)}%</span>
                    </div>
                    <Progress value={(currentExerciseIndex / totalExercises) * 100} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}
