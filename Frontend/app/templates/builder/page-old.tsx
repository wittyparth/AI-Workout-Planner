"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Dumbbell, Target, Calendar, Plus, Search, Filter, X, ChevronDown, Check, ChevronRight, Clock, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Dock, DockIcon } from "@/components/magicui/dock";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Data
import { SAMPLE_EXERCISES, ExerciseData } from "@/app/templates/builder/data/exercises";
import { WorkoutTemplate, DayWorkout, TemplateExercise } from "@/lib/types/template";

const WORKOUT_CATEGORIES = [
    "All Categories",
    "Strength",
    "Cardio",
    "Flexibility",
    "HIIT",
    "Bodyweight",
    "Powerlifting"
];

const MUSCLE_GROUPS = [
    "All Muscle Groups",
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Glutes",
    "Full Body"
];

const DIFFICULTY_LEVELS = [
    "All Levels",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert"
];

const EQUIPMENT_TYPES = [
    "All Equipment",
    "No Equipment",
    "Dumbbells",
    "Barbell",
    "Resistance Bands",
    "Kettlebells",
    "Cable Machine",
    "Pull-up Bar",
    "Bench"
];

interface ExerciseSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddExercise: (exercise: ExerciseData) => void;
    selectedDayIndex: number;
}

function ExerciseSelectionModal({ isOpen, onClose, onAddExercise, selectedDayIndex }: ExerciseSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All Muscle Groups");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
    const [selectedEquipment, setSelectedEquipment] = useState("All Equipment");
    const [filteredExercises, setFilteredExercises] = useState(SAMPLE_EXERCISES);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
    const [customSets, setCustomSets] = useState(3);
    const [customReps, setCustomReps] = useState(12);
    const [customWeight, setCustomWeight] = useState("");
    const [customRestTime, setCustomRestTime] = useState(60);

    useEffect(() => {
        let filtered = SAMPLE_EXERCISES;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(exercise =>
                exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.muscleGroups.some(group =>
                    group.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Apply category filter
        if (selectedCategory !== "All Categories") {
            filtered = filtered.filter(exercise => exercise.category === selectedCategory);
        }

        // Apply muscle group filter
        if (selectedMuscleGroup !== "All Muscle Groups") {
            filtered = filtered.filter(exercise =>
                exercise.muscleGroups.includes(selectedMuscleGroup)
            );
        }

        // Apply difficulty filter
        if (selectedDifficulty !== "All Levels") {
            filtered = filtered.filter(exercise => exercise.difficulty === selectedDifficulty);
        }

        // Apply equipment filter
        if (selectedEquipment !== "All Equipment") {
            if (selectedEquipment === "No Equipment") {
                filtered = filtered.filter(exercise =>
                    exercise.equipment.length === 0 || exercise.equipment.includes("None")
                );
            } else {
                filtered = filtered.filter(exercise =>
                    exercise.equipment.includes(selectedEquipment)
                );
            }
        }

        setFilteredExercises(filtered);
    }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedDifficulty, selectedEquipment]);

    const handleAddExercise = () => {
        const exercise = filteredExercises.find(ex => ex.id === selectedExerciseId);
        if (exercise) {
            // Convert weight from string to proper type
            let weightValue: number | "bodyweight" | "percentage" | undefined;
            if (customWeight === "" || customWeight === "bodyweight") {
                weightValue = "bodyweight";
            } else if (customWeight.includes("%")) {
                weightValue = "percentage";
            } else {
                const numWeight = parseFloat(customWeight);
                weightValue = isNaN(numWeight) ? undefined : numWeight;
            }

            const exerciseWithCustomData: ExerciseData = {
                ...exercise,
                sets: customSets,
                reps: customReps,
                weight: customWeight, // Keep original string for ExerciseData
                restTime: customRestTime,
            };
            onAddExercise(exerciseWithCustomData);
            onClose();
            // Reset form
            setSelectedExerciseId(null);
            setCustomSets(3);
            setCustomReps(12);
            setCustomWeight("");
            setCustomRestTime(60);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-6xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border bg-background shadow-2xl"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b bg-background/95 backdrop-blur-md">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                                <Dumbbell className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold">Add Exercise</h2>
                                <p className="text-sm text-muted-foreground">
                                    Choose and customize exercises for Day {selectedDayIndex + 1}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex h-[600px]">
                    {/* Filters Sidebar */}
                    <div className="w-80 border-r bg-muted/30 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Search */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Search Exercises</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or muscle group..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WORKOUT_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Muscle Group Filter */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Muscle Group</Label>
                                <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MUSCLE_GROUPS.map((group) => (
                                            <SelectItem key={group} value={group}>
                                                {group}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Difficulty Filter */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Difficulty</Label>
                                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DIFFICULTY_LEVELS.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Equipment Filter */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Equipment</Label>
                                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EQUIPMENT_TYPES.map((equipment) => (
                                            <SelectItem key={equipment} value={equipment}>
                                                {equipment}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Results Count */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        <NumberTicker value={filteredExercises.length} /> exercises found
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exercise List */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="grid gap-4">
                            {filteredExercises.map((exercise) => (
                                <motion.div
                                    key={exercise.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedExerciseId === exercise.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                            : "border-border hover:border-muted-foreground/50"
                                        }`}
                                    onClick={() => setSelectedExerciseId(exercise.id)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                            <Dumbbell className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium truncate">{exercise.name}</h3>
                                                <Badge variant="secondary" className="text-xs">
                                                    {exercise.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {exercise.difficulty}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {exercise.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {exercise.muscleGroups.map((group) => (
                                                    <Badge key={group} variant="outline" className="text-xs">
                                                        {group}
                                                    </Badge>
                                                ))}
                                            </div>
                                            {exercise.equipment.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {exercise.equipment.map((item) => (
                                                        <Badge key={item} variant="secondary" className="text-xs">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {selectedExerciseId === exercise.id && (
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Customization Panel */}
                    {selectedExerciseId && (
                        <div className="w-80 border-l bg-muted/30 p-6 overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Exercise Configuration</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Customize sets, reps, and other parameters
                                    </p>
                                </div>

                                {/* Sets */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Number of Sets</Label>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCustomSets(Math.max(1, customSets - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="font-medium w-8 text-center">{customSets}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCustomSets(customSets + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Reps */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Reps per Set</Label>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCustomReps(Math.max(1, customReps - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="font-medium w-8 text-center">{customReps}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCustomReps(customReps + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Weight (optional)</Label>
                                    <Input
                                        placeholder="e.g., 20kg, 45lbs"
                                        value={customWeight}
                                        onChange={(e) => setCustomWeight(e.target.value)}
                                    />
                                </div>

                                {/* Rest Time */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Rest Time (seconds)</Label>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCustomRestTime(Math.max(15, customRestTime - 15))}
                                        >
                                            -
                                        </Button>
                                        <span className="font-medium w-12 text-center">{customRestTime}s</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCustomRestTime(customRestTime + 15)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <ShimmerButton
                                    onClick={handleAddExercise}
                                    className="w-full"
                                    shimmerColor="#ffffff"
                                    background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Workout
                                </ShimmerButton>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function TemplateBuilderPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    // Template data
    const [templateData, setTemplateData] = useState<Partial<WorkoutTemplate>>({
        name: "",
        description: "",
        difficulty: "Beginner",
        duration: 4,
        goal: "Strength",
        tags: [],
        weeklyPlan: {
            days: {
                monday: {
                    id: "monday",
                    name: "Day 1",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                },
                tuesday: {
                    id: "tuesday",
                    name: "Day 2",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                },
                wednesday: {
                    id: "wednesday",
                    name: "Day 3",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                },
                thursday: {
                    id: "thursday",
                    name: "Day 4",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                },
                friday: {
                    id: "friday",
                    name: "Day 5",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                },
                saturday: {
                    id: "saturday",
                    name: "Day 6",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                },
                sunday: {
                    id: "sunday",
                    name: "Day 7",
                    exercises: [],
                    isRestDay: false,
                    focusAreas: [],
                    estimatedDuration: 0,
                    difficulty: "Beginner",
                    aiGenerated: false,
                    exerciseCount: 0
                }
            }
        }
    });

    const workoutDays = Object.values(templateData.weeklyPlan?.days || {});

    const steps = [
        {
            id: 1,
            title: "Template Details",
            description: "Basic information about your workout template",
            icon: Target
        },
        {
            id: 2,
            title: "Weekly Schedule",
            description: "Set up your weekly workout structure",
            icon: Calendar
        },
        {
            id: 3,
            title: "Exercise Selection",
            description: "Add exercises to each workout day",
            icon: Dumbbell
        }
    ];

    const handleAddExercise = (exercise: ExerciseData) => {
        const dayKeys = Object.keys(templateData.weeklyPlan?.days || {});
        const selectedDayKey = dayKeys[selectedDayIndex];

        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

        const newExercise: TemplateExercise = {
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
            if (!prev.weeklyPlan?.days) return prev;

            const updatedDay = {
                ...prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days],
                exercises: [...prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days].exercises, newExercise],
                exerciseCount: prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days].exercises.length + 1
            };

            return {
                ...prev,
                weeklyPlan: {
                    ...prev.weeklyPlan,
                    days: {
                        ...prev.weeklyPlan.days,
                        [selectedDayKey]: updatedDay
                    }
                }
            };
        });
    };

    const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
        const dayKeys = Object.keys(templateData.weeklyPlan?.days || {});
        const selectedDayKey = dayKeys[dayIndex];

        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

        setTemplateData(prev => {
            if (!prev.weeklyPlan?.days) return prev;

            const currentDay = prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days];
            const updatedDay = {
                ...currentDay,
                exercises: currentDay.exercises.filter((_, i) => i !== exerciseIndex),
                exerciseCount: currentDay.exercises.length - 1
            };

            return {
                ...prev,
                weeklyPlan: {
                    ...prev.weeklyPlan,
                    days: {
                        ...prev.weeklyPlan.days,
                        [selectedDayKey]: updatedDay
                    }
                }
            };
        });
    };

    const addWorkoutDay = () => {
        // This would add a new day to the week - for now we'll work with the fixed 7 days
    };

    const removeWorkoutDay = (index: number) => {
        // This would remove a day - for now we'll just toggle rest day
        toggleRestDay(index);
    };

    const toggleRestDay = (index: number) => {
        const dayKeys = Object.keys(templateData.weeklyPlan?.days || {});
        const selectedDayKey = dayKeys[index];

        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

        setTemplateData(prev => {
            if (!prev.weeklyPlan?.days) return prev;

            const currentDay = prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days];
            const updatedDay = {
                ...currentDay,
                isRestDay: !currentDay.isRestDay,
                exercises: !currentDay.isRestDay ? [] : currentDay.exercises, // Clear exercises if making it a rest day
                exerciseCount: !currentDay.isRestDay ? 0 : currentDay.exerciseCount
            };

            return {
                ...prev,
                weeklyPlan: {
                    ...prev.weeklyPlan,
                    days: {
                        ...prev.weeklyPlan.days,
                        [selectedDayKey]: updatedDay
                    }
                }
            };
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Top Navigation */}
            <div className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/templates">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <BlurFade delay={0.1}>
                                    <h1 className="text-2xl font-semibold">Template Builder</h1>
                                </BlurFade>
                                <BlurFade delay={0.2}>
                                    <p className="text-sm text-muted-foreground">
                                        Create a custom workout template
                                    </p>
                                </BlurFade>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                                Step {currentStep} of {steps.length}
                            </span>
                            <div className="flex space-x-1">
                                {steps.map((step) => (
                                    <div
                                        key={step.id}
                                        className={`h-2 w-8 rounded-full transition-colors ${step.id <= currentStep
                                                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                                : "bg-muted"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Step Header */}
                    <BlurFade delay={0.3}>
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                                    {React.createElement(steps[currentStep - 1].icon, {
                                        className: "h-8 w-8 text-white"
                                    })}
                                </div>
                            </div>
                            <TextAnimate animation="blurInUp" by="word" className="text-3xl font-bold mb-4">
                                {steps[currentStep - 1].title}
                            </TextAnimate>
                            <TextAnimate animation="fadeIn" delay={0.5} className="text-lg text-muted-foreground">
                                {steps[currentStep - 1].description}
                            </TextAnimate>
                        </div>
                    </BlurFade>

                    {/* Step Content */}
                    <BlurFade delay={0.4}>
                        <Card className="border-0 shadow-2xl bg-background/50 backdrop-blur-md">
                            <CardContent className="p-8">
                                {currentStep === 1 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">Template Name</Label>
                                                    <Input
                                                        placeholder="e.g., Beginner Full Body"
                                                        value={templateData.name || ""}
                                                        onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                                                        className="h-12 text-lg"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">Description</Label>
                                                    <Textarea
                                                        placeholder="Describe your workout template..."
                                                        value={templateData.description || ""}
                                                        onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                                                        className="min-h-[120px] text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">Difficulty Level</Label>
                                                    <Select
                                                        value={templateData.difficulty || "Beginner"}
                                                        onValueChange={(value) => setTemplateData(prev => ({ ...prev, difficulty: value as any }))}
                                                    >
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">Program Duration (weeks)</Label>
                                                    <div className="flex items-center space-x-4">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-12 w-12"
                                                            onClick={() => setTemplateData(prev => ({ ...prev, duration: Math.max(1, (prev.duration || 4) - 1) }))}
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="text-2xl font-semibold w-16 text-center">
                                                            <NumberTicker value={templateData.duration || 4} />
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-12 w-12"
                                                            onClick={() => setTemplateData(prev => ({ ...prev, duration: (prev.duration || 4) + 1 }))}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-base font-medium">Goal</Label>
                                                    <Select
                                                        value={templateData.goal || "Strength"}
                                                        onValueChange={(value) => setTemplateData(prev => ({ ...prev, goal: value as any }))}
                                                    >
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Strength">Strength Training</SelectItem>
                                                            <SelectItem value="Muscle Building">Muscle Building</SelectItem>
                                                            <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                                                            <SelectItem value="Endurance">Endurance</SelectItem>
                                                            <SelectItem value="General Fitness">General Fitness</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-8">
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold mb-2">Weekly Workout Schedule</h3>
                                            <p className="text-muted-foreground">
                                                Configure your workout days and rest days
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            {workoutDays.map((day, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-6 rounded-xl border bg-card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <Input
                                                                    value={day.name}
                                                                    onChange={(e) => {
                                                                        const dayKeys = Object.keys(templateData.weeklyPlan?.days || {});
                                                                        const selectedDayKey = dayKeys[index];

                                                                        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

                                                                        setTemplateData(prev => {
                                                                            if (!prev.weeklyPlan?.days) return prev;

                                                                            const updatedDay = {
                                                                                ...prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days],
                                                                                name: e.target.value
                                                                            };

                                                                            return {
                                                                                ...prev,
                                                                                weeklyPlan: {
                                                                                    ...prev.weeklyPlan,
                                                                                    days: {
                                                                                        ...prev.weeklyPlan.days,
                                                                                        [selectedDayKey]: updatedDay
                                                                                    }
                                                                                }
                                                                            };
                                                                        });
                                                                    }}
                                                                    className="font-medium text-lg border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                                                                />
                                                                <p className="text-sm text-muted-foreground">
                                                                    {day.isRestDay ? "Rest Day" : `${day.exercises.length} exercises`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    id={`rest-${index}`}
                                                                    checked={day.isRestDay}
                                                                    onCheckedChange={() => toggleRestDay(index)}
                                                                />
                                                                <Label htmlFor={`rest-${index}`} className="text-sm">
                                                                    Rest Day
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold mb-2">Exercise Selection</h3>
                                            <p className="text-muted-foreground">
                                                Add exercises to each workout day
                                            </p>
                                        </div>

                                        <div className="grid gap-6">
                                            {workoutDays.map((day, dayIndex) => (
                                                <motion.div
                                                    key={dayIndex}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-6 rounded-xl border bg-card"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                                                                {dayIndex + 1}
                                                            </div>
                                                            <h4 className="font-semibold text-lg">{day.name}</h4>
                                                            {day.isRestDay && (
                                                                <Badge variant="secondary">Rest Day</Badge>
                                                            )}
                                                        </div>
                                                        {!day.isRestDay && (
                                                            <ShimmerButton
                                                                onClick={() => {
                                                                    setSelectedDayIndex(dayIndex);
                                                                    setIsExerciseModalOpen(true);
                                                                }}
                                                                className="px-4 py-2"
                                                                shimmerColor="#ffffff"
                                                                background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Add Exercise
                                                            </ShimmerButton>
                                                        )}
                                                    </div>

                                                    {!day.isRestDay && (
                                                        <div className="space-y-3">
                                                            {day.exercises.length === 0 ? (
                                                                <div className="text-center py-12 text-muted-foreground">
                                                                    <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                                    <p>No exercises added yet</p>
                                                                    <p className="text-sm">Click "Add Exercise" to get started</p>
                                                                </div>
                                                            ) : (
                                                                day.exercises.map((exercise, exerciseIndex) => (
                                                                    <motion.div
                                                                        key={exerciseIndex}
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
                                                                    >
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                                                                <Dumbbell className="h-5 w-5 text-muted-foreground" />
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium">{exercise.name}</h5>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {exercise.sets} sets × {typeof exercise.reps === 'number' ? exercise.reps : `${exercise.reps.min}-${exercise.reps.max}`} reps
                                                                                    {exercise.weight && exercise.weight !== "bodyweight" && ` @ ${exercise.weight}`}
                                                                                    {exercise.restTime && ` • ${exercise.restTime}s rest`}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)}
                                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </motion.div>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </BlurFade>

                    {/* Navigation */}
                    <BlurFade delay={0.5}>
                        <div className="flex justify-between items-center mt-8">
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                                className="px-8 py-3"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>

                            <div className="flex space-x-4">
                                {currentStep < steps.length ? (
                                    <InteractiveHoverButton
                                        onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                                        className="px-8 py-3"
                                    >
                                        Next Step
                                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                                    </InteractiveHoverButton>
                                ) : (
                                    <AnimatedSubscribeButton
                                        buttonColor="#667eea"
                                        buttonTextColor="#ffffff"
                                        subscribeStatus={false}
                                        initialText={
                                            <span className="group inline-flex items-center">
                                                Create Template
                                                <Check className="ml-2 h-4 w-4" />
                                            </span>
                                        }
                                        changeText={
                                            <span className="group inline-flex items-center">
                                                <Check className="mr-2 h-4 w-4" />
                                                Template Created!
                                            </span>
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>

            {/* Exercise Selection Modal */}
            <ExerciseSelectionModal
                isOpen={isExerciseModalOpen}
                onClose={() => setIsExerciseModalOpen(false)}
                onAddExercise={handleAddExercise}
                selectedDayIndex={selectedDayIndex}
            />
        </div>
    );
}
