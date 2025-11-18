"use client";

import React from "react";
import { motion } from "motion/react";
import { Save, CheckCircle, Users, Clock, Target, Dumbbell, Calendar, Share } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";

// Types
import { WorkoutTemplate } from "@/lib/types/template";

interface ReviewStepProps {
    templateData: Partial<WorkoutTemplate>;
    onSaveTemplate: () => void;
    onGoBack: () => void;
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

export function ReviewStep({ templateData, onSaveTemplate, onGoBack }: ReviewStepProps) {
    const workoutDays = templateData.weeklyPlan?.days
        ? Object.entries(templateData.weeklyPlan.days).filter(([_, day]) => !day.isRestDay)
        : [];

    const totalExercises = workoutDays.reduce((total, [_, day]) => total + (day.exerciseCount || 0), 0);
    const avgWorkoutTime = workoutDays.length > 0
        ? Math.round(workoutDays.reduce((total, [_, day]) => total + day.estimatedDuration, 0) / workoutDays.length)
        : 0;

    const isComplete = templateData.name && templateData.description && totalExercises > 0;

    return (
        <div className="space-y-8">
            <BlurFade delay={0.1} inView>
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        {isComplete ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                            <Save className="h-8 w-8 text-primary" />
                        )}
                    </div>
                    <TextAnimate
                        className="text-3xl font-bold"
                        animation="slideUp"
                    >
                        {isComplete ? "Template Ready!" : "Review & Save"}
                    </TextAnimate>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {isComplete
                            ? "Your workout template is complete and ready to be saved. Review the details below and save when ready."
                            : "Review your template and make any final adjustments before saving."
                        }
                    </p>
                </div>
            </BlurFade>

            <div className="max-w-6xl mx-auto">
                {/* Template Summary */}
                <BlurFade delay={0.2} inView>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Template Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            {templateData.name || "Untitled Template"}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="default">
                                                {templateData.difficulty || "Intermediate"}
                                            </Badge>
                                            <Badge variant="secondary">
                                                {templateData.goal || "Muscle Building"}
                                            </Badge>
                                            <Badge variant="outline">
                                                {templateData.duration || 4} weeks
                                            </Badge>
                                            {templateData.isPublic && (
                                                <Badge variant="outline" className="border-green-600 text-green-600">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    Public
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground">
                                            {templateData.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <NumberTicker
                                                value={workoutDays.length}
                                                className="text-2xl font-bold text-primary"
                                            />
                                            <div className="text-sm text-muted-foreground">Workout Days</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <NumberTicker
                                                value={totalExercises}
                                                className="text-2xl font-bold text-blue-600"
                                            />
                                            <div className="text-sm text-muted-foreground">Total Exercises</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <NumberTicker
                                                value={avgWorkoutTime}
                                                className="text-2xl font-bold text-green-600"
                                            />
                                            <div className="text-sm text-muted-foreground">Avg Time (min)</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <NumberTicker
                                                value={7 - workoutDays.length}
                                                className="text-2xl font-bold text-muted-foreground"
                                            />
                                            <div className="text-sm text-muted-foreground">Rest Days</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>

                {/* Weekly Overview */}
                <BlurFade delay={0.3} inView>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Weekly Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-4">
                                {DAYS.map((day, index) => {
                                    const dayData = templateData.weeklyPlan?.days?.[day.key as keyof typeof templateData.weeklyPlan.days];
                                    if (!dayData) return null;

                                    return (
                                        <div key={day.key} className="text-center">
                                            <h4 className="font-medium text-sm mb-2">{day.shortName}</h4>
                                            <Card className={`p-3 ${dayData.isRestDay ? 'border-dashed' : 'border-primary/20'}`}>
                                                <CardContent className="p-0">
                                                    {dayData.isRestDay ? (
                                                        <div className="text-muted-foreground">
                                                            <div className="text-xs">Rest</div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium">
                                                                {dayData.exerciseCount || 0}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                exercises
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {dayData.estimatedDuration}min
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>

                {/* Detailed Workout Days */}
                {workoutDays.length > 0 && (
                    <BlurFade delay={0.4} inView>
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5" />
                                    Workout Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {workoutDays.map(([dayKey, dayData], index) => (
                                    <div key={dayKey} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold">
                                                {DAYS.find(d => d.key === dayKey)?.name}
                                            </h4>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{dayData.exerciseCount || 0} exercises</span>
                                                <span>{dayData.estimatedDuration} min</span>
                                            </div>
                                        </div>

                                        {dayData.exercises && dayData.exercises.length > 0 && (
                                            <div className="grid gap-2">
                                                {dayData.exercises.map((exercise, exIndex) => (
                                                    <div key={exercise.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm text-muted-foreground w-6">
                                                                {exIndex + 1}.
                                                            </span>
                                                            <div>
                                                                <p className="font-medium">{exercise.name}</p>
                                                                <div className="flex gap-2 text-sm text-muted-foreground">
                                                                    {exercise.muscleGroups.slice(0, 2).map((muscle) => (
                                                                        <Badge key={muscle} variant="secondary" className="text-xs">
                                                                            {muscle}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-sm">
                                                            <div className="font-medium">
                                                                {exercise.sets} × {typeof exercise.reps === 'number' ? exercise.reps : `${exercise.reps.min}-${exercise.reps.max}`}
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                {exercise.weight && exercise.weight !== "bodyweight" && `${exercise.weight} • `}
                                                                {exercise.restTime}s rest
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {index < workoutDays.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </BlurFade>
                )}

                {/* Action Buttons */}
                <BlurFade delay={0.6} inView>
                    <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={onGoBack}>
                            Go Back
                        </Button>

                        <div className="flex items-center gap-4">
                            {templateData.isPublic && (
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Share className="h-4 w-4" />
                                    Share Template
                                </Button>
                            )}

                            <ShimmerButton
                                onClick={onSaveTemplate}
                                disabled={!isComplete}
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {isComplete ? "Save Template" : "Complete Template First"}
                            </ShimmerButton>
                        </div>
                    </div>
                </BlurFade>
            </div>
        </div>
    );
}
