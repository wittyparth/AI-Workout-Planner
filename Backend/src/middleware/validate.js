const zod = require("zod")
const logger = require("../utils/logger")
const ResponseUtil = require("../utils/response")

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })

            // Update req with validated/transformed data
            if (result.body) req.body = result.body
            if (result.query) req.query = result.query
            if (result.params) req.params = result.params

            next()
        } catch (error) {
            if (error.errors) {
                // Format Zod validation errors
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))

                logger.error(`Validation error: ${JSON.stringify(formattedErrors)}`)
                return ResponseUtil.error(res, 'Validation failed', 400, formattedErrors)
            }
            next(error)
        }
    }
}

module.exports = validate