'use client';

import { useState, useEffect } from 'react';
import { workoutApi, Workout } from '@/lib/api/workouts';
import { userApi } from '@/lib/api/user';
import { handleApiError } from '@/lib/api/client';

export function useDashboardData() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch recent workouts, workout stats, and user stats in parallel
        const [workoutsRes, statsRes, userStatsRes] = await Promise.all([
          workoutApi.getWorkouts({ limit: 10, status: 'completed' }),
          workoutApi.getStats(),
          userApi.getStats(),
        ]);

        setWorkouts(workoutsRes.data);
        setStats(statsRes.data);
        setUserStats(userStatsRes.data);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const [workoutsRes, statsRes, userStatsRes] = await Promise.all([
        workoutApi.getWorkouts({ limit: 10, status: 'completed' }),
        workoutApi.getStats(),
        userApi.getStats(),
      ]);

      setWorkouts(workoutsRes.data);
      setStats(statsRes.data);
      setUserStats(userStatsRes.data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workouts,
    stats,
    userStats,
    isLoading,
    error,
    refetch,
  };
}
