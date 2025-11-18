"import TemplatesIntegrated from "./templates-integrated"

export default function TemplatesPage() {
  return <TemplatesIntegrated />
}";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlurFade } from "@/components/magicui/blur-fade"
import { AppHeader } from "@/components/app-header"
import { Sparkles, Clock, Target, Users, Search, Plus, Zap, Crown, Bot, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

import { SAMPLE_TEMPLATES } from "@/data/templates/sample-templates";
import { MUSCLE_GROUP_COLORS } from "@/data/exercises/sample-exercises";
import type { WorkoutTemplate } from "@/lib/types/template";

const DIFFICULTY_COLORS = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "strength", label: "Strength Training" },
    { value: "cardio", label: "Cardio" },
    { value: "flexibility", label: "Flexibility" },
    { value: "bodyweight", label: "Bodyweight" },
    { value: "powerlifting", label: "Powerlifting" },
];

const DIFFICULTY_OPTIONS = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
];

const BODY_PART_OPTIONS = [
    { value: "all", label: "All Body Parts" },
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "shoulders", label: "Shoulders" },
    { value: "arms", label: "Arms" },
    { value: "legs", label: "Legs" },
    { value: "core", label: "Core" },
    { value: "glutes", label: "Glutes" },
    { value: "biceps", label: "Biceps" },
    { value: "triceps", label: "Triceps" },
    { value: "quads", label: "Quads" },
    { value: "hamstrings", label: "Hamstrings" },
    { value: "calves", label: "Calves" },
    { value: "lats", label: "Lats" },
    { value: "traps", label: "Traps" },
    { value: "deltoids", label: "Deltoids" },
    { value: "forearms", label: "Forearms" },
];

const TEMPLATE_SOURCE_OPTIONS = [
    { value: "all", label: "All Templates" },
    { value: "my", label: "My Templates" },
    { value: "community", label: "Community" },
    { value: "ai", label: "AI Generated" },
];

