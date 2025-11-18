const { z } = require("zod");

const variationSchema = z.object({
  name: z.string(),
  description: z.string(),
  exercise_id : z.uuid(),
  gifUrl : z.url(),
  difficulty: z.enum(["easier", "harder", "lateral"])
});

const ExerciseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(100),
  alternativeNames: z.array(z.string()).default([]),
  description: z.string().max(500),

  // Muscle groups
  primaryMuscleGroups: z.array(
    z.enum([
      "chest",
      "back",
      "shoulders",
      "biceps",
      "triceps",
      "forearms",
      "abs",
      "obliques",
      "quadriceps",
      "hamstrings",
      "calves",
      "glutes",
      "trapezius",
      "lats",
      "rhomboids",
      "erector_spinae",
      "hip_flexors",
    ])
  ).min(1),

  secondaryMuscles: z.array(
    z.enum([
      "chest",
      "back",
      "shoulders",
      "biceps",
      "triceps",
      "forearms",
      "abs",
      "obliques",
      "quadriceps",
      "hamstrings",
      "calves",
      "glutes",
      "trapezius",
      "lats",
      "rhomboids",
      "erector_spinae",
      "hip_flexors",
    ])
  ).default([]),

  // Equipment (grouped into professional categories)
  equipment: z.array(
    z.enum([
      "bodyweight",
      "barbell",
      "dumbbell",
      "kettlebell",
      "weight_plate",
      "resistance_band",
      "cable_machine",
      "smith_machine",
      "leg_press_machine",
      "pec_deck_machine",
      "pull_up_bar",
      "dip_station",
      "rings",
      "suspension_trainer",
      "bench",
      "stability_ball",
      "medicine_ball",
      "foam_roller",
      "rowing_machine",
      "treadmill",
      "stationary_bike",
      "elliptical",
      "stair_climber",
    ])
  ).default([]),

  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),

  exerciseType: z.array(
    z.enum([
      "strength",
      "cardio",
      "flexibility",
      "balance",
      "plyometric",
      "powerlifting",
      "olympic_lifting",
      "rehabilitation",
    ])
  ).min(1),

  mechanics: z.enum(["compound", "isolation"]),
  instructions: z.array(z.string()).min(3),
  setupInstructions: z.array(z.string()).default([]),
  tips: z.array(z.string()).default([]),
  commonMistakes: z.array(z.string()).default([]),
  variations: z.array(variationSchema).default([]),

  media: z.object({
    gif: z.object({
      url: z.string(),
    }),
    video: z.object({
      url: z.string(),
    }).optional(),
  }),

  defaultSets: z.number().min(1).max(10).default(3),
  defaultReps: z.number().min(1).max(100),
  defaultRestTime: z.number().min(30).max(1000).default(90),

  tags: z.array(z.string()).default([]),

  category: z.array(
    z.enum([
      "push",
      "pull",
      "legs",
      "upper_body",
      "lower_body",
      "full_body",
      "core",
      "cardio",
      "flexibility",
      "warmup",
      "cooldown",
      "rehab",
    ])
  ),

  calories: z.object({
    perMinute: z.number().min(0),
    perRep: z.number().min(0),
  }).default({ perMinute: 0, perRep: 0 }),

  isActive: z.boolean().default(true),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  version: z.string().default("1.0.0"),
});

module.exports = ExerciseSchema;
