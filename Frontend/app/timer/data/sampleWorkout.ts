import { Exercise } from "../types/workout"

export const sampleWorkout: Exercise[] = [
  {
    id: "1",
    name: "Barbell Back Squat",
    sets: 4,
    reps: 8,
    weight: 185,
    restTime: 180,
    difficulty: "Intermediate",
    muscleGroups: ["Quads", "Glutes", "Core"],
    targetMuscles: ["Quadriceps", "Gluteus Maximus", "Hamstrings", "Core"],
    instructions: "Stand with feet shoulder-width apart, bar on upper back. Lower by pushing hips back and bending knees. Drive through heels to return to start.",
    tips: [
      "Keep chest up and core engaged",
      "Don't let knees cave inward",
      "Full depth - hip crease below knee",
      "Drive through whole foot, not just heels"
    ],
    videoUrl: "/videos/barbell-squat.mp4",
    thumbnailUrl: "/exercises/barbell-squat.jpg",
    personalRecord: {
      weight: 225,
      reps: 5,
      date: "2024-11-20"
    },
    lastWorkout: {
      date: "2024-12-01",
      sets: [
        { weight: 175, reps: 8, rpe: 7, restTime: 180 },
        { weight: 175, reps: 8, rpe: 7, restTime: 180 },
        { weight: 185, reps: 6, rpe: 8, restTime: 180 },
        { weight: 185, reps: 5, rpe: 9, restTime: 180 }
      ]
    },
    alternatives: ["Goblet Squat", "Bulgarian Split Squat", "Leg Press"]
  },
  {
    id: "2",
    name: "Bench Press",
    sets: 4,
    reps: 10,
    weight: 135,
    restTime: 120,
    difficulty: "Beginner",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    targetMuscles: ["Pectoralis Major", "Anterior Deltoid", "Triceps"],
    instructions: "Lie on bench, grip bar slightly wider than shoulders. Lower to chest with control, press up explosively.",
    tips: [
      "Keep feet planted on ground",
      "Retract shoulder blades",
      "Touch chest lightly, don't bounce",
      "Keep wrists straight and strong"
    ],
    videoUrl: "/videos/bench-press.mp4",
    thumbnailUrl: "/exercises/bench-press.jpg",
    personalRecord: {
      weight: 155,
      reps: 8,
      date: "2024-11-15"
    },
    lastWorkout: {
      date: "2024-12-01",
      sets: [
        { weight: 125, reps: 10, rpe: 6, restTime: 120 },
        { weight: 135, reps: 8, rpe: 7, restTime: 120 },
        { weight: 135, reps: 8, rpe: 8, restTime: 120 },
        { weight: 135, reps: 6, rpe: 8, restTime: 120 }
      ]
    },
    alternatives: ["Dumbbell Bench Press", "Push-ups", "Incline Bench Press"]
  },
  {
    id: "3",
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: 225,
    restTime: 240,
    difficulty: "Advanced",
    muscleGroups: ["Back", "Glutes", "Hamstrings"],
    targetMuscles: ["Erector Spinae", "Gluteus Maximus", "Hamstrings", "Latissimus Dorsi"],
    instructions: "Stand with feet hip-width apart, bar over mid-foot. Hinge at hips, grip bar. Drive through heels and hips to stand tall.",
    tips: [
      "Keep bar close to body throughout",
      "Start with hips higher than knees",
      "Drive hips forward at top",
      "Don't round lower back"
    ],
    videoUrl: "/videos/deadlift.mp4",
    thumbnailUrl: "/exercises/deadlift.jpg",
    personalRecord: {
      weight: 275,
      reps: 3,
      date: "2024-11-25"
    },
    lastWorkout: {
      date: "2024-12-01",
      sets: [
        { weight: 205, reps: 5, rpe: 7, restTime: 240 },
        { weight: 225, reps: 5, rpe: 8, restTime: 240 },
        { weight: 225, reps: 3, rpe: 9, restTime: 240 }
      ]
    },
    alternatives: ["Romanian Deadlift", "Sumo Deadlift", "Trap Bar Deadlift"]
  },
  {
    id: "4",
    name: "Overhead Press",
    sets: 3,
    reps: 8,
    weight: 95,
    restTime: 150,
    difficulty: "Intermediate",
    muscleGroups: ["Shoulders", "Triceps", "Core"],
    targetMuscles: ["Anterior Deltoid", "Medial Deltoid", "Triceps", "Core"],
    instructions: "Stand tall, grip bar at shoulder width. Press straight up, keeping core tight. Lower with control.",
    tips: [
      "Keep core braced throughout",
      "Press in straight line over shoulders",
      "Don't arch back excessively",
      "Squeeze glutes for stability"
    ],
    videoUrl: "/videos/overhead-press.mp4",
    thumbnailUrl: "/exercises/overhead-press.jpg",
    personalRecord: {
      weight: 115,
      reps: 5,
      date: "2024-11-18"
    },
    lastWorkout: {
      date: "2024-12-01",
      sets: [
        { weight: 85, reps: 8, rpe: 6, restTime: 150 },
        { weight: 95, reps: 6, rpe: 8, restTime: 150 },
        { weight: 95, reps: 5, rpe: 8, restTime: 150 }
      ]
    },
    alternatives: ["Dumbbell Press", "Pike Push-ups", "Seated Press"]
  },
  {
    id: "5",
    name: "Barbell Rows",
    sets: 4,
    reps: 10,
    weight: 115,
    restTime: 120,
    difficulty: "Intermediate",
    muscleGroups: ["Back", "Biceps", "Rear Delts"],
    targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Middle Trapezius", "Biceps"],
    instructions: "Hinge at hips, hold bar with overhand grip. Pull to lower chest, squeeze shoulder blades. Lower with control.",
    tips: [
      "Keep torso stable and core tight",
      "Pull to sternum, not belly",
      "Squeeze shoulder blades together",
      "Don't use momentum"
    ],
    videoUrl: "/videos/barbell-rows.mp4",
    thumbnailUrl: "/exercises/barbell-rows.jpg",
    personalRecord: {
      weight: 135,
      reps: 8,
      date: "2024-11-22"
    },
    lastWorkout: {
      date: "2024-12-01",
      sets: [
        { weight: 105, reps: 10, rpe: 6, restTime: 120 },
        { weight: 115, reps: 8, rpe: 7, restTime: 120 },
        { weight: 115, reps: 8, rpe: 8, restTime: 120 },
        { weight: 115, reps: 6, rpe: 8, restTime: 120 }
      ]
    },
    alternatives: ["T-Bar Rows", "Dumbbell Rows", "Cable Rows"]
  }
]
