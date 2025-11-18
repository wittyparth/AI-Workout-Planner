import AICoachIntegrated from "@/components/ai-coach-integrated"

export default function AICoachPage() {
  return <AICoachIntegrated />
}

const sidebarItems = [
  { icon: Activity, label: "Dashboard", href: "/" },
  { icon: Dumbbell, label: "Workouts", href: "/workouts" },
  { icon: Clock, label: "Timer", href: "/timer" },
  { icon: TrendingUp, label: "Progress", href: "/analytics" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Zap, label: "AI Coach", href: "/ai-coach", active: true },
]

function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border", className)}>
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">FitFlow AI</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <div className="text-2xl font-bold text-primary">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Coach
            </h1>
            <p className="text-sm text-muted-foreground">Get personalized workouts powered by AI</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  )
}

interface QuestionnaireData {
  fitnessLevel: string
  goals: string[]
  timeAvailable: string
  equipment: string[]
  injuries: string
  preferences: string
  workoutDays: string
}

const questionnaire = [
  {
    id: "fitnessLevel",
    title: "What's your current fitness level?",
    type: "radio",
    options: [
      { value: "beginner", label: "Beginner", description: "New to working out or returning after a long break" },
      { value: "intermediate", label: "Intermediate", description: "Regular exercise for 6+ months" },
      { value: "advanced", label: "Advanced", description: "Consistent training for 2+ years" },
    ],
  },
  {
    id: "goals",
    title: "What are your primary fitness goals?",
    type: "checkbox",
    options: [
      { value: "weight-loss", label: "Weight Loss" },
      { value: "muscle-gain", label: "Muscle Gain" },
      { value: "strength", label: "Strength Building" },
      { value: "endurance", label: "Endurance" },
      { value: "flexibility", label: "Flexibility" },
      { value: "general-fitness", label: "General Fitness" },
    ],
  },
  {
    id: "timeAvailable",
    title: "How much time do you have for workouts?",
    type: "radio",
    options: [
      { value: "15-30", label: "15-30 minutes" },
      { value: "30-45", label: "30-45 minutes" },
      { value: "45-60", label: "45-60 minutes" },
      { value: "60+", label: "60+ minutes" },
    ],
  },
  {
    id: "equipment",
    title: "What equipment do you have access to?",
    type: "checkbox",
    options: [
      { value: "bodyweight", label: "Bodyweight Only" },
      { value: "dumbbells", label: "Dumbbells" },
      { value: "barbell", label: "Barbell" },
      { value: "resistance-bands", label: "Resistance Bands" },
      { value: "gym", label: "Full Gym Access" },
      { value: "cardio-machines", label: "Cardio Machines" },
    ],
  },
  {
    id: "workoutDays",
    title: "How many days per week can you work out?",
    type: "radio",
    options: [
      { value: "2-3", label: "2-3 days" },
      { value: "3-4", label: "3-4 days" },
      { value: "4-5", label: "4-5 days" },
      { value: "5-6", label: "5-6 days" },
      { value: "daily", label: "Daily" },
    ],
  },
]

