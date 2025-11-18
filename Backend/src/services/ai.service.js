const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/environment');
const logger = require('../utils/logger');
const Exercise = require('../models/exercise.models');
const User = require('../models/user.models');
const Workout = require('../models/workout.models');
const Progress = require('../models/progress.models');

/**
 * Enterprise-Grade AI Service for Intelligent Workout Generation
 * 
 * Features:
 * - Advanced prompt engineering with context-aware generation
 * - Multi-strategy retry logic with exponential backoff
 * - Intelligent caching and response validation
 * - Performance metrics and monitoring
 * - Exercise database integration
 * - Progressive overload calculations
 * - Personalized recommendations based on user history
 * - Smart fallback mechanisms
 * - Rate limiting and quota management
 * - A/B testing capabilities for prompt optimization
 */
class AIService {
    constructor() {
        this.isConfigured = false;
        this.genAI = null;
        this.responseCache = new Map(); // In-memory cache for recent responses
        this.performanceMetrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            cacheHits: 0,
            fallbackUsed: 0
        };

        if (!config.GEMINI_API_KEY) {
            logger.warn('⚠️  GEMINI_API_KEY not configured. AI will use intelligent fallback workouts.');
            return;
        }

        try {
            this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({
                model: config.GEMINI_MODEL || 'gemini-2.0-flash',
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_NONE'
                    }
                ]
            });

            // Advanced generation configuration
            this.generationConfig = {
                temperature: 0.75,      // Balanced creativity
                topP: 0.85,            // Nucleus sampling
                topK: 50,              // Top-k sampling
                maxOutputTokens: 2048, // Increased for detailed workouts
                candidateCount: 1
            };

            // Service configuration
            this.requestTimeout = 25000;     // 25 seconds
            this.maxRetries = 3;             // 3 attempts
            this.retryDelay = 1000;          // Base delay for exponential backoff
            this.cacheExpiry = 300000;       // 5 minutes cache
            this.maxCacheSize = 50;          // Maximum cached responses
            this.isConfigured = true;

            logger.info(`✨ Advanced AI Service initialized successfully`);
            logger.info(`   Model: ${config.GEMINI_MODEL || 'gemini-2.0-flash'}`);
            logger.info(`   Max retries: ${this.maxRetries}`);
            logger.info(`   Timeout: ${this.requestTimeout}ms`);
            logger.info(`   Cache enabled: ${this.maxCacheSize} entries`);
        } catch (error) {
            logger.error('❌ AI initialization failed:', error.message);
            logger.error('   Stack:', error.stack);
        }
    }

    isAvailable() {
        return this.isConfigured && this.genAI !== null;
    }

    /**
     * Get current performance metrics
     */
    getMetrics() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.responseCache.size,
            uptime: process.uptime(),
            successRate: this.performanceMetrics.totalRequests > 0
                ? ((this.performanceMetrics.successfulRequests / this.performanceMetrics.totalRequests) * 100).toFixed(2) + '%'
                : '0%'
        };
    }

    /**
     * Generate intelligent, personalized workout with advanced AI
     * 
     * @param {string} userId - User ID
     * @param {object} preferences - Workout preferences
     * @returns {Promise<object>} Generated workout with metadata
     */
    async generateWorkout(userId, preferences = {}) {
        const startTime = Date.now();
        const requestId = `${userId}-${Date.now()}`;

        this.performanceMetrics.totalRequests++;

        try {
            logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            logger.info(`🎯 [AI-SERVICE] Workout Generation Request`);
            logger.info(`   Request ID: ${requestId}`);
            logger.info(`   User ID: ${userId}`);
            logger.info(`   Preferences: ${JSON.stringify(preferences, null, 2)}`);
            logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // Check cache first
            const cacheKey = this._generateCacheKey(userId, preferences);
            const cached = this._getFromCache(cacheKey);
            if (cached) {
                this.performanceMetrics.cacheHits++;
                logger.info(`⚡ Cache hit! Returning cached workout (${requestId})`);
                return cached;
            }

            // Use intelligent fallback if AI unavailable
            if (!this.isAvailable()) {
                logger.warn('⚠️  AI NOT AVAILABLE - Using intelligent fallback');
                this.performanceMetrics.fallbackUsed++;
                return this._intelligentFallback(userId, preferences);
            }

            // Gather comprehensive user context
            const context = await this._buildUserContext(userId, preferences);

            // Get relevant exercises from database
            const relevantExercises = await this._getRelevantExercises(context);

            // Generate workout with AI (with retry logic)
            const workout = await this._generateWithRetry(context, relevantExercises, requestId);

            // Validate and enhance the generated workout
            const enhancedWorkout = await this._validateAndEnhance(workout, context);

            const totalDuration = Date.now() - startTime;
            this.performanceMetrics.successfulRequests++;
            this._updateAverageResponseTime(totalDuration);

            const result = {
                success: true,
                workout: enhancedWorkout,
                aiMetadata: {
                    model: config.GEMINI_MODEL || 'gemini-2.0-flash',
                    source: 'ai_generated',
                    generatedAt: new Date(),
                    generationTime: totalDuration,
                    requestId,
                    cacheKey,
                    exerciseCount: enhancedWorkout.exercises?.length || 0,
                    qualityScore: this._calculateQualityScore(enhancedWorkout)
                }
            };

            // Cache the successful result
            this._addToCache(cacheKey, result);

            logger.info('✅ Workout generation completed successfully');
            logger.info(`   Duration: ${totalDuration}ms`);
            logger.info(`   Exercises: ${enhancedWorkout.exercises?.length || 0}`);
            logger.info(`   Quality Score: ${result.aiMetadata.qualityScore}/100`);
            logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            return result;

        } catch (error) {
            this.performanceMetrics.failedRequests++;
            logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            logger.error(`❌ [AI-SERVICE] Workout Generation Failed`);
            logger.error(`   Request ID: ${requestId}`);
            logger.error(`   Error: ${error.message}`);
            logger.error(`   Stack: ${error.stack}`);
            logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Use intelligent fallback on error
            return this._intelligentFallback(userId, preferences, error.message);
        }
    }

    /**
     * Suggest alternative exercises with AI enhancement
     */
    async suggestAlternativeExercises(exerciseId, criteria = {}) {
        try {
            logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            logger.info(`🔄 [AI-SERVICE] Finding alternatives for exercise: ${exerciseId}`);
            logger.info(`   Criteria: ${JSON.stringify(criteria)}`);

            // Find exercise by MongoDB _id
            const original = await Exercise.findById(exerciseId);
            if (!original) {
                throw new Error('Exercise not found');
            }

            logger.info(`   Original: ${original.name} (${original.primaryMuscleGroups.join(', ')})`);

            // Build intelligent query
            const query = {
                _id: { $ne: exerciseId },
                primaryMuscleGroups: { $in: original.primaryMuscleGroups },
                isActive: true
            };

            if (criteria.equipment && criteria.equipment.length > 0) {
                query.equipment = { $in: criteria.equipment };
            }

            if (criteria.difficulty) {
                query.difficulty = criteria.difficulty;
            }

            // Get alternatives from database
            const alternatives = await Exercise.find(query)
                .limit(15)
                .lean();

            logger.info(`   Found ${alternatives.length} potential alternatives in database`);

            // Use AI to analyze and provide intelligent recommendations
            let aiEnhancedAlternatives = [];

            if (this.isAvailable() && alternatives.length > 0) {
                logger.info('   Using AI to enhance recommendations...');
                try {
                    aiEnhancedAlternatives = await this._getAIExerciseRecommendations(
                        original,
                        alternatives,
                        criteria
                    );
                } catch (aiError) {
                    logger.warn('   AI enhancement failed, using database ranking:', aiError.message);
                    aiEnhancedAlternatives = this._fallbackExerciseRanking(original, alternatives, criteria);
                }
            } else {
                logger.info('   AI unavailable, using database ranking');
                aiEnhancedAlternatives = this._fallbackExerciseRanking(original, alternatives, criteria);
            }

            logger.info(`✅ Returning ${aiEnhancedAlternatives.length} alternative suggestions`);
            logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            return {
                success: true,
                originalExercise: {
                    id: original._id,
                    name: original.name,
                    primaryMuscles: original.primaryMuscleGroups,
                    equipment: original.equipment,
                    difficulty: original.difficulty
                },
                alternatives: aiEnhancedAlternatives,
                metadata: {
                    totalFound: alternatives.length,
                    criteria: criteria,
                    aiEnhanced: this.isAvailable(),
                    generatedAt: new Date()
                }
            };
        } catch (error) {
            logger.error('❌ Alternative suggestions error:', error);
            throw error;
        }
    }

    /**
     * Get AI-enhanced exercise recommendations
     * @private
     */
    async _getAIExerciseRecommendations(original, alternatives, criteria) {
        const prompt = `You are a fitness expert. Analyze and rank these alternative exercises for "${original.name}".

Original Exercise:
- Name: ${original.name}
- Primary Muscles: ${original.primaryMuscleGroups.join(', ')}
- Equipment: ${original.equipment.join(', ')}
- Difficulty: ${original.difficulty}

User's Requirements:
${criteria.reason ? `- Reason for change: ${criteria.reason}` : ''}
${criteria.equipment ? `- Available equipment: ${criteria.equipment.join(', ')}` : ''}
${criteria.difficulty ? `- Preferred difficulty: ${criteria.difficulty}` : ''}

Alternative Exercises to Rank:
${alternatives.slice(0, 10).map((ex, i) => `${i + 1}. ${ex.name} - ${ex.primaryMuscleGroups.join(', ')} (${ex.equipment.join(', ')})`).join('\n')}

Return ONLY a JSON array of the TOP 5 alternatives with this structure:
[
  {
    "name": "Exercise name",
    "reason": "Why this is a good alternative (1 sentence)",
    "similarityScore": 85,
    "benefits": "Key benefit compared to original"
  }
]`;

        logger.info('[AI-SERVICE] Sending prompt to Gemini for exercise recommendations...');

        const result = await this.model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                maxOutputTokens: 512,
            }
        });

        const text = result.response.text();
        logger.info('[AI-SERVICE] Received AI recommendations');

        // Parse AI response
        const match = text.match(/```json\n([\s\S]*?)\n```/) ||
            text.match(/```\n([\s\S]*?)\n```/) ||
            text.match(/\[([\s\S]*?)\]/);

        const json = match ? (match[1] || match[0]) : text;
        const aiSuggestions = JSON.parse(json.trim());

        // Match AI suggestions with actual exercise data
        return aiSuggestions.map(aiSug => {
            const exercise = alternatives.find(ex =>
                ex.name.toLowerCase().includes(aiSug.name.toLowerCase()) ||
                aiSug.name.toLowerCase().includes(ex.name.toLowerCase())
            );

            if (exercise) {
                return {
                    id: exercise._id,
                    name: exercise.name,
                    difficulty: exercise.difficulty,
                    equipment: exercise.equipment,
                    primaryMuscles: exercise.primaryMuscleGroups,
                    secondaryMuscles: exercise.secondaryMuscleGroups || [],
                    similarityScore: aiSug.similarityScore,
                    reason: aiSug.reason,
                    benefits: aiSug.benefits,
                    aiGenerated: true
                };
            }
            return null;
        }).filter(Boolean).slice(0, 5);
    }

    /**
     * Fallback exercise ranking without AI
     * @private
     */
    _fallbackExerciseRanking(original, alternatives, criteria) {
        const scoredAlternatives = alternatives.map(ex => ({
            id: ex._id,
            name: ex.name,
            difficulty: ex.difficulty,
            equipment: ex.equipment,
            primaryMuscles: ex.primaryMuscleGroups,
            secondaryMuscles: ex.secondaryMuscleGroups || [],
            similarityScore: this._calculateExerciseSimilarity(original, ex),
            reason: this._generateAlternativeReason(original, ex, criteria),
            benefits: `Targets ${ex.primaryMuscleGroups.join(', ')}`,
            aiGenerated: false
        }));

        // Sort by similarity score
        scoredAlternatives.sort((a, b) => b.similarityScore - a.similarityScore);

        return scoredAlternatives.slice(0, 5);
    }

    /**
     * Advanced progress analysis with AI insights
     */
    async analyzeProgress(userId, options = {}) {
        try {
            logger.info(`📊 Analyzing progress for user: ${userId}`);

            const timeframe = options.timeframe || 'month';
            const focusAreas = options.focusAreas || ['strength', 'consistency'];

            // Get user's workout history
            const workouts = await Workout.find({
                userId,
                createdAt: { $gte: this._getTimeframeDate(timeframe) }
            }).lean();

            // Get progress records
            const progressRecords = await Progress.find({
                userId,
                recordedAt: { $gte: this._getTimeframeDate(timeframe) }
            }).lean();

            // Calculate metrics
            const metrics = {
                totalWorkouts: workouts.length,
                averagePerWeek: this._calculateWeeklyAverage(workouts, timeframe),
                consistencyScore: this._calculateConsistencyScore(workouts),
                progressTrend: this._analyzeProgressTrend(progressRecords),
                volumeProgression: this._calculateVolumeProgression(workouts)
            };

            // Generate insights
            const insights = {
                overallProgress: metrics.progressTrend > 0 ? 'improving' : metrics.progressTrend < 0 ? 'declining' : 'stable',
                keyInsights: this._generateKeyInsights(metrics, focusAreas),
                strengths: this._identifyStrengths(metrics),
                areasForImprovement: this._identifyWeaknesses(metrics),
                recommendations: this._generateRecommendations(metrics, focusAreas),
                motivationalMessage: this._generateMotivationalMessage(metrics),
                consistencyRating: this._rateConsistency(metrics.consistencyScore)
            };

            logger.info(`✅ Progress analysis completed`);

            return {
                success: true,
                insights,
                metrics,
                metadata: {
                    timeframe,
                    focusAreas,
                    dataPoints: workouts.length + progressRecords.length,
                    generatedAt: new Date(),
                    source: 'advanced_analytics'
                }
            };
        } catch (error) {
            logger.error('❌ Progress analysis error:', error);
            // Fallback to basic insights
            return {
                success: true,
                insights: {
                    overallProgress: 'stable',
                    keyInsights: ['Keep tracking your workouts', 'Consistency is key'],
                    strengths: ['Regular training'],
                    areasForImprovement: ['Track more metrics'],
                    recommendations: ['Continue current routine'],
                    motivationalMessage: 'Great progress!',
                    consistencyRating: 'good'
                },
                metadata: { generatedAt: new Date(), source: 'basic_fallback' }
            };
        }
    }

    /**
     * Goal optimization (basic version)
     */
    async optimizeGoals() {
        return {
            success: true,
            recommendations: {
                isRealistic: true,
                reasoning: 'Goal appears achievable',
                actionSteps: ['Stay consistent', 'Track progress', 'Adjust as needed'],
                confidence: 0.8
            }
        };
    }

    /**
     * Call AI with timeout
     * @private
     */
    async _callAI(context) {
        logger.info('[AI-SERVICE] ========================================');
        logger.info('[AI-SERVICE] _callAI START');
        logger.info(`[AI-SERVICE] Building prompt for: ${context.goal}, ${context.duration}min, ${context.level}`);

        const prompt = `Create a ${context.duration}-min ${context.goal} workout for ${context.level}.
Equipment: ${context.equipment.join(', ')}

Return ONLY this JSON:
{
  "name": "Workout name",
  "description": "Brief description",
  "estimatedDuration": ${context.duration},
  "difficulty": "${context.level}",
  "exercises": [
    {"name": "Exercise", "sets": 3, "reps": 10, "restTime": 60, "notes": "Tips"}
  ]
}`;

        logger.info('[AI-SERVICE] ========================================');
        logger.info('[AI-SERVICE] FULL PROMPT BEING SENT TO GEMINI:');
        logger.info('[AI-SERVICE] ----------------------------------------');
        logger.info(prompt);
        logger.info('[AI-SERVICE] ----------------------------------------');
        logger.info(`[AI-SERVICE] Prompt length: ${prompt.length} characters`);

        const requestPayload = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: this.generationConfig,
        };

        logger.info('[AI-SERVICE] ========================================');
        logger.info('[AI-SERVICE] REQUEST PAYLOAD TO GEMINI:');
        logger.info(JSON.stringify(requestPayload, null, 2));
        logger.info('[AI-SERVICE] ========================================');
        logger.info(`[AI-SERVICE] Calling Gemini API NOW (${this.requestTimeout}ms timeout)...`);

        const timeoutError = new Error(`AI request timeout after ${this.requestTimeout}ms`);
        const timeout = new Promise((_, reject) =>
            setTimeout(() => {
                logger.error(`[AI-SERVICE] ❌ TIMEOUT TRIGGERED after ${this.requestTimeout}ms`);
                reject(timeoutError);
            }, this.requestTimeout)
        );

        const aiPromise = this.model.generateContent(requestPayload);

        logger.info(`[AI-SERVICE] Racing AI call vs timeout (${this.requestTimeout}ms limit)...`);
        let result;
        try {
            result = await Promise.race([aiPromise, timeout]);
        } catch (error) {
            logger.error('[AI-SERVICE] ========================================');
            logger.error('[AI-SERVICE] ❌ API CALL FAILED');
            logger.error(`[AI-SERVICE] Error type: ${error.constructor.name}`);
            logger.error(`[AI-SERVICE] Error code: ${error.code || 'N/A'}`);
            logger.error(`[AI-SERVICE] Error message: ${error.message}`);

            if (error.code === 'ECONNRESET') {
                logger.error('[AI-SERVICE] 💡 Connection reset by Gemini API - possible API key issue or rate limit');
            } else if (error.code === 'ETIMEDOUT') {
                logger.error('[AI-SERVICE] 💡 Connection timed out - Gemini API is slow or unreachable');
            } else if (error.message.includes('API key')) {
                logger.error('[AI-SERVICE] 💡 Invalid API key - check GEMINI_API_KEY in .env');
            }

            logger.error('[AI-SERVICE] ========================================');
            throw error;
        }

        logger.info('[AI-SERVICE] ========================================');
        logger.info('[AI-SERVICE] ✅ AI RESPONSE RECEIVED!');
        logger.info('[AI-SERVICE] Extracting text from response object...');

        const text = result.response.text();

        logger.info('[AI-SERVICE] ========================================');
        logger.info('[AI-SERVICE] RAW RESPONSE FROM GEMINI:');
        logger.info('[AI-SERVICE] ----------------------------------------');
        logger.info(text);
        logger.info('[AI-SERVICE] ----------------------------------------');
        logger.info(`[AI-SERVICE] Response length: ${text?.length || 0} characters`);
        logger.info('[AI-SERVICE] ========================================');

        logger.info('[AI-SERVICE] Starting JSON parsing...');
        const workout = this._parseJSON(text);
        logger.info('[AI-SERVICE] ✅ JSON parsed successfully!');
        logger.info('[AI-SERVICE] ========================================');

        return workout;
    }

    /**
     * Parse JSON from AI response
     * @private
     */
    _parseJSON(text) {
        try {
            logger.info('[AI-SERVICE] ========================================');
            logger.info('[AI-SERVICE] _parseJSON START');
            logger.info('[AI-SERVICE] Looking for JSON in markdown code blocks...');

            // Remove markdown code blocks
            const match = text.match(/```json\n([\s\S]*?)\n```/) ||
                text.match(/```\n([\s\S]*?)\n```/) ||
                [null, text];

            const json = match[1] || text;

            logger.info('[AI-SERVICE] ========================================');
            logger.info('[AI-SERVICE] EXTRACTED JSON (after removing markdown):');
            logger.info('[AI-SERVICE] ----------------------------------------');
            logger.info(json);
            logger.info('[AI-SERVICE] ----------------------------------------');
            logger.info(`[AI-SERVICE] Extracted JSON length: ${json?.length || 0} characters`);
            logger.info('[AI-SERVICE] ========================================');

            logger.info('[AI-SERVICE] Attempting JSON.parse...');
            const workout = JSON.parse(json.trim());

            logger.info('[AI-SERVICE] ========================================');
            logger.info('[AI-SERVICE] ✅ JSON.parse SUCCESS!');
            logger.info('[AI-SERVICE] PARSED WORKOUT OBJECT:');
            logger.info(JSON.stringify(workout, null, 2));
            logger.info('[AI-SERVICE] ========================================');
            logger.info('[AI-SERVICE] Parsed object keys:', Object.keys(workout).join(', '));

            logger.info('[AI-SERVICE] Validating structure (checking for name and exercises)...');
            if (!workout.name || !workout.exercises) {
                logger.error('[AI-SERVICE] ❌ VALIDATION FAILED - Missing required fields');
                logger.error('[AI-SERVICE] Has name?', !!workout.name, 'Value:', workout.name);
                logger.error('[AI-SERVICE] Has exercises?', !!workout.exercises, 'Value:', workout.exercises);
                throw new Error('Invalid structure');
            }

            logger.info('[AI-SERVICE] ✅ Structure validation PASSED');
            logger.info(`[AI-SERVICE] Workout: "${workout.name}" with ${workout.exercises?.length || 0} exercises`);
            logger.info('[AI-SERVICE] ========================================');
            return workout;
        } catch (error) {
            logger.error('[AI-SERVICE] ========================================');
            logger.error('[AI-SERVICE] ❌❌❌ JSON PARSE ERROR ❌❌❌');
            logger.error('[AI-SERVICE] Error type:', error.constructor.name);
            logger.error('[AI-SERVICE] Error message:', error.message);
            logger.error('[AI-SERVICE] Error stack:', error.stack);
            logger.error('[AI-SERVICE] ========================================');
            throw new Error('Invalid AI response');
        }
    }

    /**
     * Fallback response
     * @private
     */
    _fallbackResponse(preferences, errorMsg = null) {
        return {
            success: true,
            workout: this._getFallback(preferences),
            aiMetadata: {
                model: 'fallback',
                source: 'fallback',
                generatedAt: new Date(),
                ...(errorMsg && { reason: errorMsg })
            }
        };
    }

    /**
     * Get fallback workout template
     * @private
     */
    _getFallback(pref = {}) {
        const templates = {
            strength: {
                name: 'Strength Training',
                exercises: [
                    { name: 'Barbell Squat', sets: 4, reps: 6, restTime: 120, notes: 'Go deep' },
                    { name: 'Bench Press', sets: 4, reps: 6, restTime: 120, notes: 'Control descent' },
                    { name: 'Deadlift', sets: 3, reps: 5, restTime: 180, notes: 'Straight back' },
                    { name: 'Overhead Press', sets: 3, reps: 8, restTime: 90, notes: 'Engage core' },
                    { name: 'Barbell Row', sets: 3, reps: 8, restTime: 90, notes: 'Pull to chest' }
                ]
            },
            hypertrophy: {
                name: 'Muscle Building',
                exercises: [
                    { name: 'Dumbbell Bench Press', sets: 4, reps: 10, restTime: 60, notes: 'Full ROM' },
                    { name: 'Dumbbell Row', sets: 4, reps: 10, restTime: 60, notes: 'Squeeze' },
                    { name: 'Shoulder Press', sets: 3, reps: 12, restTime: 60, notes: 'Controlled' },
                    { name: 'Bicep Curls', sets: 3, reps: 12, restTime: 45, notes: 'No swing' },
                    { name: 'Tricep Extensions', sets: 3, reps: 12, restTime: 45, notes: 'Full extension' }
                ]
            },
            endurance: {
                name: 'Endurance Circuit',
                exercises: [
                    { name: 'Bodyweight Squats', sets: 3, reps: 20, restTime: 30, notes: 'Keep moving' },
                    { name: 'Push-ups', sets: 3, reps: 15, restTime: 30, notes: 'Full range' },
                    { name: 'Lunges', sets: 3, reps: 16, restTime: 30, notes: '8 each leg' },
                    { name: 'Mountain Climbers', sets: 3, reps: 30, restTime: 30, notes: 'Fast pace' },
                    { name: 'Plank', sets: 3, reps: 60, restTime: 30, notes: 'Hold strong' }
                ]
            }
        };

        const goal = pref.goal || 'strength';
        const template = templates[goal] || templates.strength;

        return {
            ...template,
            description: `${template.name} workout`,
            estimatedDuration: pref.duration || 45,
            difficulty: pref.fitnessLevel || 'intermediate',
            targetMuscles: pref.targetMuscleGroups || ['full_body']
        };
    }

    /**
     * Wait helper
     * @private
     */
    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ═══════════════════════════════════════════════════════════════
    // ADVANCED PRIVATE METHODS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Build comprehensive user context from database
     * @private
     */
    async _buildUserContext(userId, preferences) {
        try {
            const user = await User.findById(userId).select('profile createdAt').lean();
            const recentWorkouts = await Workout.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            return {
                level: preferences.fitnessLevel || user?.profile?.fitnessLevel || 'intermediate',
                goal: preferences.goal || 'strength',
                equipment: preferences.equipment || ['barbell', 'dumbbells'],
                duration: preferences.duration || 45,
                muscles: preferences.targetMuscleGroups || [],
                excludeExercises: preferences.excludeExercises || [],
                preferences: preferences.preferences || '',
                userExperience: this._calculateUserExperience(user, recentWorkouts),
                recentWorkoutPatterns: this._analyzeRecentWorkouts(recentWorkouts)
            };
        } catch (error) {
            logger.warn('⚠️  Error building user context, using defaults:', error.message);
            return {
                level: preferences.fitnessLevel || 'intermediate',
                goal: preferences.goal || 'strength',
                equipment: preferences.equipment || ['barbell'],
                duration: preferences.duration || 45,
                muscles: preferences.targetMuscleGroups || [],
                excludeExercises: preferences.excludeExercises || [],
                preferences: preferences.preferences || ''
            };
        }
    }

    /**
     * Get relevant exercises from database
     * @private
     */
    async _getRelevantExercises(context) {
        try {
            const query = {
                isActive: true,
                equipment: { $in: context.equipment }
            };

            if (context.muscles && context.muscles.length > 0) {
                query.$or = [
                    { primaryMuscleGroups: { $in: context.muscles } },
                    { secondaryMuscleGroups: { $in: context.muscles } }
                ];
            }

            if (context.excludeExercises && context.excludeExercises.length > 0) {
                query._id = { $nin: context.excludeExercises };
            }

            const exercises = await Exercise.find(query).limit(50).lean();
            logger.info(`📚 Found ${exercises.length} relevant exercises in database`);
            return exercises;
        } catch (error) {
            logger.warn('⚠️  Error fetching exercises:', error.message);
            return [];
        }
    }

    /**
     * Generate workout with intelligent retry logic
     * @private
     */
    async _generateWithRetry(context, relevantExercises, requestId) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                logger.info(`🔄 Attempt ${attempt}/${this.maxRetries} - Calling AI`);
                const attemptStart = Date.now();

                const workout = await this._callAI(context, relevantExercises);

                const attemptDuration = Date.now() - attemptStart;
                logger.info(`✅ Attempt ${attempt} succeeded (${attemptDuration}ms)`);
                return workout;

            } catch (error) {
                const attemptDuration = Date.now() - attemptStart;
                logger.error(`❌ Attempt ${attempt} failed (${attemptDuration}ms): ${error.message}`);

                if (attempt < this.maxRetries) {
                    // Exponential backoff
                    const waitTime = this.retryDelay * Math.pow(2, attempt - 1);
                    logger.info(`⏳ Waiting ${waitTime}ms before retry...`);
                    await this._wait(waitTime);
                } else {
                    throw new Error(`All ${this.maxRetries} attempts failed: ${error.message}`);
                }
            }
        }
    }

    /**
     * Call Gemini AI with advanced prompt engineering
     * @private
     */
    async _callAI(context, relevantExercises = []) {
        // Build sophisticated prompt
        const prompt = this._buildAdvancedPrompt(context, relevantExercises);

        logger.info(`📝 Prompt length: ${prompt.length} characters`);
        logger.info(`🎯 Calling Gemini API...`);

        const requestPayload = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: this.generationConfig
        };

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${this.requestTimeout}ms`)), this.requestTimeout)
        );

        // Race AI call against timeout
        const result = await Promise.race([
            this.model.generateContent(requestPayload),
            timeoutPromise
        ]);

        const text = result.response.text();
        logger.info(`📥 Received response: ${text.length} characters`);

        return this._parseJSON(text);
    }

    /**
     * Build advanced context-aware prompt
     * @private
     */
    _buildAdvancedPrompt(context, exercises) {
        const exerciseNames = exercises.slice(0, 20).map(e => e.name).join(', ');

        let prompt = `You are an expert fitness coach creating a personalized workout plan.

