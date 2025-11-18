"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Save, Trash2, Clock, Dumbbell, Target, Users, User, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

// Modal Component
import { ExerciseSelectionModal } from "@/app/timer/components/ExerciseSelectionModal";

// Data and Types
import { ExerciseData } from "@/app/templates/builder/data/exercises";
import { saveWorkout } from "@/data/workouts/created-workouts";

interface WorkoutData {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: number;
  targetAudience: string;
  exercises: ExerciseData[];
}

const WORKOUT_CATEGORIES = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "Flexibility",
  "Bodyweight",
  "Powerlifting",
  "CrossFit"
];

const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate", 
  "Advanced",
  "Expert"
];

const TARGET_AUDIENCES = [
  "General Fitness",
  "Weight Loss",
  "Muscle Building",
  "Athletic Performance",
  "Rehabilitation",
  "Senior Fitness",
  "Youth Fitness"
];

export default function CreateWorkoutPage() {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    name: "",
    description: "",
    category: "",
    difficulty: "",
    estimatedDuration: 30,
    targetAudience: "",
    exercises: []
  });

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddExercise = (exercise: ExerciseData) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleSaveWorkout = async () => {
    if (!workoutData.name || !workoutData.category || !workoutData.difficulty || workoutData.exercises.length === 0) {
      alert("Please fill in all required fields and add at least one exercise.");
      return;
    }

    setIsSaving(true);
    
    try {
      // Save the workout
      const newWorkout = saveWorkout({
        name: workoutData.name,
        description: workoutData.description,
        category: workoutData.category,
        difficulty: workoutData.difficulty,
        estimatedDuration: workoutData.estimatedDuration,
        targetAudience: workoutData.targetAudience,
        exercises: workoutData.exercises,
        isPublic: false,
        tags: [workoutData.category.toLowerCase(), workoutData.difficulty.toLowerCase()],
        rating: 0
      });

      console.log("Workout saved:", newWorkout);
      
      // Show success message
      alert(`Workout "${workoutData.name}" saved successfully!`);
      
      // Redirect to workouts page
      setTimeout(() => {
        window.location.href = "/workouts";
      }, 500);
      
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateTotalDuration = () => {
    return workoutData.exercises.reduce((total, exercise) => {
      const exerciseTime = (exercise.sets || 0) * ((exercise.reps || 0) * 3 + (exercise.restTime || 0)); // Rough estimate: 3s per rep + rest
      return total + exerciseTime;
    }, 0);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return minutes > 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/workouts">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">Create Workout</h1>
                <p className="text-sm text-muted-foreground">Build your custom workout</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/workouts">Cancel</Link>
              </Button>
              <ShimmerButton
                onClick={handleSaveWorkout}
                disabled={isSaving || !workoutData.name || workoutData.exercises.length === 0}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Workout"}
              </ShimmerButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Workout Info */}
            <div className="lg:col-span-2 space-y-6">
              <BlurFade delay={0.1} inView>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Workout Details
                    </CardTitle>
                    <CardDescription>
                      Basic information about your workout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Workout Name *</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Morning Upper Body Blast"
                          value={workoutData.name}
                          onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={workoutData.category} onValueChange={(value) => setWorkoutData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your workout goals and target muscles..."
                        value={workoutData.description}
                        onChange={(e) => setWorkoutData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty *</Label>
                        <Select value={workoutData.difficulty} onValueChange={(value) => setWorkoutData(prev => ({ ...prev, difficulty: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
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
                      <div className="space-y-2">
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select value={workoutData.targetAudience} onValueChange={(value) => setWorkoutData(prev => ({ ...prev, targetAudience: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            {TARGET_AUDIENCES.map((audience) => (
                              <SelectItem key={audience} value={audience}>
                                {audience}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>

              {/* Exercises Section */}
              <BlurFade delay={0.2} inView>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Dumbbell className="h-5 w-5" />
                          Exercises ({workoutData.exercises.length})
                        </CardTitle>
                        <CardDescription>
                          Add exercises to build your workout
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={() => setIsExerciseModalOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Exercise
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {workoutData.exercises.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No exercises added yet</h3>
                        <p className="text-muted-foreground mb-4">Add your first exercise to get started</p>
                        <Button onClick={() => setIsExerciseModalOpen(true)} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Exercise
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {workoutData.exercises.map((exercise, index) => (
                          <motion.div
                            key={exercise.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                      <h4 className="font-semibold">{exercise.name}</h4>
                                      <Badge variant="outline">{exercise.difficulty}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                                    
                                    <div className="flex flex-wrap gap-3 text-sm">
                                      {exercise.sets && (
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium">{exercise.sets}</span>
                                          <span className="text-muted-foreground">sets</span>
                                        </div>
                                      )}
                                      {exercise.reps && (
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium">{exercise.reps}</span>
                                          <span className="text-muted-foreground">reps</span>
                                        </div>
                                      )}
                                      {exercise.weight && (
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium">{exercise.weight}</span>
                                          <span className="text-muted-foreground">weight</span>
                                        </div>
                                      )}
                                      {exercise.restTime && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          <span className="font-medium">{exercise.restTime}s</span>
                                          <span className="text-muted-foreground">rest</span>
                                        </div>
                                      )}
                                    </div>

                                    {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-3">
                                        {exercise.muscleGroups.map((muscle) => (
                                          <Badge key={muscle} variant="secondary" className="text-xs">
                                            {muscle}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveExercise(exercise.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </BlurFade>
            </div>

            {/* Workout Summary Sidebar */}
            <div className="space-y-6">
              <BlurFade delay={0.3} inView>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Workout Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Exercises</span>
                        <span className="font-medium">{workoutData.exercises.length}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Est. Duration</span>
                        <span className="font-medium">{formatDuration(calculateTotalDuration())}</span>
                      </div>

                      {workoutData.difficulty && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Difficulty</span>
                          <Badge variant="outline">{workoutData.difficulty}</Badge>
                        </div>
                      )}

                      {workoutData.category && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Category</span>
                          <Badge variant="secondary">{workoutData.category}</Badge>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {workoutData.exercises.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Muscle Groups</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(workoutData.exercises.flatMap(ex => ex.muscleGroups || []))).map(muscle => (
                            <Badge key={muscle} variant="outline" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Button 
                        className="w-full gap-2" 
                        onClick={handleSaveWorkout}
                        disabled={isSaving || !workoutData.name || workoutData.exercises.length === 0}
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Workout"}
                      </Button>
                      
                      {workoutData.exercises.length > 0 && (
                        <Button variant="outline" className="w-full gap-2" asChild>
                          <Link href="/timer">
                            <ChevronRight className="h-4 w-4" />
                            Preview & Start
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      <ExerciseSelectionModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onAddExercise={handleAddExercise}
        selectedDayIndex={0}
      />
    </div>
  );
}
