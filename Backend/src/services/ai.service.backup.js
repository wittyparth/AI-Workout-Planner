const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/environment');
const logger = require('../utils/logger');
const Exercise = require('../models/exercise.models');
const User = require('../models/user.models');

/**
 * AI Service for workout generation and recommendations using Google Gemini
 * Production-ready implementation with timeout handling, retries, and fallbacks
 */
class AIService {
    constructor() {
        if (!config.GEMINI_API_KEY) {
            logger.warn('⚠️  GEMINI_API_KEY not configured. AI features will use fallback mode.');
            this.genAI = null;
            this.isConfigured = false;
            return;
        }

        try {
            this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({
                model: config.GEMINI_MODEL || 'gemini-1.5-flash'
            });

            this.generationConfig = {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 512,
            };

            this.requestTimeout = 15000; // 15 seconds - production standard
            this.maxRetries = 2; // Retry failed requests
            this.isConfigured = true;

            logger.info(`✅ AI Service initialized with model: ${config.GEMINI_MODEL || 'gemini-1.5-flash'}`);
        } catch (error) {
            logger.error('Failed to initialize AI service:', error);
            this.genAI = null;
            this.isConfigured = false;
        }
    }

    /**
     * Check if AI service is available
     */
    isAvailable() {
        return this.isConfigured && this.genAI !== null;
    }

    /**
     * Generate personalized workout based on user profile and preferences
     * Uses fallback if AI fails or times out
     */
    async generateWorkout(userId, preferences = {}) {
        try {
            logger.info(`🤖 Workout generation request for user: ${userId}`);

            // Always return fallback if AI not configured
            if (!this.isAvailable()) {
                logger.warn('⚠️  AI not available, using fallback workout');
                return this._createFallbackResponse(preferences);
            }

            // Get minimal user data
            const user = await User.findById(userId).select('profile.fitnessLevel').lean();
            
            const context = {
                fitnessLevel: preferences.fitnessLevel || user?.profile?.fitnessLevel || 'intermediate',
                goal: preferences.goal || 'strength',
                equipment: preferences.equipment || ['barbell', 'dumbbells'],
                duration: preferences.duration || 45,
                targetMuscleGroups: preferences.targetMuscleGroups || []
            };

            logger.info('🚀 Calling Gemini API with timeout protection...');

            // Try AI generation with retry logic
            let result = null;
            let lastError = null;

            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    result = await this._callGeminiAPI(context, attempt);
                    if (result) break; // Success!
                } catch (error) {
                    lastError = error;
                    logger.warn(`Attempt ${attempt}/${this.maxRetries} failed:`, error.message);
                    if (attempt < this.maxRetries) {
                        await this._delay(1000 * attempt); // Exponential backoff
                    }
                }
            }

            // If AI succeeded, return it
            if (result) {
                logger.info('✅ AI workout generated successfully');
                return {
                    success: true,
                    workout: result,
                    aiMetadata: {
                        model: config.GEMINI_MODEL || 'gemini-1.5-flash',
                        generatedAt: new Date(),
                        source: 'ai'
                    }
                };
            }

