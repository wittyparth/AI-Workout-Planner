import apiClient, { ApiResponse } from './client';
import { User } from './auth';

export const userApi = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    dateOfBirth?: string;
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
    goals?: string[];
    bio?: string;
  }) => {
    const response = await apiClient.put<ApiResponse<User['profile']>>('/user/profile', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences: {
    units?: 'metric' | 'imperial';
    notifications?: {
      workoutReminders?: boolean;
      progressUpdates?: boolean;
      socialActivity?: boolean;
      aiRecommendations?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'friends' | 'private';
      workoutSharing?: boolean;
      progressSharing?: boolean;
    };
  }) => {
    const response = await apiClient.put<ApiResponse<User['preferences']>>(
      '/user/preferences',
      preferences
    );
    return response.data;
  },

  // Update body metrics
  updateMetrics: async (metrics: {
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    bodyFatPercentage?: number;
    measurementUnit?: 'kg' | 'lbs';
  }) => {
    const response = await apiClient.put<ApiResponse<User['metrics']>>('/user/metrics', metrics);
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await apiClient.get<ApiResponse<{
      followers: number;
      following: number;
      friends: number;
      achievements: number;
      level: string;
    }>>('/user/stats');
    return response.data;
  },

  // Delete account
  deleteAccount: async (confirmPassword: string) => {
    const response = await apiClient.delete<ApiResponse<null>>('/user/account', {
      data: { confirmPassword },
    });
    return response.data;
  },
};
