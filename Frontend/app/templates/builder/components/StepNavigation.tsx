"use client";

import React from "react";
import { motion } from "motion/react";
import { Target, Calendar, Dumbbell, Save, Check } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";

interface StepNavigationProps {
    currentStep: number;
    onStepChange: (step: number) => void;
    onNext: () => void;
    onPrev: () => void;
    canProceed: boolean;
}

const STEPS = [
    {
        id: 1,
        title: "Template Info",
        description: "Basic details",
        icon: Target
    },
    {
        id: 2,
        title: "Weekly Structure",
        description: "Define workout days",
        icon: Calendar
    },
    {
        id: 3,
        title: "Add Exercises",
        description: "Build workouts",
        icon: Dumbbell
    },
    {
        id: 4,
        title: "Review & Save",
        description: "Final review",
        icon: Save
    }
];

export function StepNavigation({
    currentStep,
    onStepChange,
    onNext,
    onPrev,
    canProceed
}: StepNavigationProps) {
    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <BlurFade delay={0.1} inView>
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const isClickable = currentStep >= step.id;

                            return (
                                <React.Fragment key={step.id}>
                                    <motion.div
                                        className={`flex items-center space-x-3 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                                            }`}
                                        onClick={() => isClickable && onStepChange(step.id)}
                                        whileHover={isClickable ? { scale: 1.02 } : {}}
                                        whileTap={isClickable ? { scale: 0.98 } : {}}
                                    >
                                        <div
                                            className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${isActive
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                                                    : isCompleted
                                                        ? 'border-green-500 bg-green-500 text-white'
                                                        : 'border-muted-foreground bg-background text-muted-foreground'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}

                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2 border-primary"
                                                    initial={{ scale: 1, opacity: 1 }}
                                                    animate={{ scale: 1.3, opacity: 0 }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeOut"
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <div className="text-left hidden md:block">
                                            <h3 className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'
                                                }`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`w-12 h-0.5 transition-colors duration-200 ${currentStep > step.id
                                                    ? 'bg-green-500'
                                                    : currentStep === step.id
                                                        ? 'bg-primary'
                                                        : 'bg-muted-foreground/30'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </BlurFade>

            {/* Mobile Step Indicator */}
            <BlurFade delay={0.2} inView>
                <div className="md:hidden">
                    <div className="text-center space-y-2">
                        <div className="text-sm text-muted-foreground">
                            Step {currentStep} of {STEPS.length}
                        </div>
                        <h2 className="text-xl font-semibold">
                            {STEPS.find(s => s.id === currentStep)?.title}
                        </h2>
                        <p className="text-muted-foreground">
                            {STEPS.find(s => s.id === currentStep)?.description}
                        </p>
                    </div>

                    <div className="mt-4 bg-muted rounded-full h-2">
                        <motion.div
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </BlurFade>

            {/* Navigation Buttons */}
            <BlurFade delay={0.3} inView>
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={onPrev}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Previous
                    </Button>

                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                            {currentStep === STEPS.length
                                ? "Ready to save your template"
                                : `${STEPS.length - currentStep} step${STEPS.length - currentStep === 1 ? '' : 's'} remaining`
                            }
                        </div>
                    </div>

                    <Button
                        onClick={onNext}
                        disabled={currentStep === STEPS.length || !canProceed}
                        className="flex items-center gap-2"
                    >
                        {currentStep === STEPS.length ? "Finish" : "Next"}
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Button>
                </div>
            </BlurFade>
        </div>
    );
}
