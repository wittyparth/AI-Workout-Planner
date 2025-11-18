"use client";

import React, { useReducer, useCallback, useMemo, memo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Save, Trash2, Clock, Target } from "lucide-react";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

// Data and Types
import { saveWorkout } from "@/data/workouts/created-workouts";

interface ExerciseData {
  id: string;
  name: string;
  category: string;
  targetMuscles: string[];
  equipment: string;
  instructions: string[];
}

interface WorkoutState {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: number;
  targetAudience: string;
  exercises: ExerciseData[];
  isExerciseModalOpen: boolean;
  isSaving: boolean;
  validationErrors: Record<string, string>;
}

// Action types
type WorkoutAction =
  | { type: 'UPDATE_FIELD'; field: keyof WorkoutState; value: any }
  | { type: 'ADD_EXERCISE'; exercise: ExerciseData }
  | { type: 'REMOVE_EXERCISE'; exerciseId: string }
  | { type: 'TOGGLE_MODAL'; isOpen: boolean }
  | { type: 'SET_SAVING'; isSaving: boolean }
  | { type: 'SET_VALIDATION_ERRORS'; errors: Record<string, string> }
  | { type: 'RESET_WORKOUT' };

const initialState: WorkoutState = {
  name: "",
  description: "",
  category: "",
  difficulty: "",
  estimatedDuration: 30,
  targetAudience: "",
  exercises: [],
  isExerciseModalOpen: false,
  isSaving: false,
  validationErrors: {},
};

// Optimized reducer
function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      if (state[action.field] === action.value) return state; // Prevent unnecessary updates
      return {
        ...state,
        [action.field]: action.value,
        validationErrors: { ...state.validationErrors, [action.field]: undefined }, // Clear field error
      };

    case 'ADD_EXERCISE':
      // Check if exercise already exists
      if (state.exercises.some(ex => ex.id === action.exercise.id)) return state;
      return {
        ...state,
        exercises: [...state.exercises, action.exercise],
        isExerciseModalOpen: false,
        validationErrors: { ...state.validationErrors, exercises: undefined },
      };

    case 'REMOVE_EXERCISE':
      const filteredExercises = state.exercises.filter(ex => ex.id !== action.exerciseId);
      if (filteredExercises.length === state.exercises.length) return state; // No change
      return {
        ...state,
        exercises: filteredExercises,
      };

    case 'TOGGLE_MODAL':
      if (state.isExerciseModalOpen === action.isOpen) return state;
      return { ...state, isExerciseModalOpen: action.isOpen };

    case 'SET_SAVING':
      if (state.isSaving === action.isSaving) return state;
      return { ...state, isSaving: action.isSaving };

    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.errors };

    case 'RESET_WORKOUT':
      return initialState;

    default:
      return state;
  }
}

// Memoized Exercise Card Component
const ExerciseCard = memo(({ 
  exercise, 
  onRemove 
}: { 
  exercise: ExerciseData; 
  onRemove: (id: string) => void;
}) => {
  const handleRemove = useCallback(() => onRemove(exercise.id), [exercise.id, onRemove]);

  return (
    <Card className="exercise-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{exercise.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{exercise.category}</Badge>
              <Badge variant="outline">{exercise.equipment}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          <strong>Target Muscles:</strong> {exercise.targetMuscles.join(', ')}
        </div>
      </CardContent>
    </Card>
  );
});

ExerciseCard.displayName = "ExerciseCard";

