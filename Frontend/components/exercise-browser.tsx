"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Dumbbell,
    Search,
    Filter,
    Play,
    Info,
    Plus,
    X,
} from "lucide-react"
import { useExercises, useExerciseFilters } from "@/hooks/useExercises"
import { cn } from "@/lib/utils"
import type { ExerciseFilters } from "@/lib/api"

export default function ExerciseBrowser() {
    const [searchTerm, setSearchTerm] = useState("")
    const [localFilters, setLocalFilters] = useState<ExerciseFilters>({})
    const [selectedExercise, setSelectedExercise] = useState<any>(null)

    const { exercises, isLoading, updateFilters, resetFilters, pagination } = useExercises(localFilters)
    const { filterOptions } = useExerciseFilters()

    const handleSearch = () => {
        updateFilters({ search: searchTerm })
    }

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value || undefined }
        setLocalFilters(newFilters)
        updateFilters(newFilters)
    }

    const clearFilters = () => {
        setLocalFilters({})
        setSearchTerm("")
        resetFilters()
    }

    const activeFiltersCount = Object.keys(localFilters).filter(k => localFilters[k as keyof ExerciseFilters]).length

    return (
        <div className="container max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Dumbbell className="h-8 w-8 text-primary" />
                    Exercise Library
                </h1>
                <p className="text-muted-foreground mt-1">
                    Browse {pagination.totalItems || 0} exercises with detailed instructions and videos
                </p>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Filter className="h-5 w-5" />
                        Search & Filter
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary">{activeFiltersCount} active</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search exercises by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleSearch}>Search</Button>
                    </div>

                    {/* Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Muscle Group</Label>
                            <Select
                                value={localFilters.muscleGroup}
                                onValueChange={(value) => handleFilterChange("muscleGroup", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    {filterOptions?.muscleGroups?.map((group: string) => (
                                        <SelectItem key={group} value={group}>{group}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Equipment</Label>
                            <Select
                                value={localFilters.equipment}
                                onValueChange={(value) => handleFilterChange("equipment", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    {filterOptions?.equipment?.map((eq: string) => (
                                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select
                                value={localFilters.difficulty}
                                onValueChange={(value) => handleFilterChange("difficulty", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={localFilters.category}
                                onValueChange={(value) => handleFilterChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    {filterOptions?.categories?.map((cat: string) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {activeFiltersCount > 0 && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Exercise Grid */}
            {isLoading ? (
                <div className="text-center py-12">
                    <Dumbbell className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading exercises...</p>
                </div>
            ) : exercises.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No exercises found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Try adjusting your search or filters
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((exercise) => (
                            <Card key={exercise._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base line-clamp-1">
                                                {exercise.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-1">
                                                {exercise.muscleGroup}
                                            </CardDescription>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setSelectedExercise(exercise)}
                                                >
                                                    <Info className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>{exercise.name}</DialogTitle>
                                                    <DialogDescription>
                                                        {exercise.category} • {exercise.muscleGroup}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    {exercise.videoUrl && (
                                                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                                            <Play className="h-12 w-12 text-muted-foreground" />
                                                            {/* Video player would go here */}
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Equipment</Label>
                                                            <p className="text-sm">{exercise.equipment}</p>
                                                        </div>
                                                        <div>
                                                            <Label>Difficulty</Label>
                                                            <p className="text-sm capitalize">{exercise.difficulty}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label>Primary Muscles</Label>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {exercise.primaryMuscles?.map((muscle: string) => (
                                                                <Badge key={muscle} variant="secondary">{muscle}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                                                        <div>
                                                            <Label>Secondary Muscles</Label>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {exercise.secondaryMuscles.map((muscle: string) => (
                                                                    <Badge key={muscle} variant="outline">{muscle}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <Label>Instructions</Label>
                                                        <ol className="list-decimal list-inside space-y-2 mt-2 text-sm">
                                                            {exercise.instructions?.map((instruction: string, idx: number) => (
                                                                <li key={idx}>{instruction}</li>
                                                            ))}
                                                        </ol>
                                                    </div>

                                                    {exercise.tips && exercise.tips.length > 0 && (
                                                        <div>
                                                            <Label>Tips</Label>
                                                            <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
                                                                {exercise.tips.map((tip: string, idx: number) => (
                                                                    <li key={idx}>{tip}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {exercise.equipment}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs capitalize">
                                            {exercise.difficulty}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {exercise.description || exercise.instructions?.[0]}
                                    </p>

                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Info className="h-3 w-3 mr-1" />
                                                    Details
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                        <Button size="sm" className="flex-1">
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add to Workout
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={pagination.currentPage === 1}
                                onClick={() => updateFilters({ page: pagination.currentPage - 1 })}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-2 px-4">
                                <span className="text-sm">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => updateFilters({ page: pagination.currentPage + 1 })}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
