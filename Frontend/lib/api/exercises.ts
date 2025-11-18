import apiClient, { ApiResponse } from './client';

export interface Exercise {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  instructions?: string[];
  primaryMuscleGroups: string[];
  secondaryMuscleGroups?: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exerciseType?: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'plyometric' | 'powerlifting' | 'olympic_weightlifting';
  movementPattern?: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'lunge' | 'rotation' | 'isometric';
  tags?: string[];
  media?: {
    images?: string[];
    videos?: string[];
    gifs?: string[];
  };
  metrics?: {
    averageRating?: number;
    totalRatings?: number;
    popularityScore?: number;
    usageCount?: number;
  };
  variations?: Array<{
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    instructions?: string[];
  }>;
  safety?: {
    warnings?: string[];
    commonMistakes?: string[];
    tips?: string[];
  };
  calories?: {
    perMinute?: number;
    baseRate?: number;
  };
  defaultSets?: number;
  defaultReps?: {
    min?: number;
    max?: number;
    target?: number;
  };
  defaultRestTime?: number;
  isActive?: boolean;
  isCustom?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseFilters {
  search?: string;
  muscleGroups?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  exerciseType?: string;
  page?: number;
  limit?: number;
}

export const exerciseApi = {
  // Get all exercises with filters
  getExercises: async (filters?: ExerciseFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get<ApiResponse<Exercise[]>>(
      `/exercises${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  },

  // Get exercise by ID
  getExerciseById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Exercise>>(`/exercises/${id}`);
    return response.data;
  },

  // Get filter options
  getFilterOptions: async () => {
    const response = await apiClient.get<ApiResponse<{
      muscleGroups: string[];
      equipment: string[];
      difficulties: string[];
    }>>('/exercises/filters');
    return response.data;
  },

  // Get exercise statistics
  getStats: async () => {
    const response = await apiClient.get<ApiResponse<{
      total: number;
      byMuscleGroup: Record<string, number>;
      byDifficulty: Record<string, number>;
      byEquipment: Record<string, number>;
    }>>('/exercises/stats');
    return response.data;
  },

  // Create custom exercise
  createExercise: async (data: Partial<Exercise>) => {
    const response = await apiClient.post<ApiResponse<Exercise>>('/exercises', data);
    return response.data;
  },

  // Update exercise
  updateExercise: async (id: string, data: Partial<Exercise>) => {
    const response = await apiClient.put<ApiResponse<Exercise>>(`/exercises/${id}`, data);
    return response.data;
  },

  // Delete exercise
  deleteExercise: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/exercises/${id}`);
    return response.data;
  },
};