// Memoized Form Section Component
const WorkoutInfoSection = memo(({ 
  state, 
  onUpdateField 
}: { 
  state: WorkoutState;
  onUpdateField: (field: keyof WorkoutState, value: any) => void;
}) => {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onUpdateField('name', e.target.value),
    [onUpdateField]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdateField('description', e.target.value),
    [onUpdateField]
  );

  const handleCategoryChange = useCallback(
    (value: string) => onUpdateField('category', value),
    [onUpdateField]
  );

  const handleDifficultyChange = useCallback(
    (value: string) => onUpdateField('difficulty', value),
    [onUpdateField]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Workout Name *</label>
          <Input
            value={state.name}
            onChange={handleNameChange}
            placeholder="Enter workout name"
            className={state.validationErrors.name ? "border-red-500" : ""}
          />
          {state.validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{state.validationErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={state.description}
            onChange={handleDescriptionChange}
            placeholder="Describe your workout"
            rows={3}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select value={state.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
              </SelectContent>
            </Select>
            {state.validationErrors.category && (
              <p className="text-red-500 text-sm mt-1">{state.validationErrors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty *</label>
            <Select value={state.difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            {state.validationErrors.difficulty && (
              <p className="text-red-500 text-sm mt-1">{state.validationErrors.difficulty}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

WorkoutInfoSection.displayName = "WorkoutInfoSection";

// Main component using optimized patterns
export default function CreateWorkoutPageOptimized() {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Memoized action creators
  const actions = useMemo(() => ({
    updateField: (field: keyof WorkoutState, value: any) => 
      dispatch({ type: 'UPDATE_FIELD', field, value }),
    addExercise: (exercise: ExerciseData) => 
      dispatch({ type: 'ADD_EXERCISE', exercise }),
    removeExercise: (exerciseId: string) => 
      dispatch({ type: 'REMOVE_EXERCISE', exerciseId }),
    toggleModal: (isOpen: boolean) => 
      dispatch({ type: 'TOGGLE_MODAL', isOpen }),
    setSaving: (isSaving: boolean) => 
      dispatch({ type: 'SET_SAVING', isSaving }),
    setValidationErrors: (errors: Record<string, string>) => 
      dispatch({ type: 'SET_VALIDATION_ERRORS', errors }),
    resetWorkout: () => 
      dispatch({ type: 'RESET_WORKOUT' }),
  }), []);

  // Memoized validation
  const validate = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!state.name.trim()) errors.name = 'Workout name is required';
    if (!state.category) errors.category = 'Category is required';
    if (!state.difficulty) errors.difficulty = 'Difficulty is required';
    if (state.exercises.length === 0) errors.exercises = 'At least one exercise is required';

    actions.setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [state.name, state.category, state.difficulty, state.exercises.length, actions]);

  // Memoized save handler
  const handleSaveWorkout = useCallback(async () => {
    if (!validate()) return;

    actions.setSaving(true);
    try {
      await saveWorkout({
        id: `workout-${Date.now()}`,
        ...state,
        createdAt: new Date(),
      });
      console.log('Workout saved successfully!');
      actions.resetWorkout();
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      actions.setSaving(false);
    }
  }, [validate, state, actions]);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    totalDuration: state.estimatedDuration,
    exerciseCount: state.exercises.length,
    muscleGroups: [...new Set(state.exercises.flatMap(ex => ex.targetMuscles))],
    isFormValid: state.name && state.category && state.difficulty && state.exercises.length > 0,
  }), [state.name, state.category, state.difficulty, state.exercises, state.estimatedDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/workouts">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Workouts
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Create New Workout</h1>
                <p className="text-muted-foreground">Design your custom workout routine</p>
              </div>
            </div>
            
            {/* Save Button */}
            <ShimmerButton 
              onClick={handleSaveWorkout}
              disabled={!computedValues.isFormValid || state.isSaving}
              className="min-w-[120px]"
            >
              {state.isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Workout
                </>
              )}
            </ShimmerButton>
          </div>
        </BlurFade>

        {/* Workout Stats */}
        <BlurFade delay={0.2}>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{computedValues.exerciseCount}</div>
                <div className="text-sm text-muted-foreground">Exercises</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{computedValues.totalDuration}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{computedValues.muscleGroups.length}</div>
                <div className="text-sm text-muted-foreground">Muscle Groups</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{state.difficulty || "—"}</div>
                <div className="text-sm text-muted-foreground">Difficulty</div>
              </CardContent>
            </Card>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workout Information */}
          <BlurFade delay={0.3}>
            <WorkoutInfoSection state={state} onUpdateField={actions.updateField} />
          </BlurFade>

          {/* Exercises Section */}
          <BlurFade delay={0.4}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Exercises ({state.exercises.length})</CardTitle>
                  <Button onClick={() => actions.toggleModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {state.validationErrors.exercises && (
                  <p className="text-red-500 text-sm mb-4">{state.validationErrors.exercises}</p>
                )}
                
                {state.exercises.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No exercises added yet</p>
                    <p className="text-sm">Click "Add Exercise" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.exercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onRemove={actions.removeExercise}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Exercise Selection Modal would go here */}
      </div>
    </div>
  );
}
