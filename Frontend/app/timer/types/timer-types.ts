export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  completedAt?: Date;
  restTimeUsed?: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  targetMuscles: string[];
  personalRecord?: {
    weight: number;
    reps: number;
  };
  lastWorkout?: {
    sets: {
      weight: number;
      reps: number;
      restTime?: number;
    }[];
  };
  tips?: string[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface TimerState {
  // Workout data
  template: WorkoutTemplate | null;
  exercises: Exercise[];
  currentExerciseIndex: number;
  
  // Set management
  workoutSets: Record<string, ExerciseSet[]>;
  
  // Timer state
  isResting: boolean;
  restTime: number;
  isTimerRunning: boolean;
  defaultRestTime: number;
  
  // UI state
  workoutStartTime: number;
  showStats: boolean;
  showExerciseDetails: boolean;
  editingSet: string | null; // exerciseId_setIndex
}

export type TimerAction =
  | { type: 'LOAD_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'SET_EXERCISES'; payload: Exercise[] }
  | { type: 'ADD_EXERCISE'; payload: Exercise }
  | { type: 'REMOVE_EXERCISE'; payload: string }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'PREVIOUS_EXERCISE' }
  | { type: 'SELECT_EXERCISE'; payload: number }
  
  | { type: 'UPDATE_SET'; payload: { exerciseId: string; setIndex: number; updates: Partial<ExerciseSet> } }
  | { type: 'COMPLETE_SET'; payload: { exerciseId: string; setIndex: number } }
  | { type: 'ADD_SET'; payload: string } // exerciseId
  | { type: 'REMOVE_SET'; payload: { exerciseId: string; setIndex: number } }
  
  | { type: 'START_REST'; payload?: number }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'STOP_REST' }
  | { type: 'TICK_TIMER' }
  | { type: 'SET_DEFAULT_REST_TIME'; payload: number }
  
  | { type: 'TOGGLE_STATS' }
  | { type: 'TOGGLE_EXERCISE_DETAILS' }
  | { type: 'SET_EDITING_SET'; payload: string | null }
  | { type: 'RESET_WORKOUT' };