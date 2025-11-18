import apiClient, { ApiResponse } from './client';

export interface Goal {
  _id: string;
  user: string;
  type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'custom';
  title: string;
  description?: string;
  target: {
    value: number;
    unit: string;
    metric?: string;
  };
  current?: {
    value: number;
    unit: string;
  };
  deadline?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress?: number;
  milestones?: Array<{
    title: string;
    target: number;
    achieved: boolean;
    achievedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalData {
  type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'custom';
  title: string;
  description?: string;
  target: {
    value: number;
    unit: string;
    metric?: string;
  };
  current?: {
    value: number;
    unit: string;
  };
  deadline?: string;
}

export const goalApi = {
  // Create goal
  createGoal: async (data: CreateGoalData) => {
    const response = await apiClient.post<ApiResponse<Goal>>('/goals', data);
    return response.data;
  },

  // Get all goals
  getGoals: async () => {
    const response = await apiClient.get<ApiResponse<Goal[]>>('/goals');
    return response.data;
  },

  // Get goal statistics
  getStats: async () => {
    const response = await apiClient.get<ApiResponse<{
      totalGoals: number;
      activeGoals: number;
      completedGoals: number;
      averageProgress: number;
    }>>('/goals/stats');
    return response.data;
  },

  // Get goal by ID
  getGoalById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Goal>>(`/goals/${id}`);
    return response.data;
  },

  // Update goal
  updateGoal: async (id: string, data: Partial<CreateGoalData>) => {
    const response = await apiClient.put<ApiResponse<Goal>>(`/goals/${id}`, data);
    return response.data;
  },

  // Delete goal
  deleteGoal: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/goals/${id}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (id: string, value: number, unit: string) => {
    const response = await apiClient.post<ApiResponse<Goal>>(
      `/goals/${id}/progress`,
      { value, unit }
    );
    return response.data;
  },

  // Add milestone
  addMilestone: async (id: string, milestone: { title: string; target: number }) => {
    const response = await apiClient.post<ApiResponse<Goal>>(
      `/goals/${id}/milestone`,
      milestone
    );
    return response.data;
  },

  // Get AI insights
  getInsights: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{
      analysis: string;
      recommendations: string[];
      projectedCompletion?: string;
    }>>(`/goals/${id}/insights`);
    return response.data;
  },
};
