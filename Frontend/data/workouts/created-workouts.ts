import { ExerciseData } from "@/app/templates/builder/data/exercises";

export interface CreatedWorkout {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: number;
  targetAudience: string;
  exercises: ExerciseData[];
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
  tags: string[];
  rating?: number;
  completions: number;
}

// Sample created workouts data (in a real app, this would come from a database)
export const createdWorkouts: CreatedWorkout[] = [
  {
    id: "custom-1",
    name: "Quick Morning Energizer",
    description: "A quick 15-minute workout to start your day with energy",
    category: "Bodyweight",
    difficulty: "Beginner",
    estimatedDuration: 15,
    targetAudience: "General Fitness",
    exercises: [
      {
        id: "jumping-jacks",
        name: "Jumping Jacks",
        description: "Classic cardio warm-up exercise",
        muscleGroups: ["Full Body"],
        category: "Cardio",
        difficulty: "Beginner",
        equipment: [],
        sets: 3,
        reps: 20,
        restTime: 30
      },
      {
        id: "push-up",
        name: "Push-ups",
        description: "Classic bodyweight exercise for chest, shoulders, and triceps",
        muscleGroups: ["Chest", "Shoulders", "Arms"],
        category: "Bodyweight",
        difficulty: "Beginner",
        equipment: [],
        sets: 3,
        reps: 10,
        restTime: 45
      },
      {
        id: "bodyweight-squat",
        name: "Bodyweight Squats",
        description: "Basic squat movement for lower body strength",
        muscleGroups: ["Legs", "Glutes"],
        category: "Bodyweight",
        difficulty: "Beginner",
        equipment: [],
        sets: 3,
        reps: 15,
        restTime: 45
      }
    ],
    createdAt: new Date("2024-12-01"),
    lastModified: new Date("2024-12-01"),
    isPublic: false,
    tags: ["morning", "quick", "energizing"],
    rating: 4.5,
    completions: 12
  },
  {
    id: "custom-2",
    name: "Upper Body Power",
    description: "Intensive upper body strength workout using dumbbells",
    category: "Strength Training",
    difficulty: "Intermediate",
    estimatedDuration: 45,
    targetAudience: "Muscle Building",
    exercises: [
      {
        id: "dumbbell-chest-press",
        name: "Dumbbell Chest Press",
        description: "Dumbbell variation of chest press for better muscle activation",
        muscleGroups: ["Chest", "Shoulders", "Arms"],
        category: "Strength",
        difficulty: "Intermediate",
        equipment: ["Dumbbells", "Bench"],
        sets: 4,
        reps: 8,
        weight: "70% 1RM",
        restTime: 90
      },
      {
        id: "dumbbell-rows",
        name: "Dumbbell Rows",
        description: "Single-arm dumbbell rows for back development",
        muscleGroups: ["Back", "Arms"],
        category: "Strength",
        difficulty: "Intermediate",
        equipment: ["Dumbbells", "Bench"],
        sets: 4,
        reps: 10,
        weight: "65% 1RM",
        restTime: 90
      },
      {
        id: "shoulder-press",
        name: "Dumbbell Shoulder Press",
        description: "Overhead press for shoulder development",
        muscleGroups: ["Shoulders", "Arms"],
        category: "Strength",
        difficulty: "Intermediate",
        equipment: ["Dumbbells"],
        sets: 3,
        reps: 12,
        weight: "60% 1RM",
        restTime: 75
      }
    ],
    createdAt: new Date("2024-11-28"),
    lastModified: new Date("2024-11-30"),
    isPublic: true,
    tags: ["strength", "upper-body", "dumbbells"],
    rating: 4.8,
    completions: 25
  }
];

// Helper functions for workout management
export const saveWorkout = (workout: Omit<CreatedWorkout, 'id' | 'createdAt' | 'lastModified' | 'completions'>) => {
  const newWorkout: CreatedWorkout = {
    ...workout,
    id: `custom-${Date.now()}`,
    createdAt: new Date(),
    lastModified: new Date(),
    completions: 0
  };
  
  // In a real app, this would save to a database
  createdWorkouts.push(newWorkout);
  return newWorkout;
};

export const updateWorkout = (id: string, updates: Partial<CreatedWorkout>) => {
  const index = createdWorkouts.findIndex(w => w.id === id);
  if (index !== -1) {
    createdWorkouts[index] = {
      ...createdWorkouts[index],
      ...updates,
      lastModified: new Date()
    };
    return createdWorkouts[index];
  }
  return null;
};

export const deleteWorkout = (id: string) => {
  const index = createdWorkouts.findIndex(w => w.id === id);
  if (index !== -1) {
    return createdWorkouts.splice(index, 1)[0];
  }
  return null;
};

export const getWorkoutById = (id: string) => {
  return createdWorkouts.find(w => w.id === id);
};

export const getUserWorkouts = (userId?: string) => {
  // In a real app, this would filter by user ID
  return createdWorkouts;
};
