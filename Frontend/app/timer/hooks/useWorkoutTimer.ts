"use client";

import { useReducer, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import { TimerState, TimerAction, Exercise, ExerciseSet } from '../types/timer-types';

// Initial state
const initialState: TimerState = {
  template: null,
  exercises: [],
  currentExerciseIndex: 0,
  workoutSets: {},
  isResting: false,
  restTime: 90,
  isTimerRunning: false,
  defaultRestTime: 90,
  workoutStartTime: Date.now(),
  showStats: false,
  showExerciseDetails: false,
  editingSet: null,
};

// Helper function to create default sets for an exercise
const createDefaultSets = (exercise: Exercise): ExerciseSet[] => {
  const defaultSetCount = exercise.lastWorkout?.sets.length || 3;
  
  return Array.from({ length: defaultSetCount }, (_, index) => ({
    id: `${exercise.id}_set_${index}`,
    weight: exercise.lastWorkout?.sets[index]?.weight || 0,
    reps: exercise.lastWorkout?.sets[index]?.reps || 10,
    completed: false,
  }));
};

// Reducer with Immer for immutable updates
const timerReducer = produce((draft: TimerState, action: TimerAction) => {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      draft.template = action.payload;
      draft.exercises = action.payload.exercises;
      draft.currentExerciseIndex = 0;
      
      // Initialize sets for all exercises
      action.payload.exercises.forEach(exercise => {
        if (!draft.workoutSets[exercise.id]) {
          draft.workoutSets[exercise.id] = createDefaultSets(exercise);
        }
      });
      break;

    case 'SET_EXERCISES':
      draft.exercises = action.payload;
      
      // Initialize sets for new exercises
      action.payload.forEach(exercise => {
        if (!draft.workoutSets[exercise.id]) {
          draft.workoutSets[exercise.id] = createDefaultSets(exercise);
        }
      });
      break;

    case 'ADD_EXERCISE':
      draft.exercises.push(action.payload);
      draft.workoutSets[action.payload.id] = createDefaultSets(action.payload);
      break;

    case 'REMOVE_EXERCISE':
      draft.exercises = draft.exercises.filter(ex => ex.id !== action.payload);
      delete draft.workoutSets[action.payload];
      
      // Adjust current exercise index if needed
      if (draft.currentExerciseIndex >= draft.exercises.length) {
        draft.currentExerciseIndex = Math.max(0, draft.exercises.length - 1);
      }
      break;

    case 'NEXT_EXERCISE':
      if (draft.currentExerciseIndex < draft.exercises.length - 1) {
        draft.currentExerciseIndex += 1;
        draft.isResting = false;
        draft.isTimerRunning = false;
      }
      break;

    case 'PREVIOUS_EXERCISE':
      if (draft.currentExerciseIndex > 0) {
        draft.currentExerciseIndex -= 1;
        draft.isResting = false;
        draft.isTimerRunning = false;
      }
      break;

    case 'SELECT_EXERCISE':
      if (action.payload >= 0 && action.payload < draft.exercises.length) {
        draft.currentExerciseIndex = action.payload;
        draft.isResting = false;
        draft.isTimerRunning = false;
      }
      break;

    case 'UPDATE_SET':
      const { exerciseId, setIndex, updates } = action.payload;
      if (draft.workoutSets[exerciseId]?.[setIndex]) {
        Object.assign(draft.workoutSets[exerciseId][setIndex], updates);
      }
      break;

    case 'COMPLETE_SET':
      const { exerciseId: completeExerciseId, setIndex: completeSetIndex } = action.payload;
      const setToComplete = draft.workoutSets[completeExerciseId]?.[completeSetIndex];
      
      if (setToComplete) {
        setToComplete.completed = true;
        setToComplete.completedAt = new Date();
        
        // Auto-start rest timer
        draft.isResting = true;
        draft.restTime = draft.defaultRestTime;
        draft.isTimerRunning = true;
      }
      break;

    case 'ADD_SET':
      const exerciseSets = draft.workoutSets[action.payload];
      if (exerciseSets && exerciseSets.length > 0) {
        // Copy the last set's values (excluding completed status)
        const lastSet = exerciseSets[exerciseSets.length - 1];
        const newSet: ExerciseSet = {
          id: `${action.payload}_set_${exerciseSets.length}`,
          weight: lastSet.weight,
          reps: lastSet.reps,
          completed: false,
        };
        exerciseSets.push(newSet);
      }
      break;

    case 'REMOVE_SET':
      const { exerciseId: removeExerciseId, setIndex: removeSetIndex } = action.payload;
      const setsToModify = draft.workoutSets[removeExerciseId];
      if (setsToModify && setsToModify.length > 1) {
        setsToModify.splice(removeSetIndex, 1);
      }
      break;

    case 'START_REST':
      draft.isResting = true;
      draft.restTime = action.payload || draft.defaultRestTime;
      draft.isTimerRunning = true;
      break;

    case 'PAUSE_TIMER':
      draft.isTimerRunning = false;
      break;

    case 'RESUME_TIMER':
      draft.isTimerRunning = true;
      break;

    case 'STOP_REST':
      draft.isResting = false;
      draft.isTimerRunning = false;
      draft.restTime = draft.defaultRestTime;
      break;

    case 'TICK_TIMER':
      if (draft.isTimerRunning && draft.restTime > 0) {
        draft.restTime -= 1;
      } else if (draft.restTime === 0) {
        draft.isResting = false;
        draft.isTimerRunning = false;
        draft.restTime = draft.defaultRestTime;
      }
      break;

    case 'SET_DEFAULT_REST_TIME':
      draft.defaultRestTime = action.payload;
      if (!draft.isResting) {
        draft.restTime = action.payload;
      }
      break;

    case 'TOGGLE_STATS':
      draft.showStats = !draft.showStats;
      break;

    case 'TOGGLE_EXERCISE_DETAILS':
      draft.showExerciseDetails = !draft.showExerciseDetails;
      break;

    case 'SET_EDITING_SET':
      draft.editingSet = action.payload;
      break;

    case 'RESET_WORKOUT':
      return {
        ...initialState,
        workoutStartTime: Date.now(),
      };

    default:
      break;
  }
});

