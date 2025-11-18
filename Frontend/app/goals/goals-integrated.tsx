"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, TrendingUp, CheckCircle } from "lucide-react"
import { useGoals } from "@/hooks/useGoals"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function GoalsPage() {
  const { goals, createGoal, updateGoalProgress, deleteGoal, isLoading } = useGoals()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "strength",
    targetValue: "",
    currentValue: "",
    unit: "kg",
    deadline: "",
  })

  const handleCreateGoal = async () => {
    try {
      await createGoal({
        ...newGoal,
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: parseFloat(newGoal.currentValue || "0"),
      })
      setShowCreateDialog(false)
      setNewGoal({
        title: "",
        type: "strength",
        targetValue: "",
        currentValue: "",
        unit: "kg",
        deadline: "",
      })
    } catch (error) {
      console.error("Create goal error:", error)
    }
  }

  const getProgress = (goal: any) => {
    if (!goal.targetValue || !goal.currentValue) return 0
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Fitness Goals
          </h1>
          <p className="text-muted-foreground mt-1">
            Set and track your fitness goals with AI insights
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input
                  placeholder="E.g., Bench Press 100kg"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Goal Type</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                >
                  <option value="strength">Strength</option>
                  <option value="weight">Weight Loss/Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="habit">Habit</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Value</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No goals yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set your first fitness goal to start tracking progress
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => {
            const progress = getProgress(goal)
            const isComplete = progress >= 100

            return (
              <Card key={goal._id} className={isComplete ? "border-green-500" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {goal.title}
                        {isComplete && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {goal.type} • Due {new Date(goal.deadline).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={isComplete ? "default" : "secondary"}>
                      {progress.toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {goal.currentValue} {goal.unit}
                      </span>
                      <span className="text-muted-foreground">
                        Target: {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="mr-2 h-3 w-3" />
                          Update Progress
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Progress</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Current Value</Label>
                            <Input
                              type="number"
                              defaultValue={goal.currentValue}
                              onBlur={(e) => {
                                const value = parseFloat(e.target.value)
                                if (value !== goal.currentValue) {
                                  updateGoalProgress(goal._id, value)
                                }
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
