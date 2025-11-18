// Re-export all API modules for easy importing
export * from './client';
export * from './auth';
export * from './exercises';
export * from './workouts';
export * from './templates';
export * from './goals';
export * from './ai';
export * from './progress';
export * from './user';
export * from './social';

// Default export with all APIs
import { authApi } from './auth';
import { exerciseApi } from './exercises';
import { workoutApi } from './workouts';
import { templateApi } from './templates';
import { goalApi } from './goals';
import { aiApi } from './ai';
import { progressApi } from './progress';
import { userApi } from './user';
import { socialApi } from './social';

const api = {
  auth: authApi,
  exercises: exerciseApi,
  workouts: workoutApi,
  templates: templateApi,
  goals: goalApi,
  ai: aiApi,
  progress: progressApi,
  user: userApi,
  social: socialApi,
};

export default api;
