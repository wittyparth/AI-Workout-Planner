"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";

// Components
import { StepNavigation } from "./components/StepNavigation";
import { TemplateInfoStep } from "./components/TemplateInfoStep";
import { WeeklyStructureStep } from "./components/WeeklyStructureStep";
import { ExerciseBuilderStep } from "./components/ExerciseBuilderStep";
import { ReviewStep } from "./components/ReviewStep";
import { ExerciseSelectionModal } from "../../timer/components/ExerciseSelectionModal";

// Hooks
import { useTemplateBuilder } from "./hooks/useTemplateBuilder";

// Data
import { ExerciseData } from "./data/exercises";

export default function TemplateBuilderPage() {
    const router = useRouter();
    const {
        currentStep,
        templateData,
        selectedDayKey,
        selectedDayIndex,
        isExerciseModalOpen,
        setTemplateData,
        nextStep,
        prevStep,
        goToStep,
        selectDay,
        openExerciseModal,
        closeExerciseModal,
        saveTemplate
    } = useTemplateBuilder();

    const handleAddExercise = (exercise: ExerciseData) => {
        if (!selectedDayKey || !templateData.weeklyPlan?.days) return;

        // Convert ExerciseData to TemplateExercise format and add to the selected day
        const templateExercise = {
            id: `${selectedDayKey}-${Date.now()}`,
            exerciseId: exercise.id,
            name: exercise.name,
            sets: exercise.sets || 3,
            reps: exercise.reps || 12,
            weight: exercise.weight && exercise.weight !== ""
                ? (exercise.weight === "bodyweight" || exercise.weight.includes("%")
                    ? exercise.weight as "bodyweight" | "percentage"
                    : parseFloat(exercise.weight) || undefined)
                : "bodyweight",
            restTime: exercise.restTime || 90,
            isSuperset: false,
            alternatives: [],
            muscleGroups: exercise.muscleGroups,
            equipment: exercise.equipment,
            order: templateData.weeklyPlan.days[selectedDayKey as keyof typeof templateData.weeklyPlan.days].exercises.length + 1
        };

        setTemplateData(prev => {
            if (!prev.weeklyPlan?.days || !selectedDayKey) return prev;

            const currentDay = prev.weeklyPlan.days[selectedDayKey as keyof typeof prev.weeklyPlan.days];

            return {
                ...prev,
                weeklyPlan: {
                    ...prev.weeklyPlan,
                    days: {
                        ...prev.weeklyPlan.days,
                        [selectedDayKey]: {
                            ...currentDay,
                            exercises: [...currentDay.exercises, templateExercise],
                            exerciseCount: currentDay.exercises.length + 1
                        }
                    }
                }
            };
        });
    };

    const handleSaveTemplate = async () => {
        try {
            const savedTemplate = await saveTemplate();
            console.log("Template saved:", savedTemplate);

            // Redirect to templates page or show success message
            router.push("/templates");
        } catch (error) {
            console.error("Failed to save template:", error);
            // Show error message to user
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return !!(templateData.name && templateData.description);
            case 2:
                return templateData.weeklyPlan?.days
                    ? Object.values(templateData.weeklyPlan.days).some(day => !day.isRestDay)
                    : false;
            case 3:
                return templateData.weeklyPlan?.days
                    ? Object.values(templateData.weeklyPlan.days).some(day =>
                        !day.isRestDay && day.exercises.length > 0
                    )
                    : false;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <TemplateInfoStep
                        templateData={templateData}
                        setTemplateData={setTemplateData}
                    />
                );
            case 2:
                return (
                    <WeeklyStructureStep
                        templateData={templateData}
                        setTemplateData={setTemplateData}
                        onSelectDay={selectDay}
                    />
                );
            case 3:
                return (
                    <ExerciseBuilderStep
                        templateData={templateData}
                        setTemplateData={setTemplateData}
                        selectedDayKey={selectedDayKey}
                        selectedDayIndex={selectedDayIndex}
                        onOpenExerciseModal={openExerciseModal}
                    />
                );
            case 4:
                return (
                    <ReviewStep
                        templateData={templateData}
                        onSaveTemplate={handleSaveTemplate}
                        onGoBack={prevStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <BlurFade delay={0.1} inView>
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href="/templates">
                                    <Button variant="ghost" size="icon">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold">Workout Template Builder</h1>
                                    <p className="text-muted-foreground">
                                        Create your custom workout template
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button variant="outline" onClick={() => router.push("/templates")}>
                                    Save Draft
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </BlurFade>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Step Navigation */}
                <div className="mb-12">
                    <StepNavigation
                        currentStep={currentStep}
                        onStepChange={goToStep}
                        onNext={nextStep}
                        onPrev={prevStep}
                        canProceed={canProceed()}
                    />
                </div>

                {/* Step Content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {renderStep()}
                </motion.div>
            </div>

            {/* Exercise Selection Modal */}
            <ExerciseSelectionModal
                isOpen={isExerciseModalOpen}
                onClose={closeExerciseModal}
                onAddExercise={handleAddExercise}
                selectedDayIndex={selectedDayIndex}
            />
        </div>
    );
}