export function useWorkoutTimer() {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Timer effect
  useEffect(() => {
    if (state.isTimerRunning && state.restTime > 0) {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [state.isTimerRunning, state.restTime]);

  // Computed values
  const currentExercise = state.exercises[state.currentExerciseIndex] || null;
  const currentExerciseSets = currentExercise ? state.workoutSets[currentExercise.id] || [] : [];
  const currentSetIndex = currentExerciseSets.findIndex(set => !set.completed);
  
  // Workout statistics
  const completedSets = Object.values(state.workoutSets)
    .flat()
    .filter(set => set.completed);
  
  const totalVolume = completedSets.reduce(
    (total, set) => total + (set.weight * set.reps), 
    0
  );
  
  const workoutDuration = Math.floor((Date.now() - state.workoutStartTime) / 1000);
  
  const workoutProgress = state.exercises.length > 0 
    ? ((state.currentExerciseIndex + 1) / state.exercises.length) * 100 
    : 0;

  // Action creators
  const actions = {
    loadTemplate: useCallback((template: any) => {
      dispatch({ type: 'LOAD_TEMPLATE', payload: template });
    }, []),

    addExercise: useCallback((exercise: Exercise) => {
      dispatch({ type: 'ADD_EXERCISE', payload: exercise });
    }, []),

    removeExercise: useCallback((exerciseId: string) => {
      dispatch({ type: 'REMOVE_EXERCISE', payload: exerciseId });
    }, []),

    nextExercise: useCallback(() => {
      dispatch({ type: 'NEXT_EXERCISE' });
    }, []),

    previousExercise: useCallback(() => {
      dispatch({ type: 'PREVIOUS_EXERCISE' });
    }, []),

    selectExercise: useCallback((index: number) => {
      dispatch({ type: 'SELECT_EXERCISE', payload: index });
    }, []),

    updateSet: useCallback((exerciseId: string, setIndex: number, updates: Partial<ExerciseSet>) => {
      dispatch({ type: 'UPDATE_SET', payload: { exerciseId, setIndex, updates } });
    }, []),

    completeSet: useCallback((exerciseId: string, setIndex: number) => {
      dispatch({ type: 'COMPLETE_SET', payload: { exerciseId, setIndex } });
    }, []),

    addSet: useCallback((exerciseId: string) => {
      dispatch({ type: 'ADD_SET', payload: exerciseId });
    }, []),

    removeSet: useCallback((exerciseId: string, setIndex: number) => {
      dispatch({ type: 'REMOVE_SET', payload: { exerciseId, setIndex } });
    }, []),

    startRest: useCallback((duration?: number) => {
      dispatch({ type: 'START_REST', payload: duration });
    }, []),

    pauseTimer: useCallback(() => {
      dispatch({ type: 'PAUSE_TIMER' });
    }, []),

    resumeTimer: useCallback(() => {
      dispatch({ type: 'RESUME_TIMER' });
    }, []),

    stopRest: useCallback(() => {
      dispatch({ type: 'STOP_REST' });
    }, []),

    setDefaultRestTime: useCallback((time: number) => {
      dispatch({ type: 'SET_DEFAULT_REST_TIME', payload: time });
    }, []),

    toggleStats: useCallback(() => {
      dispatch({ type: 'TOGGLE_STATS' });
    }, []),

    toggleExerciseDetails: useCallback(() => {
      dispatch({ type: 'TOGGLE_EXERCISE_DETAILS' });
    }, []),

    setEditingSet: useCallback((setId: string | null) => {
      dispatch({ type: 'SET_EDITING_SET', payload: setId });
    }, []),

    resetWorkout: useCallback(() => {
      dispatch({ type: 'RESET_WORKOUT' });
    }, []),
  };

  // Utility functions
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getNextIncompleteSet = useCallback((exerciseId: string) => {
    const sets = state.workoutSets[exerciseId] || [];
    return sets.findIndex(set => !set.completed);
  }, [state.workoutSets]);

  return {
    // State
    state,
    
    // Computed values
    currentExercise,
    currentExerciseSets,
    currentSetIndex,
    completedSets,
    totalVolume,
    workoutDuration,
    workoutProgress,
    
    // Actions
    actions,
    
    // Utilities
    formatTime,
    getNextIncompleteSet,
  };
}
    defaultRestTime: 120,
    warningTime: 10,
    soundEnabled: true,
    vibrationEnabled: true,
    smartRest: true,
    backgroundMusic: false,
    customRestTimes: {},
  })

  const [workoutSession, setWorkoutSession] = useState<WorkoutSession>({
    startTime: new Date(),
    totalVolume: 0,
    completedSets: 0,
    totalRestTime: 0,
    exercisesCompleted: 0,
    personalRecords: 0,
  })

  const [quickRestTimes] = useState([60, 90, 120, 180, 300])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentExercise = exercises[currentExerciseIndex]
  const totalExercises = exercises.length

  // Initialize workout sets
  useEffect(() => {
    const initialSets: Record<string, WorkoutSet[]> = {}
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i]
      initialSets[exercise.id] = Array.from({ length: exercise.sets }, (_, index) => {
        const lastWorkoutSet = exercise.lastWorkout?.sets[index]
        return {
          weight: lastWorkoutSet?.weight || exercise.weight || 0,
          reps: lastWorkoutSet?.reps || exercise.reps,
          completed: false,
          rpe: lastWorkoutSet?.rpe || 7,
        }
      })
    }
    setWorkoutSets(initialSets)
    setCurrentWeight(currentExercise.weight || 0)
    setCurrentReps(currentExercise.reps)
  }, [exercises, currentExercise])

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio('/notification-sound.mp3')
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && isResting && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false)
            setIsRunning(false)
            if (!isMuted && restTimerSettings.soundEnabled) {
              playNotificationSound()
            }
            if (restTimerSettings.vibrationEnabled) {
              triggerVibration()
            }
            return 0
          }
          if (prev <= restTimerSettings.warningTime && !restWarning) {
            setRestWarning(true)
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isResting, timeLeft, isMuted, restTimerSettings, restWarning])

  // Total workout time
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTotalWorkoutTime(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused])

  const playNotificationSound = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
    }
  }, [isMuted])

  const triggerVibration = useCallback(() => {
    if (navigator.vibrate && restTimerSettings.vibrationEnabled) {
      navigator.vibrate([200, 100, 200])
    }
  }, [restTimerSettings.vibrationEnabled])

  // Utility functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRestTime = () => {
    const customTime = restTimerSettings.customRestTimes[currentExercise.id]
    if (customTime) return customTime
    if (restTimerSettings.smartRest) {
      return getSmartRestTime(currentExercise.difficulty, currentRPE)
    }
    return currentExercise.restTime || restTimerSettings.defaultRestTime
  }

  const getSmartRestTime = (difficulty: string, rpe: number) => {
    const baseTime = {
      "Beginner": 60,
      "Intermediate": 90,
      "Advanced": 120
    }[difficulty] || 90

    const rpeMultiplier = rpe >= 8 ? 1.5 : rpe >= 6 ? 1.2 : 1.0
    return Math.round(baseTime * rpeMultiplier)
  }

  const calculatePlateLoading = (weight: number): PlateCalculation => {
    const barWeight = 45
    const weightPerSide = (weight - barWeight) / 2
    const availablePlates = [45, 35, 25, 10, 5, 2.5]
    
    const plates: number[] = []
    let remaining = weightPerSide
    
    for (const plate of availablePlates) {
      while (remaining >= plate) {
        plates.push(plate)
        remaining -= plate
      }
    }
    
    return { plates, remaining: Math.round(remaining * 4) / 4 }
  }

  const checkPersonalRecord = (weight: number, reps: number) => {
    if (!currentExercise.personalRecord) return true
    const currentMax = currentExercise.personalRecord.weight * currentExercise.personalRecord.reps
    const newMax = weight * reps
    return newMax > currentMax
  }

  const getLastWorkoutComparison = () => {
    const lastSet = workoutSets[currentExercise.id]?.[currentSetIndex - 1]
    if (!lastSet || !currentExercise.lastWorkout) return null
    
    const lastWorkoutSet = currentExercise.lastWorkout.sets[currentSetIndex]
    if (!lastWorkoutSet) return null
    
    const currentVolume = currentWeight * currentReps
    const lastVolume = lastWorkoutSet.weight * lastWorkoutSet.reps
    
    return {
      weight: lastWorkoutSet.weight,
      reps: lastWorkoutSet.reps,
      performance: currentVolume > lastVolume ? 'better' : 
                  currentVolume === lastVolume ? 'same' : 'worse'
    }
  }

  const getRPEDescription = (rpe: number) => {
    const descriptions = {
      1: "Very Easy", 2: "Easy", 3: "Moderate", 4: "Somewhat Hard",
      5: "Hard", 6: "Harder", 7: "Very Hard", 8: "Very Very Hard",
      9: "Extremely Hard", 10: "Maximum Effort"
    }
    return descriptions[rpe as keyof typeof descriptions] || "Unknown"
  }

  const getWeightSuggestion = () => {
    const lastSet = workoutSets[currentExercise.id]?.[currentSetIndex - 1]
    if (!lastSet) return currentWeight
    
    if (lastSet.rpe && lastSet.rpe <= 6) {
      return lastSet.weight + 5
    } else if (lastSet.rpe && lastSet.rpe >= 9) {
      return Math.max(lastSet.weight - 5, 45)
    }
    return lastSet.weight
  }

  // Action functions
  const completeSet = () => {
    const newSet: WorkoutSet = {
      weight: currentWeight,
      reps: currentReps,
      rpe: currentRPE,
      completed: true,
      notes: currentNotes,
      completedAt: new Date(),
      isWarmup: isWarmupSet,
      isDropSet: isDropSet,
    }

    setWorkoutSets(prev => ({
      ...prev,
      [currentExercise.id]: prev[currentExercise.id].map((set, index) =>
        index === currentSetIndex ? newSet : set
      )
    }))

    // Update session stats
    setWorkoutSession(prev => ({
      ...prev,
      totalVolume: prev.totalVolume + (currentWeight * currentReps),
      completedSets: prev.completedSets + 1,
      personalRecords: prev.personalRecords + (checkPersonalRecord(currentWeight, currentReps) ? 1 : 0)
    }))

    // Progress to next set or exercise
    if (currentSetIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(prev => prev + 1)
      startRestTimer()
    } else if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setCurrentSetIndex(0)
      const nextExercise = exercises[currentExerciseIndex + 1]
      setCurrentWeight(nextExercise.weight || 0)
      setCurrentReps(nextExercise.reps)
      startRestTimer()
    } else {
      setShowCompleted(true)
    }

    // Reset form
    setCurrentNotes("")
    setIsWarmupSet(false)
    setIsDropSet(false)
  }

  const skipSet = () => {
    if (currentSetIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(prev => prev + 1)
    } else if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setCurrentSetIndex(0)
      const nextExercise = exercises[currentExerciseIndex + 1]
      setCurrentWeight(nextExercise.weight || 0)
      setCurrentReps(nextExercise.reps)
    }
  }

  const previousSet = () => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex(prev => prev - 1)
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
      setCurrentSetIndex(exercises[currentExerciseIndex - 1].sets - 1)
      const prevExercise = exercises[currentExerciseIndex - 1]
      setCurrentWeight(prevExercise.weight || 0)
      setCurrentReps(prevExercise.reps)
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setCurrentSetIndex(0)
      const nextEx = exercises[currentExerciseIndex + 1]
      setCurrentWeight(nextEx.weight || 0)
      setCurrentReps(nextEx.reps)
    }
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
      setCurrentSetIndex(0)
      const prevEx = exercises[currentExerciseIndex - 1]
      setCurrentWeight(prevEx.weight || 0)
      setCurrentReps(prevEx.reps)
    }
  }

  const skipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      nextExercise()
    } else {
      setShowCompleted(true)
    }
  }

  const startRestTimer = () => {
    const restTime = getRestTime()
    setTimeLeft(restTime)
    setIsResting(true)
    setIsRunning(true)
    setRestWarning(false)
  }

  const pauseWorkout = () => {
    setIsPaused(true)
    setIsRunning(false)
  }

  const resumeWorkout = () => {
    setIsPaused(false)
    if (isResting && timeLeft > 0) {
      setIsRunning(true)
    }
  }

  const adjustWeight = (delta: number) => {
    setCurrentWeight(Math.max(0, currentWeight + delta))
  }

  const adjustReps = (delta: number) => {
    setCurrentReps(Math.max(1, currentReps + delta))
  }

  return {
    // State
    currentExercise,
    currentExerciseIndex,
    currentSetIndex,
    totalExercises,
    workoutSets,
    currentWeight,
    currentReps,
    currentRPE,
    currentNotes,
    isResting,
    timeLeft,
    isRunning,
    restWarning,
    totalWorkoutTime,
    isPaused,
    isMuted,
    showCompleted,
    isWarmupSet,
    isDropSet,
    autoProgressionEnabled,
    restTimerSettings,
    workoutSession,
    quickRestTimes,

    // Setters
    setCurrentWeight,
    setCurrentReps,
    setCurrentRPE,
    setCurrentNotes,
    setIsWarmupSet,
    setIsDropSet,
    setAutoProgressionEnabled,
    setRestTimerSettings,
    setIsMuted,
    setShowCompleted,
    setTimeLeft,
    setRestWarning,
    setIsRunning,
    setIsResting,

    // Actions
    completeSet,
    skipSet,
    previousSet,
    nextExercise,
    previousExercise,
    skipExercise,
    startRestTimer,
    pauseWorkout,
    resumeWorkout,
    adjustWeight,
    adjustReps,

    // Utilities
    formatTime,
    getRestTime,
    calculatePlateLoading,
    checkPersonalRecord,
    getLastWorkoutComparison,
    getRPEDescription,
    getWeightSuggestion,
  }
}