function TemplateCard({ template, index }: { template: WorkoutTemplate; index: number }) {
    const primaryMuscles = template.metadata.primaryMuscles.slice(0, 3);
    const workoutDays = Object.values(template.weeklyPlan.days).filter(day => !day.isRestDay);
    const totalDays = workoutDays.length;
    const estimatedTime = workoutDays[0]?.estimatedDuration || 60;

    // Determine template source type based on authorName
    const isAIGenerated = template.authorName?.toLowerCase().includes('ai') || template.authorName === 'FitFlow AI';
    const isCommunity = template.authorName !== 'FitFlow AI' && template.authorName !== 'system';

    return (
        <BlurFade delay={0.1 + index * 0.05} inView>
            <Card className="group relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {template.name}
                                </CardTitle>
                                {isAIGenerated && (
                                    <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 dark:from-purple-900 dark:to-blue-900 dark:text-purple-300 dark:border-purple-700">
                                        <Bot className="h-3 w-3 mr-1" />
                                        AI
                                    </Badge>
                                )}
                                {isCommunity && (
                                    <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 dark:border-green-700">
                                        <Users className="h-3 w-3 mr-1" />
                                        Community
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-sm text-muted-foreground">
                                {template.description}
                            </CardDescription>
                            <div className="text-xs text-muted-foreground">
                                by {template.authorName || 'Unknown'}
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className={`${DIFFICULTY_COLORS[template.metadata.difficulty]} font-medium`}
                        >
                            {template.metadata.difficulty}
                        </Badge>
                    </div>

                    {/* Muscle Groups */}
                    <div className="flex flex-wrap gap-1.5">
                        {primaryMuscles.map((muscle: string) => (
                            <Badge
                                key={muscle}
                                variant="outline"
                                className="text-xs"
                                style={{
                                    borderColor: (MUSCLE_GROUP_COLORS as any)[muscle] || "#6b7280",
                                    color: (MUSCLE_GROUP_COLORS as any)[muscle] || "#6b7280",
                                }}
                            >
                                {muscle}
                            </Badge>
                        ))}
                        {template.metadata.primaryMuscles.length > 3 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{template.metadata.primaryMuscles.length - 3} more
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{estimatedTime}min</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{totalDays} days</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{template.metadata.category}</span>
                        </div>
                    </div>

                    {/* Rating and Usage Stats */}
                    {(template.rating || template.timesUsed) && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {template.rating && (
                                <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-medium">{template.rating}</span>
                                    {template.reviews && (
                                        <span className="text-muted-foreground">({template.reviews})</span>
                                    )}
                                </div>
                            )}
                            {template.timesUsed && (
                                <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-muted-foreground">{template.timesUsed.toLocaleString()} uses</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Equipment */}
                    {template.metadata.equipment.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Equipment Needed
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {template.metadata.equipment.slice(0, 3).map((equipment: string) => (
                                    <Badge key={equipment} variant="secondary" className="text-xs bg-muted">
                                        {equipment}
                                    </Badge>
                                ))}
                                {template.metadata.equipment.length > 3 && (
                                    <Badge variant="secondary" className="text-xs bg-muted">
                                        +{template.metadata.equipment.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                        <Button
                            asChild
                            variant="default"
                            size="sm"
                            className="flex-1 group/btn relative overflow-hidden"
                        >
                            <Link href={`/templates/${template.id}`}>
                                <span className="relative z-10">Use Template</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                            Preview
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </BlurFade>
    );
}

export default function TemplatesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [selectedBodyPart, setSelectedBodyPart] = useState("all");
    const [selectedSource, setSelectedSource] = useState("all");

    // Calculate template statistics
    const templateStats = useMemo(() => {
        const total = SAMPLE_TEMPLATES.length;
        const aiGenerated = SAMPLE_TEMPLATES.filter(t => 
            t.authorName?.toLowerCase().includes('ai') || t.authorName === 'FitFlow AI'
        ).length;
        const community = SAMPLE_TEMPLATES.filter(t => 
            t.authorName !== 'FitFlow AI' && t.authorName !== 'system'
        ).length;
        const myTemplates = SAMPLE_TEMPLATES.filter(t => 
            t.authorName === 'You'
        ).length;

        return { total, aiGenerated, community, myTemplates };
    }, []);

    const filteredTemplates = useMemo(() => {
        return SAMPLE_TEMPLATES.filter((template) => {
            const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.metadata.primaryMuscles.some((muscle: string) =>
                    muscle.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesCategory = selectedCategory === "all" ||
                template.metadata.category.toLowerCase() === selectedCategory.toLowerCase();

            const matchesDifficulty = selectedDifficulty === "all" ||
                template.metadata.difficulty === selectedDifficulty;

            const matchesBodyPart = selectedBodyPart === "all" ||
                template.metadata.primaryMuscles.some((muscle: string) =>
                    muscle.toLowerCase() === selectedBodyPart.toLowerCase()
                );

            const isAIGenerated = template.authorName?.toLowerCase().includes('ai') || template.authorName === 'FitFlow AI';
            const isCommunity = template.authorName !== 'FitFlow AI' && template.authorName !== 'system';
            const isMyTemplate = template.authorName === 'You'; // This would be dynamic based on user

            const matchesSource = selectedSource === "all" ||
                (selectedSource === "ai" && isAIGenerated) ||
                (selectedSource === "community" && isCommunity) ||
                (selectedSource === "my" && isMyTemplate);

            return matchesSearch && matchesCategory && matchesDifficulty && matchesBodyPart && matchesSource;
        });
    }, [searchQuery, selectedCategory, selectedDifficulty, selectedBodyPart, selectedSource]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <AppHeader
                title="Workout Templates"
                description="Browse and create professional workout templates"
            />
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <BlurFade delay={0} inView>
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <Sparkles className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Workout Templates
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover professionally designed workout templates to accelerate your fitness journey.
                            Browse community favorites, AI-generated routines, and create your own custom programs.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                                <Bot className="h-4 w-4 text-purple-500" />
                                <span>AI-Powered Templates</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-green-500" />
                                <span>Community Verified</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Crown className="h-4 w-4 text-yellow-500" />
                                <span>Expert Designed</span>
                            </div>
                        </div>
                    </div>
                </BlurFade>

                {/* Quick Stats */}
                <BlurFade delay={0.05} inView>
                    <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-muted">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-primary">{templateStats.total}</div>
                                    <div className="text-sm text-muted-foreground">Total Templates</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-purple-600">{templateStats.aiGenerated}</div>
                                    <div className="text-sm text-muted-foreground">AI Generated</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-green-600">{templateStats.community}</div>
                                    <div className="text-sm text-muted-foreground">Community</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-blue-600">{templateStats.myTemplates}</div>
                                    <div className="text-sm text-muted-foreground">My Templates</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>

                {/* Action Buttons */}
                <BlurFade delay={0.1} inView>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="group relative overflow-hidden">
                                <Link href="/templates/builder">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Template
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="group border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950">
                                <Link href="/templates/builder?ai=true">
                                    <Sparkles className="h-5 w-5 mr-2" />
                                    Create with AI
                                </Link>
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                        </div>
                    </div>
                </BlurFade>

                {/* Enhanced Filters */}
                <BlurFade delay={0.2} inView>
                    <Card className="border-dashed">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Body Part" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BODY_PART_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DIFFICULTY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedSource} onValueChange={setSelectedSource}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TEMPLATE_SOURCE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            index={index}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <BlurFade delay={0.3} inView>
                        <Card className="border-dashed">
                            <CardContent className="p-12 text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">No templates found</h3>
                                    <p className="text-muted-foreground">
                                        Try adjusting your search criteria or create a new template.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <Button asChild>
                                        <Link href="/templates/builder">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Template
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/templates/builder?ai=true">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Create with AI
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </BlurFade>
                )}
            </div>
        </div>
    );
}
