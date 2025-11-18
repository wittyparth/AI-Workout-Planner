export const WORKOUT_CATEGORIES = [
    "All Categories",
    "Strength",
    "Cardio",
    "Flexibility",
    "HIIT",
    "Bodyweight",
    "Powerlifting"
];

export const MUSCLE_GROUPS = [
    "All Muscle Groups",
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Glutes",
    "Full Body"
];

export const DIFFICULTY_LEVELS = [
    "All Levels",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert"
];

export const EQUIPMENT_TYPES = [
    "All Equipment",
    "No Equipment",
    "Dumbbells",
    "Barbell",
    "Cable Machine",
    "Resistance Bands",
    "Kettlebell",
    "Smith Machine",
    "Pull-up Bar",
    "Bench",
    "Medicine Ball"
];

export const BUILDER_STEPS = [
    {
        id: 1,
        title: "Template Info",
        description: "Basic template details",
        icon: "Target"
    },
    {
        id: 2,
        title: "Weekly Structure",
        description: "Define workout days",
        icon: "Calendar"
    },
    {
        id: 3,
        title: "Add Exercises",
        description: "Build your workouts",
        icon: "Dumbbell"
    },
    {
        id: 4,
        title: "Review & Save",
        description: "Final template review",
        icon: "Save"
    }
];

export const DEFAULT_TEMPLATE_DATA = {
    name: "",
    description: "",
    difficulty: "Intermediate" as const,
    duration: 4,
    goal: "Muscle Building" as const,
    tags: [],
    isPublic: false,
    weeklyPlan: {
        days: {
            monday: {
                id: "monday",
                name: "Monday Workout",
                isRestDay: false,
                focusAreas: [],
                estimatedDuration: 60,
                difficulty: "Intermediate" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            },
            tuesday: {
                id: "tuesday",
                name: "Tuesday Workout",
                isRestDay: false,
                focusAreas: [],
                estimatedDuration: 60,
                difficulty: "Intermediate" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            },
            wednesday: {
                id: "wednesday",
                name: "Wednesday Workout",
                isRestDay: false,
                focusAreas: [],
                estimatedDuration: 60,
                difficulty: "Intermediate" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            },
            thursday: {
                id: "thursday",
                name: "Thursday Workout",
                isRestDay: false,
                focusAreas: [],
                estimatedDuration: 60,
                difficulty: "Intermediate" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            },
            friday: {
                id: "friday",
                name: "Friday Workout",
                isRestDay: false,
                focusAreas: [],
                estimatedDuration: 60,
                difficulty: "Intermediate" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            },
            saturday: {
                id: "saturday",
                name: "Saturday Workout",
                isRestDay: false,
                focusAreas: [],
                estimatedDuration: 60,
                difficulty: "Intermediate" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            },
            sunday: {
                id: "sunday",
                name: "Sunday Rest",
                isRestDay: true,
                focusAreas: [],
                estimatedDuration: 0,
                difficulty: "Beginner" as const,
                exercises: [],
                aiGenerated: false,
                exerciseCount: 0
            }
        }
    }
};
