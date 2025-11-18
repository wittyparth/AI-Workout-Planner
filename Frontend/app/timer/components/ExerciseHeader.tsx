import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Info, RotateCcw, Trophy, TrendingUp } from "lucide-react"
import { Exercise } from "../types/workout"

interface ExerciseHeaderProps {
    exercise: Exercise
    currentSetIndex: number
    showExerciseDetails: boolean
    showAlternatives: boolean
    onShowDetailsChange: (show: boolean) => void
    onShowAlternativesChange: (show: boolean) => void
}

export function ExerciseHeader({
    exercise,
    currentSetIndex,
    showExerciseDetails,
    showAlternatives,
    onShowDetailsChange,
    onShowAlternativesChange
}: ExerciseHeaderProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                                <Badge variant={exercise.difficulty === "Beginner" ? "default" :
                                    exercise.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                                    {exercise.difficulty}
                                </Badge>
                            </div>
                            <CardDescription className="text-sm">
                                Set {currentSetIndex + 1} of {exercise.sets} • {exercise.muscleGroups.slice(0, 2).join(", ")}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Dialog open={showExerciseDetails} onOpenChange={onShowDetailsChange}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Info className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{exercise.name}</DialogTitle>
                                </DialogHeader>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Instructions</h4>
                                            <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">Form Tips</h4>
                                            <ul className="text-sm text-muted-foreground space-y-1">
                                                {exercise.tips.map((tip, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-primary">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {exercise.personalRecord && (
                                            <div className="p-3 bg-muted rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                                    <span className="text-sm font-medium">Personal Record</span>
                                                </div>
                                                <div className="text-lg font-bold">
                                                    {exercise.personalRecord.weight}lbs × {exercise.personalRecord.reps} reps
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(exercise.personalRecord.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                        {exercise.lastWorkout && (
                                            <div>
                                                <h4 className="font-medium mb-2">Previous Workout</h4>
                                                <div className="space-y-1">
                                                    {exercise.lastWorkout.sets.slice(0, 3).map((set, index) => (
                                                        <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                                                            <span>Set {index + 1}</span>
                                                            <span>{set.weight}lbs × {set.reps} (RPE {set.rpe})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={showAlternatives} onOpenChange={onShowAlternativesChange}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Exercise Alternatives</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-2">
                                    {exercise.alternatives?.map((alt, index) => (
                                        <Button key={index} variant="outline" className="justify-start">
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            {alt}
                                        </Button>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}
