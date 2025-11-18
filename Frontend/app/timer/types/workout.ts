export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  restTime?: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  muscleGroups: string[]
  instructions: string
  tips: string[]
  videoUrl?: string
  thumbnailUrl?: string
  personalRecord?: {
    weight: number
    reps: number
    date: string
  }
  lastWorkout?: {
    date: string
    sets: {
      weight: number
      reps: number
      rpe: number
      restTime?: number
    }[]
  }
  alternatives?: string[]
  targetMuscles: string[]
}

export interface WorkoutSet {
  weight: number
  reps: number
  rpe?: number
  completed: boolean
  notes?: string
  completedAt?: Date
  restTimeUsed?: number
  isWarmup?: boolean
  isDropSet?: boolean
}

export interface WorkoutSession {
  startTime: Date
  endTime?: Date
  totalVolume: number
  completedSets: number
  totalRestTime: number
  exercisesCompleted: number
  personalRecords: number
  notes?: string
}

export interface RestTimerSettings {
  defaultRestTime: number
  warningTime: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  smartRest: boolean
  backgroundMusic: boolean
  customRestTimes: Record<string, number>
}

export interface PlateCalculation {
  plates: number[]
  remaining: number
}
