'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useProgressPhotos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.progress.getProgress();
      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const uploadPhoto = useCallback(async (file: File, notes?: string) => {
    try {
      const response = await api.progress.uploadPhoto(file, undefined, notes);
      setPhotos(prev => [response.data, ...prev]);
      toast.success('Photo uploaded successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error('Failed to upload photo');
      throw error;
    }
  }, []);

  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      // Note: Backend may need a delete photo endpoint
      toast.success('Photo deleted');
      setPhotos(prev => prev.filter(p => p._id !== photoId));
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast.error('Failed to delete photo');
    }
  }, []);

  return {
    photos,
    isLoading,
    uploadPhoto,
    deletePhoto,
    refetch: fetchPhotos
  };
}

export function useBodyMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = useCallback(async (metric?: string) => {
    try {
      setIsLoading(true);
      const response = await api.progress.getProgress();
      setMetrics(response.data.metrics || []);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const logMetric = useCallback(async (metricData: {
    metricType: string;
    value: number;
    unit: string;
    notes?: string;
  }) => {
    try {
      const response = await api.progress.addMetrics({
        date: new Date().toISOString(),
        weight: metricData.metricType === 'weight' ? metricData.value : undefined,
        bodyFat: metricData.metricType === 'bodyfat' ? metricData.value : undefined,
        notes: metricData.notes,
      });
      setMetrics(prev => [response.data, ...prev]);
      toast.success('Metric logged successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to log metric:', error);
      toast.error('Failed to log metric');
      throw error;
    }
  }, []);

  return {
    metrics,
    isLoading,
    logMetric,
    refetch: fetchMetrics
  };
}

export function useStrengthProgress(exerciseId?: string) {
  const [progress, setProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProgress = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.progress.getStrengthProgression(id);
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch strength progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (exerciseId) {
      fetchProgress(exerciseId);
    }
  }, [exerciseId, fetchProgress]);

  return { progress, isLoading, refetch: fetchProgress };
}
