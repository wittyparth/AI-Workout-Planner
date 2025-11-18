"use client";

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { WorkoutTemplate } from '@/lib/types/template';
import { DEFAULT_TEMPLATE_DATA } from '../constants';

// State shape
interface TemplateBuilderState {
  currentStep: number;
  templateData: Partial<WorkoutTemplate>;
  selectedDayKey: string | null;
  selectedDayIndex: number;
  isExerciseModalOpen: boolean;
  isDirty: boolean;
  validationErrors: Record<string, string>;
}

// Action types
type TemplateBuilderAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_TEMPLATE'; payload: Partial<WorkoutTemplate> }
  | { type: 'SELECT_DAY'; payload: { dayKey: string; dayIndex: number } }
  | { type: 'OPEN_EXERCISE_MODAL' }
  | { type: 'CLOSE_EXERCISE_MODAL' }
  | { type: 'ADD_EXERCISE'; payload: { dayKey: string; exercise: any } }
  | { type: 'REMOVE_EXERCISE'; payload: { dayKey: string; exerciseIndex: number } }
  | { type: 'SET_VALIDATION_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET_TEMPLATE' };

// Initial state
const initialState: TemplateBuilderState = {
  currentStep: 1,
  templateData: DEFAULT_TEMPLATE_DATA,
  selectedDayKey: null,
  selectedDayIndex: 0,
  isExerciseModalOpen: false,
  isDirty: false,
  validationErrors: {},
};

// Reducer with optimized updates
function templateBuilderReducer(
  state: TemplateBuilderState,
  action: TemplateBuilderAction
): TemplateBuilderState {
  switch (action.type) {
    case 'SET_STEP':
      if (state.currentStep === action.payload) return state; // Prevent unnecessary updates
      return { ...state, currentStep: action.payload };

    case 'NEXT_STEP':
      const nextStep = Math.min(state.currentStep + 1, 4);
      if (state.currentStep === nextStep) return state;
      return { ...state, currentStep: nextStep };

    case 'PREV_STEP':
      const prevStep = Math.max(state.currentStep - 1, 1);
      if (state.currentStep === prevStep) return state;
      return { ...state, currentStep: prevStep };

    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templateData: { ...state.templateData, ...action.payload },
        isDirty: true,
        validationErrors: {}, // Clear errors on update
      };

    case 'SELECT_DAY':
      if (state.selectedDayKey === action.payload.dayKey) return state;
      return {
        ...state,
        selectedDayKey: action.payload.dayKey,
        selectedDayIndex: action.payload.dayIndex,
        currentStep: Math.max(state.currentStep, 3), // Auto-advance to exercise step
      };

    case 'OPEN_EXERCISE_MODAL':
      if (state.isExerciseModalOpen) return state;
      return { ...state, isExerciseModalOpen: true };

    case 'CLOSE_EXERCISE_MODAL':
      if (!state.isExerciseModalOpen) return state;
      return { ...state, isExerciseModalOpen: false };

    case 'ADD_EXERCISE':
      if (!state.templateData.weeklyPlan?.days || !action.payload.dayKey) return state;
      
      const updatedDays = { ...state.templateData.weeklyPlan.days };
      const currentDay = updatedDays[action.payload.dayKey];
      
      if (!currentDay) return state;
      
      updatedDays[action.payload.dayKey] = {
        ...currentDay,
        exercises: [...(currentDay.exercises || []), action.payload.exercise],
      };

      return {
        ...state,
        templateData: {
          ...state.templateData,
          weeklyPlan: {
            ...state.templateData.weeklyPlan,
            days: updatedDays,
          },
        },
        isDirty: true,
        isExerciseModalOpen: false,
      };

    case 'REMOVE_EXERCISE':
      if (!state.templateData.weeklyPlan?.days || !action.payload.dayKey) return state;
      
      const daysAfterRemoval = { ...state.templateData.weeklyPlan.days };
      const dayAfterRemoval = daysAfterRemoval[action.payload.dayKey];
      
      if (!dayAfterRemoval?.exercises) return state;
      
      daysAfterRemoval[action.payload.dayKey] = {
        ...dayAfterRemoval,
        exercises: dayAfterRemoval.exercises.filter((_, index) => index !== action.payload.exerciseIndex),
      };

      return {
        ...state,
        templateData: {
          ...state.templateData,
          weeklyPlan: {
            ...state.templateData.weeklyPlan,
            days: daysAfterRemoval,
          },
        },
        isDirty: true,
      };

    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };

    case 'RESET_TEMPLATE':
      return initialState;

    default:
      return state;
  }
}

