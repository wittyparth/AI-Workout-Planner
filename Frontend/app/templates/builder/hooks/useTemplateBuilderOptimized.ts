"use client";

import { useReducer, useCallback, useMemo, useRef, useEffect } from 'react';
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

// Action types with strict typing
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

// Optimized reducer with performance considerations
function templateBuilderReducer(
  state: TemplateBuilderState,
  action: TemplateBuilderAction
): TemplateBuilderState {
  switch (action.type) {
    case 'SET_STEP':
      // Prevent unnecessary updates if step is the same
      if (state.currentStep === action.payload) return state;
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
      // Shallow comparison to prevent unnecessary updates
      const hasChanges = Object.keys(action.payload).some(
        key => (state.templateData as any)[key] !== (action.payload as any)[key]
      );
      if (!hasChanges) return state;
      
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
      // Complex state update with performance optimization
      if (!state.templateData.weeklyPlan?.days || !action.payload.dayKey) return state;
      
      const templateData = { ...state.templateData };
      const weeklyPlan = { ...templateData.weeklyPlan };
      const days = { ...weeklyPlan.days };
      const currentDay = days[action.payload.dayKey as keyof typeof days];
      
      if (!currentDay) return state;
      
      // Create new day object with added exercise
      const updatedDay = {
        ...currentDay,
        exercises: [...(currentDay.exercises || []), action.payload.exercise],
      };
      
      // Update the days object
      (days as any)[action.payload.dayKey] = updatedDay;
      
      return {
        ...state,
        templateData: {
          ...templateData,
          weeklyPlan: { ...weeklyPlan, days },
        },
        isDirty: true,
        isExerciseModalOpen: false,
      };

    case 'REMOVE_EXERCISE':
      if (!state.templateData.weeklyPlan?.days || !action.payload.dayKey) return state;
      
      const newTemplateData = { ...state.templateData };
      const newWeeklyPlan = { ...newTemplateData.weeklyPlan };
      const newDays = { ...newWeeklyPlan.days };
      const dayToUpdate = newDays[action.payload.dayKey as keyof typeof newDays];
      
      if (!dayToUpdate?.exercises) return state;
      
      const updatedDayAfterRemoval = {
        ...dayToUpdate,
        exercises: dayToUpdate.exercises.filter((_, index) => index !== action.payload.exerciseIndex),
      };
      
      (newDays as any)[action.payload.dayKey] = updatedDayAfterRemoval;

      return {
        ...state,
        templateData: {
          ...newTemplateData,
          weeklyPlan: { ...newWeeklyPlan, days: newDays },
        },
        isDirty: true,
      };

    case 'SET_VALIDATION_ERRORS':
      // Check if errors actually changed
      const errorKeys = Object.keys(action.payload);
      const stateErrorKeys = Object.keys(state.validationErrors);
      
      if (errorKeys.length !== stateErrorKeys.length ||
          errorKeys.some(key => state.validationErrors[key] !== action.payload[key])) {
        return { ...state, validationErrors: action.payload };
      }
      return state;

    case 'RESET_TEMPLATE':
      return initialState;

    default:
      return state;
  }
}

