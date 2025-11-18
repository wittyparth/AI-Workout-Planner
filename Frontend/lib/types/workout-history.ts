export interface WorkoutHistoryEntry {
  id: string
  workoutId: string
  workoutTitle: string
  workoutType: string
  startTime: Date
  endTime?: Date
  status: "completed" | "in-progress" | "paused" | "cancelled"
  duration: number // in minutes
  exercisesCompleted: number
  totalExercises: number
  caloriesBurned?: number
  totalVolume?: number
  averageHeartRate?: number
  notes?: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  muscleGroups: string[]
  thumbnail?: string
  completionPercentage: number
  personalRecords?: Array<{
    exerciseName: string
    type: "weight" | "reps" | "duration"
    value: number
    previousBest: number
  }>
}

export interface LikedWorkout {
  id: string
  workoutId: string
  workoutTitle: string
  workoutType: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  exercises: number
  rating: number
  thumbnail?: string
  likedAt: Date
  description: string
}

export interface BookmarkedWorkout {
  id: string
  workoutId: string
  workoutTitle: string
  workoutType: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  exercises: number
  rating: number
  thumbnail?: string
  bookmarkedAt: Date
  description: string
  tags?: string[]
}

export type WorkoutFilter = "all" | "completed" | "liked" | "bookmarked" | "recent"
export type SortOption = "date-desc" | "date-asc" | "duration-desc" | "duration-asc" | "rating-desc"
