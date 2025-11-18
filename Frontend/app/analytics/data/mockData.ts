import { 
  ExerciseProgress, 
  PersonalRecord, 
  BodyWeightProgress, 
  ProgressPhoto, 
  WorkoutSession, 
  ConsistencyData, 
  VolumeData, 
  CalorieData, 
  StreakData, 
  MonthlyStats, 
  ExerciseSpecificProgress 
} from '../types'

// Exercise Progress Data
export const exerciseProgressData: ExerciseProgress[] = [
  { date: "2024-09-01", exerciseName: "Bench Press", weight: 185, reps: 8, sets: 3, volume: 4440, oneRepMax: 231 },
  { date: "2024-09-08", exerciseName: "Bench Press", weight: 190, reps: 8, sets: 3, volume: 4560, oneRepMax: 237 },
  { date: "2024-09-15", exerciseName: "Bench Press", weight: 195, reps: 8, sets: 3, volume: 4680, oneRepMax: 243 },
  { date: "2024-09-22", exerciseName: "Bench Press", weight: 200, reps: 8, sets: 3, volume: 4800, oneRepMax: 250 },
  { date: "2024-09-29", exerciseName: "Bench Press", weight: 205, reps: 8, sets: 3, volume: 4920, oneRepMax: 256 },
  { date: "2024-10-06", exerciseName: "Bench Press", weight: 210, reps: 8, sets: 3, volume: 5040, oneRepMax: 262 },
]

export const squatProgressData: ExerciseProgress[] = [
  { date: "2024-09-01", exerciseName: "Squat", weight: 225, reps: 8, sets: 3, volume: 5400, oneRepMax: 281 },
  { date: "2024-09-08", exerciseName: "Squat", weight: 235, reps: 8, sets: 3, volume: 5640, oneRepMax: 293 },
  { date: "2024-09-15", exerciseName: "Squat", weight: 245, reps: 8, sets: 3, volume: 5880, oneRepMax: 306 },
  { date: "2024-09-22", exerciseName: "Squat", weight: 255, reps: 8, sets: 3, volume: 6120, oneRepMax: 318 },
  { date: "2024-09-29", exerciseName: "Squat", weight: 265, reps: 8, sets: 3, volume: 6360, oneRepMax: 331 },
  { date: "2024-10-06", exerciseName: "Squat", weight: 275, reps: 8, sets: 3, volume: 6600, oneRepMax: 343 },
]

export const deadliftProgressData: ExerciseProgress[] = [
  { date: "2024-09-01", exerciseName: "Deadlift", weight: 275, reps: 5, sets: 3, volume: 4125, oneRepMax: 309 },
  { date: "2024-09-08", exerciseName: "Deadlift", weight: 285, reps: 5, sets: 3, volume: 4275, oneRepMax: 320 },
  { date: "2024-09-15", exerciseName: "Deadlift", weight: 295, reps: 5, sets: 3, volume: 4425, oneRepMax: 331 },
  { date: "2024-09-22", exerciseName: "Deadlift", weight: 305, reps: 5, sets: 3, volume: 4575, oneRepMax: 342 },
  { date: "2024-09-29", exerciseName: "Deadlift", weight: 315, reps: 5, sets: 3, volume: 4725, oneRepMax: 354 },
  { date: "2024-10-06", exerciseName: "Deadlift", weight: 325, reps: 5, sets: 3, volume: 4875, oneRepMax: 365 },
]

// Personal Records
export const personalRecords: PersonalRecord[] = [
  { date: "2024-09-01", exerciseName: "Bench Press", weight: 225, reps: 1, improvement: 0 },
  { date: "2024-09-15", exerciseName: "Bench Press", weight: 235, reps: 1, previousRecord: 225, improvement: 10 },
  { date: "2024-10-01", exerciseName: "Bench Press", weight: 245, reps: 1, previousRecord: 235, improvement: 10 },
  { date: "2024-09-08", exerciseName: "Squat", weight: 315, reps: 1, improvement: 0 },
  { date: "2024-09-22", exerciseName: "Squat", weight: 325, reps: 1, previousRecord: 315, improvement: 10 },
  { date: "2024-10-06", exerciseName: "Squat", weight: 335, reps: 1, previousRecord: 325, improvement: 10 },
  { date: "2024-09-10", exerciseName: "Deadlift", weight: 375, reps: 1, improvement: 0 },
  { date: "2024-09-24", exerciseName: "Deadlift", weight: 385, reps: 1, previousRecord: 375, improvement: 10 },
  { date: "2024-10-08", exerciseName: "Deadlift", weight: 395, reps: 1, previousRecord: 385, improvement: 10 },
]