// Main hook with all optimization patterns
export function useTemplateBuilderOptimized() {
  const [state, dispatch] = useReducer(templateBuilderReducer, initialState);
  const renderCount = useRef(0);

  // Track renders for performance monitoring
  useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === 'development') {
      console.log(`useTemplateBuilder rendered ${renderCount.current} times`);
    }
  });

  // Memoized selectors - only recompute when dependencies change
  const selectors = useMemo(() => ({
    currentStep: state.currentStep,
    isDirty: state.isDirty,
    hasValidationErrors: Object.keys(state.validationErrors).length > 0,
    selectedDay: state.selectedDayKey && state.templateData.weeklyPlan?.days
      ? (state.templateData.weeklyPlan.days as any)[state.selectedDayKey]
      : null,
    totalExercises: state.templateData.weeklyPlan?.days 
      ? Object.values(state.templateData.weeklyPlan.days).reduce(
          (total, day) => total + (day.exercises?.length || 0), 0
        )
      : 0,
    completedSteps: [
      !!state.templateData.name,
      !!state.templateData.weeklyPlan,
      state.templateData.weeklyPlan?.days && 
        Object.values(state.templateData.weeklyPlan.days).some(day => day.exercises?.length),
      true // Review step is always available
    ],
  }), [
    state.currentStep,
    state.isDirty,
    state.validationErrors,
    state.selectedDayKey,
    state.templateData.weeklyPlan,
    state.templateData.name,
  ]);

  // Memoized action creators - prevent function recreation on every render
  const actions = useMemo(() => ({
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
    setValidationErrors: (errors: Record<string, string>) => 
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors }),
    resetTemplate: () => dispatch({ type: 'RESET_TEMPLATE' }),
  }), []); // Empty dependency array since dispatch is stable

  // Validation logic with caching
  const validate = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (!state.templateData.name?.trim()) {
      errors.name = 'Template name is required';
    }
    
    if (!state.templateData.description?.trim()) {
      errors.description = 'Template description is required';
    }
    
    if (!state.templateData.weeklyPlan?.days) {
      errors.weeklyPlan = 'Weekly plan is required';
    } else {
      const hasExercises = Object.values(state.templateData.weeklyPlan.days)
        .some(day => day.exercises && day.exercises.length > 0);
      
      if (!hasExercises) {
        errors.exercises = 'At least one exercise is required';
      }
    }
    
    actions.setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [state.templateData.name, state.templateData.description, state.templateData.weeklyPlan, actions]);

  // Save function with optimization
  const saveTemplate = useCallback(async () => {
    if (!validate()) {
      throw new Error('Validation failed');
    }

    try {
      console.log('Saving template:', state.templateData);
      
      const completeTemplate: WorkoutTemplate = {
        id: `template-${Date.now()}`,
        name: state.templateData.name || "Untitled Template",
        description: state.templateData.description || "",
        difficulty: state.templateData.difficulty || "Intermediate",
        duration: state.templateData.duration || 4,
        goal: state.templateData.goal || "Muscle Building",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: state.templateData.isPublic || false,
        tags: state.templateData.tags || [],
        weeklyPlan: state.templateData.weeklyPlan || DEFAULT_TEMPLATE_DATA.weeklyPlan,
        metadata: {
          totalExercises: selectors.totalExercises,
          totalSets: 0,
          weeklyVolume: 0,
          muscleGroupDistribution: {},
          equipmentRequired: [],
          estimatedWeeklyDuration: 0,
          restDaysPerWeek: 0,
          workoutDaysPerWeek: 0,
          primaryMuscles: [],
          difficulty: state.templateData.difficulty?.toLowerCase() as "beginner" | "intermediate" | "advanced" || "intermediate",
          category: state.templateData.goal || "Muscle Building",
          equipment: []
        }
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Template saved successfully:", completeTemplate);
      return completeTemplate;
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  }, [state.templateData, validate, selectors.totalExercises]);

  return {
    // State
    currentStep: state.currentStep,
    templateData: state.templateData,
    selectedDayKey: state.selectedDayKey,
    selectedDayIndex: state.selectedDayIndex,
    isExerciseModalOpen: state.isExerciseModalOpen,
    
    // Computed values
    ...selectors,
    
    // Actions
    ...actions,
    validate,
    saveTemplate,
    
    // Performance debugging
    renderCount: renderCount.current,
  };
}

// Custom hook for performance monitoring
export function useRenderTracker(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  renderCount.current += 1;
  const currentTime = Date.now();
  const timeSinceLastRender = currentTime - lastRenderTime.current;
  lastRenderTime.current = currentTime;
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName}: Render #${renderCount.current} (${timeSinceLastRender}ms since last)`);
    }
  });
  
  return {
    renderCount: renderCount.current,
    timeSinceLastRender,
  };
}
