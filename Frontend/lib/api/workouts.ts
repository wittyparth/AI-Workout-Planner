import apiClient, { ApiResponse } from './client';

export interface WorkoutSet {
  setNumber: number;
  weight?: number;
  reps?: number;
  restTime?: number;
  completedAt?: Date;
  personalRecord?: boolean;
  rpe?: number; // 1-10
  notes?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName?: string;
  order?: number;
  sets: WorkoutSet[];
  totalVolume?: number;
  personalRecords?: Array<{
    type: 'max_weight' | 'max_reps' | 'max_volume' | 'one_rep_max';
    value: number;
    previousRecord?: number;
    improvementPercentage?: number;
    achievedAt?: Date;
  }>;
}

export interface Workout {
  _id: string;
  userId: string;
  templateId?: string;
  sessionData: {
    name: string;
    date: Date;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    exercises: WorkoutExercise[];
    metrics?: {
      totalVolume?: number;
      averageRPE?: number;
      caloriesBurned?: number;
      totalRestTime?: number;
      personalRecordsSet?: number;
    };
    location?: 'home' | 'gym' | 'outdoor' | 'other';
    mood?: {
      before?: string;
      after?: string;
      energy?: number; // 1-10
    };
    notes?: string;
  };
  sharing?: {
    isShared?: boolean;
    sharedWith?: string[];
    visibility?: 'private' | 'friends' | 'public';
    socialMetrics?: {
      likes?: number;
      comments?: number;
      shares?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutData {
  name: string;
  exercises: Array<{
    exerciseId: string;
    plannedSets?: number;
    plannedReps?: number;
    plannedWeight?: number;
  }>;
  templateId?: string;
  scheduledFor?: Date;
  location?: 'home' | 'gym' | 'outdoor' | 'other';
  notes?: string;
}

export interface WorkoutFilters {
  status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const workoutApi = {
  // Create workout
  createWorkout: async (data: CreateWorkoutData) => {
    const response = await apiClient.post<ApiResponse<Workout>>('/workouts', data);
    return response.data;
  },

  // Get workout history
  getWorkouts: async (filters?: WorkoutFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get<ApiResponse<Workout[]>>(
      `/workouts${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  },

  // Get workout by ID
  getWorkoutById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Workout>>(`/workouts/${id}`);
    return response.data;
  },

  // Update workout
  updateWorkout: async (id: string, data: Partial<Workout>) => {
    const response = await apiClient.put<ApiResponse<Workout>>(`/workouts/${id}`, data);
    return response.data;
  },

  // Delete workout
  deleteWorkout: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/workouts/${id}`);
    return response.data;
  },

  // Start workout session
  startWorkout: async (id: string) => {
    const response = await apiClient.post<ApiResponse<Workout>>(`/workouts/${id}/start`);
    return response.data;
  },

  // Complete a set
  completeSet: async (id: string, exerciseIndex: number, setData: WorkoutSet) => {
    const response = await apiClient.post<ApiResponse<Workout>>(
      `/workouts/${id}/set`,
      { exerciseIndex, setData }
    );
    return response.data;
  },

  // Complete workout
  completeWorkout: async (id: string, data?: {
    mood?: { after?: string; energy?: number };
    notes?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<Workout>>(
      `/workouts/${id}/complete`,
      data || {}
    );
    return response.data;
  },

  // Cancel workout
  cancelWorkout: async (id: string) => {
    const response = await apiClient.post<ApiResponse<Workout>>(`/workouts/${id}/cancel`);
    return response.data;
  },

  // Get workout statistics
  getStats: async () => {
    const response = await apiClient.get<ApiResponse<{
      totalWorkouts: number;
      completedWorkouts: number;
      totalExercises: number;
      totalSets: number;
      totalVolume?: number;
      totalDuration?: number;
      averageDuration?: number;
      currentStreak?: number;
      longestStreak?: number;
      workoutsByMonth?: Array<{ month: string; count: number }>;
    }>>('/workouts/stats');
    return response.data;
  },
};
