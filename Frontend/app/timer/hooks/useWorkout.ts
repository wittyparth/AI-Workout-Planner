import React from 'react'
import { useState } from 'react'

const useWorkout = () => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
      const [currentSetIndex, setCurrentSetIndex] = useState(0)
      const [isResting, setIsResting] = useState(false)
      const [restTime, setRestTime] = useState(90)
      const [customRestTime, setCustomRestTime] = useState(90)
      const [isTimerRunning, setIsTimerRunning] = useState(false)
      const [workoutSets, setWorkoutSets] = useState<Record<string, any[]>>({})
      const [editingSet, setEditingSet] = useState<number | null>(null)
      const [workoutStartTime] = useState(Date.now())
      const [showStats, setShowStats] = useState(false)
      const [showExerciseDetails, setShowExerciseDetails] = useState(false)
      const sampleWorkout = [
  {
    id: "1",
    name: "Bench Press (Barbell)",
    sets: 4,
    muscle: "Chest",
    equipment: "Barbell",
    personalRecord: { weight: 225, reps: 8 },
    lastWorkout: {
      sets: [
        { weight: 135, reps: 12, rpe: 7, restTime: 90 },
        { weight: 155, reps: 10, rpe: 8, restTime: 120 },
        { weight: 175, reps: 8, rpe: 9, restTime: 120 },
        { weight: 185, reps: 6, rpe: 9.5, restTime: 90 }
      ]
    },
    tips: ["Keep core engaged", "Control the negative", "Full range of motion"],
    targetMuscles: ["Chest", "Triceps", "Anterior Deltoids"]
  },
  {
    id: "2",
    name: "Incline Dumbbell Press",
    sets: 3,
    muscle: "Chest",
    equipment: "Dumbbells",
    personalRecord: { weight: 80, reps: 10 },
    lastWorkout: {
      sets: [
        { weight: 60, reps: 12, rpe: 7, restTime: 90 },
        { weight: 65, reps: 10, rpe: 8, restTime: 90 },
        { weight: 70, reps: 8, rpe: 8.5, restTime: 90 }
      ]
    },
    tips: ["Squeeze chest at top", "45-degree angle", "Control the weight"],
    targetMuscles: ["Upper Chest", "Triceps", "Anterior Deltoids"]
  },
  {
    id: "3",
    name: "Push-ups",
    sets: 3,
    muscle: "Chest",
    equipment: "Bodyweight",
    personalRecord: { weight: 0, reps: 25 },
    lastWorkout: {
      sets: [
        { weight: 0, reps: 15, rpe: 6, restTime: 60 },
        { weight: 0, reps: 12, rpe: 7, restTime: 60 },
        { weight: 0, reps: 10, rpe: 8, restTime: 60 }
      ]
    },
    tips: ["Perfect form over speed", "Full extension", "Engage core"],
    targetMuscles: ["Chest", "Triceps", "Core"]
  }
]

      const currentExercise = sampleWorkout[currentExerciseIndex]
  const exerciseSets = workoutSets[currentExercise.id] || []

      const completeSet = (setIndex: number) => {
    const updatedSets = [...exerciseSets]
    updatedSets[setIndex] = { ...updatedSets[setIndex], completed: true, completedAt: Date.now() }
    setWorkoutSets(prev => ({
      ...prev,
      [currentExercise.id]: updatedSets
    }))

    if (setIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(setIndex + 1)
      setIsResting(true)
      setRestTime(customRestTime)
      setIsTimerRunning(true)
    } else {
      nextExercise()
    }
    setEditingSet(null)
  }
  return 
}

export default useWorkout