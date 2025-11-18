import apiClient, { ApiResponse } from './client';

export interface User {
  _id: string;
  email: string;
  username?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
    profilePicture?: string;
    bio?: string;
    location?: string;
    timezone?: string;
  };
  preferences?: {
    units?: 'metric' | 'imperial';
    defaultRestTime?: number;
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
  };
  metrics?: {
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    bodyFatPercentage?: number;
    measurementUnit?: 'kg' | 'lbs';
  };
  subscription?: {
    plan?: 'free' | 'premium' | 'pro';
    status?: 'active' | 'cancelled' | 'expired';
    startDate?: string;
    endDate?: string;
  };
  lastLoginAt?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  // Register new user
  register: async (data: RegisterData) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: LoginData) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout', { refreshToken });
      return response.data;
    }
    return { success: true, message: 'Logged out', data: null };
  },

  // Refresh token
  refresh: async (refreshToken: string) => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      { token, password }
    );
    return response.data;
  },

  // Confirm email
  confirmEmail: async (token: string) => {
    const response = await apiClient.get<ApiResponse<{ message: string }>>(
      `/auth/confirm-email?token=${token}`
    );
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');
    return response.data;
  },
};
