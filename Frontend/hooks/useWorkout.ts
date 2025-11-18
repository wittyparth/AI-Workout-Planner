'use client';

import { useState, useCallback } from 'react';
import api, { WorkoutExercise } from '@/lib/api';
import { toast } from 'sonner';

export function useActiveWorkout(workoutId?: string) {
  const [activeWorkout, setActiveWorkout] = useState<any | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startWorkout = useCallback(async (id: string) => {
    try {
      const response = await api.workouts.startWorkout(id);
      setActiveWorkout(response.data);
      setIsActive(true);
      setStartTime(new Date());
      setCurrentExerciseIndex(0);
      toast.success('Workout started!');
      return response.data;
    } catch (error) {
      console.error('Failed to start workout:', error);
      toast.error('Failed to start workout');
      throw error;
    }
  }, []);

  const logSet = useCallback(async (exerciseId: string, setData: { weight: number; reps: number; rpe?: number }) => {
    if (!activeWorkout) return;

    try {
      const response = await api.workouts.logSet(activeWorkout._id, {
        exerciseId,
        ...setData
      });
      setActiveWorkout(response.data);
      toast.success('Set logged!');
      return response.data;
    } catch (error) {
      console.error('Failed to log set:', error);
      toast.error('Failed to log set');
      throw error;
    }
  }, [activeWorkout]);

  const completeWorkout = useCallback(async () => {
    if (!activeWorkout) return;

    try {
      const response = await api.workouts.completeWorkout(activeWorkout._id);
      toast.success('Workout completed! Great job! 💪');
      setActiveWorkout(null);
      setIsActive(false);
      setStartTime(null);
      return response.data;
    } catch (error) {
      console.error('Failed to complete workout:', error);
      toast.error('Failed to complete workout');
      throw error;
    }
  }, [activeWorkout]);

  const cancelWorkout = useCallback(() => {
    setActiveWorkout(null);
    setIsActive(false);
    setStartTime(null);
    setCurrentExerciseIndex(0);
    toast.info('Workout cancelled');
  }, []);

  const nextExercise = useCallback(() => {
    if (activeWorkout && currentExerciseIndex < activeWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  }, [activeWorkout, currentExerciseIndex]);

  const previousExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  }, [currentExerciseIndex]);

  return {
    activeWorkout,
    isActive,
    currentExerciseIndex,
    startTime,
    startWorkout,
    logSet,
    completeWorkout,
    cancelWorkout,
    nextExercise,
    previousExercise
  };
}

export function useWorkoutHistory() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkouts = useCallback(async (filters?: any) => {
    try {
      setIsLoading(true);
      const response = await api.workouts.getWorkouts(filters);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteWorkout = useCallback(async (id: string) => {
    try {
      await api.workouts.deleteWorkout(id);
      setWorkouts(prev => prev.filter(w => w._id !== id));
      toast.success('Workout deleted');
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Failed to delete workout');
    }
  }, []);

  return {
    workouts,
    isLoading,
    fetchWorkouts,
    deleteWorkout
  };
}

export function useCreateWorkout() {
  const [isCreating, setIsCreating] = useState(false);

  const createWorkout = useCallback(async (workoutData: { 
    name: string; 
    exercises: WorkoutExercise[];
    notes?: string;
  }) => {
    try {
      setIsCreating(true);
      const response = await api.workouts.createWorkout(workoutData);
      toast.success('Workout created successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to create workout:', error);
      toast.error('Failed to create workout');
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { createWorkout, isCreating };
}
