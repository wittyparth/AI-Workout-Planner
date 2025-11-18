'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { sampleWorkout } from '@/data/workouts/push-workout'
import Link from 'next/link'
import {
  ChevronLeft,
  Play,
  Pause,
  Clock,
  BarChart3,
  CheckCircle,
  Trophy,
  Target,
  Timer,
  Plus,
  Minus,
  SkipForward,
  ArrowRight,
  Activity,
  Heart,
  Star,
  Award,
  Flame,
  Zap,
  Weight,
  Repeat
} from 'lucide-react'

// MagicUI Components
import { BlurFade } from '@/components/magicui/blur-fade'
import { MagicCard } from '@/components/magicui/magic-card'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Meteors } from '@/components/magicui/meteors'
import { Particles } from '@/components/magicui/particles'
import { NeonGradientCard } from '@/components/magicui/neon-gradient-card'
import { TextAnimate } from '@/components/magicui/text-animate'
import { AuroraText } from '@/components/magicui/aurora-text'

export default function WorkoutTimer() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(90)
  const [customRestTime, setCustomRestTime] = useState(90)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [workoutSets, setWorkoutSets] = useState<Record<string, any[]>>({})
  const [editingSet, setEditingSet] = useState<number | null>(null)
  const [workoutStartTime] = useState(Date.now())
  const [showStats, setShowStats] = useState(false)
  const [showExerciseDetails, setShowExerciseDetails] = useState(false)
  const [setsCompleted, setSetsCompleted] = useState(0)

  const currentExercise = sampleWorkout[currentExerciseIndex]
  const exerciseSets = workoutSets[currentExercise.id] || []

  // Calculate workout stats
  const completedSets = Object.values(workoutSets).flat().filter(set => set.completed)
  const totalVolume = completedSets.reduce((total, set) => total + (set.weight * set.reps), 0)
  const averageRPE = completedSets.length > 0
    ? completedSets.reduce((total, set) => total + (set.rpe || 0), 0) / completedSets.length
    : 0
  const workoutDuration = Math.floor((Date.now() - workoutStartTime) / 1000)

  // Initialize sets with last workout data
  useEffect(() => {
    if (!workoutSets[currentExercise.id]) {
      const initialSets = Array.from({ length: currentExercise.sets }, (_, i) => ({
        weight: currentExercise.lastWorkout?.sets[i]?.weight || 0,
        reps: currentExercise.lastWorkout?.sets[i]?.reps || 10,
        rpe: 7,
        completed: false,
        restTime: 0
      }))
      setWorkoutSets(prev => ({
        ...prev,
        [currentExercise.id]: initialSets
      }))
    }
  }, [currentExercise.id])

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && restTime > 0) {
      const timer = setInterval(() => {
        setRestTime(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (restTime === 0) {
      setIsTimerRunning(false)
      setIsResting(false)
    }
  }, [isTimerRunning, restTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const completeSet = (setIndex: number) => {
    const updatedSets = [...exerciseSets]
    updatedSets[setIndex] = { ...updatedSets[setIndex], completed: true, completedAt: Date.now() }
    setWorkoutSets(prev => ({
      ...prev,
      [currentExercise.id]: updatedSets
    }))
    setSetsCompleted(prev => prev + 1)

    if (setIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(setIndex + 1)
      setIsResting(true)
      setRestTime(customRestTime)
      setIsTimerRunning(true)
    } else {
      nextExercise()
    }
    setEditingSet(null)
  }

  const skipSet = () => {
    if (currentSetIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(currentSetIndex + 1)
    } else {
      nextExercise()
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < sampleWorkout.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSetIndex(0)
      setIsResting(false)
      setIsTimerRunning(false)
    }
  }

  const skipExercise = () => {
    nextExercise()
  }

  const updateSetValue = (setIndex: number, field: 'weight' | 'reps' | 'rpe', value: number) => {
    const updatedSets = [...exerciseSets]
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value }
    setWorkoutSets(prev => ({
      ...prev,
      [currentExercise.id]: updatedSets
    }))
  }

  const setRestTimer = (seconds: number) => {
    setCustomRestTime(seconds)
    setRestTime(seconds)
    setIsResting(true)
    setIsTimerRunning(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Background Effects */}
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={80}
        color="#8B5CF6"
      />
      
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto max-w-6xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div className="min-w-0 flex-1">
                  <TextAnimate
                    animation="slideUp"
                    by="word"
                    className="text-base sm:text-xl font-bold truncate"
                  >
                    {currentExercise.name}
                  </TextAnimate>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      {currentExercise.muscle}
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Exercise {currentExerciseIndex + 1}/{sampleWorkout.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={showStats} onOpenChange={setShowStats}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <BarChart3 className="h-4 w-4" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Workout Stats
                      </DialogTitle>
                    </DialogHeader>
                    <MagicCard className="p-0">
                      <div className="space-y-4 p-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="space-y-1">
                            <NumberTicker 
                              value={completedSets.length} 
                              className="text-2xl font-bold text-blue-600"
                            />
                            <div className="text-xs text-muted-foreground">Sets</div>
                          </div>
                          <div className="space-y-1">
                            <NumberTicker 
                              value={Math.round(totalVolume)} 
                              className="text-2xl font-bold text-green-600"
                            />
                            <div className="text-xs text-muted-foreground">Volume (lbs)</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-purple-600">{formatTime(workoutDuration)}</div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                          </div>
                          <div className="space-y-1">
                            <NumberTicker 
                              value={averageRPE} 
                              decimalPlaces={1}
                              className="text-2xl font-bold text-orange-600"
                            />
                            <div className="text-xs text-muted-foreground">Avg RPE</div>
                          </div>
                        </div>
                      </div>
                    </MagicCard>
                  </DialogContent>
                </Dialog>
                <Badge variant="outline" className="text-xs bg-white/50 backdrop-blur">
                  <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                  Set {currentSetIndex + 1}/{currentExercise.sets}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <div className="container mx-auto max-w-6xl p-4 space-y-4 sm:space-y-6">

        {/* Exercise Demo Card */}
        <BlurFade delay={0.2}>
          <NeonGradientCard 
            className="overflow-hidden"
            neonColors={{
              firstColor: "#8B5CF6",
              secondColor: "#06B6D4"
            }}
          >
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              <Meteors number={10} />
              <div className="text-center text-muted-foreground relative z-10">
                <div className="mb-4 relative">
                  <div className="h-20 w-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                  <BorderBeam size={80} duration={3} />
                </div>
                <AuroraText className="text-lg sm:text-2xl font-bold mb-2">
                  {currentExercise.name}
                </AuroraText>
                <p className="text-sm sm:text-base opacity-80">Exercise demonstration</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Heart className="h-3 w-3 mr-1" />
                {currentExercise.muscle}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                {currentExercise.equipment}
              </Badge>
            </div>

            <Dialog open={showExerciseDetails} onOpenChange={setShowExerciseDetails}>
              <DialogTrigger asChild>
                <ShimmerButton className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Exercise Details
                </ShimmerButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {currentExercise.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Target Muscles
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {currentExercise.targetMuscles.map(muscle => (
                        <Badge key={muscle} variant="secondary" className="text-xs">{muscle}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      Form Tips
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {currentExercise.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      Personal Record
                    </h4>
                    <MagicCard className="p-0">
                      <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">
                            {currentExercise.personalRecord.weight > 0
                              ? `${currentExercise.personalRecord.weight}lbs × ${currentExercise.personalRecord.reps}`
                              : `${currentExercise.personalRecord.reps} reps`
                            }
                          </span>
                        </div>
                      </div>
                    </MagicCard>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </NeonGradientCard>
        </BlurFade>

        {/* Enhanced Rest Timer */}
        {isResting && (
          <BlurFade delay={0.3}>
            <MagicCard className="border-orange-500/50 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 overflow-hidden relative">
              <Meteors number={15} />
              <div className="p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Clock className="h-8 w-8 text-orange-500" />
                      <div className="absolute -inset-1 bg-orange-400 rounded-full opacity-25 animate-ping" />
                    </div>
                    <div>
                      <NumberTicker 
                        value={restTime} 
                        className="text-3xl sm:text-4xl font-bold text-orange-600"
                        direction="down"
                      />
                      <div className="text-sm text-muted-foreground">seconds remaining</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ShimmerButton
                      size="sm"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="h-10 w-10 p-0"
                    >
                      {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </ShimmerButton>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsResting(false)
                        setIsTimerRunning(false)
                      }}
                      className="backdrop-blur-sm bg-white/50"
                    >
                      Skip Rest
                    </Button>
                  </div>
                </div>

                {/* Quick Timer Options */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground self-center">Quick set:</span>
                  {[30, 60, 90, 120, 180].map(seconds => (
                    <Button
                      key={seconds}
                      variant="ghost"
                      size="sm"
                      onClick={() => setRestTimer(seconds)}
                      className="h-8 px-3 text-xs bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all"
                    >
                      {formatTime(seconds)}
                    </Button>
                  ))}
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        )}

        {/* Sets Log */}
        <BlurFade delay={0.4}>
          <MagicCard className="overflow-hidden">
            <BorderBeam size={250} duration={12} delay={9} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <AnimatedGradientText className="text-lg font-bold">
                      🎯 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
                      <span className="inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                        Sets Progress
                      </span>
                    </AnimatedGradientText>
                    <p className="text-sm text-muted-foreground">
                      {exerciseSets.filter(s => s.completed).length}/{currentExercise.sets} completed
                    </p>
                  </div>
                </div>
                <ShimmerButton
                  size="sm"
                  onClick={() => setRestTimer(customRestTime)}
                  className="h-10"
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Start Timer
                </ShimmerButton>
              </div>

              <div className="space-y-3">
                {Array.from({ length: currentExercise.sets }, (_, i) => {
                  const set = exerciseSets[i] || {
                    weight: currentExercise.lastWorkout?.sets[i]?.weight || 0,
                    reps: currentExercise.lastWorkout?.sets[i]?.reps || 10,
                    rpe: 7,
                    completed: false
                  }
                  const isCurrentSet = i === currentSetIndex
                  const isCompleted = set.completed
                  const lastWorkoutSet = currentExercise.lastWorkout?.sets[i]
                  const isPersonalRecord = set.weight >= (currentExercise.personalRecord?.weight || 0) &&
                    set.reps >= (currentExercise.personalRecord?.reps || 0)

                  return (
                    <BlurFade key={i} delay={0.5 + i * 0.1}>
                      <NeonGradientCard
                        className={cn(
                          "transition-all duration-300",
                          isCompleted 
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" 
                            : isCurrentSet 
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" 
                              : "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20"
                        )}
                        neonColors={
                          isCompleted 
                            ? { firstColor: "#10B981", secondColor: "#059669" }
                            : isCurrentSet 
                              ? { firstColor: "#3B82F6", secondColor: "#8B5CF6" }
                              : { firstColor: "#6B7280", secondColor: "#9CA3AF" }
                        }
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all",
                              isCompleted 
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse" 
                                : isCurrentSet 
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                                  : "bg-gradient-to-r from-gray-400 to-slate-400 text-white"
                            )}>
                              {isCompleted ? <CheckCircle className="h-4 w-4" /> : i + 1}
                            </div>

                            {lastWorkoutSet && (
                              <Badge variant="outline" className="text-xs bg-white/50 backdrop-blur">
                                Last: {lastWorkoutSet.weight > 0 ? `${lastWorkoutSet.weight}×` : ''}{lastWorkoutSet.reps}
                              </Badge>
                            )}

                            {isPersonalRecord && !isCompleted && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                                <Trophy className="h-3 w-3 mr-1" />
                                PR!
                              </Badge>
                            )}

                            {isCompleted && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-3 mb-4">
                            {/* Weight Input */}
                            {currentExercise.equipment !== "Bodyweight" && (
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Weight className="h-3 w-3" />
                                  Weight
                                </Label>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateSetValue(i, 'weight', Math.max(0, set.weight - 5))}
                                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                                    disabled={isCompleted}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) => updateSetValue(i, 'weight', parseFloat(e.target.value) || 0)}
                                    className="text-center h-8 text-sm bg-white/50 backdrop-blur border-0 focus:ring-2 focus:ring-blue-500"
                                    disabled={isCompleted}
                                    min="0"
                                    step="5"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateSetValue(i, 'weight', set.weight + 5)}
                                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                                    disabled={isCompleted}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Reps Input */}
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Repeat className="h-3 w-3" />
                                Reps
                              </Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateSetValue(i, 'reps', Math.max(1, set.reps - 1))}
                                  className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                                  disabled={isCompleted}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => updateSetValue(i, 'reps', parseInt(e.target.value) || 1)}
                                  className="text-center h-8 text-sm bg-white/50 backdrop-blur border-0 focus:ring-2 focus:ring-green-500"
                                  disabled={isCompleted}
                                  min="1"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateSetValue(i, 'reps', set.reps + 1)}
                                  className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                                  disabled={isCompleted}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* RPE Input */}
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                RPE
                              </Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateSetValue(i, 'rpe', Math.max(1, set.rpe - 1))}
                                  className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900"
                                  disabled={isCompleted}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={set.rpe}
                                  onChange={(e) => updateSetValue(i, 'rpe', parseInt(e.target.value) || 1)}
                                  className="text-center h-8 text-sm bg-white/50 backdrop-blur border-0 focus:ring-2 focus:ring-orange-500"
                                  disabled={isCompleted}
                                  min="1"
                                  max="10"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateSetValue(i, 'rpe', Math.min(10, set.rpe + 1))}
                                  className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900"
                                  disabled={isCompleted}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Complete/Skip Buttons */}
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground opacity-0">Action</Label>
                              <div className="flex gap-1">
                                {!isCompleted && isCurrentSet && (
                                  <ShimmerButton
                                    onClick={() => completeSet(i)}
                                    size="sm"
                                    className="flex-1 h-8 text-xs"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Done
                                  </ShimmerButton>
                                )}
                                {!isCompleted && isCurrentSet && (
                                  <Button
                                    variant="ghost"
                                    onClick={skipSet}
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                                  >
                                    <SkipForward className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Progress bar for current set */}
                          {isCurrentSet && !isCompleted && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{Math.round((set.weight * set.reps) / Math.max(1, (lastWorkoutSet?.weight || 1) * (lastWorkoutSet?.reps || 1)) * 100)}% vs last</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                  style={{
                                    width: `${Math.min(100, Math.max(0, (set.weight * set.reps) / Math.max(1, (lastWorkoutSet?.weight || 1) * (lastWorkoutSet?.reps || 1)) * 100))}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </NeonGradientCard>
                    </BlurFade>
                  )
                })}
              </div>
            </div>
          </MagicCard>
        </BlurFade>

        {/* Workout Progress Stats */}
        <BlurFade delay={0.8}>
          <MagicCard className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <AuroraText className="text-lg font-bold">
                  Workout Stats
                </AuroraText>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <NumberTicker 
                    value={setsCompleted} 
                    className="text-2xl font-bold text-blue-600"
                  />
                  <div className="text-xs text-muted-foreground">Sets</div>
                </div>
                <div className="space-y-1">
                  <NumberTicker 
                    value={Math.round(totalVolume)} 
                    className="text-2xl font-bold text-green-600"
                  />
                  <div className="text-xs text-muted-foreground">Volume</div>
                </div>
                <div className="space-y-1">
                  <TextAnimate 
                    text={formatTime(workoutDuration)}
                    className="text-2xl font-bold text-purple-600"
                  />
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
                <div className="space-y-1">
                  <NumberTicker 
                    value={averageRPE} 
                    decimalPlaces={1}
                    className="text-2xl font-bold text-orange-600"
                  />
                  <div className="text-xs text-muted-foreground">RPE</div>
                </div>
              </div>
            </div>
          </MagicCard>
        </BlurFade>

        {/* Navigation Buttons */}
        <BlurFade delay={0.9}>
          <div className="flex gap-3">
            {/* Skip Exercise */}
            <Button
              onClick={skipExercise}
              variant="outline"
              className="flex-1 h-12 bg-white/50 backdrop-blur border-orange-200 hover:bg-orange-50"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Exercise
            </Button>

            {/* Next Exercise */}
            {currentExerciseIndex < sampleWorkout.length - 1 ? (
              <ShimmerButton
                onClick={nextExercise}
                className="flex-1 h-12"
                disabled={exerciseSets.filter(s => s.completed).length === 0}
              >
                Next: {sampleWorkout[currentExerciseIndex + 1]?.name.slice(0, 15)}...
                <ArrowRight className="h-4 w-4 ml-2" />
              </ShimmerButton>
            ) : (
              exerciseSets.every(set => set.completed) && (
                <ShimmerButton
                  className="flex-1 h-12"
                  asChild
                >
                  <Link href="/">
                    🎉 Finish Workout
                    <Trophy className="h-4 w-4 ml-2" />
                  </Link>
                </ShimmerButton>
              )
            )}
          </div>
        </BlurFade>

      </div>
    </div>
  )
}