// Body Weight Progress
export const bodyWeightData: BodyWeightProgress[] = [
  { date: "2024-08-01", weight: 185.2, bodyFat: 18.5, muscleMass: 151.0, bmi: 25.1 },
  { date: "2024-08-08", weight: 184.8, bodyFat: 18.2, muscleMass: 151.3, bmi: 25.0 },
  { date: "2024-08-15", weight: 184.5, bodyFat: 17.9, muscleMass: 151.6, bmi: 25.0 },
  { date: "2024-08-22", weight: 184.1, bodyFat: 17.6, muscleMass: 152.0, bmi: 24.9 },
  { date: "2024-08-29", weight: 183.9, bodyFat: 17.3, muscleMass: 152.3, bmi: 24.9 },
  { date: "2024-09-05", weight: 183.5, bodyFat: 17.0, muscleMass: 152.7, bmi: 24.9 },
  { date: "2024-09-12", weight: 183.2, bodyFat: 16.7, muscleMass: 153.1, bmi: 24.8 },
  { date: "2024-09-19", weight: 182.8, bodyFat: 16.4, muscleMass: 153.5, bmi: 24.8 },
  { date: "2024-09-26", weight: 182.5, bodyFat: 16.1, muscleMass: 153.9, bmi: 24.7 },
  { date: "2024-10-03", weight: 182.2, bodyFat: 15.8, muscleMass: 154.2, bmi: 24.7 },
]

// Progress Photos
export const progressPhotos: ProgressPhoto[] = [
  { id: "1", date: "2024-08-01", type: "front", url: "/fitness-progress-photo-front-view.jpg", notes: "Starting point" },
  { id: "2", date: "2024-08-01", type: "side", url: "/fitness-progress-photo-side-view.jpg", notes: "Starting point" },
  { id: "3", date: "2024-10-01", type: "front", url: "/fitness-progress-photo-front-view-after-2-weeks.jpg", notes: "2 months progress" },
  { id: "4", date: "2024-10-01", type: "side", url: "/fitness-progress-photo-side-view-after-2-weeks.jpg", notes: "2 months progress" },
]

// Workout Sessions
export const workoutSessions: WorkoutSession[] = [
  { id: "1", date: "2024-10-07", type: "Upper Body", duration: 75, exercises: 8, totalVolume: 12500, caloriesBurned: 420, completed: true, started: true },
  { id: "2", date: "2024-10-06", type: "Lower Body", duration: 80, exercises: 6, totalVolume: 15200, caloriesBurned: 480, completed: true, started: true },
  { id: "3", date: "2024-10-05", type: "Push", duration: 65, exercises: 7, totalVolume: 10800, caloriesBurned: 380, completed: true, started: true },
  { id: "4", date: "2024-10-04", type: "Pull", duration: 70, exercises: 8, totalVolume: 11600, caloriesBurned: 400, completed: true, started: true },
  { id: "5", date: "2024-10-03", type: "Legs", duration: 85, exercises: 6, totalVolume: 16500, caloriesBurned: 520, completed: true, started: true },
  { id: "6", date: "2024-10-02", type: "Cardio", duration: 30, exercises: 3, totalVolume: 0, caloriesBurned: 300, completed: true, started: true },
  { id: "7", date: "2024-10-01", type: "Full Body", duration: 90, exercises: 10, totalVolume: 18200, caloriesBurned: 550, completed: true, started: true },
]

// Consistency Data (Last 12 weeks)
export const consistencyData: ConsistencyData[] = Array.from({ length: 84 }, (_, i) => {
  const date = new Date(2024, 7, 1) // Start from August 1st
  date.setDate(date.getDate() + i)
  
  const dayOfWeek = date.getDay()
  const week = Math.floor(i / 7)
  
  // Simulate realistic workout patterns
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const baseChance = isWeekend ? 0.3 : 0.8
  const workoutCompleted = Math.random() < baseChance
  
  return {
    date: date.toISOString().split('T')[0],
    workoutCompleted,
    duration: workoutCompleted ? Math.floor(Math.random() * 60) + 30 : 0,
    intensity: workoutCompleted ? Math.floor(Math.random() * 5) + 6 : 0,
    dayOfWeek,
    week
  }
})