// Context
const TemplateBuilderContext = createContext<{
  state: TemplateBuilderState;
  dispatch: React.Dispatch<TemplateBuilderAction>;
} | null>(null);

// Optimized selector context for performance
const TemplateBuilderSelectorsContext = createContext<{
  currentStep: number;
  templateData: Partial<WorkoutTemplate>;
  selectedDay: any;
  isDirty: boolean;
  validationErrors: Record<string, string>;
} | null>(null);

// Provider component with performance optimizations
export function TemplateBuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(templateBuilderReducer, initialState);

  // Memoized selectors to prevent unnecessary re-renders
  const selectors = useMemo(() => ({
    currentStep: state.currentStep,
    templateData: state.templateData,
    selectedDay: state.selectedDayKey && state.templateData.weeklyPlan?.days
      ? state.templateData.weeklyPlan.days[state.selectedDayKey]
      : null,
    isDirty: state.isDirty,
    validationErrors: state.validationErrors,
  }), [
    state.currentStep,
    state.templateData,
    state.selectedDayKey,
    state.isDirty,
    state.validationErrors,
  ]);

  // Memoize context value to prevent provider re-renders
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  const selectorsValue = useMemo(() => selectors, [selectors]);

  return (
    <TemplateBuilderContext.Provider value={contextValue}>
      <TemplateBuilderSelectorsContext.Provider value={selectorsValue}>
        {children}
      </TemplateBuilderSelectorsContext.Provider>
    </TemplateBuilderContext.Provider>
  );
}

// Optimized hooks
export function useTemplateBuilderDispatch() {
  const context = useContext(TemplateBuilderContext);
  if (!context) {
    throw new Error('useTemplateBuilderDispatch must be used within TemplateBuilderProvider');
  }
  return context.dispatch;
}

export function useTemplateBuilderState() {
  const context = useContext(TemplateBuilderContext);
  if (!context) {
    throw new Error('useTemplateBuilderState must be used within TemplateBuilderProvider');
  }
  return context.state;
}

// Selector hook for performance - only re-renders when selected data changes
export function useTemplateBuilderSelectors() {
  const context = useContext(TemplateBuilderSelectorsContext);
  if (!context) {
    throw new Error('useTemplateBuilderSelectors must be used within TemplateBuilderProvider');
  }
  return context;
}

// Action creators with useCallback for performance
export function useTemplateBuilderActions() {
  const dispatch = useTemplateBuilderDispatch();

  return useMemo(() => ({
    setStep: (step: number) => dispatch({ type: 'SET_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    updateTemplate: (updates: Partial<WorkoutTemplate>) => 
      dispatch({ type: 'UPDATE_TEMPLATE', payload: updates }),
    selectDay: (dayKey: string, dayIndex: number) => 
      dispatch({ type: 'SELECT_DAY', payload: { dayKey, dayIndex } }),
    openExerciseModal: () => dispatch({ type: 'OPEN_EXERCISE_MODAL' }),
    closeExerciseModal: () => dispatch({ type: 'CLOSE_EXERCISE_MODAL' }),
    addExercise: (dayKey: string, exercise: any) => 
      dispatch({ type: 'ADD_EXERCISE', payload: { dayKey, exercise } }),
    removeExercise: (dayKey: string, exerciseIndex: number) => 
      dispatch({ type: 'REMOVE_EXERCISE', payload: { dayKey, exerciseIndex } }),
    resetTemplate: () => dispatch({ type: 'RESET_TEMPLATE' }),
  }), [dispatch]);
}

// Performance monitoring hook (for learning)
export function useRenderTracker(componentName: string) {
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  
  React.useEffect(() => {
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
}
