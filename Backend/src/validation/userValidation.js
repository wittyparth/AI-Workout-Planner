const zod = require("zod")

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const sanitizedBody = zod.parse(schema, req.body)
            req.body = sanitizedBody
            next()
        }
        catch (error) {
            logger.error(`Validation error: ${error.message}`, error)
            return ResponseUtil.error(res, "Validation error", 400)
        }
    }
}