// Volume Data
export const volumeData: VolumeData[] = [
  { date: "Week 1", chest: 8500, back: 9200, legs: 12500, shoulders: 4800, arms: 3500, core: 2800, totalVolume: 41300 },
  { date: "Week 2", chest: 8800, back: 9500, legs: 13000, shoulders: 5000, arms: 3700, core: 3000, totalVolume: 43000 },
  { date: "Week 3", chest: 9100, back: 9800, legs: 13500, shoulders: 5200, arms: 3900, core: 3200, totalVolume: 44700 },
  { date: "Week 4", chest: 9000, back: 9600, legs: 13200, shoulders: 5100, arms: 3800, core: 3100, totalVolume: 43800 },
  { date: "Week 5", chest: 9300, back: 10000, legs: 13800, shoulders: 5300, arms: 4000, core: 3300, totalVolume: 45700 },
  { date: "Week 6", chest: 9500, back: 10200, legs: 14000, shoulders: 5400, arms: 4100, core: 3400, totalVolume: 46600 },
  { date: "Week 7", chest: 9700, back: 10400, legs: 14200, shoulders: 5500, arms: 4200, core: 3500, totalVolume: 47500 },
  { date: "Week 8", chest: 9900, back: 10600, legs: 14500, shoulders: 5600, arms: 4300, core: 3600, totalVolume: 48500 },
]

// Calorie Data
export const calorieData: CalorieData[] = [
  { date: "2024-10-01", caloriesBurned: 420, workoutType: "Upper Body", duration: 75, intensity: "High" },
  { date: "2024-10-02", caloriesBurned: 300, workoutType: "Cardio", duration: 30, intensity: "Medium" },
  { date: "2024-10-03", caloriesBurned: 520, workoutType: "Legs", duration: 85, intensity: "High" },
  { date: "2024-10-04", caloriesBurned: 400, workoutType: "Pull", duration: 70, intensity: "Medium" },
  { date: "2024-10-05", caloriesBurned: 380, workoutType: "Push", duration: 65, intensity: "Medium" },
  { date: "2024-10-06", caloriesBurned: 480, workoutType: "Lower Body", duration: 80, intensity: "High" },
  { date: "2024-10-07", caloriesBurned: 420, workoutType: "Upper Body", duration: 75, intensity: "High" },
]

// Streak Data
export const streakData: StreakData = {
  currentStreak: 7,
  longestStreak: 23,
  weeklyAverage: 4.2,
  monthlyTotal: 18
}

// Monthly Stats
export const monthlyStats: MonthlyStats[] = [
  { month: "Aug 2024", workoutsCompleted: 16, workoutsPlanned: 20, totalDuration: 1200, avgDuration: 75, completionRate: 80 },
  { month: "Sep 2024", workoutsCompleted: 18, workoutsPlanned: 20, totalDuration: 1350, avgDuration: 75, completionRate: 90 },
  { month: "Oct 2024", workoutsCompleted: 15, workoutsPlanned: 16, totalDuration: 1125, avgDuration: 75, completionRate: 94 },
]

// Exercise Specific Progress
export const exerciseSpecificProgress: ExerciseSpecificProgress[] = [
  {
    exerciseName: "Bench Press",
    data: exerciseProgressData.map(item => ({
      date: item.date,
      weight: item.weight,
      reps: item.reps,
      volume: item.volume,
      estimatedMax: item.oneRepMax
    })),
    currentMax: 262,
    progression: 13.4,
    trend: 'up'
  },
  {
    exerciseName: "Squat",
    data: squatProgressData.map(item => ({
      date: item.date,
      weight: item.weight,
      reps: item.reps,
      volume: item.volume,
      estimatedMax: item.oneRepMax
    })),
    currentMax: 343,
    progression: 22.1,
    trend: 'up'
  },
  {
    exerciseName: "Deadlift",
    data: deadliftProgressData.map(item => ({
      date: item.date,
      weight: item.weight,
      reps: item.reps,
      volume: item.volume,
      estimatedMax: item.oneRepMax
    })),
    currentMax: 365,
    progression: 18.1,
    trend: 'up'
  }
]
