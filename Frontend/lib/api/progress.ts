import apiClient, { ApiResponse } from './client';

export interface ProgressMetric {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  notes?: string;
}

export interface ProgressPhoto {
  _id: string;
  url: string;
  date: string;
  weight?: number;
  notes?: string;
}

export interface PersonalRecord {
  exercise: any;
  metric: 'weight' | 'reps' | 'duration' | 'distance';
  value: number;
  achievedAt: string;
}

export const progressApi = {
  // Get all progress data
  getProgress: async () => {
    const response = await apiClient.get<ApiResponse<{
      metrics: ProgressMetric[];
      photos: ProgressPhoto[];
      personalRecords: PersonalRecord[];
    }>>('/progress');
    return response.data;
  },

  // Add body metrics
  addMetrics: async (data: ProgressMetric) => {
    const response = await apiClient.post<ApiResponse<ProgressMetric>>(
      '/progress/metrics',
      data
    );
    return response.data;
  },

  // Delete metric
  deleteMetric: async (metricId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/progress/metrics/${metricId}`
    );
    return response.data;
  },

  // Upload progress photo
  uploadPhoto: async (file: File, weight?: number, notes?: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (weight) formData.append('weight', weight.toString());
    if (notes) formData.append('notes', notes);

    const response = await apiClient.post<ApiResponse<ProgressPhoto>>(
      '/progress/photos',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get strength progression for exercise
  getStrengthProgression: async (exerciseId: string) => {
    const response = await apiClient.get<ApiResponse<{
      exercise: any;
      progression: Array<{
        date: string;
        maxWeight: number;
        totalVolume: number;
        oneRepMax: number;
      }>;
    }>>(`/progress/strength/${exerciseId}`);
    return response.data;
  },

  // Get personal records
  getPersonalRecords: async () => {
    const response = await apiClient.get<ApiResponse<PersonalRecord[]>>('/progress/prs');
    return response.data;
  },

  // Get workout streaks
  getStreaks: async () => {
    const response = await apiClient.get<ApiResponse<{
      currentStreak: number;
      longestStreak: number;
      streakHistory: Array<{ start: string; end: string; length: number }>;
    }>>('/progress/streaks');
    return response.data;
  },

  // Get analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<ApiResponse<{
      workoutFrequency: any;
      volumeTrends: any;
      strengthGains: any;
      bodyComposition: any;
    }>>(`/progress/analytics?${params.toString()}`);
    return response.data;
  },
};
