import { stat } from "fs";
import { useEffect, useReducer } from "react";
import producer, { produce } from "immer"

type exerciseType = {
    id: number;
    name: string;
    sets: number;
    muscle: string;
    equipment: string;
    personalRecord: { weight: number; reps: number };
    setDetails : {sets: { weight: number; reps: number; rpe: number; restTime: number,completed:boolean,date : Date | null }[]};
    tips: string[];
    targetMuscles: string[];
  }

type initialStateType = {
  workout: exerciseType[],
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTime: number;
  customRestTime: number;
  isTimerRunning: boolean;
  editingSet: number | null;
  workoutStartTime: number;
  showStats: boolean;
  showExerciseDetails: boolean;
};
const useTimer = () => {

  const sampleWorkout = [
    {
      id: 1,
      name: "Bench Press (Barbell)",
      sets: 4,
      muscle: "Chest",
      equipment: "Barbell",
      personalRecord: { weight: 225, reps: 8 },
      setDetails: {
        sets: [
          { weight: 135, reps: 12, rpe: 7, restTime: 90, completed : false,date : null },
          { weight: 155, reps: 10, rpe: 8, restTime: 120, completed : false,date : null },
          { weight: 175, reps: 8, rpe: 9, restTime: 120, completed : false,date : null },
          { weight: 185, reps: 6, rpe: 9.5, restTime: 90, completed : false,date : null },
        ],
      },
      tips: [
        "Keep core engaged",
        "Control the negative",
        "Full range of motion",
      ],
      targetMuscles: ["Chest", "Triceps", "Anterior Deltoids"],
    },
    {
      id: 2,
      name: "Incline Dumbbell Press",
      sets: 3,
      muscle: "Chest",
      equipment: "Dumbbells",
      personalRecord: { weight: 80, reps: 10 },
      setDetails: {
        sets: [
          { weight: 60, reps: 12, rpe: 7, restTime: 90, completed : false,date : null },
          { weight: 65, reps: 10, rpe: 8, restTime: 90, completed : false,date : null },
          { weight: 70, reps: 8, rpe: 8.5, restTime: 90, completed : false,date : null },
        ],
      },
      tips: ["Squeeze chest at top", "45-degree angle", "Control the weight"],
      targetMuscles: ["Upper Chest", "Triceps", "Anterior Deltoids"],
    },
    {
      id: 3,
      name: "Push-ups",
      sets: 3,
      muscle: "Chest",
      equipment: "Bodyweight",
      personalRecord: { weight: 0, reps: 25 },
      setDetails: {
        sets: [
          { weight: 0, reps: 15, rpe: 6, restTime: 60, completed : false,date : null },
          { weight: 0, reps: 12, rpe: 7, restTime: 60, completed : false,date : null },
          { weight: 0, reps: 10, rpe: 8, restTime: 60, completed : false,date : null },
        ],
      },
      tips: ["Perfect form over speed", "Full extension", "Engage core"],
      targetMuscles: ["Chest", "Triceps", "Core"],
    },
  ];

  const initialState: initialStateType = {
    workout : sampleWorkout,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    isResting: false,
    customRestTime: 90,
    restTime: 90,
    isTimerRunning: false,
    editingSet: null,
    workoutStartTime: Date.now(),
    showStats: false,
    showExerciseDetails: false,
  };

  const workoutReducer = (state:initialStateType,payload:any):initialStateType => {
    return produce(state, (draft) => {
    switch (payload.type) {
        case "COMPLETE_SET":
          let foundExercise = draft.workout.find((item) => item.id == draft.currentExerciseIndex);
          if (foundExercise) {
            foundExercise.setDetails.sets[draft.currentSetIndex].completed = true;
          }
          let exercise = draft.workout.find((item) => item.id == draft.currentExerciseIndex);
          if (exercise) {
            exercise.setDetails.sets[draft.currentSetIndex].date = new Date();
          }
          if(draft.currentSetIndex < draft.workout[draft.currentExerciseIndex].sets-1){
            draft.currentSetIndex+=1;
            draft.isResting = true
            draft.restTime = draft.customRestTime
            draft.isTimerRunning = true
          }
          else{
            if(draft.currentExerciseIndex < draft.workout.length-1){
              draft.currentExerciseIndex++
              draft.currentSetIndex=0
              draft.isResting = false
              draft.isTimerRunning = false
            }
          }
        case "SKIP_SET":
          if (exercise) {
            exercise.setDetails.sets[draft.currentSetIndex].date = new Date();
          }
        case "NEXT_EXERCISE":
          if(draft.currentExerciseIndex < draft.workout.length-1){
              draft.currentExerciseIndex++
              draft.currentSetIndex=0
              draft.isResting = false
              draft.isTimerRunning = false
            }
        case "SKIP_EXERCISE":
          if(draft.currentExerciseIndex < draft.workout.length-1){
              draft.currentExerciseIndex++
              draft.currentSetIndex=0
              draft.isResting = false
              draft.isTimerRunning = false
            }
        case "UPDATE_SET":
          exercise = draft.workout.find((item) => item.id == draft.currentExerciseIndex);
          if (exercise) {
            const set = exercise.setDetails.sets[payload.setIndex];
            if (set && typeof payload.field === "string" && payload.field in set) {
              (set as any)[payload.field] = payload.value;
            }
          }
        case "START_REST":
        case "STOP_REST":
        default : return state
    }
    })
  }

  const [workoutData, dispatch] = useReducer(workoutReducer, initialState)

  const currentExercise = sampleWorkout[workoutData.currentExerciseIndex];
  const exerciseSets = workoutData.workoutSets[currentExercise.id] || [];

  // Calculate workout stats
  const completedSets = Object.values(workoutData.workoutSets)
    .flat()
    .filter((set) => set.completed);
  const totalVolume = completedSets.reduce(
    (total, set) => total + set.weight * set.reps,
    0
  );
  const averageRPE =
    completedSets.length > 0
      ? completedSets.reduce((total, set) => total + (set.rpe || 0), 0) /
        completedSets.length
      : 0;
  const workoutDuration = Math.floor((Date.now() - workoutData.workoutStartTime) / 1000);

  
    // Timer effect
    useEffect(() => {
      if (workoutData.isTimerRunning && workoutData.restTime > 0) {
        const timer = setInterval(() => {
          setRestTime(prev => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
      } else if (restTime === 0) {
        setIsTimerRunning(false)
        setIsResting(false)
      }
    }, [workoutData.isTimerRunning, workoutData.restTime])
  
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  return;
};

export default useTimer;
