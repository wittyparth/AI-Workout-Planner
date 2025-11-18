"use client";

import React from "react";
import { motion } from "motion/react";
import { Dumbbell, Plus, Trash2, Edit, GripVertical, Calendar } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

// Types
import { WorkoutTemplate, TemplateExercise } from "@/lib/types/template";
import { ExerciseData } from "@/app/templates/builder/data/exercises";

interface ExerciseBuilderStepProps {
    templateData: Partial<WorkoutTemplate>;
    setTemplateData: React.Dispatch<React.SetStateAction<Partial<WorkoutTemplate>>>;
    selectedDayKey: string | null;
    selectedDayIndex: number;
    onOpenExerciseModal: () => void;
}

const DAYS = [
    { key: "monday", name: "Monday", shortName: "Mon" },
    { key: "tuesday", name: "Tuesday", shortName: "Tue" },
    { key: "wednesday", name: "Wednesday", shortName: "Wed" },
    { key: "thursday", name: "Thursday", shortName: "Thu" },
    { key: "friday", name: "Friday", shortName: "Fri" },
    { key: "saturday", name: "Saturday", shortName: "Sat" },
    { key: "sunday", name: "Sunday", shortName: "Sun" }
];

export function ExerciseBuilderStep({
    templateData,
    setTemplateData,
    selectedDayKey,
    selectedDayIndex,
    onOpenExerciseModal
}: ExerciseBuilderStepProps) {

    const addExercise = (exercise: ExerciseData) => {
        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

        // Convert ExerciseData to TemplateExercise
        const templateExercise: TemplateExercise = {
            id: `${selectedDayKey}-${Date.now()}`,
            exerciseId: exercise.id,
            name: exercise.name,
            sets: exercise.sets || 3,
            reps: exercise.reps || 12,
            weight: exercise.weight && exercise.weight !== ""
                ? (exercise.weight === "bodyweight" || exercise.weight.includes("%")
                    ? exercise.weight as "bodyweight" | "percentage"
                    : parseFloat(exercise.weight) || undefined)
                : "bodyweight",
            restTime: exercise.restTime || 90,
            isSuperset: false,
            alternatives: [],
            muscleGroups: exercise.muscleGroups,
            equipment: exercise.equipment,
            order: templateData.weeklyPlan.days[selectedDayKey as keyof typeof templateData.weeklyPlan.days].exercises.length + 1
        };

        setTemplateData(prev => {
            if (!prev.weeklyPlan?.days || !selectedDayKey) return prev;

            const currentDay = prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days];

            return {
                ...prev,
                weeklyPlan: {
                    ...prev.weeklyPlan,
                    days: {
                        ...prev.weeklyPlan.days,
                        [selectedDayKey]: {
                            ...currentDay,
                            exercises: [...currentDay.exercises, templateExercise],
                            exerciseCount: currentDay.exercises.length + 1
                        }
                    }
                }
            };
        });
    };

    const removeExercise = (exerciseId: string) => {
        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

        const currentDay = templateData.weeklyPlan.days[selectedDayKey as keyof typeof templateData.weeklyPlan.days];
        const updatedExercises = currentDay.exercises.filter(ex => ex.id !== exerciseId);

        setTemplateData(prev => ({
            ...prev,
            weeklyPlan: {
                ...prev.weeklyPlan!,
                days: {
                    ...prev.weeklyPlan!.days,
                    [selectedDayKey]: {
                        ...currentDay,
                        exercises: updatedExercises,
                        exerciseCount: updatedExercises.length
                    }
                }
            }
        }));
    };

    const selectDay = (dayKey: string, dayIndex: number) => {
        // This would be handled by parent component
        console.log(`Selecting day: ${dayKey}, index: ${dayIndex}`);
    };

    const currentDay = selectedDayKey && templateData.weeklyPlan?.days
        ? templateData.weeklyPlan.days[selectedDayKey as keyof typeof templateData.weeklyPlan.days]
        : null;

    const workoutDays = templateData.weeklyPlan?.days
        ? Object.entries(templateData.weeklyPlan.days).filter(([_, day]) => !day.isRestDay)
        : [];

    return (
        <div className="space-y-8">
            <BlurFade delay={0.1} inView>
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <TextAnimate
                        className="text-3xl font-bold"
                        animation="slideUp"
                    >
                        Build Your Workouts
                    </TextAnimate>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Add exercises to each workout day. Start by selecting a day, then add exercises
                        with custom sets, reps, and weights.
                    </p>
                </div>
            </BlurFade>

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Day Selection */}
                    <div className="space-y-4">
                        <BlurFade delay={0.2} inView>
                            <h3 className="text-xl font-semibold">Select Workout Day</h3>
                        </BlurFade>

                        <div className="space-y-3">
                            {DAYS.map((day, index) => {
                                const dayData = templateData.weeklyPlan?.days?.[day.key as keyof typeof templateData.weeklyPlan.days];
                                if (!dayData || dayData.isRestDay) return null;

                                return (
                                    <BlurFade key={day.key} delay={0.3 + index * 0.1} inView>
                                        <Card
                                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedDayKey === day.key
                                                    ? "ring-2 ring-primary shadow-lg"
                                                    : ""
                                                }`}
                                            onClick={() => selectDay(day.key, index)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{day.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {dayData.exerciseCount || 0} exercises
                                                        </p>
                                                    </div>
                                                    <Badge variant={selectedDayKey === day.key ? "default" : "secondary"}>
                                                        {dayData.estimatedDuration} min
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </BlurFade>
                                );
                            })}
                        </div>
                    </div>

                    {/* Exercise List */}
                    <div className="lg:col-span-2 space-y-4">
                        {selectedDayKey && currentDay ? (
                            <>
                                <BlurFade delay={0.4} inView>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">
                                            {DAYS.find(d => d.key === selectedDayKey)?.name} Exercises
                                        </h3>
                                        <ShimmerButton
                                            onClick={onOpenExerciseModal}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Exercise
                                        </ShimmerButton>
                                    </div>
                                </BlurFade>

                                {currentDay.exercises.length > 0 ? (
                                    <div className="space-y-4">
                                        {currentDay.exercises.map((exercise, index) => (
                                            <BlurFade key={exercise.id} delay={0.5 + index * 0.1} inView>
                                                <Card>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <GripVertical className="h-4 w-4" />
                                                                <span className="text-sm font-medium">
                                                                    {exercise.order || index + 1}
                                                                </span>
                                                            </div>

                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="space-y-2">
                                                                        <h4 className="text-lg font-semibold">
                                                                            {exercise.name}
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {exercise.muscleGroups.map((muscle) => (
                                                                                <Badge key={muscle} variant="secondary">
                                                                                    {muscle}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <Button variant="ghost" size="icon">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeExercise(exercise.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                <Separator className="my-4" />

                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                    <div>
                                                                        <span className="text-muted-foreground">Sets</span>
                                                                        <p className="font-medium">{exercise.sets}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-muted-foreground">Reps</span>
                                                                        <p className="font-medium">
                                                                            {typeof exercise.reps === 'number'
                                                                                ? exercise.reps
                                                                                : `${exercise.reps.min}-${exercise.reps.max}`
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-muted-foreground">Weight</span>
                                                                        <p className="font-medium">
                                                                            {exercise.weight === "bodyweight"
                                                                                ? "Bodyweight"
                                                                                : exercise.weight || "—"
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-muted-foreground">Rest</span>
                                                                        <p className="font-medium">{exercise.restTime}s</p>
                                                                    </div>
                                                                </div>

                                                                {exercise.equipment.length > 0 && (
                                                                    <div className="mt-4">
                                                                        <span className="text-sm text-muted-foreground">Equipment: </span>
                                                                        <span className="text-sm">{exercise.equipment.join(", ")}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </BlurFade>
                                        ))}
                                    </div>
                                ) : (
                                    <BlurFade delay={0.5} inView>
                                        <Card className="border-dashed">
                                            <CardContent className="p-12 text-center">
                                                <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <h4 className="text-lg font-medium mb-2">No exercises added yet</h4>
                                                <p className="text-muted-foreground mb-6">
                                                    Start building your workout by adding exercises for {DAYS.find(d => d.key === selectedDayKey)?.name}.
                                                </p>
                                                <InteractiveHoverButton onClick={onOpenExerciseModal}>
                                                    Add Your First Exercise
                                                </InteractiveHoverButton>
                                            </CardContent>
                                        </Card>
                                    </BlurFade>
                                )}
                            </>
                        ) : (
                            <BlurFade delay={0.4} inView>
                                <Card className="border-dashed">
                                    <CardContent className="p-12 text-center">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h4 className="text-lg font-medium mb-2">Select a workout day</h4>
                                        <p className="text-muted-foreground">
                                            Choose a workout day from the left panel to start adding exercises.
                                        </p>
                                    </CardContent>
                                </Card>
                            </BlurFade>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Summary */}
            {workoutDays.length > 0 && (
                <BlurFade delay={0.8} inView>
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle>Template Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {workoutDays.filter(([_, day]) => day.exerciseCount > 0).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Days with exercises
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {workoutDays.reduce((total, [_, day]) => total + (day.exerciseCount || 0), 0)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Total exercises
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {Math.round(workoutDays.reduce((total, [_, day]) =>
                                            total + day.estimatedDuration, 0) / workoutDays.length) || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Avg workout time (min)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
            )}
        </div>
    );
}
