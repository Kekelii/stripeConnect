import logger from '../utils/logger.js';
export function errorHandler(err, req, res, next) {
    //handling errors emitted by wallet
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    if (statusCode == 500) {
        logger.fatal(message);
    }
    if (statusCode == 401) {
        logger.error(message);
    }
    if (statusCode == 400) {
        logger.error(message);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
    });
}
//# sourceMappingURL=errorHander.js.map