export interface ExerciseProgress {
  date: string
  exerciseName: string
  weight: number
  reps: number
  sets: number
  volume: number
  oneRepMax: number
}

export interface PersonalRecord {
  date: string
  exerciseName: string
  weight: number
  reps: number
  previousRecord?: number
  improvement: number
}

export interface BodyWeightProgress {
  date: string
  weight: number
  bodyFat?: number
  muscleMass?: number
  bmi: number
}

export interface ProgressPhoto {
  id: string
  date: string
  type: 'front' | 'side' | 'back'
  url: string
  notes?: string
}

export interface WorkoutSession {
  id: string
  date: string
  type: string
  duration: number
  exercises: number
  totalVolume: number
  caloriesBurned: number
  completed: boolean
  started: boolean
  notes?: string
}

export interface ConsistencyData {
  date: string
  workoutCompleted: boolean
  duration: number
  intensity: number
  dayOfWeek: number
  week: number
}

export interface VolumeData {
  date: string
  chest: number
  back: number
  legs: number
  shoulders: number
  arms: number
  core: number
  totalVolume: number
}

export interface CalorieData {
  date: string
  caloriesBurned: number
  workoutType: string
  duration: number
  intensity: string
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  weeklyAverage: number
  monthlyTotal: number
}

export interface MonthlyStats {
  month: string
  workoutsCompleted: number
  workoutsPlanned: number
  totalDuration: number
  avgDuration: number
  completionRate: number
}

export interface ExerciseSpecificProgress {
  exerciseName: string
  data: Array<{
    date: string
    weight: number
    reps: number
    volume: number
    estimatedMax: number
  }>
  currentMax: number
  progression: number
  trend: 'up' | 'down' | 'stable'
}