            // All retries failed, use fallback
            logger.warn('⚠️  All AI attempts failed, using fallback');
            return this._createFallbackResponse(preferences, lastError?.message);

        } catch (error) {
            logger.error('❌ Workout generation error:', error.message);
            return this._createFallbackResponse(preferences, error.message);
        }
    }

    /**
     * Call Gemini API with timeout protection
     * @private
     */
    async _callGeminiAPI(context, attemptNumber = 1) {
        const prompt = this._buildWorkoutPrompt(context);
        
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${this.requestTimeout}ms`)), this.requestTimeout)
        );

        const aiPromise = this.model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: this.generationConfig,
        });

        const result = await Promise.race([aiPromise, timeoutPromise]);
        const aiResponse = result.response.text();
        
        return this._parseWorkoutResponse(aiResponse);
    }

    /**
     * Create fallback response when AI is unavailable
     * @private
     */
    _createFallbackResponse(preferences, errorMessage = null) {
        const workout = this._getFallbackWorkout(preferences);
        return {
            success: true,
            workout,
            aiMetadata: {
                model: 'fallback',
                generatedAt: new Date(),
                source: 'fallback',
                reason: errorMessage || 'AI service unavailable'
            }
        };
    }

    /**
     * Delay helper for retry logic
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Suggest alternative exercises based on equipment, muscle group, or difficulty
     * Returns database matches immediately without AI
     */
    async suggestAlternativeExercises(exerciseId, criteria = {}) {
        try {
            const originalExercise = await Exercise.findById(exerciseId);
            if (!originalExercise) {
                throw new Error('Exercise not found');
            }

            // Find matching exercises from database (fast, no AI needed)
            const matchedExercises = await Exercise.find({
                _id: { $ne: exerciseId },
                primaryMuscleGroups: { $in: originalExercise.primaryMuscleGroups },
                isActive: true,
                ...(criteria.equipment && { equipment: { $in: criteria.equipment } }),
                ...(criteria.difficulty && { difficulty: criteria.difficulty })
            }).limit(5).lean();

            return {
                success: true,
                originalExercise: {
                    id: originalExercise._id,
                    name: originalExercise.name,
                    primaryMuscles: originalExercise.primaryMuscleGroups
                },
                alternatives: matchedExercises.map(ex => ({
                    id: ex._id,
                    name: ex.name,
                    difficulty: ex.difficulty,
                    equipment: ex.equipment,
                    primaryMuscles: ex.primaryMuscleGroups,
                    reason: 'Similar muscle activation pattern'
                }))
            };

        } catch (error) {
            logger.error('Error suggesting alternatives:', error);
            throw error;
        }
    }

    /**
     * Analyze user progress - simplified version without AI
     */
    async analyzeProgress(userId) {
        try {
            return {
                success: true,
                insights: {
                    overallProgress: 'stable',
                    keyInsights: [
                        'Continue tracking your workouts for better insights',
                        'Consistency is key to progress'
                    ],
                    strengths: ['Regular training'],
                    areasForImprovement: ['Add more workout data'],
                    recommendations: ['Keep logging your workouts'],
                    motivationalMessage: 'Great job staying consistent!'
                },
                metadata: {
                    generatedAt: new Date(),
                    source: 'basic_analysis'
                }
            };
        } catch (error) {
            logger.error('Error analyzing progress:', error);
            throw error;
        }
    }

    /**
     * Optimize goals - simplified version
     */
    async optimizeGoals(userId, goalId) {
        try {
            return {
                success: true,
                recommendations: {
                    isRealistic: true,
                    reasoning: 'Current goal appears achievable with consistent effort',
                    actionSteps: [
                        'Continue current training program',
                        'Track your progress weekly',
                        'Adjust intensity as needed'
                    ],
                    confidence: 0.8
                }
            };
        } catch (error) {
            logger.error('Error optimizing goal:', error);
            throw error;
        }
    }

    /**
     * Build workout context from user data
     * @private
     */
    _buildWorkoutContext(user, recentWorkouts, goals, preferences) {
        const fitnessLevel = user.profile?.fitnessLevel || 'beginner';
        const units = user.preferences?.units || 'metric';

        const recentExercises = recentWorkouts.flatMap(w =>
            w.sessionData.exercises.map(e => e.exerciseName)
        ).filter(Boolean);

        const targetMuscles = preferences.targetMuscles || ['full_body'];
        const availableEquipment = preferences.equipment || ['bodyweight', 'dumbbells', 'barbell'];
        const duration = preferences.duration || 45;

        return {
            fitnessLevel,
            units,
            targetMuscles,
            availableEquipment,
            duration,
            recentExercises: [...new Set(recentExercises)].slice(0, 10),
            goals: goals.map(g => ({ type: g.type, title: g.title })),
            preferences: {
                workoutType: preferences.workoutType || 'strength',
                intensity: preferences.intensity || 'moderate',
                focusAreas: preferences.focusAreas || []
            }
        };
    }

    /**
     * Build AI prompt for workout generation
     * @private
     */
    _buildWorkoutPrompt(context) {
        return `Create a ${context.duration}-minute ${context.goal} workout for ${context.fitnessLevel} level.

Equipment: ${context.equipment.join(', ')}
${context.targetMuscleGroups.length > 0 ? `Target: ${context.targetMuscleGroups.join(', ')}` : ''}

Return ONLY valid JSON (no markdown, no extra text):
{
  "name": "Workout name",
  "description": "Brief description",
  "estimatedDuration": ${context.duration},
  "difficulty": "${context.fitnessLevel}",
  "exercises": [
    {"name": "Exercise name", "sets": 3, "reps": 10, "restTime": 60, "notes": "Form tips"}
  ]
}`;
    }

    /**
     * Build prompt for alternative exercise suggestions
     * @private
     */
    _buildAlternativeExercisePrompt(exercise, criteria) {
        return `Suggest 5 alternative exercises for: ${exercise.name}

ORIGINAL EXERCISE:
- Primary Muscles: ${exercise.primaryMuscleGroups.join(', ')}
- Equipment: ${exercise.equipment.join(', ')}
- Difficulty: ${exercise.difficulty}

CRITERIA FOR ALTERNATIVES:
- Same primary muscle groups
- ${criteria.equipment ? `Equipment: ${criteria.equipment.join(', ')}` : 'Any equipment'}
- ${criteria.difficulty ? `Difficulty: ${criteria.difficulty}` : 'Same or similar difficulty'}

Provide alternatives in this JSON format:
{
  "alternatives": [
    {"name": "Exercise name", "reason": "Why this is a good alternative", "equipment": ["items"]}
  ]
}`;
    }

    /**
     * Build prompt for progress analysis
     * @private
     */
    _buildProgressAnalysisPrompt(user, workouts, goals) {
        const workoutSummary = workouts.map(w => ({
            date: w.sessionData.date,
            duration: w.sessionData.duration,
            volume: w.sessionData.metrics.totalVolume,
            exercises: w.sessionData.exercises.length
        }));

        return `Analyze the fitness progress for this user and provide actionable insights.

USER DATA:
- Fitness Level: ${user.profile?.fitnessLevel || 'beginner'}
- Active Goals: ${goals.length}

RECENT WORKOUTS (last 20):
${JSON.stringify(workoutSummary, null, 2)}

Provide analysis in JSON format:
{
  "overallProgress": "improving/stable/declining",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "motivationalMessage": "Personalized encouragement"
}`;
    }

    /**
     * Build prompt for goal optimization
     * @private
     */
    _buildGoalOptimizationPrompt(user, goal, workouts) {
        return `Analyze this fitness goal and suggest optimizations based on user's recent performance.

GOAL:
- Type: ${goal.type}
- Title: ${goal.title}
- Current Progress: ${goal.currentValue} / ${goal.targetValue} ${goal.unit}
- Target Date: ${goal.targetDate}
- Progress: ${((goal.currentValue / goal.targetValue) * 100).toFixed(1)}%

RECENT WORKOUT PERFORMANCE:
${workouts.map(w => `- ${w.sessionData.name}: ${w.sessionData.metrics.totalVolume} total volume`).join('\n')}

Provide recommendations in JSON format:
{
  "isRealistic": true/false,
  "adjustedTarget": number,
  "adjustedDate": "YYYY-MM-DD",
  "reasoning": "Why these adjustments",
  "actionSteps": ["step1", "step2"],
  "confidence": 0.8
}`;
    }

    /**
     * Parse AI workout generation response
     * @private
     */
    _parseWorkoutResponse(aiResponse) {
        try {
            // Remove markdown code blocks if present
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                [null, aiResponse];

            const jsonString = jsonMatch[1] || aiResponse;
            const workout = JSON.parse(jsonString.trim());

            // Validate required fields
            if (!workout.name || !workout.exercises || !Array.isArray(workout.exercises)) {
                throw new Error('Invalid workout structure from AI');
            }

            return workout;
        } catch (error) {
            logger.error('Failed to parse AI workout response:', error);
            logger.debug('AI Response:', aiResponse);

            // Return fallback workout
            return this._getFallbackWorkout();
        }
    }

    /**
     * Parse alternative exercises response
     * @private
     */
    _parseAlternativesResponse(aiResponse) {
        try {
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || [null, aiResponse];
            const jsonString = jsonMatch[1] || aiResponse;
            const parsed = JSON.parse(jsonString.trim());
            return parsed.alternatives || [];
        } catch (error) {
            logger.error('Failed to parse alternatives response:', error);
            return [];
        }
    }

    /**
     * Parse progress insights response
     * @private
     */
    _parseProgressInsights(aiResponse) {
        try {
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || [null, aiResponse];
            const jsonString = jsonMatch[1] || aiResponse;
            return JSON.parse(jsonString.trim());
        } catch (error) {
            logger.error('Failed to parse progress insights:', error);
            return {
                overallProgress: 'stable',
                keyInsights: ['Continue with your current routine'],
                strengths: ['Consistency'],
                areasForImprovement: ['Track more data for better insights'],
                recommendations: ['Keep up the good work!']
            };
        }
    }

    /**
     * Parse goal optimization response
     * @private
     */
    _parseGoalOptimization(aiResponse) {
        try {
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || [null, aiResponse];
            const jsonString = jsonMatch[1] || aiResponse;
            return JSON.parse(jsonString.trim());
        } catch (error) {
            logger.error('Failed to parse goal optimization:', error);
            return {
                isRealistic: true,
                reasoning: 'Current goal appears achievable',
                actionSteps: ['Continue current program'],
                confidence: 0.7
            };
        }
    }

    /**
     * Enrich AI-generated workout with actual exercise data from database
     * @private
     */
    async _enrichWorkoutWithExercises(workoutPlan) {
        const enrichedExercises = await Promise.all(
            workoutPlan.exercises.map(async (exercise) => {
                // Try to find matching exercise in database
                const dbExercise = await Exercise.findOne({
                    name: new RegExp(exercise.name, 'i'),
                    isActive: true
                });

                if (dbExercise) {
                    return {
                        exerciseId: dbExercise._id,
                        exerciseName: dbExercise.name,
                        order: workoutPlan.exercises.indexOf(exercise) + 1,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        restTime: exercise.restTime || 60,
                        notes: exercise.notes,
                        weight: { type: 'bodyweight', value: 0 },
                        alternatives: []
                    };
                }

                // If not found, create a reference without ID
                return {
                    exerciseId: null,
                    exerciseName: exercise.name,
                    order: workoutPlan.exercises.indexOf(exercise) + 1,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    restTime: exercise.restTime || 60,
                    notes: exercise.notes,
                    weight: { type: 'bodyweight', value: 0 },
                    alternatives: []
                };
            })
        );

        return {
            ...workoutPlan,
            exercises: enrichedExercises
        };
    }

    /**
     * Get fallback workout if AI generation fails
     * Customized based on preferences
     * @private
     */
    _getFallbackWorkout(preferences = {}) {
        const goal = preferences.goal || 'strength';
        const level = preferences.fitnessLevel || 'intermediate';
        const duration = preferences.duration || 45;
        
        const workoutTemplates = {
            strength: {
                name: 'Strength Training Workout',
                description: 'Build muscle strength with compound movements',
                exercises: [
                    { name: 'Barbell Back Squat', sets: 4, reps: 6, restTime: 120, notes: 'Focus on depth and form' },
                    { name: 'Barbell Bench Press', sets: 4, reps: 6, restTime: 120, notes: 'Control the descent' },
                    { name: 'Barbell Deadlift', sets: 3, reps: 5, restTime: 180, notes: 'Keep back straight' },
                    { name: 'Overhead Press', sets: 3, reps: 8, restTime: 90, notes: 'Engage core' },
                    { name: 'Barbell Row', sets: 3, reps: 8, restTime: 90, notes: 'Pull to chest' }
                ]
            },
            hypertrophy: {
                name: 'Muscle Building Workout',
                description: 'Hypertrophy focused training for muscle growth',
                exercises: [
                    { name: 'Dumbbell Bench Press', sets: 4, reps: 10, restTime: 60, notes: 'Full range of motion' },
                    { name: 'Dumbbell Rows', sets: 4, reps: 10, restTime: 60, notes: 'Squeeze at top' },
                    { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12, restTime: 60, notes: 'Control the weight' },
                    { name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, restTime: 45, notes: 'No swinging' },
                    { name: 'Dumbbell Tricep Extensions', sets: 3, reps: 12, restTime: 45, notes: 'Full extension' }
                ]
            },
            endurance: {
                name: 'Endurance Circuit',
                description: 'High-rep circuit for muscular endurance',
                exercises: [
                    { name: 'Bodyweight Squats', sets: 3, reps: 20, restTime: 30, notes: 'Keep moving' },
                    { name: 'Push-ups', sets: 3, reps: 15, restTime: 30, notes: 'Full range' },
                    { name: 'Lunges', sets: 3, reps: 16, restTime: 30, notes: '8 each leg' },
                    { name: 'Mountain Climbers', sets: 3, reps: 30, restTime: 30, notes: 'Fast pace' },
                    { name: 'Plank', sets: 3, reps: 60, restTime: 30, notes: 'Hold position' }
                ]
            },
            weight_loss: {
                name: 'Fat Burning Workout',
                description: 'High-intensity training for calorie burn',
                exercises: [
                    { name: 'Burpees', sets: 4, reps: 12, restTime: 45, notes: 'Explosive movement' },
                    { name: 'Jump Squats', sets: 4, reps: 15, restTime: 45, notes: 'Land softly' },
                    { name: 'High Knees', sets: 4, reps: 30, restTime: 30, notes: 'Fast pace' },
                    { name: 'Push-ups', sets: 3, reps: 12, restTime: 30, notes: 'Maintain form' },
                    { name: 'Jumping Jacks', sets: 3, reps: 30, restTime: 30, notes: 'Keep rhythm' }
                ]
            },
            general_fitness: {
                name: 'Full Body Fitness',
                description: 'Balanced workout for overall fitness',
                exercises: [
                    { name: 'Goblet Squats', sets: 3, reps: 12, restTime: 60, notes: 'Hold dumbbell at chest' },
                    { name: 'Push-ups', sets: 3, reps: 12, restTime: 60, notes: 'Modify as needed' },
                    { name: 'Dumbbell Rows', sets: 3, reps: 12, restTime: 60, notes: 'Each arm' },
                    { name: 'Plank', sets: 3, reps: 45, restTime: 45, notes: 'Hold strong' },
                    { name: 'Lunges', sets: 3, reps: 20, restTime: 60, notes: 'Alternate legs' }
                ]
            }
        };

        const template = workoutTemplates[goal] || workoutTemplates.general_fitness;

        return {
            ...template,
            estimatedDuration: duration,
            difficulty: level,
            targetMuscles: preferences.targetMuscleGroups || ['full_body'],
            warmup: [
                { name: 'Light Cardio', duration: 300, instructions: '5 minutes of light movement' },
                { name: 'Dynamic Stretching', duration: 180, instructions: 'Arm circles, leg swings, torso twists' }
            ],
            cooldown: [
                { name: 'Static Stretching', duration: 300, instructions: 'Hold each stretch 30 seconds' },
                { name: 'Foam Rolling', duration: 180, instructions: 'Focus on worked muscles' }
            ]
        };
    }
}

// Export singleton instance
module.exports = new AIService();
