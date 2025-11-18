import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
    MoreVertical,
    CheckCircle,
    SkipForward,
    Zap,
    Trophy,
    TrendingUp,
    Play,
    Info,
    Settings,
    Minus,
    Plus
} from "lucide-react"
import { PlateCalculation } from "../types/workout"
import { cn } from "@/lib/utils"

interface SetInputProps {
    currentWeight: number
    currentReps: number
    currentRPE: number
    currentNotes: string
    isWarmupSet: boolean
    isDropSet: boolean
    isResting: boolean
    isPaused: boolean
    plateCalculation: PlateCalculation | null
    lastWorkoutComparison: any
    isPersonalRecord: boolean
    personalRecord?: { weight: number; reps: number }
    getRPEDescription: (rpe: number) => string
    onWeightChange: (weight: number) => void
    onRepsChange: (reps: number) => void
    onRPEChange: (rpe: number) => void
    onNotesChange: (notes: string) => void
    onWarmupChange: (warmup: boolean) => void
    onDropSetChange: (dropSet: boolean) => void
    onAdjustWeight: (delta: number) => void
    onAdjustReps: (delta: number) => void
    onCompleteSet: () => void
    onSkipSet: () => void
    onUseAISuggestion: () => void
}

export function SetInput({
    currentWeight,
    currentReps,
    currentRPE,
    currentNotes,
    isWarmupSet,
    isDropSet,
    isResting,
    isPaused,
    plateCalculation,
    lastWorkoutComparison,
    isPersonalRecord,
    personalRecord,
    getRPEDescription,
    onWeightChange,
    onRepsChange,
    onRPEChange,
    onNotesChange,
    onWarmupChange,
    onDropSetChange,
    onAdjustWeight,
    onAdjustReps,
    onCompleteSet,
    onSkipSet,
    onUseAISuggestion
}: SetInputProps) {
    return (
        <div className="space-y-4">
            {/* Desktop Layout with Exercise Demo */}
            <div className="hidden lg:block">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Exercise Demo Section */}
                    <div className="lg:col-span-1">
                        <Card className="h-fit">
                            <CardContent className="p-4">
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                                    <div className="text-center text-muted-foreground">
                                        <Play className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm">Exercise Demo</p>
                                        <p className="text-xs">Coming Soon</p>
                                    </div>
                                </div>
                                {/* Exercise Tips */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm font-medium">Form Tips</span>
                                    </div>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>• Keep core engaged throughout movement</li>
                                        <li>• Control the negative (eccentric) phase</li>
                                        <li>• Full range of motion for optimal results</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Input Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                {/* Weight & Reps Controls - Desktop Optimized */}
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    {/* Weight Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-lg font-semibold">Weight</Label>
                                            {lastWorkoutComparison && (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Last: {lastWorkoutComparison.weight}lbs
                                                    </Badge>
                                                    {lastWorkoutComparison.performance === 'better' && (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <TrendingUp className="h-3 w-3" />
                                                            <span className="text-xs">↑</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Weight Input with Enhanced Controls */}
                                        <div className="relative">
                                            <div className="flex items-center bg-background border-2 border-border rounded-lg p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(-2.5)}
                                                    className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={currentWeight}
                                                    onChange={(e) => onWeightChange(Number(e.target.value))}
                                                    className="text-center font-mono text-2xl h-12 border-0 bg-transparent focus-visible:ring-0 font-bold"
                                                    step="2.5"
                                                />
                                                <span className="text-muted-foreground text-sm mr-2">lbs</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(2.5)}
                                                    className="h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Weight Increment Buttons - Grouped */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-muted-foreground">Quick adjustments</div>
                                            <div className="grid grid-cols-3 gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(-10)}
                                                    className="h-8 text-xs hover:bg-red-50 hover:border-red-200"
                                                >
                                                    -10
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(-5)}
                                                    className="h-8 text-xs hover:bg-red-50 hover:border-red-200"
                                                >
                                                    -5
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(-2.5)}
                                                    className="h-8 text-xs hover:bg-red-50 hover:border-red-200"
                                                >
                                                    -2.5
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(2.5)}
                                                    className="h-8 text-xs hover:bg-green-50 hover:border-green-200"
                                                >
                                                    +2.5
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(5)}
                                                    className="h-8 text-xs hover:bg-green-50 hover:border-green-200"
                                                >
                                                    +5
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustWeight(10)}
                                                    className="h-8 text-xs hover:bg-green-50 hover:border-green-200"
                                                >
                                                    +10
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Quick Weight Presets */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-muted-foreground">Quick weights</div>
                                            <div className="flex gap-1 flex-wrap">
                                                {[45, 95, 135, 185, 225].filter(w => w !== currentWeight).slice(0, 5).map((weight) => (
                                                    <Button
                                                        key={weight}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onWeightChange(weight)}
                                                        className="h-7 px-2 text-xs hover:bg-primary/10 border border-border/50"
                                                    >
                                                        {weight}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reps Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-lg font-semibold">Reps</Label>
                                            {lastWorkoutComparison && (
                                                <Badge variant="outline" className="text-xs">
                                                    Last: {lastWorkoutComparison.reps}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Main Reps Input with Enhanced Controls */}
                                        <div className="relative">
                                            <div className="flex items-center bg-background border-2 border-border rounded-lg p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onAdjustReps(-1)}
                                                    className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={currentReps}
                                                    onChange={(e) => onRepsChange(Number(e.target.value))}
                                                    className="text-center font-mono text-2xl h-12 border-0 bg-transparent focus-visible:ring-0 font-bold"
                                                />
                                                <span className="text-muted-foreground text-sm mr-2">reps</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onAdjustReps(1)}
                                                    className="h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Reps Increment Buttons - Grouped */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-muted-foreground">Quick adjustments</div>
                                            <div className="grid grid-cols-2 gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustReps(-5)}
                                                    className="h-8 text-xs hover:bg-red-50 hover:border-red-200"
                                                >
                                                    -5
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onAdjustReps(5)}
                                                    className="h-8 text-xs hover:bg-green-50 hover:border-green-200"
                                                >
                                                    +5
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Quick Rep Presets */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-muted-foreground">Common reps</div>
                                            <div className="flex gap-1 flex-wrap">
                                                {[5, 8, 10, 12, 15].filter(r => r !== currentReps).slice(0, 5).map((reps) => (
                                                    <Button
                                                        key={reps}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRepsChange(reps)}
                                                        className="h-7 px-2 text-xs hover:bg-primary/10 border border-border/50"
                                                    >
                                                        {reps}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Plate Calculator - Enhanced for Desktop */}
                                {plateCalculation && currentWeight > 45 && (
                                    <div className="mb-6">
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Plate Loading</div>
                                                <div className="text-xs text-blue-700 dark:text-blue-300">Per side</div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {plateCalculation.plates.map((plate, i) => (
                                                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                        {plate}lb
                                                    </Badge>
                                                ))}
                                                {plateCalculation.remaining > 0 && (
                                                    <span className="text-xs text-blue-600 dark:text-blue-400">
                                                        +{plateCalculation.remaining}lb
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Personal Record Indicator */}
                                {isPersonalRecord && (
                                    <div className="mb-6">
                                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Trophy className="h-5 w-5 text-yellow-600" />
                                                <span className="font-semibold text-yellow-800 dark:text-yellow-100">New Personal Record!</span>
                                            </div>
                                            <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                                This would beat your current PR of {personalRecord?.weight}lbs × {personalRecord?.reps}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* RPE Section - Enhanced */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-medium">RPE (Rate of Perceived Exertion)</Label>
                                        <Badge variant="outline" className="text-sm">
                                            {currentRPE}/10 - {getRPEDescription(currentRPE)}
                                        </Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <Input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={currentRPE}
                                            onChange={(e) => onRPEChange(Number(e.target.value))}
                                            className="h-2"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Very Easy</span>
                                            <span>Moderate</span>
                                            <span>Max Effort</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Enhanced for Desktop */}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={onCompleteSet}
                                        className="flex-1 h-12 text-base font-medium"
                                        disabled={isResting || isPaused}
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Complete Set
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={onSkipSet}
                                        disabled={isResting || isPaused}
                                        className="h-12 px-6"
                                    >
                                        <SkipForward className="h-4 w-4 mr-2" />
                                        Skip
                                    </Button>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-12 w-12">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Set Options</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="warmup"
                                                        checked={isWarmupSet}
                                                        onCheckedChange={onWarmupChange}
                                                    />
                                                    <Label htmlFor="warmup">Mark as warmup set</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="dropset"
                                                        checked={isDropSet}
                                                        onCheckedChange={onDropSetChange}
                                                    />
                                                    <Label htmlFor="dropset">Drop set</Label>
                                                </div>
                                                <Button variant="outline" className="w-full" onClick={onUseAISuggestion}>
                                                    <Zap className="h-4 w-4 mr-2" />
                                                    Use AI Suggestion
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Notes Section */}
                                <div className="mt-6">
                                    <Label htmlFor="notes" className="text-base font-medium mb-3 block">Set Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="How did this set feel? Any form notes?"
                                        value={currentNotes}
                                        onChange={(e) => onNotesChange(e.target.value)}
                                        className="min-h-[80px] resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Compact and Touch-Friendly */}
            <div className="lg:hidden">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Set Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Mobile Weight Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="weight" className="text-sm font-medium">Weight (lbs)</Label>
                                    {lastWorkoutComparison && (
                                        <Badge variant="outline" className="text-xs">
                                            Last: {lastWorkoutComparison.weight}
                                        </Badge>
                                    )}
                                </div>

                                {/* Mobile Weight Input */}
                                <div className="flex items-center bg-background border rounded-lg p-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAdjustWeight(-2.5)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={currentWeight}
                                        onChange={(e) => onWeightChange(Number(e.target.value))}
                                        className="text-center font-mono text-lg h-10 border-0 bg-transparent focus-visible:ring-0"
                                        step="2.5"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAdjustWeight(2.5)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Mobile Weight Quick Buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAdjustWeight(-5)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        -5
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAdjustWeight(5)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        +5
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Reps Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="reps" className="text-sm font-medium">Reps</Label>
                                    {lastWorkoutComparison && (
                                        <Badge variant="outline" className="text-xs">
                                            Last: {lastWorkoutComparison.reps}
                                        </Badge>
                                    )}
                                </div>

                                {/* Mobile Reps Input */}
                                <div className="flex items-center bg-background border rounded-lg p-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAdjustReps(-1)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                        id="reps"
                                        type="number"
                                        value={currentReps}
                                        onChange={(e) => onRepsChange(Number(e.target.value))}
                                        className="text-center font-mono text-lg h-10 border-0 bg-transparent focus-visible:ring-0"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAdjustReps(1)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Mobile Reps Quick Buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAdjustReps(-1)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        -1
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAdjustReps(1)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        +1
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Plate Calculator */}
                        {plateCalculation && currentWeight > 45 && (
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <div className="text-xs font-medium text-muted-foreground mb-1">Plates per side:</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {plateCalculation.plates.map((plate, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                            {plate}lb
                                        </Badge>
                                    ))}
                                    {plateCalculation.remaining > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            +{plateCalculation.remaining}lb
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile Personal Record */}
                        {isPersonalRecord && (
                            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-600" />
                                    <span className="text-sm font-medium text-yellow-800">New PR!</span>
                                </div>
                            </div>
                        )}

                        {/* Mobile RPE */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="rpe" className="text-sm font-medium">RPE</Label>
                                <Badge variant="outline" className="text-xs">
                                    {currentRPE}/10
                                </Badge>
                            </div>
                            <Input
                                id="rpe"
                                type="range"
                                min="1"
                                max="10"
                                value={currentRPE}
                                onChange={(e) => onRPEChange(Number(e.target.value))}
                                className="h-2"
                            />
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="flex gap-3">
                            <Button onClick={onCompleteSet} className="flex-1 h-12" disabled={isResting || isPaused}>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Complete Set
                            </Button>
                            <Button variant="outline" onClick={onSkipSet} disabled={isResting || isPaused} className="h-12 px-4">
                                <SkipForward className="h-4 w-4" />
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-12 w-12">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Set Options</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="warmup-mobile"
                                                checked={isWarmupSet}
                                                onCheckedChange={onWarmupChange}
                                            />
                                            <Label htmlFor="warmup-mobile">Warmup set</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="dropset-mobile"
                                                checked={isDropSet}
                                                onCheckedChange={onDropSetChange}
                                            />
                                            <Label htmlFor="dropset-mobile">Drop set</Label>
                                        </div>
                                        <Button variant="outline" className="w-full" onClick={onUseAISuggestion}>
                                            <Zap className="h-4 w-4 mr-2" />
                                            AI Suggestion
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Mobile Notes */}
                        <div className="space-y-3">
                            <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="How did this set feel?"
                                value={currentNotes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                className="min-h-[60px] resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
