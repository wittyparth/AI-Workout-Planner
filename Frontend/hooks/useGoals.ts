'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useGoals() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = useCallback(async (status?: string) => {
    try {
      setIsLoading(true);
      const response = await api.goals.getGoals();
      // Filter by status client-side if needed
      const filteredGoals = status 
        ? response.data.filter((g: any) => g.status === status)
        : response.data;
      setGoals(filteredGoals);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = useCallback(async (goalData: any) => {
    try {
      const response = await api.goals.createGoal(goalData);
      setGoals(prev => [...prev, response.data]);
      toast.success('Goal created successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error('Failed to create goal');
      throw error;
    }
  }, []);

  const updateGoalProgress = useCallback(async (goalId: string, currentValue: number) => {
    try {
      const response = await api.goals.updateProgress(goalId, { currentValue });
      setGoals(prev => prev.map(g => g._id === goalId ? response.data : g));
      toast.success('Progress updated!');
      return response.data;
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      toast.error('Failed to update progress');
      throw error;
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      await api.goals.deleteGoal(goalId);
      setGoals(prev => prev.filter(g => g._id !== goalId));
      toast.success('Goal deleted');
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    }
  }, []);

  return {
    goals,
    isLoading,
    createGoal,
    updateGoalProgress,
    deleteGoal,
    refetch: fetchGoals
  };
}

export function useGoalInsights(goalId: string) {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.goals.getInsights(goalId);
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to fetch goal insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    if (goalId) {
      fetchInsights();
    }
  }, [goalId, fetchInsights]);

  return { insights, isLoading, refetch: fetchInsights };
}
