const Goal = require('../models/goal.models');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Goal Service - Business logic for fitness goals
 */
class GoalService {
    /**
     * Create a new goal
     */
    async createGoal(userId, goalData) {
        try {
            const goal = new Goal({
                userId,
                type: goalData.type,
                title: goalData.title,
                description: goalData.description,
                targetValue: goalData.targetValue,
                currentValue: goalData.currentValue || 0,
                unit: goalData.unit,
                targetDate: goalData.targetDate,
                priority: goalData.priority || 'medium',
                relatedExercises: goalData.relatedExercises || []
            });

            // Add default milestones (25%, 50%, 75%, 100%)
            const milestones = [25, 50, 75, 100];
            milestones.forEach(percentage => {
                goal.addMilestone((goalData.targetValue * percentage) / 100, percentage);
            });

            await goal.save();

            logger.info(`Goal created: ${goal._id} for user: ${userId}`);
            return goal;

        } catch (error) {
            logger.error('Error creating goal:', error);
            throw new AppError(`Failed to create goal: ${error.message}`, 500);
        }
    }

    /**
     * Get goal by ID
     */
    async getGoalById(goalId, userId) {
        const goal = await Goal.findOne({ _id: goalId, userId })
            .populate('relatedExercises', 'name primaryMuscleGroups');

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        return goal;
    }

    /**
     * Get all goals for a user
     */
    async getUserGoals(userId, options = {}) {
        const {
            status,
            type,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = options;

        const query = { userId };

        if (status) query.status = status;
        if (type) query.type = type;

        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const goals = await Goal.find(query)
            .sort(sortOptions)
            .populate('relatedExercises', 'name primaryMuscleGroups')
            .lean();

        // Add computed fields
        const enrichedGoals = goals.map(goal => ({
            ...goal,
            progressPercentage: goal.targetValue > 0 ? (goal.currentValue / goal.targetValue * 100).toFixed(2) : 0,
            daysRemaining: Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)),
            isOverdue: new Date() > new Date(goal.targetDate) && goal.status === 'active'
        }));

