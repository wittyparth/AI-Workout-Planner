import { WorkoutHistoryEntry, LikedWorkout, BookmarkedWorkout } from "@/lib/types/workout-history"

export const workoutHistory: WorkoutHistoryEntry[] = [
  {
    id: "hist-1",
    workoutId: "1",
    workoutTitle: "Upper Body Strength",
    workoutType: "Strength Training",
    startTime: new Date("2024-12-01T08:00:00"),
    endTime: new Date("2024-12-01T08:45:00"),
    status: "completed",
    duration: 45,
    exercisesCompleted: 8,
    totalExercises: 8,
    caloriesBurned: 320,
    totalVolume: 4250,
    averageHeartRate: 145,
    difficulty: "Intermediate",
    muscleGroups: ["Chest", "Shoulders", "Triceps", "Back"],
    thumbnail: "/gym-upper-body-workout.jpg",
    completionPercentage: 100,
    personalRecords: [
      {
        exerciseName: "Bench Press",
        type: "weight",
        value: 145,
        previousBest: 135
      }
    ],
    notes: "Felt strong today, increased bench press weight!"
  },
  {
    id: "hist-2",
    workoutId: "2",
    workoutTitle: "HIIT Cardio Blast",
    workoutType: "HIIT",
    startTime: new Date("2024-11-30T18:30:00"),
    endTime: new Date("2024-11-30T19:00:00"),
    status: "completed",
    duration: 30,
    exercisesCompleted: 6,
    totalExercises: 6,
    caloriesBurned: 420,
    averageHeartRate: 165,
    difficulty: "Advanced",
    muscleGroups: ["Full Body"],
    thumbnail: "/hiit-cardio-workout.png",
    completionPercentage: 100
  },
  {
    id: "hist-3",
    workoutId: "3",
    workoutTitle: "Morning Yoga Flow",
    workoutType: "Yoga",
    startTime: new Date("2024-11-29T07:00:00"),
    endTime: new Date("2024-11-29T07:25:00"),
    status: "completed",
    duration: 25,
    exercisesCompleted: 12,
    totalExercises: 12,
    caloriesBurned: 150,
    averageHeartRate: 95,
    difficulty: "Beginner",
    muscleGroups: ["Full Body", "Core"],
    thumbnail: "/morning-yoga-flow.jpg",
    completionPercentage: 100,
    notes: "Great way to start the day, feeling refreshed!"
  },
  {
    id: "hist-4",
    workoutId: "5",
    workoutTitle: "Leg Day Destroyer",
    workoutType: "Strength Training",
    startTime: new Date("2024-11-28T16:00:00"),
    endTime: new Date("2024-11-28T16:35:00"),
    status: "cancelled",
    duration: 35,
    exercisesCompleted: 5,
    totalExercises: 9,
    caloriesBurned: 180,
    totalVolume: 2100,
    difficulty: "Advanced",
    muscleGroups: ["Legs", "Glutes"],
    thumbnail: "/leg-day-workout.png",
    completionPercentage: 56,
    notes: "Had to cut it short due to time constraints"
  },
  {
    id: "hist-5",
    workoutId: "4",
    workoutTitle: "Full Body Bodyweight",
    workoutType: "Bodyweight",
    startTime: new Date("2024-11-27T12:00:00"),
    endTime: new Date("2024-11-27T12:35:00"),
    status: "completed",
    duration: 35,
    exercisesCompleted: 10,
    totalExercises: 10,
    caloriesBurned: 280,
    averageHeartRate: 135,
    difficulty: "Intermediate",
    muscleGroups: ["Full Body"],
    thumbnail: "/bodyweight-workout.png",
    completionPercentage: 100
  },
  {
    id: "hist-6",
    workoutId: "6",
    workoutTitle: "Core & Abs Burner",
    workoutType: "Bodyweight",
    startTime: new Date("2024-11-26T19:00:00"),
    endTime: new Date("2024-11-26T19:20:00"),
    status: "completed",
    duration: 20,
    exercisesCompleted: 7,
    totalExercises: 7,
    caloriesBurned: 180,
    averageHeartRate: 125,
    difficulty: "Intermediate",
    muscleGroups: ["Core", "Abs"],
    thumbnail: "/core-abs-workout.jpg",
    completionPercentage: 100,
    personalRecords: [
      {
        exerciseName: "Plank Hold",
        type: "duration",
        value: 90,
        previousBest: 75
      }
    ]
  }
]

