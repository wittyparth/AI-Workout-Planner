const aiService = require('../services/ai.service');
const templateService = require('../services/template.service');
const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

/**
 * AI Controller - Handle AI-powered features
 */

/**
 * Generate AI-powered workout
 * POST /ai/workout-generate
 */
exports.generateWorkout = async (req, res) => {
    try {
        logger.info('========================================');
        logger.info('[AI-CONTROLLER] 🎯 AI workout generation request received');
        logger.info('[AI-CONTROLLER] User:', req.user._id);
        logger.info('[AI-CONTROLLER] Request body:', JSON.stringify(req.body, null, 2));

        logger.info('[AI-CONTROLLER] Checking if AI service is available...');
        const isAvail = aiService.isAvailable();
        logger.info('[AI-CONTROLLER] AI available?', isAvail);

        if (!isAvail) {
            logger.error('[AI-CONTROLLER] ❌ AI service NOT available!');
            return ResponseUtil.error(res, 'AI service is not available. Please configure GEMINI_API_KEY.', 503);
        }

        const userId = req.user._id;
        const preferences = req.body;

        logger.info('[AI-CONTROLLER] ========================================');
        logger.info(`[AI-CONTROLLER] 📝 Calling aiService.generateWorkout...`);
        logger.info(`[AI-CONTROLLER] userId: ${userId}`);
        logger.info(`[AI-CONTROLLER] preferences:`, JSON.stringify(preferences, null, 2));
        logger.info('[AI-CONTROLLER] ========================================');

        const result = await aiService.generateWorkout(userId, preferences);

        logger.info('[AI-CONTROLLER] ========================================');
        logger.info('[AI-CONTROLLER] ✅ aiService.generateWorkout returned!');
        logger.info('[AI-CONTROLLER] Result:', JSON.stringify(result, null, 2));
        logger.info('[AI-CONTROLLER] ========================================');

        return ResponseUtil.success(res, {
            workout: result.workout,
            aiMetadata: result.aiMetadata
        }, 'AI workout generated successfully', 201);

    } catch (error) {
        logger.error('[AI-CONTROLLER] ========================================');
        logger.error('[AI-CONTROLLER] ❌❌❌ ERROR IN AI CONTROLLER ❌❌❌');
        logger.error('[AI-CONTROLLER] Error message:', error.message);
        logger.error('[AI-CONTROLLER] Error stack:', error.stack);
        logger.error('[AI-CONTROLLER] ========================================');
        return ResponseUtil.error(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get exercise suggestions from AI
 * POST /ai/exercise-suggest
 */
exports.suggestExercises = async (req, res) => {
    try {
        logger.info('========================================');
        logger.info('[AI-CONTROLLER] 🔍 Exercise suggestion request received');
        logger.info('[AI-CONTROLLER] Request body:', JSON.stringify(req.body, null, 2));

        if (!aiService.isAvailable()) {
            logger.error('[AI-CONTROLLER] ❌ AI service NOT available');
            return ResponseUtil.error(res, 'AI service is not available', 503);
        }

        const { exerciseId, criteria } = req.body;
        logger.info('[AI-CONTROLLER] Extracted:', { exerciseId, criteria });

        if (!exerciseId) {
            logger.error('[AI-CONTROLLER] ❌ No exerciseId provided');
            return ResponseUtil.error(res, 'Exercise ID is required', 400);
        }

        logger.info('[AI-CONTROLLER] Calling aiService.suggestAlternativeExercises...');
        const result = await aiService.suggestAlternativeExercises(exerciseId, criteria || {});
        logger.info('[AI-CONTROLLER] ✅ Got result:', JSON.stringify(result, null, 2));

        return ResponseUtil.success(res, result, 'Exercise suggestions generated successfully');

    } catch (error) {
        logger.error('[AI-CONTROLLER] ========================================');
        logger.error('[AI-CONTROLLER] ❌❌❌ ERROR IN SUGGEST EXERCISES ❌❌❌');
        logger.error('[AI-CONTROLLER] Error message:', error.message);
        logger.error('[AI-CONTROLLER] Error stack:', error.stack);
        logger.error('[AI-CONTROLLER] ========================================');
        return ResponseUtil.error(res, error.message, error.statusCode || 500);
    }
};

/**
 * Analyze user progress with AI
 * GET /ai/progress-insights
 */
exports.analyzeProgress = async (req, res) => {
    try {
        if (!aiService.isAvailable()) {
            return ResponseUtil.error(res, 'AI service is not available', 503);
        }

        const userId = req.user._id;

        const result = await aiService.analyzeProgress(userId);

        return ResponseUtil.success(res, result, 'Progress analysis completed successfully');

    } catch (error) {
        logger.error('Analyze progress error:', error);
        return ResponseUtil.error(res, error.message, error.statusCode || 500);
    }
};

/**
 * Optimize goals with AI recommendations
 * POST /ai/goal-optimize
 */
exports.optimizeGoal = async (req, res) => {
    try {
        if (!aiService.isAvailable()) {
            return ResponseUtil.error(res, 'AI service is not available', 503);
        }

        const userId = req.user._id;
        const { goalId } = req.body;

        if (!goalId) {
            return ResponseUtil.error(res, 'Goal ID is required', 400);
        }

        const result = await aiService.optimizeGoals(userId, goalId);

        return ResponseUtil.success(res, result, 'Goal optimization completed successfully');

    } catch (error) {
        logger.error('Optimize goal error:', error);
        return ResponseUtil.error(res, error.message, error.statusCode || 500);
    }
};

/**
 * Check AI service status
 * GET /ai/status
 */
exports.getAIStatus = async (req, res) => {
    try {
        const isAvailable = aiService.isAvailable();

        return ResponseUtil.success(res, {
            available: isAvailable,
            model: isAvailable ? process.env.GEMINI_MODEL || 'gemini-1.5-pro' : null,
            features: isAvailable ? [
                'workout_generation',
                'exercise_suggestions',
                'progress_analysis',
                'goal_optimization'
            ] : []
        }, 'AI service status retrieved');

    } catch (error) {
        logger.error('Get AI status error:', error);
        return ResponseUtil.error(res, error.message, 500);
    }
};
