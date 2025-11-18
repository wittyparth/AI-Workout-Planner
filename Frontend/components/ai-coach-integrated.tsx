"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dumbbell,
    Target,
    Zap,
    ArrowRight,
    Sparkles,
    Brain,
    RefreshCw,
    Save,
    Loader2,
    Clock,
    TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAIWorkout } from "@/hooks/useAI"
import { useCreateWorkout } from "@/hooks/useWorkout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { AIWorkoutRequest } from "@/lib/api"

const GOALS = ["Muscle Gain", "Fat Loss", "Strength", "Endurance", "General Fitness", "Athletic Performance"]
const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"]
const EQUIPMENT = ["Barbell", "Dumbbells", "Kettlebells", "Resistance Bands", "Bodyweight", "Machines", "Cable"]
const TARGET_MUSCLES = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"]

export default function AICoachPage() {
    const router = useRouter()
    const { generateWorkout, isGenerating, generatedWorkout, clearWorkout } = useAIWorkout()
    const { createWorkout, isCreating } = useCreateWorkout()

    const [formData, setFormData] = useState<Partial<AIWorkoutRequest>>({
        goal: "Muscle Gain",
        difficulty: "intermediate",
        duration: 45,
        availableEquipment: [],
        targetMuscles: [],
        preferences: "",
    })

    const handleGenerate = async () => {
        if (!formData.goal || !formData.difficulty || !formData.duration) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            await generateWorkout(formData as AIWorkoutRequest)
        } catch (error) {
            console.error("Generation error:", error)
        }
    }

    const handleSaveWorkout = async () => {
        if (!generatedWorkout) return

        try {
            const workout = await createWorkout({
                name: generatedWorkout.name || "AI Generated Workout",
                exercises: generatedWorkout.exercises.map((ex: any) => ({
                    exerciseId: ex.exerciseId || ex._id,
                    sets: ex.sets || 3,
                    reps: ex.reps || 10,
                    restTime: ex.restTime || 60,
                    notes: ex.notes || "",
                })),
                notes: generatedWorkout.notes || "",
            })

            toast.success("Workout saved! Redirecting...")
            setTimeout(() => {
                router.push(`/workouts/${workout._id}`)
            }, 1000)
        } catch (error) {
            console.error("Save error:", error)
        }
    }

    const toggleEquipment = (equipment: string) => {
        setFormData(prev => ({
            ...prev,
            availableEquipment: prev.availableEquipment?.includes(equipment)
                ? prev.availableEquipment.filter(e => e !== equipment)
                : [...(prev.availableEquipment || []), equipment]
        }))
    }

    const toggleMuscle = (muscle: string) => {
        setFormData(prev => ({
            ...prev,
            targetMuscles: prev.targetMuscles?.includes(muscle)
                ? prev.targetMuscles.filter(m => m !== muscle)
                : [...(prev.targetMuscles || []), muscle]
        }))
    }

    return (
        <div className="container max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Brain className="h-8 w-8 text-primary" />
                        AI Workout Coach
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Generate personalized workouts powered by AI
                    </p>
                </div>
                {generatedWorkout && (
                    <Button variant="outline" onClick={clearWorkout}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        New Workout
                    </Button>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <Card className={cn(generatedWorkout && "lg:col-span-1")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Workout Preferences
                        </CardTitle>
                        <CardDescription>
                            Tell us what you're looking for and we'll create the perfect workout
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Goal */}
                        <div className="space-y-2">
                            <Label>Primary Goal *</Label>
                            <RadioGroup
                                value={formData.goal}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    {GOALS.map((goal) => (
                                        <label
                                            key={goal}
                                            className={cn(
                                                "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent",
                                                formData.goal === goal && "border-primary bg-primary/5"
                                            )}
                                        >
                                            <RadioGroupItem value={goal} id={goal} />
                                            <span className="text-sm">{goal}</span>
                                        </label>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label>Difficulty Level *</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DIFFICULTY_LEVELS.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label>Workout Duration (minutes) *</Label>
                            <Select
                                value={formData.duration?.toString()}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">60 minutes</SelectItem>
                                    <SelectItem value="90">90 minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Equipment */}
                        <div className="space-y-2">
                            <Label>Available Equipment</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {EQUIPMENT.map((equipment) => (
                                    <label
                                        key={equipment}
                                        className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:bg-accent"
                                    >
                                        <Checkbox
                                            checked={formData.availableEquipment?.includes(equipment)}
                                            onCheckedChange={() => toggleEquipment(equipment)}
                                        />
                                        <span className="text-sm">{equipment}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Target Muscles */}
                        <div className="space-y-2">
                            <Label>Target Muscle Groups</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {TARGET_MUSCLES.map((muscle) => (
                                    <label
                                        key={muscle}
                                        className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:bg-accent"
                                    >
                                        <Checkbox
                                            checked={formData.targetMuscles?.includes(muscle)}
                                            onCheckedChange={() => toggleMuscle(muscle)}
                                        />
                                        <span className="text-sm">{muscle}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Additional Preferences */}
                        <div className="space-y-2">
                            <Label>Additional Preferences (Optional)</Label>
                            <Textarea
                                placeholder="E.g., Focus on compound movements, avoid jumping exercises, include core work..."
                                value={formData.preferences}
                                onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full"
                            size="lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate AI Workout
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Workout */}
                {generatedWorkout && (
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Dumbbell className="h-5 w-5 text-primary" />
                                {generatedWorkout.name || "Your AI Workout"}
                            </CardTitle>
                            <CardDescription>
                                {generatedWorkout.description || "Personalized workout generated just for you"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Workout Details */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 border rounded-lg">
                                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                                    <div className="text-sm font-medium">{generatedWorkout.estimatedDuration || formData.duration} min</div>
                                    <div className="text-xs text-muted-foreground">Duration</div>
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                    <Dumbbell className="h-5 w-5 mx-auto mb-1 text-primary" />
                                    <div className="text-sm font-medium">{generatedWorkout.exercises?.length || 0}</div>
                                    <div className="text-xs text-muted-foreground">Exercises</div>
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                    <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
                                    <div className="text-sm font-medium capitalize">{generatedWorkout.difficulty || formData.difficulty}</div>
                                    <div className="text-xs text-muted-foreground">Level</div>
                                </div>
                            </div>

                            {/* Exercise List */}
                            <div className="space-y-3">
                                <Label>Exercises</Label>
                                {generatedWorkout.exercises?.map((exercise: any, index: number) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium">{exercise.name || `Exercise ${index + 1}`}</h4>
                                                <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
                                            </div>
                                            <Badge variant="outline">{exercise.equipment || "Bodyweight"}</Badge>
                                        </div>
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <span>{exercise.sets || 3} sets</span>
                                            <span>•</span>
                                            <span>{exercise.reps || exercise.targetReps || "10"} reps</span>
                                            {exercise.restTime && (
                                                <>
                                                    <span>•</span>
                                                    <span>{exercise.restTime}s rest</span>
                                                </>
                                            )}
                                        </div>
                                        {exercise.notes && (
                                            <p className="text-xs text-muted-foreground italic">{exercise.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* AI Notes */}
                            {generatedWorkout.notes && (
                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                    <Label className="flex items-center gap-2 mb-2">
                                        <Brain className="h-4 w-4 text-primary" />
                                        AI Coach Tips
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{generatedWorkout.notes}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveWorkout}
                                    disabled={isCreating}
                                    className="flex-1"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save & Start
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
