class ResponseUtil {
    static success(res, data = null, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            sucess: true,
            message,
            data,
            timeStamp: new Date().toISOString()
        })
    }

    static error(res, message = "Error Occured", statusCode = "500", errors = null) {
        res.status(statusCode).json({
            errors,
            timeStamp: new Date().toISOString(),
            message,
            success: false
        })
    }

    static paginated(res, data = null, message = "Success", page, limit, total) {
        const totalPages = Math.ceil(total / limit)
        res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages,
                total,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 0
            },
            timeStamp: new Date().toISOString()
        })
    }
}

module.exports = ResponseUtil