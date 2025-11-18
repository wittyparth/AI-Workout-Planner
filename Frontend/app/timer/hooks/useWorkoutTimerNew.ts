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