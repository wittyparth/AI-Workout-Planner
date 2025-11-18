import apiClient, { ApiResponse } from './client';
import { User } from './auth';

export interface Activity {
  _id: string;
  user: User;
  type: 'workout_completed' | 'pr_achieved' | 'goal_completed' | 'achievement_unlocked';
  workout?: any;
  exercise?: any;
  personalRecord?: any;
  goal?: any;
  achievement?: any;
  caption?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  content: string;
  createdAt: string;
}

export const socialApi = {
  // Get activity feed
  getFeed: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      `/social/feed?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Like activity
  likeActivity: async (activityId: string) => {
    const response = await apiClient.post<ApiResponse<Activity>>(
      `/social/activities/${activityId}/like`
    );
    return response.data;
  },

  // Unlike activity
  unlikeActivity: async (activityId: string) => {
    const response = await apiClient.delete<ApiResponse<Activity>>(
      `/social/activities/${activityId}/like`
    );
    return response.data;
  },

  // Add comment
  addComment: async (activityId: string, content: string) => {
    const response = await apiClient.post<ApiResponse<Activity>>(
      `/social/activities/${activityId}/comments`,
      { content }
    );
    return response.data;
  },

  // Delete comment
  deleteComment: async (activityId: string, commentId: string) => {
    const response = await apiClient.delete<ApiResponse<Activity>>(
      `/social/activities/${activityId}/comments/${commentId}`
    );
    return response.data;
  },

  // Follow user
  followUser: async (userId: string) => {
    const response = await apiClient.post<ApiResponse<{ following: boolean }>>(
      `/social/users/${userId}/follow`
    );
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<{ following: boolean }>>(
      `/social/users/${userId}/follow`
    );
    return response.data;
  },

  // Get followers
  getFollowers: async (userId?: string) => {
    const url = userId ? `/social/users/${userId}/followers` : '/social/followers';
    const response = await apiClient.get<ApiResponse<User[]>>(url);
    return response.data;
  },

  // Get following
  getFollowing: async (userId?: string) => {
    const url = userId ? `/social/users/${userId}/following` : '/social/following';
    const response = await apiClient.get<ApiResponse<User[]>>(url);
    return response.data;
  },

  // Search users
  searchUsers: async (query: string) => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/social/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};
