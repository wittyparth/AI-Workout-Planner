export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: number // weeks
  goal: "Strength" | "Muscle Building" | "Fat Loss" | "Endurance" | "General Fitness"
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  tags: string[]
  rating?: number
  reviews?: number
  weeklyPlan: WeeklyPlan
  metadata: TemplateMetadata
  thumbnail?: string
  authorId?: string
  authorName?: string
  timesUsed?: number
  averageRating?: number
}

export interface WeeklyPlan {
  days: {
    monday: DayWorkout
    tuesday: DayWorkout
    wednesday: DayWorkout
    thursday: DayWorkout
    friday: DayWorkout
    saturday: DayWorkout
    sunday: DayWorkout
  }
}

export interface DayWorkout {
  id: string
  name: string
  isRestDay: boolean
  focusAreas: string[] // ["Chest", "Shoulders", "Triceps"]
  estimatedDuration: number // minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  exercises: TemplateExercise[]
  warmup?: TemplateExercise[]
  cooldown?: TemplateExercise[]
  notes?: string
  aiGenerated: boolean
  totalVolume?: number
  exerciseCount: number
}

export interface TemplateExercise {
  id: string
  exerciseId: string
  name: string
  sets: number
  reps: number | { min: number; max: number }
  weight?: number | "bodyweight" | "percentage" // percentage of 1RM
  restTime: number
  intensity?: "Light" | "Moderate" | "Heavy"
  rpe?: number
  isSuperset: boolean
  supersetGroup?: string
  notes?: string
  alternatives: string[]
  progressionOptions?: ProgressionOption[]
  muscleGroups: string[]
  equipment: string[]
  order: number
}

export interface ProgressionOption {
  type: "weight" | "reps" | "sets" | "time"
  increment: number
  condition: string // "weekly", "when_rpe_below_8", etc.
  description: string
}

export interface TemplateMetadata {
  totalExercises: number
  totalSets: number
  weeklyVolume: number
  muscleGroupDistribution: Record<string, number>
  equipmentRequired: string[]
  estimatedWeeklyDuration: number // minutes
  restDaysPerWeek: number
  workoutDaysPerWeek: number
  // Additional properties for the template page
  primaryMuscles: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  equipment: string[]
}

export interface ExerciseDatabase {
  id: string
  name: string
  primaryMuscleGroups: string[]
  secondaryMuscleGroups: string[]
  equipment: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: "Compound" | "Isolation"
  movementPattern: "Push" | "Pull" | "Squat" | "Hinge" | "Carry" | "Twist"
  instructions: string[]
  tips: string[]
  videoUrl?: string
  thumbnailUrl?: string
  alternatives: string[]
  commonMistakes: string[]
  safetyNotes: string[]
  variations: string[]
}

export interface TemplateFilters {
  difficulty?: ("Beginner" | "Intermediate" | "Advanced")[]
  goal?: ("Strength" | "Muscle Building" | "Fat Loss" | "Endurance" | "General Fitness")[]
  duration?: { min: number; max: number }
  equipment?: string[]
  muscleGroups?: string[]
  tags?: string[]
  rating?: number
}

export interface AIGenerationRequest {
  muscleGroups: string[]
  equipment: string[]
  duration: number
  experienceLevel: "Beginner" | "Intermediate" | "Advanced"
  goal: "Strength" | "Muscle Building" | "Fat Loss" | "Endurance" | "General Fitness"
  previousWorkouts?: DayWorkout[]
  preferences?: {
    exerciseTypes?: ("Compound" | "Isolation")[]
    intensity?: "Light" | "Moderate" | "Heavy"
    restTime?: { min: number; max: number }
  }
}

export const MUSCLE_GROUPS = [
  "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Glutes",
  "Biceps", "Triceps", "Forearms", "Quads", "Hamstrings", "Calves",
  "Upper Back", "Lower Back", "Lats", "Traps", "Deltoids"
] as const

export const EQUIPMENT_TYPES = [
  "Barbell", "Dumbbell", "Bodyweight", "Resistance Bands", "Cable Machine",
  "Smith Machine", "Kettlebell", "Medicine Ball", "TRX", "Pull-up Bar",
  "Bench", "Squat Rack", "Leg Press", "Cardio Machine"
] as const

export const WORKOUT_GOALS = [
  "Strength", "Muscle Building", "Fat Loss", "Endurance", "General Fitness"
] as const

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const
