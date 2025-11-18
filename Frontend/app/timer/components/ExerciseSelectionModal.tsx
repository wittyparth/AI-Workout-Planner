"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Filter, X, ChevronDown, Check, Plus, Minus } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

// Data and Constants
import { SAMPLE_EXERCISES, ExerciseData } from "@/app/templates/builder/data/exercises";
import { WORKOUT_CATEGORIES, MUSCLE_GROUPS, DIFFICULTY_LEVELS, EQUIPMENT_TYPES } from "@/app/templates/builder/constants";

interface ExerciseSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddExercise: (exercise: ExerciseData) => void;
    selectedDayIndex: number;
}

export function ExerciseSelectionModal({ isOpen, onClose, onAddExercise, selectedDayIndex }: ExerciseSelectionModalProps) {
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
            const exerciseWithCustomData: ExerciseData = {
                ...exercise,
                sets: customSets,
                reps: customReps,
                weight: customWeight,
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

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All Categories");
        setSelectedMuscleGroup("All Muscle Groups");
        setSelectedDifficulty("All Levels");
        setSelectedEquipment("All Equipment");
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background border rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Add Exercise</h2>
                        <p className="text-muted-foreground">Choose an exercise for your workout</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Filters Sidebar */}
                    <div className="w-80 border-r p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Search */}
                            <div className="space-y-2">
                                <Label>Search Exercises</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or muscle group..."
                                        value={searchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <Button variant="outline" onClick={clearFilters} className="w-full">
                                <Filter className="h-4 w-4 mr-2" />
                                Clear All Filters
                            </Button>

                            <Separator />

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <Label>Category</Label>
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
                                <Label>Muscle Group</Label>
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
                                <Label>Difficulty</Label>
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
                                <Label>Equipment</Label>
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
                            <div className="text-sm text-muted-foreground">
                                {filteredExercises.length} exercises found
                            </div>
                        </div>
                    </div>

                    {/* Exercise List */}
                    <div className="flex-1 flex">
                        {/* Exercise Selection */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="grid gap-4">
                                {filteredExercises.map((exercise, index) => (
                                    <BlurFade key={exercise.id} delay={0.1 + index * 0.05} inView>
                                        <Card
                                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedExerciseId === exercise.id
                                                    ? "ring-2 ring-primary shadow-lg"
                                                    : ""
                                                }`}
                                            onClick={() => setSelectedExerciseId(exercise.id)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                                                        <CardDescription className="mt-1">
                                                            {exercise.description}
                                                        </CardDescription>
                                                    </div>
                                                    {selectedExerciseId === exercise.id && (
                                                        <div className="ml-4">
                                                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                                                <Check className="h-4 w-4 text-primary-foreground" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {exercise.muscleGroups.map((muscle) => (
                                                        <Badge key={muscle} variant="secondary">
                                                            {muscle}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>{exercise.difficulty}</span>
                                                    <span>•</span>
                                                    <span>{exercise.category}</span>
                                                    {exercise.equipment.length > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{exercise.equipment.join(", ")}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </BlurFade>
                                ))}
                            </div>

                            {filteredExercises.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No exercises found matching your criteria.</p>
                                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Customization Panel */}
                        {selectedExerciseId && (
                            <div className="w-80 border-l p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Customize Exercise</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Customize sets, reps, and other parameters
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Sets */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Sets</Label>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCustomSets(Math.max(1, customSets - 1))}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="font-medium w-8 text-center">{customSets}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCustomSets(customSets + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Reps */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Reps per Set</Label>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCustomReps(Math.max(1, customReps - 1))}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="font-medium w-8 text-center">{customReps}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCustomReps(customReps + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Weight */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Weight</Label>
                                        <Input
                                            placeholder="e.g., 50 lbs, bodyweight, or 80%"
                                            value={customWeight}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomWeight(e.target.value)}
                                        />
                                    </div>

                                    {/* Rest Time */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Rest Time (seconds)</Label>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCustomRestTime(Math.max(15, customRestTime - 15))}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="font-medium w-12 text-center">{customRestTime}s</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setCustomRestTime(customRestTime + 15)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Add Exercise Button */}
                                    <ShimmerButton
                                        onClick={handleAddExercise}
                                        className="w-full"
                                    >
                                        Add Exercise
                                    </ShimmerButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