export const likedWorkouts: LikedWorkout[] = [
  {
    id: "liked-1",
    workoutId: "1",
    workoutTitle: "Upper Body Strength",
    workoutType: "Strength Training",
    difficulty: "Intermediate",
    duration: "45 min",
    exercises: 8,
    rating: 4.8,
    thumbnail: "/gym-upper-body-workout.jpg",
    likedAt: new Date("2024-11-20T10:00:00"),
    description: "Build muscle and strength in your chest, shoulders, and arms"
  },
  {
    id: "liked-2",
    workoutId: "3",
    workoutTitle: "Morning Yoga Flow",
    workoutType: "Yoga",
    difficulty: "Beginner",
    duration: "25 min",
    exercises: 12,
    rating: 4.7,
    thumbnail: "/morning-yoga-flow.jpg",
    likedAt: new Date("2024-11-18T07:30:00"),
    description: "Gentle stretches and poses to start your day right"
  },
  {
    id: "liked-3",
    workoutId: "6",
    workoutTitle: "Core & Abs Burner",
    workoutType: "Bodyweight",
    difficulty: "Intermediate",
    duration: "20 min",
    exercises: 7,
    rating: 4.5,
    thumbnail: "/core-abs-workout.jpg",
    likedAt: new Date("2024-11-15T20:00:00"),
    description: "Target your core with these effective exercises"
  }
]

export const bookmarkedWorkouts: BookmarkedWorkout[] = [
  {
    id: "bookmark-1",
    workoutId: "1",
    workoutTitle: "Upper Body Strength",
    workoutType: "Strength Training",
    difficulty: "Intermediate",
    duration: "45 min",
    exercises: 8,
    rating: 4.8,
    thumbnail: "/gym-upper-body-workout.jpg",
    bookmarkedAt: new Date("2024-11-25T15:00:00"),
    description: "Build muscle and strength in your chest, shoulders, and arms",
    tags: ["strength", "muscle building", "upper body"]
  },
  {
    id: "bookmark-2",
    workoutId: "3",
    workoutTitle: "Morning Yoga Flow",
    workoutType: "Yoga",
    difficulty: "Beginner",
    duration: "25 min",
    exercises: 12,
    rating: 4.7,
    thumbnail: "/morning-yoga-flow.jpg",
    bookmarkedAt: new Date("2024-11-22T06:45:00"),
    description: "Gentle stretches and poses to start your day right",
    tags: ["yoga", "flexibility", "morning routine"]
  },
  {
    id: "bookmark-3",
    workoutId: "6",
    workoutTitle: "Core & Abs Burner",
    workoutType: "Bodyweight",
    difficulty: "Intermediate",
    duration: "20 min",
    exercises: 7,
    rating: 4.5,
    thumbnail: "/core-abs-workout.jpg",
    bookmarkedAt: new Date("2024-11-20T14:30:00"),
    description: "Target your core with these effective exercises",
    tags: ["core", "abs", "bodyweight", "quick workout"]
  },
  {
    id: "bookmark-4",
    workoutId: "2",
    workoutTitle: "HIIT Cardio Blast",
    workoutType: "HIIT",
    difficulty: "Advanced",
    duration: "30 min",
    exercises: 6,
    rating: 4.9,
    thumbnail: "/hiit-cardio-workout.png",
    bookmarkedAt: new Date("2024-11-18T16:20:00"),
    description: "High-intensity interval training for maximum calorie burn",
    tags: ["hiit", "cardio", "fat burning", "intense"]
  }
]
