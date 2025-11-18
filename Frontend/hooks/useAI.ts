'use client';

import { useState, useCallback } from 'react';
import api, { AIWorkoutRequest } from '@/lib/api';
import { toast } from 'sonner';

export function useAIWorkout() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<any | null>(null);

  const generateWorkout = useCallback(async (preferences: AIWorkoutRequest) => {
    try {
      setIsGenerating(true);
      const response = await api.ai.generateWorkout(preferences);
      setGeneratedWorkout(response.data);
      toast.success('Workout generated successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to generate workout:', error);
      toast.error('Failed to generate workout. Please try again.');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearWorkout = useCallback(() => {
    setGeneratedWorkout(null);
  }, []);

  return {
    isGenerating,
    generatedWorkout,
    generateWorkout,
    clearWorkout
  };
}

export function useExerciseSuggestions() {
  const [isFetching, setIsFetching] = useState(false);

  const getSuggestions = useCallback(async (exerciseId: string, reason?: string) => {
    try {
      setIsFetching(true);
      const response = await api.ai.suggestAlternatives(exerciseId, reason);
      return response.data;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      toast.error('Failed to get exercise suggestions');
      throw error;
    } finally {
      setIsFetching(false);
    }
  }, []);

  return { getSuggestions, isFetching };
}

export function useProgressInsights() {
  const [isFetching, setIsFetching] = useState(false);

  const getInsights = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await api.ai.getProgressInsights();
      return response.data;
    } catch (error) {
      console.error('Failed to get insights:', error);
      toast.error('Failed to get progress insights');
      throw error;
    } finally {
      setIsFetching(false);
    }
  }, []);

  return { getInsights, isFetching };
}
