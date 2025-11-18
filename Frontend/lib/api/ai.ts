import apiClient, { ApiResponse } from './client';

export interface AIWorkoutRequest {
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  availableEquipment?: string[];
  targetMuscles?: string[];
  duration?: number;
  workoutsPerWeek?: number;
  preferences?: {
    intensity?: 'low' | 'moderate' | 'high';
    style?: string;
  };
}

export interface AIWorkout {
  name: string;
  description: string;
  exercises: Array<{
    exercise: string;
    sets: Array<{
      type: string;
      reps?: number;
      duration?: number;
      restTime?: number;
    }>;
    notes?: string;
  }>;
  estimatedDuration: number;
  difficulty: string;
  tips?: string[];
}

export const aiApi = {
  // Check AI service status
  getStatus: async () => {
    const response = await apiClient.get<ApiResponse<{
      available: boolean;
      model: string;
      version: string;
    }>>('/ai/status');
    return response.data;
  },

  // Generate workout with AI
  generateWorkout: async (request: AIWorkoutRequest) => {
    const response = await apiClient.post<ApiResponse<AIWorkout>>(
      '/ai/workout-generate',
      request
    );
    return response.data;
  },

  // Get exercise suggestions
  suggestAlternatives: async (exerciseId: string, reason?: string) => {
    const response = await apiClient.post<ApiResponse<{
      alternatives: Array<{
        exercise: any;
        reason: string;
        similarity: number;
      }>;
    }>>('/ai/exercise-suggest', {
      exerciseId,
      reason,
    });
    return response.data;
  },

  // Get progress insights
  getProgressInsights: async () => {
    const response = await apiClient.get<ApiResponse<{
      summary: string;
      insights: string[];
      recommendations: string[];
      strengths: string[];
      areasForImprovement: string[];
    }>>('/ai/progress-insights');
    return response.data;
  },

  // Optimize goals
  optimizeGoal: async (goalId: string) => {
    const response = await apiClient.post<ApiResponse<{
      analysis: string;
      suggestions: string[];
      adjustedTimeline?: string;
      milestones?: Array<{ title: string; target: number; deadline: string }>;
    }>>('/ai/goal-optimize', { goalId });
    return response.data;
  },
};
