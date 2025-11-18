import { ExerciseDatabase } from "@/lib/types/template"

export const SAMPLE_EXERCISES: ExerciseDatabase[] = [
  {
    id: "bench-press",
    name: "Bench Press (Barbell)",
    primaryMuscleGroups: ["Chest"],
    secondaryMuscleGroups: ["Triceps", "Shoulders"],
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    type: "Compound",
    movementPattern: "Push",
    instructions: [
      "Lie flat on bench with eyes under the bar",
      "Grip bar slightly wider than shoulder width",
      "Unrack the bar and position over chest",
      "Lower bar to chest with control",
      "Press bar up explosively to starting position"
    ],
    tips: [
      "Keep core engaged throughout movement",
      "Control the negative portion",
      "Full range of motion for best results",
      "Keep shoulders retracted and down"
    ],
    alternatives: ["Dumbbell Bench Press", "Push-ups", "Incline Bench Press"],
    commonMistakes: [
      "Bouncing bar off chest",
      "Arching back excessively",
      "Uneven grip width"
    ],
    safetyNotes: [
      "Always use a spotter when possible",
      "Start with empty barbell to learn form",
      "Use safety bars when training alone"
    ],
    variations: ["Incline Bench Press", "Decline Bench Press", "Close-Grip Bench Press"]
  },
  {
    id: "squat",
    name: "Squat (Barbell)",
    primaryMuscleGroups: ["Quads", "Glutes"],
    secondaryMuscleGroups: ["Core", "Hamstrings"],
    equipment: ["Barbell", "Squat Rack"],
    difficulty: "Intermediate",
    type: "Compound",
    movementPattern: "Squat",
    instructions: [
      "Position bar on upper back, not neck",
      "Step back from rack with feet shoulder-width apart",
      "Keep chest up and core braced",
      "Descend by pushing hips back and bending knees",
      "Go down until hips are below knees",
      "Drive through heels to return to starting position"
    ],
    tips: [
      "Keep knees tracking over toes",
      "Maintain neutral spine",
      "Full depth for maximum benefit",
      "Control the descent"
    ],
    alternatives: ["Goblet Squat", "Front Squat", "Leg Press"],
    commonMistakes: [
      "Knees caving inward",
      "Not going deep enough",
      "Forward lean"
    ],
    safetyNotes: [
      "Use safety bars at appropriate height",
      "Warm up thoroughly",
      "Learn bodyweight squat first"
    ],
    variations: ["Front Squat", "Overhead Squat", "Box Squat"]
  },
  {
    id: "deadlift",
    name: "Deadlift (Barbell)",
    primaryMuscleGroups: ["Back", "Glutes", "Hamstrings"],
    secondaryMuscleGroups: ["Traps", "Core", "Forearms"],
    equipment: ["Barbell"],
    difficulty: "Advanced",
    type: "Compound",
    movementPattern: "Hinge",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip bar",
      "Keep chest up and shoulders back",
      "Drive through heels and extend hips",
      "Stand tall with shoulders back",
      "Reverse movement to lower bar"
    ],
    tips: [
      "Keep bar close to body",
      "Engage lats to protect spine",
      "Drive hips forward at top",
      "Control the descent"
    ],
    alternatives: ["Romanian Deadlift", "Sumo Deadlift", "Trap Bar Deadlift"],
    commonMistakes: [
      "Bar drifting away from body",
      "Rounding lower back",
      "Hyperextending at top"
    ],
    safetyNotes: [
      "Master hip hinge pattern first",
      "Start with lighter weight",
      "Consider using lifting belt for heavy loads"
    ],
    variations: ["Sumo Deadlift", "Romanian Deadlift", "Stiff Leg Deadlift"]
  },
  {
    id: "push-ups",
    name: "Push-ups",
    primaryMuscleGroups: ["Chest"],
    secondaryMuscleGroups: ["Triceps", "Shoulders", "Core"],
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    type: "Compound",
    movementPattern: "Push",
    instructions: [
      "Start in plank position with hands under shoulders",
      "Keep body in straight line from head to heels",
      "Lower chest to ground with control",
      "Push through palms to return to start",
      "Maintain tight core throughout"
    ],
    tips: [
      "Perfect form over speed",
      "Full range of motion",
      "Engage core throughout",
      "Keep head neutral"
    ],
    alternatives: ["Incline Push-ups", "Knee Push-ups", "Bench Press"],
    commonMistakes: [
      "Sagging hips",
      "Flaring elbows too wide",
      "Partial range of motion"
    ],
    safetyNotes: [
      "Start with incline version if needed",
      "Build up gradually",
      "Stop if wrists hurt"
    ],
    variations: ["Diamond Push-ups", "Wide-Grip Push-ups", "Decline Push-ups"]
  },
  {
    id: "pull-ups",
    name: "Pull-ups",
    primaryMuscleGroups: ["Back", "Lats"],
    secondaryMuscleGroups: ["Biceps", "Forearms"],
    equipment: ["Pull-up Bar"],
    difficulty: "Intermediate",
    type: "Compound",
    movementPattern: "Pull",
    instructions: [
      "Hang from bar with overhand grip",
      "Hands slightly wider than shoulders",
      "Pull chest toward bar",
      "Lead with chest, not chin",
      "Lower with control to full extension"
    ],
    tips: [
      "Engage lats throughout movement",
      "Avoid swinging or kipping",
      "Focus on quality over quantity",
      "Control the negative"
    ],
    alternatives: ["Lat Pulldown", "Assisted Pull-ups", "Inverted Rows"],
    commonMistakes: [
      "Not going full range",
      "Using momentum",
      "Neck strain from chin focus"
    ],
    safetyNotes: [
      "Build up gradually",
      "Use assistance if needed",
      "Warm up shoulders thoroughly"
    ],
    variations: ["Chin-ups", "Wide-Grip Pull-ups", "Neutral Grip Pull-ups"]
  },
  {
    id: "overhead-press",
    name: "Overhead Press (Barbell)",
    primaryMuscleGroups: ["Shoulders"],
    secondaryMuscleGroups: ["Triceps", "Core"],
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    type: "Compound",
    movementPattern: "Push",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Grip bar at shoulder width",
      "Start with bar at shoulder height",
      "Press bar straight overhead",
      "Lock out arms at top",
      "Lower with control to shoulders"
    ],
    tips: [
      "Keep core tight",
      "Press in straight line",
      "Don't arch back excessively",
      "Full lockout at top"
    ],
    alternatives: ["Dumbbell Shoulder Press", "Seated Overhead Press", "Pike Push-ups"],
    commonMistakes: [
      "Pressing forward instead of up",
      "Excessive back arch",
      "Not engaging core"
    ],
    safetyNotes: [
      "Check shoulder mobility first",
      "Start with empty bar",
      "Avoid if shoulder issues"
    ],
    variations: ["Seated Overhead Press", "Single-Arm Press", "Push Press"]
  },
  {
    id: "plank",
    name: "Plank",
    primaryMuscleGroups: ["Core"],
    secondaryMuscleGroups: ["Shoulders", "Back"],
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    type: "Isolation",
    movementPattern: "Carry",
    instructions: [
      "Start in push-up position",
      "Lower to forearms",
      "Keep body in straight line",
      "Hold position while breathing normally",
      "Engage core throughout"
    ],
    tips: [
      "Don't hold breath",
      "Keep hips level",
      "Engage glutes",
      "Focus on form over time"
    ],
    alternatives: ["Side Plank", "Dead Bug", "Mountain Climbers"],
    commonMistakes: [
      "Sagging hips",
      "Raised hips",
      "Holding breath"
    ],
    safetyNotes: [
      "Start with shorter holds",
      "Stop if lower back hurts",
      "Build time gradually"
    ],
    variations: ["Side Plank", "Plank Up-Downs", "Plank with Leg Lifts"]
  },
  {
    id: "dumbbell-rows",
    name: "Dumbbell Rows",
    primaryMuscleGroups: ["Back", "Lats"],
    secondaryMuscleGroups: ["Biceps", "Rear Deltoids"],
    equipment: ["Dumbbell", "Bench"],
    difficulty: "Beginner",
    type: "Compound",
    movementPattern: "Pull",
    instructions: [
      "Place one knee and hand on bench",
      "Hold dumbbell in opposite hand",
      "Keep back straight and parallel to floor",
      "Pull dumbbell to lower ribs",
      "Squeeze shoulder blades together",
      "Lower with control"
    ],
    tips: [
      "Lead with elbow",
      "Keep core engaged",
      "Don't rotate torso",
      "Feel stretch at bottom"
    ],
    alternatives: ["Barbell Rows", "Cable Rows", "T-Bar Rows"],
    commonMistakes: [
      "Using too much arm",
      "Rotating body",
      "Not squeezing shoulder blades"
    ],
    safetyNotes: [
      "Support body properly",
      "Don't round back",
      "Start with lighter weight"
    ],
    variations: ["Two-Arm Dumbbell Rows", "Renegade Rows", "Single-Arm Cable Rows"]
  }
]

export const MUSCLE_GROUP_COLORS = {
  "Chest": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Back": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Shoulders": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Arms": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Legs": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Core": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Glutes": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  "Biceps": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Triceps": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Quads": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  "Hamstrings": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  "Calves": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
  "Lats": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
  "Traps": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
  "Deltoids": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Forearms": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
}
