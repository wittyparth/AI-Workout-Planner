export interface ExerciseData {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  category: string;
  difficulty: string;
  equipment: string[];
  instructions?: string[];
  sets?: number;
  reps?: number;
  weight?: string;
  restTime?: number;
}

export const SAMPLE_EXERCISES: ExerciseData[] = [
  // Chest Exercises
  {
    id: "push-up",
    name: "Push-up",
    description: "Classic bodyweight exercise for chest, shoulders, and triceps",
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    category: "Bodyweight",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "bench-press",
    name: "Bench Press",
    description: "Fundamental barbell chest exercise for upper body strength",
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Bench"],
    sets: 4,
    reps: 8,
    restTime: 120
  },
  {
    id: "dumbbell-chest-press",
    name: "Dumbbell Chest Press",
    description: "Dumbbell variation of chest press for better muscle activation",
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Bench"],
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    description: "Targets upper chest with inclined bench position",
    muscleGroups: ["Chest", "Shoulders"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Bench"],
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    id: "dumbbell-flyes",
    name: "Dumbbell Flyes",
    description: "Isolation exercise for chest development",
    muscleGroups: ["Chest"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Bench"],
    sets: 3,
    reps: 12,
    restTime: 75
  },

  // Back Exercises
  {
    id: "pull-up",
    name: "Pull-up",
    description: "Compound bodyweight exercise for back and biceps",
    muscleGroups: ["Back", "Arms"],
    category: "Bodyweight",
    difficulty: "Advanced",
    equipment: ["Pull-up Bar"],
    sets: 3,
    reps: 8,
    restTime: 120
  },
  {
    id: "bent-over-row",
    name: "Bent-over Row",
    description: "Compound rowing movement for back development",
    muscleGroups: ["Back", "Arms"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell"],
    sets: 4,
    reps: 10,
    restTime: 90
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    description: "Cable exercise targeting latissimus dorsi",
    muscleGroups: ["Back", "Arms"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Cable Machine"],
    sets: 3,
    reps: 12,
    restTime: 75
  },
  {
    id: "dumbbell-row",
    name: "Dumbbell Row",
    description: "Single-arm rowing exercise for back development",
    muscleGroups: ["Back", "Arms"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells", "Bench"],
    sets: 3,
    reps: 12,
    restTime: 75
  },
  {
    id: "deadlift",
    name: "Deadlift",
    description: "Compound exercise working multiple muscle groups",
    muscleGroups: ["Back", "Legs", "Glutes"],
    category: "Powerlifting",
    difficulty: "Advanced",
    equipment: ["Barbell"],
    sets: 3,
    reps: 5,
    restTime: 180
  },

  // Leg Exercises
  {
    id: "squat",
    name: "Squat",
    description: "Fundamental lower body compound exercise",
    muscleGroups: ["Legs", "Glutes"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell"],
    sets: 4,
    reps: 10,
    restTime: 120
  },
  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    description: "Basic squat movement using body weight",
    muscleGroups: ["Legs", "Glutes"],
    category: "Bodyweight",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: "lunges",
    name: "Lunges",
    description: "Single-leg exercise for leg and glute development",
    muscleGroups: ["Legs", "Glutes"],
    category: "Bodyweight",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "dumbbell-lunges",
    name: "Dumbbell Lunges",
    description: "Weighted lunge variation for increased resistance",
    muscleGroups: ["Legs", "Glutes"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    id: "leg-press",
    name: "Leg Press",
    description: "Machine-based leg exercise",
    muscleGroups: ["Legs", "Glutes"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Cable Machine"],
    sets: 3,
    reps: 15,
    restTime: 90
  },

  // Shoulder Exercises
  {
    id: "overhead-press",
    name: "Overhead Press",
    description: "Standing barbell press for shoulder development",
    muscleGroups: ["Shoulders", "Arms"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell"],
    sets: 3,
    reps: 8,
    restTime: 120
  },
  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    description: "Seated or standing dumbbell press for shoulders",
    muscleGroups: ["Shoulders", "Arms"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    id: "lateral-raises",
    name: "Lateral Raises",
    description: "Isolation exercise for side deltoids",
    muscleGroups: ["Shoulders"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: "front-raises",
    name: "Front Raises",
    description: "Isolation exercise for front deltoids",
    muscleGroups: ["Shoulders"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60
  },

  // Arm Exercises
  {
    id: "bicep-curls",
    name: "Bicep Curls",
    description: "Classic isolation exercise for biceps",
    muscleGroups: ["Arms"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    description: "Bodyweight exercise for triceps development",
    muscleGroups: ["Arms"],
    category: "Bodyweight",
    difficulty: "Intermediate",
    equipment: ["Bench"],
    sets: 3,
    reps: 10,
    restTime: 75
  },
  {
    id: "hammer-curls",
    name: "Hammer Curls",
    description: "Neutral grip curl for biceps and forearms",
    muscleGroups: ["Arms"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "tricep-overhead-extension",
    name: "Tricep Overhead Extension",
    description: "Overhead movement for triceps isolation",
    muscleGroups: ["Arms"],
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60
  },

  // Core Exercises
  {
    id: "plank",
    name: "Plank",
    description: "Isometric core strengthening exercise",
    muscleGroups: ["Core"],
    category: "Bodyweight",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 1,
    restTime: 60
  },
  {
    id: "crunches",
    name: "Crunches",
    description: "Basic abdominal exercise",
    muscleGroups: ["Core"],
    category: "Bodyweight",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 20,
    restTime: 45
  },
  {
    id: "russian-twists",
    name: "Russian Twists",
    description: "Rotational core exercise",
    muscleGroups: ["Core"],
    category: "Bodyweight",
    difficulty: "Intermediate",
    equipment: [],
    sets: 3,
    reps: 20,
    restTime: 60
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    description: "Dynamic core and cardio exercise",
    muscleGroups: ["Core", "Full Body"],
    category: "HIIT",
    difficulty: "Intermediate",
    equipment: [],
    sets: 3,
    reps: 20,
    restTime: 45
  },

  // Full Body / Cardio
  {
    id: "burpees",
    name: "Burpees",
    description: "Full body high-intensity exercise",
    muscleGroups: ["Full Body"],
    category: "HIIT",
    difficulty: "Advanced",
    equipment: [],
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    description: "Basic cardio warm-up exercise",
    muscleGroups: ["Full Body"],
    category: "Cardio",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 30,
    restTime: 30
  },
  {
    id: "kettlebell-swings",
    name: "Kettlebell Swings",
    description: "Dynamic hip-hinge movement for power",
    muscleGroups: ["Glutes", "Core", "Shoulders"],
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Kettlebells"],
    sets: 3,
    reps: 15,
    restTime: 90
  },
  {
    id: "high-knees",
    name: "High Knees",
    description: "Cardio exercise with high knee lifts",
    muscleGroups: ["Legs", "Core"],
    category: "Cardio",
    difficulty: "Beginner",
    equipment: [],
    sets: 3,
    reps: 30,
    restTime: 30
  }
];
