# API Quick Reference Guide

## Import & Usage

```typescript
// Import specific APIs
import { authApi, userApi, workoutApi, exerciseApi } from '@/lib/api';

// Or import everything
import api from '@/lib/api';
```

## Authentication

### Register
```typescript
const { data } = await authApi.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});
// Returns: { user, accessToken, refreshToken }
```

### Login
```typescript
const { data } = await authApi.login({
  email: "john@example.com",
  password: "password123"
});
// Returns: { user, accessToken, refreshToken }
```

### Get Profile
```typescript
const { data: user } = await authApi.getProfile();
```

## User Profile

### Update Profile
```typescript
await userApi.updateProfile({
  firstName: "John",
  lastName: "Doe",
  gender: "male",
  fitnessLevel: "intermediate"
});
```

### Update Body Metrics
```typescript
await userApi.updateMetrics({
  currentWeight: 75,
  targetWeight: 70,
  height: 180,
  bodyFatPercentage: 15
});
```

## Exercises

### Get Exercises with Filters
```typescript
const { data: exercises } = await exerciseApi.getExercises({
  muscleGroups: "chest,triceps",
  difficulty: "intermediate",
  page: 1,
  limit: 20
});
```

### Get Exercise Details
```typescript
const { data: exercise } = await exerciseApi.getExerciseById(exerciseId);
```

## Workouts

### Create Workout
```typescript
const { data: workout } = await workoutApi.createWorkout({
  name: "Upper Body Strength",
  exercises: [
    {
      exerciseId: "exercise_id_here",
      plannedSets: 3,
      plannedReps: 10,
      plannedWeight: 50
    }
  ],
  location: "gym",
  notes: "Focus on form"
});
```

### Start Workout
```typescript
const { data: workout } = await workoutApi.startWorkout(workoutId);
```

### Complete Set
```typescript
const { data: workout } = await workoutApi.completeSet(workoutId, exerciseIndex, {
  setNumber: 1,
  weight: 50,
  reps: 10,
  rpe: 8
});
```

### Complete Workout
```typescript
const { data: workout } = await workoutApi.completeWorkout(workoutId, {
  mood: { after: "energized", energy: 8 },
  notes: "Great workout!"
});
```

### Get Workout History
```typescript
const { data: workouts } = await workoutApi.getWorkouts({
  status: "completed",
  page: 1,
  limit: 10
});
```

## AI Features

### Generate Workout
```typescript
const { data: workout } = await aiApi.generateWorkout({
  goal: "muscle_gain",
  duration: 60,
  difficulty: "intermediate",
  equipment: ["barbell", "dumbbells"],
  targetMuscles: ["chest", "triceps"]
});
```

### Get Exercise Alternatives
```typescript
const { data: alternatives } = await aiApi.suggestAlternatives(
  exerciseId,
  "No gym equipment available"
);
```

### Get Progress Insights
```typescript
const { data: insights } = await aiApi.getProgressInsights();
// Returns: { summary, insights, recommendations, strengths, areasForImprovement }
```

## Templates

### Get Featured Templates
```typescript
const { data: templates } = await templateApi.getFeaturedTemplates();
```

### Create Template
```typescript
const { data: template } = await templateApi.createTemplate({
  name: "My Upper Body Routine",
  description: "Focus on chest and arms",
  difficulty: "intermediate",
  exercises: [...],
  isPublic: true,
  tags: ["upper-body", "strength"]
});
```

## Goals

### Create Goal
```typescript
const { data: goal } = await goalApi.createGoal({
  type: "weight_loss",
  title: "Lose 5kg",
  target: { value: 70, unit: "kg" },
  current: { value: 75, unit: "kg" },
  deadline: "2024-12-31"
});
```

### Update Progress
```typescript
await goalApi.updateProgress(goalId, 73, "kg");
```

## Progress Tracking

### Add Body Metrics
```typescript
await progressApi.addMetrics({
  date: new Date().toISOString(),
  weight: 75,
  bodyFat: 15,
  measurements: {
    chest: 100,
    waist: 80,
    biceps: 35
  }
});
```

### Upload Progress Photo
```typescript
const { data: photo } = await progressApi.uploadPhoto(
  file,
  75, // weight
  "Front view"
);
```

### Get Personal Records
```typescript
const { data: prs } = await progressApi.getPersonalRecords();
```

## Social Features

### Get Activity Feed
```typescript
const { data: activities } = await socialApi.getFeed(1, 20);
```

### Like Activity
```typescript
await socialApi.likeActivity(activityId);
```

### Add Comment
```typescript
await socialApi.addComment(activityId, "Great workout!");
```

### Follow User
```typescript
await socialApi.followUser(userId);
```

## Error Handling

All API calls return standardized responses:

```typescript
try {
  const { data, message } = await workoutApi.createWorkout(workoutData);
  toast.success(message);
  // Use data...
} catch (error) {
  const errorMessage = handleApiError(error);
  toast.error(errorMessage);
}
```

## Response Format

All successful responses follow this format:
```typescript
{
  success: true,
  message: "Success message",
  data: { /* your data */ },
  pagination?: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 20
  }
}
```

## Authentication Headers

The API client automatically adds authentication headers to all requests:
```
Authorization: Bearer <access_token>
```

Tokens are automatically refreshed when they expire.

## Base URL

Default: `http://localhost:5000/api/v1`

Configure via environment variable:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
