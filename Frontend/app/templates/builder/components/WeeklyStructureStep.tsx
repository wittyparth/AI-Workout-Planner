"use client";

import React from "react";
import { motion } from "motion/react";
import { Calendar, Plus, Dumbbell, Clock, RotateCcw } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

// Types
import { WorkoutTemplate, DayWorkout } from "@/lib/types/template";

interface WeeklyStructureStepProps {
    templateData: Partial<WorkoutTemplate>;
    setTemplateData: React.Dispatch<React.SetStateAction<Partial<WorkoutTemplate>>>;
    onSelectDay: (dayKey: string, dayIndex: number) => void;
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

export function WeeklyStructureStep({ templateData, setTemplateData, onSelectDay }: WeeklyStructureStepProps) {
    const toggleRestDay = (dayKey: string) => {
        if (!templateData.weeklyPlan?.days) return;

        const currentDay = templateData.weeklyPlan.days[dayKey as keyof typeof templateData.weeklyPlan.days];

        setTemplateData(prev => ({
            ...prev,
            weeklyPlan: {
                ...prev.weeklyPlan!,
                days: {
                    ...prev.weeklyPlan!.days,
                    [dayKey]: {
                        ...currentDay,
                        isRestDay: !currentDay.isRestDay,
                        exercises: currentDay.isRestDay ? currentDay.exercises : [],
                        exerciseCount: currentDay.isRestDay ? currentDay.exerciseCount : 0
                    }
                }
            }
        }));
    };

    const getWorkoutDaysCount = () => {
        if (!templateData.weeklyPlan?.days) return 0;
        return Object.values(templateData.weeklyPlan.days).filter(day => !day.isRestDay).length;
    };

    const getRestDaysCount = () => {
        if (!templateData.weeklyPlan?.days) return 0;
        return Object.values(templateData.weeklyPlan.days).filter(day => day.isRestDay).length;
    };

    const getTotalExercises = () => {
        if (!templateData.weeklyPlan?.days) return 0;
        return Object.values(templateData.weeklyPlan.days).reduce((total, day) =>
            total + (day.exerciseCount || 0), 0
        );
    };

    return (
        <div className="space-y-8">
            <BlurFade delay={0.1} inView>
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <TextAnimate
                        className="text-3xl font-bold"
                        animation="slideUp"
                    >
                        Weekly Structure
                    </TextAnimate>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Design your weekly workout schedule. Toggle rest days and organize your training split
                        to match your goals and recovery needs.
                    </p>
                </div>
            </BlurFade>

            {/* Weekly Stats */}
            <BlurFade delay={0.2} inView>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{getWorkoutDaysCount()}</div>
                            <div className="text-sm text-muted-foreground">Workout Days</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-muted-foreground">{getRestDaysCount()}</div>
                            <div className="text-sm text-muted-foreground">Rest Days</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{getTotalExercises()}</div>
                            <div className="text-sm text-muted-foreground">Total Exercises</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {templateData.weeklyPlan?.days ?
                                    Math.round(Object.values(templateData.weeklyPlan.days)
                                        .filter(day => !day.isRestDay)
                                        .reduce((avg, day) => avg + day.estimatedDuration, 0) / getWorkoutDaysCount() || 0)
                                    : 0
                                }
                            </div>
                            <div className="text-sm text-muted-foreground">Avg Duration (min)</div>
                        </CardContent>
                    </Card>
                </div>
            </BlurFade>

            {/* Weekly Calendar */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DAYS.map((day, index) => {
                        const dayData = templateData.weeklyPlan?.days?.[day.key as keyof typeof templateData.weeklyPlan.days];
                        if (!dayData) return null;

                        return (
                            <BlurFade key={day.key} delay={0.3 + index * 0.1} inView>
                                <Card className={`relative transition-all duration-200 hover:shadow-lg ${dayData.isRestDay
                                    ? "border-dashed border-muted-foreground/30"
                                    : "border-primary/20 hover:border-primary/40"
                                    }`}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center justify-between">
                                            <span>{day.shortName}</span>
                                            <Switch
                                                checked={!dayData.isRestDay}
                                                onCheckedChange={() => toggleRestDay(day.key)}
                                                className="scale-75"
                                            />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {dayData.isRestDay ? (
                                            <div className="text-center py-8">
                                                <RotateCcw className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">Rest Day</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">{dayData.name}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{dayData.estimatedDuration} min</span>
                                                    </div>
                                                </div>

                                                {dayData.focusAreas.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {dayData.focusAreas.map((area) => (
                                                            <Badge key={area} variant="secondary" className="text-xs">
                                                                {area}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Exercises</span>
                                                        <Badge variant="outline">
                                                            {dayData.exerciseCount || 0}
                                                        </Badge>
                                                    </div>

                                                    {dayData.exercises && dayData.exercises.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {dayData.exercises.slice(0, 3).map((exercise, idx) => (
                                                                <div key={idx} className="text-sm text-muted-foreground truncate">
                                                                    • {exercise.name}
                                                                </div>
                                                            ))}
                                                            {dayData.exercises.length > 3 && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    +{dayData.exercises.length - 3} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <Dumbbell className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                                            <p className="text-xs text-muted-foreground mb-3">
                                                                No exercises added
                                                            </p>
                                                            <InteractiveHoverButton
                                                                onClick={() => onSelectDay(day.key, index)}
                                                                className="w-full h-8 text-xs"
                                                            >
                                                                Add Exercises
                                                            </InteractiveHoverButton>
                                                        </div>
                                                    )}

                                                    {dayData.exercises && dayData.exercises.length > 0 && (
                                                        <InteractiveHoverButton
                                                            onClick={() => onSelectDay(day.key, index)}
                                                            className="w-full h-8 text-xs"
                                                        >
                                                            Edit Exercises
                                                        </InteractiveHoverButton>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </BlurFade>
                        );
                    })}
                </div>
            </div>

            {/* Quick Templates */}
            <BlurFade delay={0.8} inView>
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4 text-center">Quick Start Templates</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-4 text-center">
                                <h4 className="font-medium mb-2">Upper/Lower Split</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    4 workout days alternating upper and lower body
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Apply Template
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-4 text-center">
                                <h4 className="font-medium mb-2">Push Pull Legs</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    6 workout days with push, pull, and leg focus
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Apply Template
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-4 text-center">
                                <h4 className="font-medium mb-2">Full Body</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    3 workout days targeting all muscle groups
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Apply Template
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </BlurFade>
        </div>
    );
}
