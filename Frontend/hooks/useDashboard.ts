'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface DashboardStats {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: {
    current: number;
    target: number;
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [workoutStats, streaks, goalStats] = await Promise.all([
          api.workouts.getStats(),
          api.progress.getStreaks(),
          api.goals.getStats()
        ]);

        setStats({
          totalWorkouts: workoutStats.data.totalWorkouts || 0,
          totalVolume: workoutStats.data.totalVolume || 0,
          totalDuration: workoutStats.data.totalDuration || 0,
          currentStreak: streaks.data.currentStreak || 0,
          longestStreak: streaks.data.longestStreak || 0,
          weeklyGoal: {
            current: workoutStats.data.thisWeekCount || 0,
            target: 4
          }
        });
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}

export function useRecentWorkouts(limit: number = 5) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.workouts.getWorkouts({
          limit,
          status: 'completed',
          page: 1
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [limit]);

  return { workouts, isLoading };
}

export function useTodayWorkout() {
  const [workout, setWorkout] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.workouts.getWorkouts({
          startDate: today,
          endDate: today,
          limit: 1
        });
        
        if (response.data && response.data.length > 0) {
          setWorkout(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch today workout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayWorkout();
  }, []);

  return { workout, isLoading };
}
