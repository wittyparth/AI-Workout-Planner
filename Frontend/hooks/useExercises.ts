'use client';

import { useState, useEffect, useCallback } from 'react';
import api, { Exercise, ExerciseFilters } from '@/lib/api';

export function useExercises(initialFilters?: ExerciseFilters) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ExerciseFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.exercises.getExercises(filters);
      setExercises(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const updateFilters = useCallback((newFilters: Partial<ExerciseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    exercises,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    pagination,
    refetch: fetchExercises
  };
}

export function useExerciseFilters() {
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.exercises.getFilterOptions();
        setFilterOptions(response.data);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { filterOptions, isLoading };
}