        return enrichedGoals;
    }

    /**
     * Update goal progress
     */
    async updateGoalProgress(goalId, userId, newValue, notes = '', source = 'manual') {
        const goal = await this.getGoalById(goalId, userId);

        await goal.updateProgress(newValue, notes, source);

        logger.info(`Goal progress updated: ${goalId}, new value: ${newValue}`);

        // Check if goal was just completed
        if (goal.status === 'completed') {
            // Create achievement activity
            const Activity = require('../models/activity.models');
            await Activity.createGoalActivity(userId, goal);

            logger.info(`Goal completed: ${goalId}`);
        }

        return goal;
    }

    /**
     * Update goal
     */
    async updateGoal(goalId, userId, updateData) {
        const goal = await this.getGoalById(goalId, userId);

        // Update allowed fields
        if (updateData.title) goal.title = updateData.title;
        if (updateData.description) goal.description = updateData.description;
        if (updateData.targetValue) goal.targetValue = updateData.targetValue;
        if (updateData.targetDate) goal.targetDate = updateData.targetDate;
        if (updateData.priority) goal.priority = updateData.priority;
        if (updateData.status) goal.status = updateData.status;
        if (updateData.relatedExercises) goal.relatedExercises = updateData.relatedExercises;

        await goal.save();

        logger.info(`Goal updated: ${goalId}`);
        return goal;
    }

    /**
     * Delete goal
     */
    async deleteGoal(goalId, userId) {
        const goal = await Goal.findOneAndDelete({ _id: goalId, userId });

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        logger.info(`Goal deleted: ${goalId}`);
        return { success: true, message: 'Goal deleted successfully' };
    }

    /**
     * Add milestone to goal
     */
    async addMilestone(goalId, userId, milestoneData) {
        const goal = await this.getGoalById(goalId, userId);

        await goal.addMilestone(milestoneData.value, milestoneData.percentage);

        logger.info(`Milestone added to goal: ${goalId}`);
        return goal;
    }

    /**
     * Get goal statistics for a user
     */
    async getGoalStats(userId) {
        const goals = await Goal.find({ userId });

        const stats = {
            total: goals.length,
            active: goals.filter(g => g.status === 'active').length,
            completed: goals.filter(g => g.status === 'completed').length,
            failed: goals.filter(g => g.status === 'failed').length,
            paused: goals.filter(g => g.status === 'paused').length,
            byType: {},
            averageCompletionRate: 0,
            upcoming: goals.filter(g => g.status === 'active' && g.targetDate > new Date()).length,
            overdue: goals.filter(g => g.status === 'active' && g.targetDate < new Date()).length
        };

        // Count by type
        goals.forEach(goal => {
            stats.byType[goal.type] = (stats.byType[goal.type] || 0) + 1;
        });

        // Calculate average completion rate
        const activeGoals = goals.filter(g => g.status === 'active');
        if (activeGoals.length > 0) {
            const totalProgress = activeGoals.reduce((sum, g) => {
                return sum + ((g.currentValue / g.targetValue) * 100);
            }, 0);
            stats.averageCompletionRate = (totalProgress / activeGoals.length).toFixed(2);
        }

        return stats;
    }

    /**
     * Get goal progress insights
     */
    async getGoalInsights(goalId, userId) {
        const goal = await this.getGoalById(goalId, userId);

        const velocity = goal.getProgressVelocity();
        const predictedDate = goal.predictCompletionDate();

        const insights = {
            currentProgress: {
                value: goal.currentValue,
                targetValue: goal.targetValue,
                percentage: ((goal.currentValue / goal.targetValue) * 100).toFixed(2),
                remaining: goal.targetValue - goal.currentValue
            },
            timeline: {
                startDate: goal.startDate,
                targetDate: goal.targetDate,
                daysElapsed: Math.ceil((new Date() - goal.startDate) / (1000 * 60 * 60 * 24)),
                daysRemaining: Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24)),
                isOverdue: goal.isOverdue
            },
            velocity: {
                unitsPerDay: velocity.toFixed(2),
                predictedCompletionDate: predictedDate,
                onTrack: predictedDate && predictedDate <= goal.targetDate
            },
            milestones: {
                total: goal.milestones.length,
                completed: goal.milestones.filter(m => m.isCompleted).length,
                next: goal.milestones.find(m => !m.isCompleted)
            },
            recentProgress: goal.progress.slice(-5).reverse()
        };

        return insights;
    }

    /**
     * Auto-update goals from workout data
     */
    async autoUpdateGoalsFromWorkout(userId, workout) {
        try {
            // Find strength-related goals
            const strengthGoals = await Goal.find({
                userId,
                status: 'active',
                type: 'strength'
            });

            for (const goal of strengthGoals) {
                // Check if workout contains exercises related to this goal
                const relatedExercise = workout.sessionData.exercises.find(ex =>
                    goal.relatedExercises.some(ge => ge.toString() === ex.exerciseId.toString())
                );

                if (relatedExercise && relatedExercise.personalRecords.length > 0) {
                    const pr = relatedExercise.personalRecords.find(pr => pr.type === 'max_weight');
                    if (pr && pr.value > goal.currentValue) {
                        await goal.updateProgress(pr.value, `Auto-updated from workout: ${workout.sessionData.name}`, 'workout');
                        logger.info(`Auto-updated goal ${goal._id} from workout PR`);
                    }
                }
            }

            // Update frequency goals (workouts per week)
            const frequencyGoals = await Goal.find({
                userId,
                status: 'active',
                type: 'endurance',
                unit: 'workouts'
            });

            for (const goal of frequencyGoals) {
                const currentWorkouts = goal.currentValue || 0;
                await goal.updateProgress(currentWorkouts + 1, 'Workout completed', 'workout');
            }

        } catch (error) {
            logger.error('Error auto-updating goals:', error);
            // Don't throw - this shouldn't block workout completion
        }
    }
}

module.exports = new GoalService();
