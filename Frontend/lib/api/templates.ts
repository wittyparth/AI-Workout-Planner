import apiClient, { ApiResponse } from './client';
import { WorkoutExercise } from './workouts';

export interface Template {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
  isPublic: boolean;
  isFeatured?: boolean;
  createdBy: {
    _id: string;
    username: string;
    name?: string;
  };
  stats?: {
    usageCount: number;
    averageRating: number;
    totalRatings: number;
  };
  tags?: string[];
  estimatedDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
  isPublic?: boolean;
  tags?: string[];
  estimatedDuration?: number;
}

export interface TemplateFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  createdBy?: string;
  page?: number;
  limit?: number;
}

export const templateApi = {
  // Get featured templates (public)
  getFeaturedTemplates: async () => {
    const response = await apiClient.get<ApiResponse<Template[]>>('/templates/featured');
    return response.data;
  },

  // Get all templates with filters
  getTemplates: async (filters?: TemplateFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    const response = await apiClient.get<ApiResponse<Template[]>>(
      `/templates?${params.toString()}`
    );
    return response.data;
  },

  // Get template by ID
  getTemplateById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Template>>(`/templates/${id}`);
    return response.data;
  },

  // Create template
  createTemplate: async (data: CreateTemplateData) => {
    const response = await apiClient.post<ApiResponse<Template>>('/templates', data);
    return response.data;
  },

  // Update template
  updateTemplate: async (id: string, data: Partial<CreateTemplateData>) => {
    const response = await apiClient.put<ApiResponse<Template>>(`/templates/${id}`, data);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/templates/${id}`);
    return response.data;
  },

  // Duplicate template
  duplicateTemplate: async (id: string) => {
    const response = await apiClient.post<ApiResponse<Template>>(`/templates/${id}/duplicate`);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id: string) => {
    const response = await apiClient.post<ApiResponse<{ isFavorited: boolean }>>(
      `/templates/${id}/favorite`
    );
    return response.data;
  },

  // Rate template
  rateTemplate: async (id: string, rating: number) => {
    const response = await apiClient.post<ApiResponse<Template>>(
      `/templates/${id}/rate`,
      { rating }
    );
    return response.data;
  },
};
