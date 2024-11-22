class ErrorHandler {
    static handleError(err, req, res, next) {
        console.log(err.stack);
        res.status(err.status || 500).json({ message: 'An unexpected error occured', error: err.message });
    }
}

module.exports = ErrorHandler;