import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Timer, Pause, Play, FastForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface RestTimerProps {
    isResting: boolean
    timeLeft: number
    restWarning: boolean
    quickRestTimes: number[]
    isRunning: boolean
    isPaused: boolean
    formatTime: (seconds: number) => string
    onSetTime: (time: number) => void
    onToggleTimer: () => void
    onSkipRest: () => void
    onWarningClear: () => void
}

export function RestTimer({
    isResting,
    timeLeft,
    restWarning,
    quickRestTimes,
    isRunning,
    isPaused,
    formatTime,
    onSetTime,
    onToggleTimer,
    onSkipRest,
    onWarningClear
}: RestTimerProps) {
    if (!isResting) return null

    return (
        <Card className={cn(
            "border-accent bg-accent/5",
            restWarning && "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
        )}>
            <CardContent className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Timer className={cn(
                                "h-5 w-5",
                                restWarning ? "text-orange-500" : "text-accent"
                            )} />
                            <span className="font-medium">
                                {restWarning ? "Almost Ready!" : "Rest"}
                            </span>
                        </div>
                        <div className={cn(
                            "text-2xl font-bold tabular-nums",
                            restWarning ? "text-orange-500" : "text-accent"
                        )}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {quickRestTimes.slice(0, 3).map((time) => (
                            <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onSetTime(time)
                                    onWarningClear()
                                }}
                            >
                                {formatTime(time)}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onToggleTimer}
                            disabled={isPaused}
                        >
                            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onSkipRest}
                        >
                            <FastForward className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