const generatedWorkoutPlan = {
  title: "Personalized 4-Day Training Plan",
  description: "AI-generated workout plan based on your preferences and goals",
  duration: "4 days/week",
  difficulty: "Intermediate",
  estimatedWeeks: "4-6 weeks",
  routines: [
    {
      id: "day1",
      name: "Push Day - Chest, Shoulders & Triceps",
      duration: "45-60 min",
      difficulty: "Intermediate",
      muscleGroups: ["Chest", "Shoulders", "Triceps"],
      exercises: [
        {
          name: "Bench Press (Barbell)",
          sets: 4,
          reps: "8-12",
          muscle: "Chest",
          equipment: "Barbell"
        },
        {
          name: "Overhead Press",
          sets: 3,
          reps: "8-10",
          muscle: "Shoulders",
          equipment: "Barbell"
        },
        {
          name: "Incline Dumbbell Press",
          sets: 3,
          reps: "10-12",
          muscle: "Chest",
          equipment: "Dumbbells"
        },
        {
          name: "Lateral Raises",
          sets: 3,
          reps: "12-15",
          muscle: "Shoulders",
          equipment: "Dumbbells"
        },
        {
          name: "Close-Grip Bench Press",
          sets: 3,
          reps: "8-10",
          muscle: "Triceps",
          equipment: "Barbell"
        },
        {
          name: "Tricep Dips",
          sets: 3,
          reps: "10-15",
          muscle: "Triceps",
          equipment: "Bodyweight"
        }
      ],
      tags: ["Push", "Upper Body", "Strength"]
    },
    {
      id: "day2",
      name: "Pull Day - Back & Biceps",
      duration: "45-60 min",
      difficulty: "Intermediate",
      muscleGroups: ["Back", "Biceps", "Forearms"],
      exercises: [
        {
          name: "Deadlifts",
          sets: 4,
          reps: "5-8",
          muscle: "Back",
          equipment: "Barbell"
        },
        {
          name: "Pull-ups",
          sets: 3,
          reps: "8-12",
          muscle: "Back",
          equipment: "Pull-up Bar"
        },
        {
          name: "Barbell Rows",
          sets: 4,
          reps: "8-10",
          muscle: "Back",
          equipment: "Barbell"
        },
        {
          name: "Lat Pulldowns",
          sets: 3,
          reps: "10-12",
          muscle: "Back",
          equipment: "Cable Machine"
        },
        {
          name: "Barbell Curls",
          sets: 3,
          reps: "10-12",
          muscle: "Biceps",
          equipment: "Barbell"
        },
        {
          name: "Hammer Curls",
          sets: 3,
          reps: "12-15",
          muscle: "Biceps",
          equipment: "Dumbbells"
        }
      ],
      tags: ["Pull", "Back", "Strength"]
    },
    {
      id: "day3",
      name: "Legs & Glutes",
      duration: "50-65 min",
      difficulty: "Intermediate",
      muscleGroups: ["Legs", "Glutes", "Calves"],
      exercises: [
        {
          name: "Squats",
          sets: 4,
          reps: "8-12",
          muscle: "Quads",
          equipment: "Barbell"
        },
        {
          name: "Romanian Deadlifts",
          sets: 3,
          reps: "10-12",
          muscle: "Hamstrings",
          equipment: "Barbell"
        },
        {
          name: "Bulgarian Split Squats",
          sets: 3,
          reps: "12-15",
          muscle: "Quads",
          equipment: "Dumbbells"
        },
        {
          name: "Hip Thrusts",
          sets: 3,
          reps: "12-15",
          muscle: "Glutes",
          equipment: "Barbell"
        },
        {
          name: "Walking Lunges",
          sets: 3,
          reps: "20 steps",
          muscle: "Legs",
          equipment: "Dumbbells"
        },
        {
          name: "Calf Raises",
          sets: 4,
          reps: "15-20",
          muscle: "Calves",
          equipment: "Dumbbells"
        }
      ],
      tags: ["Legs", "Lower Body", "Functional"]
    },
    {
      id: "day4",
      name: "Upper Body & Core",
      duration: "40-50 min",
      difficulty: "Intermediate",
      muscleGroups: ["Chest", "Back", "Arms", "Core"],
      exercises: [
        {
          name: "Push-ups",
          sets: 3,
          reps: "12-20",
          muscle: "Chest",
          equipment: "Bodyweight"
        },
        {
          name: "Inverted Rows",
          sets: 3,
          reps: "10-15",
          muscle: "Back",
          equipment: "Barbell"
        },
        {
          name: "Dumbbell Flyes",
          sets: 3,
          reps: "12-15",
          muscle: "Chest",
          equipment: "Dumbbells"
        },
        {
          name: "Face Pulls",
          sets: 3,
          reps: "15-20",
          muscle: "Shoulders",
          equipment: "Cable Machine"
        },
        {
          name: "Plank",
          sets: 3,
          reps: "45-60 sec",
          muscle: "Core",
          equipment: "Bodyweight"
        },
        {
          name: "Russian Twists",
          sets: 3,
          reps: "20-30",
          muscle: "Core",
          equipment: "Bodyweight"
        }
      ],
      tags: ["Upper Body", "Core", "Accessory"]
    }
  ]
}