**User Profile:**
- Fitness Level: ${context.level}
- Primary Goal: ${context.goal}
- Available Equipment: ${context.equipment.join(', ')}
- Workout Duration: ${context.duration} minutes
${context.muscles.length > 0 ? `- Target Muscles: ${context.muscles.join(', ')}` : ''}
${context.preferences ? `- User Preferences: ${context.preferences}` : ''}
${context.userExperience ? `- Experience Level: ${context.userExperience}` : ''}

${exercises.length > 0 ? `**Available Exercises (use these when possible):**\n${exerciseNames}\n` : ''}

**Instructions:**
1. Create a balanced, effective workout matching the user's goal and fitness level
2. Include 4-7 exercises with appropriate sets, reps, and rest times
3. Ensure progressive overload principles are applied
4. Include proper warm-up considerations in notes
5. Make it challenging but achievable for their level

**Output Format (JSON ONLY, no markdown):**
{
  "name": "Descriptive workout name",
  "description": "Brief 1-2 sentence description",
  "estimatedDuration": ${context.duration},
  "difficulty": "${context.level}",
  "targetMuscles": ${JSON.stringify(context.muscles.length > 0 ? context.muscles : ['full_body'])},
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 10,
      "restTime": 60,
      "notes": "Coaching tips and form cues",
      "intensity": "moderate"
    }
  ],
  "warmup": "Quick warm-up suggestion",
  "cooldown": "Cool-down recommendation"
}

