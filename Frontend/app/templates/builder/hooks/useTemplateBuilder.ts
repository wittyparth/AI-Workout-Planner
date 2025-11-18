"use client";

import { useState } from "react";
import { WorkoutTemplate } from "@/lib/types/template";
import { DEFAULT_TEMPLATE_DATA } from "@/app/templates/builder/constants";

export function useTemplateBuilder() {
    const [currentStep, setCurrentStep] = useState(1);
    const [templateData, setTemplateData] = useState<Partial<WorkoutTemplate>>(DEFAULT_TEMPLATE_DATA);
    const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        setCurrentStep(Math.max(1, Math.min(step, 4)));
    };

    const selectDay = (dayKey: string, dayIndex: number) => {
        setSelectedDayKey(dayKey);
        setSelectedDayIndex(dayIndex);
        if (currentStep < 3) {
            setCurrentStep(3);
        }
    };

    const openExerciseModal = () => {
        setIsExerciseModalOpen(true);
    };

    const closeExerciseModal = () => {
        setIsExerciseModalOpen(false);
    };

    const saveTemplate = async () => {
        try {
            // Here you would typically make an API call to save the template
            console.log("Saving template:", templateData);
            
            // For now, just log the template data
            const completeTemplate: WorkoutTemplate = {
                id: `template-${Date.now()}`,
                name: templateData.name || "Untitled Template",
                description: templateData.description || "",
                difficulty: templateData.difficulty || "Intermediate",
                duration: templateData.duration || 4,
                goal: templateData.goal || "Muscle Building",
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: templateData.isPublic || false,
                tags: templateData.tags || [],
                weeklyPlan: templateData.weeklyPlan || DEFAULT_TEMPLATE_DATA.weeklyPlan,
                metadata: {
                    totalExercises: 0,
                    totalSets: 0,
                    weeklyVolume: 0,
                    muscleGroupDistribution: {},
                    equipmentRequired: [],
                    estimatedWeeklyDuration: 0,
                    restDaysPerWeek: 0,
                    workoutDaysPerWeek: 0,
                    primaryMuscles: [],
                    difficulty: templateData.difficulty?.toLowerCase() as "beginner" | "intermediate" | "advanced" || "intermediate",
                    category: templateData.goal || "Muscle Building",
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
    };

    return {
        // State
        currentStep,
        templateData,
        selectedDayKey,
        selectedDayIndex,
        isExerciseModalOpen,
        
        // Actions
        setTemplateData,
        nextStep,
        prevStep,
        goToStep,
        selectDay,
        openExerciseModal,
        closeExerciseModal,
        saveTemplate
    };
}