export default function AICoachPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const totalSteps = questionnaire.length + 1 // +1 for the final preferences step
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const generateWorkout = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setShowResults(true)
  }

  const regenerateWorkout = async () => {
    setIsRegenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRegenerating(false)
  }

  if (isGenerating) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar className="hidden md:flex" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6 space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">AI is Creating Your Workout</h2>
                  <p className="text-muted-foreground">
                    Analyzing your preferences and generating a personalized workout plan...
                  </p>
                </div>
                <div className="space-y-2">
                  <Progress value={66} className="h-2" />
                  <p className="text-sm text-muted-foreground">Processing fitness data...</p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar className="hidden md:flex" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Plan Header */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <Badge className="bg-primary text-primary-foreground">AI Generated</Badge>
                      </div>
                      <h1 className="text-2xl font-bold">{generatedWorkoutPlan.title}</h1>
                      <p className="text-muted-foreground mb-3">{generatedWorkoutPlan.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {generatedWorkoutPlan.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {generatedWorkoutPlan.difficulty}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {generatedWorkoutPlan.estimatedWeeks} program
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={regenerateWorkout} disabled={isRegenerating}>
                        {isRegenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerate
                      </Button>
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workout Routines */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Workout Routines</h2>
                {generatedWorkoutPlan.routines.map((routine, index) => (
                  <Card key={routine.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <h3 className="font-semibold text-base sm:text-lg truncate">{routine.name}</h3>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {routine.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {routine.duration}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {routine.exercises.length} exercises
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {routine.muscleGroups.map(muscle => (
                              <Badge key={muscle} variant="secondary" className="text-xs">
                                {muscle}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button size="sm" asChild className="shrink-0 ml-4">
                          <Link href="/timer">
                            <Zap className="h-4 w-4 mr-2" />
                            Start
                          </Link>
                        </Button>
                      </div>

                      {/* Exercise Preview */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Exercises</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          {routine.exercises.slice(0, 6).map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="p-2 bg-muted/50 rounded-lg text-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-1">
                                <Dumbbell className="h-4 w-4 text-primary" />
                              </div>
                              <p className="text-xs font-medium truncate">{exercise.name}</p>
                              <p className="text-xs text-muted-foreground">{exercise.sets} sets</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {routine.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Detailed Exercise List (Collapsible) */}
                      <div className="mt-4">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`routine-${routine.id}`}>
                            <AccordionTrigger className="hover:no-underline py-2">
                              <span className="text-sm">View detailed exercise breakdown</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {routine.exercises.map((exercise, exerciseIndex) => (
                                  <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                        {exerciseIndex + 1}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{exercise.name}</p>
                                        <p className="text-xs text-muted-foreground">{exercise.muscle}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{exercise.sets} sets × {exercise.reps}</p>
                                      <p className="text-xs text-muted-foreground">{exercise.equipment}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <Link href="/ai-routines">
                    <Target className="h-4 w-4 mr-2" />
                    Save to My Routines
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Share className="h-4 w-4 mr-2" />
                      Share Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Your AI Workout Plan</DialogTitle>
                      <DialogDescription>
                        Share this personalized workout plan with friends or save it for later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Copy Link
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Export PDF
                        </Button>
                      </div>
                      <Button className="w-full">Share to Community</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false)
                    setCurrentStep(0)
                  }}
                >
                  Create New Plan
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">AI Workout Generator</h2>
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Questionnaire */}
            {currentStep < questionnaire.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>{questionnaire[currentStep].title}</CardTitle>
                  <CardDescription>Help us create the perfect workout for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questionnaire[currentStep].type === "radio" && (
                    <RadioGroup
                      value={formData[questionnaire[currentStep].id as keyof QuestionnaireData] as string}
                      onValueChange={(value) => handleInputChange(questionnaire[currentStep].id, value)}
                    >
                      {questionnaire[currentStep].options?.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={option.value} className="font-medium cursor-pointer">
                              {option.label}
                            </Label>
                            {/* {option.description && (
                              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                            )} */}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {questionnaire[currentStep].type === "checkbox" && (
                    <div className="space-y-3">
                      {questionnaire[currentStep].options?.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <Checkbox
                            id={option.value}
                            checked={
                              (
                                formData[questionnaire[currentStep].id as keyof QuestionnaireData] as string[]
                              )?.includes(option.value) || false
                            }
                            onCheckedChange={(checked) => {
                              const currentValues =
                                (formData[questionnaire[currentStep].id as keyof QuestionnaireData] as string[]) || []
                              if (checked) {
                                handleInputChange(questionnaire[currentStep].id, [...currentValues, option.value])
                              } else {
                                handleInputChange(
                                  questionnaire[currentStep].id,
                                  currentValues.filter((v) => v !== option.value),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={option.value} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Final Preferences */
              <Card>
                <CardHeader>
                  <CardTitle>Additional Preferences</CardTitle>
                  <CardDescription>Any specific requirements or preferences?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="injuries">Injuries or Limitations</Label>
                    <Textarea
                      id="injuries"
                      placeholder="Describe any injuries, physical limitations, or exercises to avoid..."
                      value={formData.injuries || ""}
                      onChange={(e) => handleInputChange("injuries", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferences">Additional Preferences</Label>
                    <Textarea
                      id="preferences"
                      placeholder="Any specific exercises you love or hate? Preferred workout style?"
                      value={formData.preferences || ""}
                      onChange={(e) => handleInputChange("preferences", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={generateWorkout} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate My Workout
                </Button>
              )}
            </div>

            {/* Summary */}
            {currentStep > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Preferences So Far</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {formData.fitnessLevel && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fitness Level:</span>
                        <span className="capitalize">{formData.fitnessLevel}</span>
                      </div>
                    )}
                    {formData.goals && formData.goals.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Goals:</span>
                        <span>{formData.goals.join(", ")}</span>
                      </div>
                    )}
                    {formData.timeAvailable && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Available:</span>
                        <span>{formData.timeAvailable} minutes</span>
                      </div>
                    )}
                    {formData.equipment && formData.equipment.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Equipment:</span>
                        <span>{formData.equipment.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}