import { WorkoutTemplate } from "@/lib/types/template"

export const SAMPLE_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "beginner-full-body",
    name: "Beginner Full Body Strength",
    description: "A comprehensive 3-day full body routine perfect for beginners to build strength and muscle",
    difficulty: "Beginner",
    duration: 8,
    goal: "Strength",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    isPublic: true,
    tags: ["Full Body", "Beginner", "Strength", "3 Days"],
    rating: 4.8,
    reviews: 156,
    thumbnail: "/gym-upper-body-workout.jpg",
    authorId: "system",
    authorName: "FitFlow AI",
    timesUsed: 2341,
    averageRating: 4.8,
    weeklyPlan: {
      days: {
        monday: {
          id: "mon-full-body",
          name: "Full Body Strength A",
          isRestDay: false,
          focusAreas: ["Chest", "Back", "Legs"],
          estimatedDuration: 45,
          difficulty: "Beginner",
          exercises: [
            {
              id: "ex1",
              exerciseId: "squat",
              name: "Squat (Bodyweight)",
              sets: 3,
              reps: 12,
              weight: "bodyweight",
              restTime: 90,
              intensity: "Moderate",
              rpe: 7,
              isSuperset: false,
              alternatives: ["Goblet Squat", "Chair Squat"],
              muscleGroups: ["Quads", "Glutes"],
              equipment: ["Bodyweight"],
              order: 1,
              progressionOptions: [
                {
                  type: "reps",
                  increment: 2,
                  condition: "weekly",
                  description: "Add 2 reps each week"
                }
              ]
            },
            {
              id: "ex2",
              exerciseId: "push-ups",
              name: "Push-ups",
              sets: 3,
              reps: 8,
              weight: "bodyweight",
              restTime: 90,
              intensity: "Moderate",
              rpe: 7,
              isSuperset: false,
              alternatives: ["Incline Push-ups", "Knee Push-ups"],
              muscleGroups: ["Chest", "Triceps"],
              equipment: ["Bodyweight"],
              order: 2,
              progressionOptions: [
                {
                  type: "reps",
                  increment: 1,
                  condition: "weekly",
                  description: "Add 1 rep each week"
                }
              ]
            },
            {
              id: "ex3",
              exerciseId: "dumbbell-rows",
              name: "Dumbbell Rows",
              sets: 3,
              reps: 10,
              weight: 15,
              restTime: 90,
              intensity: "Moderate",
              rpe: 7,
              isSuperset: false,
              alternatives: ["Inverted Rows", "Resistance Band Rows"],
              muscleGroups: ["Back", "Biceps"],
              equipment: ["Dumbbell"],
              order: 3,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 2.5,
                  condition: "weekly",
                  description: "Add 2.5lbs each week"
                }
              ]
            },
            {
              id: "ex4",
              exerciseId: "plank",
              name: "Plank",
              sets: 3,
              reps: 30,
              weight: "bodyweight",
              restTime: 60,
              intensity: "Moderate",
              rpe: 6,
              isSuperset: false,
              alternatives: ["Modified Plank", "Wall Plank"],
              muscleGroups: ["Core"],
              equipment: ["Bodyweight"],
              order: 4,
              progressionOptions: [
                {
                  type: "time",
                  increment: 5,
                  condition: "weekly",
                  description: "Add 5 seconds each week"
                }
              ]
            }
          ],
          warmup: [
            {
              id: "warmup1",
              exerciseId: "arm-circles",
              name: "Arm Circles",
              sets: 1,
              reps: 10,
              weight: "bodyweight",
              restTime: 0,
              isSuperset: false,
              alternatives: [],
              muscleGroups: ["Shoulders"],
              equipment: ["Bodyweight"],
              order: 1
            }
          ],
          notes: "Focus on proper form over weight. Rest 1-2 minutes between sets.",
          aiGenerated: false,
          totalVolume: 450,
          exerciseCount: 4
        },
        tuesday: {
          id: "tue-rest",
          name: "Rest Day",
          isRestDay: true,
          focusAreas: [],
          estimatedDuration: 0,
          difficulty: "Beginner",
          exercises: [],
          notes: "Light walking or stretching recommended",
          aiGenerated: false,
          exerciseCount: 0
        },
        wednesday: {
          id: "wed-full-body",
          name: "Full Body Strength B",
          isRestDay: false,
          focusAreas: ["Shoulders", "Arms", "Core"],
          estimatedDuration: 45,
          difficulty: "Beginner",
          exercises: [
            {
              id: "ex5",
              exerciseId: "overhead-press",
              name: "Overhead Press (Dumbbell)",
              sets: 3,
              reps: 8,
              weight: 10,
              restTime: 90,
              intensity: "Moderate",
              rpe: 7,
              isSuperset: false,
              alternatives: ["Pike Push-ups", "Resistance Band Press"],
              muscleGroups: ["Shoulders", "Triceps"],
              equipment: ["Dumbbell"],
              order: 1,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 2.5,
                  condition: "weekly",
                  description: "Add 2.5lbs each week"
                }
              ]
            }
          ],
          notes: "Focus on controlled movements and proper breathing",
          aiGenerated: false,
          totalVolume: 240,
          exerciseCount: 1
        },
        thursday: {
          id: "thu-rest",
          name: "Rest Day",
          isRestDay: true,
          focusAreas: [],
          estimatedDuration: 0,
          difficulty: "Beginner",
          exercises: [],
          notes: "Active recovery - light yoga or walking",
          aiGenerated: false,
          exerciseCount: 0
        },
        friday: {
          id: "fri-full-body",
          name: "Full Body Strength C",
          isRestDay: false,
          focusAreas: ["Legs", "Back", "Core"],
          estimatedDuration: 45,
          difficulty: "Beginner",
          exercises: [
            {
              id: "ex6",
              exerciseId: "deadlift",
              name: "Romanian Deadlift (Dumbbell)",
              sets: 3,
              reps: 10,
              weight: 20,
              restTime: 120,
              intensity: "Moderate",
              rpe: 7,
              isSuperset: false,
              alternatives: ["Good Mornings", "Single-leg RDL"],
              muscleGroups: ["Hamstrings", "Glutes", "Back"],
              equipment: ["Dumbbell"],
              order: 1,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 5,
                  condition: "weekly",
                  description: "Add 5lbs each week"
                }
              ]
            }
          ],
          notes: "Focus on hip hinge movement pattern",
          aiGenerated: false,
          totalVolume: 600,
          exerciseCount: 1
        },
        saturday: {
          id: "sat-rest",
          name: "Rest Day",
          isRestDay: true,
          focusAreas: [],
          estimatedDuration: 0,
          difficulty: "Beginner",
          exercises: [],
          notes: "Complete rest or light stretching",
          aiGenerated: false,
          exerciseCount: 0
        },
        sunday: {
          id: "sun-rest",
          name: "Rest Day",
          isRestDay: true,
          focusAreas: [],
          estimatedDuration: 0,
          difficulty: "Beginner",
          exercises: [],
          notes: "Prepare for the upcoming week",
          aiGenerated: false,
          exerciseCount: 0
        }
      }
    },
    metadata: {
      totalExercises: 6,
      totalSets: 12,
      weeklyVolume: 1290,
      muscleGroupDistribution: {
        "Chest": 1,
        "Back": 2,
        "Shoulders": 1,
        "Arms": 2,
        "Legs": 2,
        "Core": 1
      },
      equipmentRequired: ["Bodyweight", "Dumbbell"],
      estimatedWeeklyDuration: 135,
      restDaysPerWeek: 4,
      workoutDaysPerWeek: 3,
      // Additional properties for template page
      primaryMuscles: ["Chest", "Back", "Legs", "Core"],
      difficulty: "beginner",
      category: "strength",
      equipment: ["Bodyweight", "Dumbbell"]
    }
  },
  {
    id: "intermediate-push-pull",
    name: "Intermediate Push/Pull/Legs",
    description: "A 6-day intermediate split focusing on push, pull, and leg movements for serious muscle building",
    difficulty: "Intermediate",
    duration: 12,
    goal: "Muscle Building",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    isPublic: true,
    tags: ["Push/Pull/Legs", "Intermediate", "Muscle Building", "6 Days"],
    rating: 4.9,
    reviews: 89,
    thumbnail: "/leg-day-workout.png",
    authorId: "trainer-1",
    authorName: "Coach Sarah",
    timesUsed: 1205,
    averageRating: 4.9,
    weeklyPlan: {
      days: {
        monday: {
          id: "mon-push",
          name: "Push Day - Chest Focus",
          isRestDay: false,
          focusAreas: ["Chest", "Shoulders", "Triceps"],
          estimatedDuration: 75,
          difficulty: "Intermediate",
          exercises: [
            {
              id: "ex7",
              exerciseId: "bench-press",
              name: "Bench Press (Barbell)",
              sets: 4,
              reps: 8,
              weight: 135,
              restTime: 180,
              intensity: "Heavy",
              rpe: 8,
              isSuperset: false,
              alternatives: ["Dumbbell Bench Press", "Incline Bench Press"],
              muscleGroups: ["Chest", "Triceps", "Shoulders"],
              equipment: ["Barbell", "Bench"],
              order: 1,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 5,
                  condition: "weekly",
                  description: "Add 5lbs when all sets completed with good form"
                }
              ]
            }
          ],
          notes: "Focus on progressive overload and proper form",
          aiGenerated: false,
          totalVolume: 4320,
          exerciseCount: 1
        },
        tuesday: {
          id: "tue-pull",
          name: "Pull Day - Back Focus",
          isRestDay: false,
          focusAreas: ["Back", "Biceps"],
          estimatedDuration: 75,
          difficulty: "Intermediate",
          exercises: [
            {
              id: "ex8",
              exerciseId: "pull-ups",
              name: "Pull-ups",
              sets: 4,
              reps: 6,
              weight: "bodyweight",
              restTime: 180,
              intensity: "Heavy",
              rpe: 8,
              isSuperset: false,
              alternatives: ["Lat Pulldown", "Assisted Pull-ups"],
              muscleGroups: ["Back", "Biceps"],
              equipment: ["Pull-up Bar"],
              order: 1,
              progressionOptions: [
                {
                  type: "reps",
                  increment: 1,
                  condition: "weekly",
                  description: "Add 1 rep when possible"
                }
              ]
            }
          ],
          notes: "Focus on quality reps over quantity",
          aiGenerated: false,
          totalVolume: 0,
          exerciseCount: 1
        },
        wednesday: {
          id: "wed-legs",
          name: "Leg Day - Quad Focus",
          isRestDay: false,
          focusAreas: ["Legs", "Glutes"],
          estimatedDuration: 90,
          difficulty: "Intermediate",
          exercises: [
            {
              id: "ex9",
              exerciseId: "squat",
              name: "Squat (Barbell)",
              sets: 4,
              reps: 8,
              weight: 185,
              restTime: 180,
              intensity: "Heavy",
              rpe: 8,
              isSuperset: false,
              alternatives: ["Front Squat", "Leg Press"],
              muscleGroups: ["Quads", "Glutes"],
              equipment: ["Barbell", "Squat Rack"],
              order: 1,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 10,
                  condition: "weekly",
                  description: "Add 10lbs when form is perfect"
                }
              ]
            }
          ],
          notes: "Prioritize depth and control over weight",
          aiGenerated: false,
          totalVolume: 5920,
          exerciseCount: 1
        },
        thursday: {
          id: "thu-push",
          name: "Push Day - Shoulder Focus",
          isRestDay: false,
          focusAreas: ["Shoulders", "Chest", "Triceps"],
          estimatedDuration: 75,
          difficulty: "Intermediate",
          exercises: [
            {
              id: "ex10",
              exerciseId: "overhead-press",
              name: "Overhead Press (Barbell)",
              sets: 4,
              reps: 6,
              weight: 95,
              restTime: 180,
              intensity: "Heavy",
              rpe: 8,
              isSuperset: false,
              alternatives: ["Dumbbell Shoulder Press", "Pike Push-ups"],
              muscleGroups: ["Shoulders", "Triceps"],
              equipment: ["Barbell"],
              order: 1,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 5,
                  condition: "weekly",
                  description: "Add 5lbs when all reps completed"
                }
              ]
            }
          ],
          notes: "Strict form is essential for shoulder health",
          aiGenerated: false,
          totalVolume: 2280,
          exerciseCount: 1
        },
        friday: {
          id: "fri-pull",
          name: "Pull Day - Deadlift Focus",
          isRestDay: false,
          focusAreas: ["Back", "Hamstrings", "Glutes"],
          estimatedDuration: 75,
          difficulty: "Intermediate",
          exercises: [
            {
              id: "ex11",
              exerciseId: "deadlift",
              name: "Deadlift (Barbell)",
              sets: 3,
              reps: 5,
              weight: 225,
              restTime: 240,
              intensity: "Heavy",
              rpe: 9,
              isSuperset: false,
              alternatives: ["Romanian Deadlift", "Sumo Deadlift"],
              muscleGroups: ["Back", "Hamstrings", "Glutes"],
              equipment: ["Barbell"],
              order: 1,
              progressionOptions: [
                {
                  type: "weight",
                  increment: 10,
                  condition: "weekly",
                  description: "Add 10lbs when form is perfect"
                }
              ]
            }
          ],
          notes: "Focus on perfect form and gradual progression",
          aiGenerated: false,
          totalVolume: 3375,
          exerciseCount: 1
        },
        saturday: {
          id: "sat-legs",
          name: "Leg Day - Posterior Chain",
          isRestDay: false,
          focusAreas: ["Hamstrings", "Glutes", "Calves"],
          estimatedDuration: 75,
          difficulty: "Intermediate",
          exercises: [],
          notes: "Focus on hamstring and glute development",
          aiGenerated: false,
          totalVolume: 0,
          exerciseCount: 0
        },
        sunday: {
          id: "sun-rest",
          name: "Rest Day",
          isRestDay: true,
          focusAreas: [],
          estimatedDuration: 0,
          difficulty: "Intermediate",
          exercises: [],
          notes: "Complete rest and recovery",
          aiGenerated: false,
          exerciseCount: 0
        }
      }
    },
    metadata: {
      totalExercises: 5,
      totalSets: 19,
      weeklyVolume: 15895,
      muscleGroupDistribution: {
        "Chest": 2,
        "Back": 3,
        "Shoulders": 2,
        "Arms": 3,
        "Legs": 3,
        "Glutes": 2
      },
      equipmentRequired: ["Barbell", "Bench", "Squat Rack", "Pull-up Bar"],
      estimatedWeeklyDuration: 465,
      restDaysPerWeek: 1,
      workoutDaysPerWeek: 6,
      // Additional properties for template page
      primaryMuscles: ["Chest", "Back", "Legs", "Shoulders"],
      difficulty: "intermediate",
      category: "bodybuilding",
      equipment: ["Barbell", "Bench", "Squat Rack", "Pull-up Bar"]
    }
  }
]

export const FEATURED_TEMPLATES = SAMPLE_TEMPLATES.slice(0, 3)
