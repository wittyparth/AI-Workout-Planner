"use client";

import React from "react";
import { motion } from "motion/react";
import { Target, Info } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Magic UI Components
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

// Types
import { WorkoutTemplate } from "@/lib/types/template";

interface TemplateInfoStepProps {
    templateData: Partial<WorkoutTemplate>;
    setTemplateData: React.Dispatch<React.SetStateAction<Partial<WorkoutTemplate>>>;
}

export function TemplateInfoStep({ templateData, setTemplateData }: TemplateInfoStepProps) {
    return (
        <div className="space-y-8">
            <BlurFade delay={0.1} inView>
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                    <TextAnimate
                        className="text-3xl font-bold"
                        animation="slideUp"
                    >
                        Template Information
                    </TextAnimate>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let's start by setting up the basic information for your workout template.
                        This will help users understand what your template is designed for.
                    </p>
                </div>
            </BlurFade>

            <div className="grid gap-8 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <BlurFade delay={0.2} inView>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="template-name">Template Name *</Label>
                                    <Input
                                        id="template-name"
                                        placeholder="e.g., Upper/Lower Split, Push Pull Legs"
                                        value={templateData.name || ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setTemplateData(prev => ({ ...prev, name: e.target.value }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="template-description">Description *</Label>
                                    <Textarea
                                        id="template-description"
                                        placeholder="Describe your workout template, its goals, and who it's designed for..."
                                        value={templateData.description || ""}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setTemplateData(prev => ({ ...prev, description: e.target.value }))
                                        }
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="template-difficulty">Difficulty Level</Label>
                                    <Select
                                        value={templateData.difficulty || "Intermediate"}
                                        onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") =>
                                            setTemplateData(prev => ({ ...prev, difficulty: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </BlurFade>

                    {/* Goals and Settings */}
                    <BlurFade delay={0.3} inView>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Goals & Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="template-goal">Primary Goal</Label>
                                    <Select
                                        value={templateData.goal || "Muscle Building"}
                                        onValueChange={(value: "Strength" | "Muscle Building" | "Fat Loss" | "Endurance" | "General Fitness") =>
                                            setTemplateData(prev => ({ ...prev, goal: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Strength">Strength</SelectItem>
                                            <SelectItem value="Muscle Building">Muscle Building</SelectItem>
                                            <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                                            <SelectItem value="Endurance">Endurance</SelectItem>
                                            <SelectItem value="General Fitness">General Fitness</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="template-duration">Duration (weeks)</Label>
                                    <Select
                                        value={templateData.duration?.toString() || "4"}
                                        onValueChange={(value: string) =>
                                            setTemplateData(prev => ({ ...prev, duration: parseInt(value) }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2">2 weeks</SelectItem>
                                            <SelectItem value="4">4 weeks</SelectItem>
                                            <SelectItem value="6">6 weeks</SelectItem>
                                            <SelectItem value="8">8 weeks</SelectItem>
                                            <SelectItem value="12">12 weeks</SelectItem>
                                            <SelectItem value="16">16 weeks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="public-template">Make Public</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow other users to discover and use your template
                                        </p>
                                    </div>
                                    <Switch
                                        id="public-template"
                                        checked={templateData.isPublic || false}
                                        onCheckedChange={(checked: boolean) =>
                                            setTemplateData(prev => ({ ...prev, isPublic: checked }))
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </BlurFade>
                </div>

                {/* Preview Card */}
                <BlurFade delay={0.4} inView>
                    <Card className="border-2 border-dashed">
                        <CardHeader>
                            <CardTitle>Template Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {templateData.name || "Your Template Name"}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                            {templateData.difficulty || "Intermediate"}
                                        </span>
                                        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                            {templateData.goal || "Muscle Building"}
                                        </span>
                                        <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                                            {templateData.duration || 4} weeks
                                        </span>
                                        {templateData.isPublic && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Public
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-muted-foreground">
                                    {templateData.description || "Add a description to help users understand your template's purpose and target audience."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
            </div>
        </div>
    );
}