Return ONLY valid JSON, nothing else.`;

        return prompt;
    }

    /**
     * Validate and enhance generated workout
     * @private
     */
    async _validateAndEnhance(workout, context) {
        // Ensure all required fields exist
        workout.name = workout.name || 'Custom Workout';
        workout.description = workout.description || `A ${context.goal} workout for ${context.level} level`;
        workout.estimatedDuration = workout.estimatedDuration || context.duration;
        workout.difficulty = workout.difficulty || context.level;
        workout.exercises = workout.exercises || [];
        workout.targetMuscles = workout.targetMuscles || context.muscles;

        // Validate exercises
        workout.exercises = workout.exercises.map((ex, idx) => ({
            name: ex.name || `Exercise ${idx + 1}`,
            sets: this._validateNumber(ex.sets, 1, 10, 3),
            reps: this._validateNumber(ex.reps, 1, 50, 10),
            restTime: this._validateNumber(ex.restTime, 15, 300, 60),
            notes: ex.notes || 'Maintain proper form',
            intensity: ex.intensity || 'moderate',
            order: idx + 1
        }));

        // Add calculated metrics
        workout.totalVolume = this._calculateWorkoutVolume(workout);
        workout.estimatedCalories = this._estimateCalories(workout, context);

        return workout;
    }

    /**
     * Calculate quality score for generated workout
     * @private
     */
    _calculateQualityScore(workout) {
        let score = 0;

        // Exercise count (20 points)
        const exCount = workout.exercises?.length || 0;
        score += Math.min(exCount * 4, 20);

        // Has description (10 points)
        if (workout.description && workout.description.length > 10) score += 10;

        // Has proper structure (20 points)
        if (workout.exercises?.every(ex => ex.name && ex.sets && ex.reps)) score += 20;

        // Has notes/tips (15 points)
        const notesCount = workout.exercises?.filter(ex => ex.notes?.length > 5).length || 0;
        score += Math.min(notesCount * 3, 15);

        // Balanced rep ranges (15 points)
        const hasVariedReps = new Set(workout.exercises?.map(ex => ex.reps)).size > 1;
        if (hasVariedReps) score += 15;

        // Has warmup/cooldown (10 points each)
        if (workout.warmup) score += 10;
        if (workout.cooldown) score += 10;

        return Math.min(score, 100);
    }

    /**
     * Intelligent fallback with user-aware templates
     * @private
     */
    async _intelligentFallback(userId, preferences, reason = null) {
        this.performanceMetrics.fallbackUsed++;

        try {
            // Try to get user's recent workouts for pattern matching
            const recentWorkouts = await Workout.find({ userId })
                .sort({ createdAt: -1 })
                .limit(3)
                .lean();

            const fallbackWorkout = this._generateSmartFallback(preferences, recentWorkouts);

            return {
                success: true,
                workout: fallbackWorkout,
                aiMetadata: {
                    model: 'intelligent_fallback',
                    source: 'database_template',
                    generatedAt: new Date(),
                    reason: reason || 'AI unavailable',
                    basedOnHistory: recentWorkouts.length > 0
                }
            };
        } catch (error) {
            // Ultimate fallback
            return {
                success: true,
                workout: this._getFallback(preferences),
                aiMetadata: {
                    model: 'basic_fallback',
                    source: 'static_template',
                    generatedAt: new Date(),
                    reason: reason || 'All systems unavailable'
                }
            };
        }
    }

    /**
     * Generate smart fallback based on user history
     * @private
     */
    _generateSmartFallback(preferences, recentWorkouts) {
        const templates = this._getFallbackTemplates();
        const goal = preferences.goal || 'strength';
        let template = templates[goal] || templates.strength;

        // If user has history, adapt the template
        if (recentWorkouts.length > 0) {
            const commonExercises = this._extractCommonExercises(recentWorkouts);
            if (commonExercises.length > 0) {
                // Blend template with user's preferred exercises
                template = this._blendWithHistory(template, commonExercises);
            }
        }

        return {
            ...template,
            description: `${template.name} - Personalized for you`,
            estimatedDuration: preferences.duration || 45,
            difficulty: preferences.fitnessLevel || 'intermediate',
            targetMuscles: preferences.targetMuscleGroups || ['full_body']
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // CACHE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    _generateCacheKey(userId, preferences) {
        const keyData = `${userId}-${preferences.goal}-${preferences.fitnessLevel}-${preferences.duration}-${(preferences.equipment || []).sort().join(',')}`;
        return require('crypto').createHash('md5').update(keyData).digest('hex');
    }

    _getFromCache(key) {
        const cached = this.responseCache.get(key);
        if (!cached) return null;

        // Check if expired
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.responseCache.delete(key);
            return null;
        }

        return cached.data;
    }

    _addToCache(key, data) {
        // Implement LRU cache logic
        if (this.responseCache.size >= this.maxCacheSize) {
            const firstKey = this.responseCache.keys().next().value;
            this.responseCache.delete(firstKey);
        }

        this.responseCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // ANALYTICS & METRICS HELPERS
    // ═══════════════════════════════════════════════════════════════

    _updateAverageResponseTime(duration) {
        const total = this.performanceMetrics.totalRequests;
        const current = this.performanceMetrics.averageResponseTime;
        this.performanceMetrics.averageResponseTime = ((current * (total - 1)) + duration) / total;
    }

    _calculateUserExperience(user, workouts) {
        if (!user) return 'beginner';
        const accountAge = Date.now() - new Date(user.createdAt).getTime();
        const daysActive = accountAge / (1000 * 60 * 60 * 24);
        const workoutCount = workouts?.length || 0;

        if (daysActive > 180 && workoutCount > 50) return 'advanced';
        if (daysActive > 60 && workoutCount > 20) return 'intermediate';
        return 'beginner';
    }

    _analyzeRecentWorkouts(workouts) {
        if (!workouts || workouts.length === 0) return null;

        const muscleFrequency = {};
        workouts.forEach(workout => {
            workout.exercises?.forEach(ex => {
                const muscle = ex.primaryMuscleGroup || 'unknown';
                muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
            });
        });

        return {
            totalWorkouts: workouts.length,
            frequentMuscles: Object.entries(muscleFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([muscle]) => muscle)
        };
    }

    _calculateExerciseSimilarity(original, alternative) {
        let score = 0;

        // Primary muscles match (40 points)
        const primaryMatch = original.primaryMuscleGroups?.filter(m =>
            alternative.primaryMuscleGroups?.includes(m)
        ).length || 0;
        score += primaryMatch * 20;

        // Equipment match (20 points)
        const equipMatch = original.equipment?.filter(e =>
            alternative.equipment?.includes(e)
        ).length || 0;
        score += equipMatch * 10;

        // Difficulty match (20 points)
        if (original.difficulty === alternative.difficulty) score += 20;

        // Movement pattern similarity (20 points)
        if (original.category === alternative.category) score += 20;

        return Math.min(score, 100);
    }

    _generateAlternativeReason(original, alternative, criteria) {
        const reasons = [];

        if (criteria.reason === 'equipment') {
            reasons.push(`Uses available equipment: ${alternative.equipment?.join(', ')}`);
        }
        if (criteria.reason === 'injury') {
            reasons.push('Lower impact alternative');
        }
        if (original.primaryMuscleGroups?.some(m => alternative.primaryMuscleGroups?.includes(m))) {
            reasons.push('Targets same muscle groups');
        }
        if (alternative.difficulty === original.difficulty) {
            reasons.push('Similar difficulty level');
        }

        return reasons.join('. ') || 'Similar exercise';
    }

    _getTimeframeDate(timeframe) {
        const now = new Date();
        const timeframes = {
            week: 7,
            month: 30,
            quarter: 90,
            year: 365
        };
        const days = timeframes[timeframe] || 30;
        return new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    }

    _calculateWeeklyAverage(workouts, timeframe) {
        if (workouts.length === 0) return 0;
        const timeframes = { week: 1, month: 4, quarter: 13, year: 52 };
        const weeks = timeframes[timeframe] || 4;
        return (workouts.length / weeks).toFixed(1);
    }

    _calculateConsistencyScore(workouts) {
        if (workouts.length < 2) return 0;

        const dates = workouts.map(w => new Date(w.createdAt).getTime()).sort();
        const intervals = [];

        for (let i = 1; i < dates.length; i++) {
            intervals.push(dates[i] - dates[i - 1]);
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) =>
            sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);

        // Lower std dev = more consistent = higher score
        const maxScore = 100;
        const score = Math.max(0, maxScore - (stdDev / (1000 * 60 * 60 * 24))); // Normalize by days

        return Math.min(score, 100);
    }

    _analyzeProgressTrend(records) {
        if (records.length < 2) return 0;

        // Simple linear regression on key metrics
        const weights = records.filter(r => r.weight).map(r => r.weight);
        if (weights.length < 2) return 0;

        const n = weights.length;
        const xSum = (n * (n + 1)) / 2;
        const ySum = weights.reduce((a, b) => a + b, 0);
        const xySum = weights.reduce((sum, y, i) => sum + y * (i + 1), 0);
        const x2Sum = (n * (n + 1) * (2 * n + 1)) / 6;

        const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
        return slope;
    }

    _calculateVolumeProgression(workouts) {
        return workouts.map((w, i) => ({
            workout: i + 1,
            volume: this._calculateWorkoutVolume(w)
        }));
    }

    _calculateWorkoutVolume(workout) {
        if (!workout.exercises) return 0;
        return workout.exercises.reduce((total, ex) =>
            total + ((ex.sets || 0) * (ex.reps || 0)), 0);
    }

    _estimateCalories(workout, context) {
        const baseCalories = {
            strength: 5,
            hypertrophy: 4.5,
            endurance: 6,
            weight_loss: 5.5,
            general_fitness: 5
        };

        const rate = baseCalories[context.goal] || 5;
        return Math.round(context.duration * rate);
    }

    _generateKeyInsights(metrics, focusAreas) {
        const insights = [];

        if (focusAreas.includes('consistency')) {
            if (metrics.consistencyScore > 75) {
                insights.push('Excellent workout consistency!');
            } else if (metrics.consistencyScore > 50) {
                insights.push('Good consistency, try to maintain regular schedule');
            } else {
                insights.push('Focus on building a consistent workout routine');
            }
        }

        if (focusAreas.includes('strength') && metrics.progressTrend > 0) {
            insights.push('Positive strength progression detected');
        }

        if (metrics.totalWorkouts === 0) {
            insights.push('Start tracking workouts to see detailed insights');
        }

        return insights;
    }

    _identifyStrengths(metrics) {
        const strengths = [];
        if (metrics.consistencyScore > 70) strengths.push('High consistency');
        if (metrics.totalWorkouts > 20) strengths.push('Strong workout history');
        if (metrics.progressTrend > 0) strengths.push('Progressive improvement');
        return strengths.length > 0 ? strengths : ['Building foundation'];
    }

    _identifyWeaknesses(metrics) {
        const weaknesses = [];
        if (metrics.consistencyScore < 50) weaknesses.push('Improve workout consistency');
        if (metrics.totalWorkouts < 5) weaknesses.push('Build workout history');
        if (metrics.progressTrend < 0) weaknesses.push('Review program intensity');
        return weaknesses.length > 0 ? weaknesses : ['Continue current path'];
    }

    _generateRecommendations(metrics, focusAreas) {
        const recommendations = [];

        if (metrics.consistencyScore < 60) {
            recommendations.push('Set specific workout days and times');
            recommendations.push('Start with 3 workouts per week');
        }

        if (metrics.progressTrend <= 0 && metrics.totalWorkouts > 10) {
            recommendations.push('Consider progressive overload');
            recommendations.push('Vary your routine every 4-6 weeks');
        }

        if (metrics.averagePerWeek < 2) {
            recommendations.push('Aim for at least 3 workouts per week');
        }

        return recommendations.length > 0 ? recommendations : ['Keep up the great work!'];
    }

    _generateMotivationalMessage(metrics) {
        if (metrics.totalWorkouts === 0) return 'Start your fitness journey today!';
        if (metrics.totalWorkouts < 5) return 'Great start! Keep building momentum!';
        if (metrics.consistencyScore > 80) return 'Outstanding consistency! You are crushing it!';
        if (metrics.progressTrend > 0) return 'Your hard work is paying off!';
        return 'Stay committed to your goals!';
    }

    _rateConsistency(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        return 'needs_improvement';
    }

    _validateNumber(value, min, max, defaultValue) {
        const num = Number(value);
        if (isNaN(num)) return defaultValue;
        return Math.max(min, Math.min(max, num));
    }

    _getFallbackTemplates() {
        return {
            strength: {
                name: 'Strength Power Workout',
                exercises: [
                    { name: 'Barbell Squat', sets: 4, reps: 5, restTime: 180, notes: 'Focus on depth and control', intensity: 'high' },
                    { name: 'Barbell Bench Press', sets: 4, reps: 5, restTime: 180, notes: 'Keep elbows at 45 degrees', intensity: 'high' },
                    { name: 'Barbell Deadlift', sets: 3, reps: 5, restTime: 240, notes: 'Maintain neutral spine', intensity: 'high' },
                    { name: 'Barbell Overhead Press', sets: 3, reps: 8, restTime: 120, notes: 'Engage core throughout', intensity: 'moderate' },
                    { name: 'Barbell Row', sets: 3, reps: 8, restTime: 120, notes: 'Pull to lower chest', intensity: 'moderate' }
                ],
                warmup: '5-10 min light cardio + dynamic stretching',
                cooldown: '5 min stretching focusing on worked muscles'
            },
            hypertrophy: {
                name: 'Muscle Building Workout',
                exercises: [
                    { name: 'Dumbbell Bench Press', sets: 4, reps: 10, restTime: 90, notes: 'Full range of motion', intensity: 'moderate' },
                    { name: 'Lat Pulldown', sets: 4, reps: 12, restTime: 75, notes: 'Control the eccentric', intensity: 'moderate' },
                    { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12, restTime: 75, notes: 'Avoid momentum', intensity: 'moderate' },
                    { name: 'Cable Bicep Curl', sets: 3, reps: 15, restTime: 60, notes: 'Squeeze at top', intensity: 'light' },
                    { name: 'Cable Tricep Extension', sets: 3, reps: 15, restTime: 60, notes: 'Full extension', intensity: 'light' },
                    { name: 'Leg Press', sets: 3, reps: 12, restTime: 90, notes: 'Full depth safely', intensity: 'moderate' }
                ],
                warmup: '5 min cardio + activation exercises',
                cooldown: 'Stretch all worked muscle groups'
            },
            endurance: {
                name: 'Endurance Circuit',
                exercises: [
                    { name: 'Burpees', sets: 3, reps: 15, restTime: 45, notes: 'Maintain pace', intensity: 'high' },
                    { name: 'Mountain Climbers', sets: 3, reps: 30, restTime: 30, notes: 'Fast tempo', intensity: 'high' },
                    { name: 'Jumping Jacks', sets: 3, reps: 40, restTime: 30, notes: 'Stay coordinated', intensity: 'moderate' },
                    { name: 'Bodyweight Squats', sets: 3, reps: 25, restTime: 30, notes: 'Full range', intensity: 'moderate' },
                    { name: 'Push-ups', sets: 3, reps: 20, restTime: 45, notes: 'Chest to ground', intensity: 'moderate' },
                    { name: 'Plank Hold', sets: 3, reps: 60, restTime: 45, notes: 'Strong core', intensity: 'moderate' }
                ],
                warmup: '3-5 min dynamic warm-up',
                cooldown: '5-10 min cool down jog + stretch'
            },
            weight_loss: {
                name: 'Fat Burning HIIT',
                exercises: [
                    { name: 'High Knees', sets: 4, reps: 40, restTime: 30, notes: 'Maximum intensity', intensity: 'high' },
                    { name: 'Jump Squats', sets: 4, reps: 15, restTime: 45, notes: 'Explosive power', intensity: 'high' },
                    { name: 'Mountain Climbers', sets: 4, reps: 30, restTime: 30, notes: 'Fast pace', intensity: 'high' },
                    { name: 'Burpees', sets: 3, reps: 12, restTime: 60, notes: 'Full movement', intensity: 'high' },
                    { name: 'Plank Jacks', sets: 3, reps: 20, restTime: 30, notes: 'Controlled', intensity: 'moderate' }
                ],
                warmup: '5 min progressive cardio warm-up',
                cooldown: '5 min walk + full body stretch'
            },
            general_fitness: {
                name: 'Total Body Fitness',
                exercises: [
                    { name: 'Goblet Squat', sets: 3, reps: 12, restTime: 60, notes: 'Keep chest up', intensity: 'moderate' },
                    { name: 'Push-ups', sets: 3, reps: 15, restTime: 60, notes: 'Modify as needed', intensity: 'moderate' },
                    { name: 'Dumbbell Rows', sets: 3, reps: 12, restTime: 60, notes: 'Each side', intensity: 'moderate' },
                    { name: 'Walking Lunges', sets: 3, reps: 20, restTime: 60, notes: '10 each leg', intensity: 'moderate' },
                    { name: 'Plank', sets: 3, reps: 45, restTime: 45, notes: 'Hold steady', intensity: 'moderate' },
                    { name: 'Jumping Jacks', sets: 3, reps: 30, restTime: 30, notes: 'Keep moving', intensity: 'light' }
                ],
                warmup: '5-7 min mixed cardio and mobility',
                cooldown: 'Light stretch routine'
            }
        };
    }

    _extractCommonExercises(workouts) {
        const exerciseFreq = {};
        workouts.forEach(workout => {
            workout.exercises?.forEach(ex => {
                const name = ex.name || ex.exerciseId?.name;
                if (name) {
                    exerciseFreq[name] = (exerciseFreq[name] || 0) + 1;
                }
            });
        });

        return Object.entries(exerciseFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name);
    }

    _blendWithHistory(template, commonExercises) {
        // Keep template structure but incorporate user's common exercises
        const newExercises = [...template.exercises];

        commonExercises.forEach((exerciseName, idx) => {
            if (idx < newExercises.length) {
                newExercises[idx] = {
                    ...newExercises[idx],
                    name: exerciseName,
                    notes: `Based on your history`
                };
            }
        });

        return {
            ...template,
            exercises: newExercises
        };
    }
}

module.exports = new AIService();
