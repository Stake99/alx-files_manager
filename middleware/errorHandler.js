export const errorHandler = (err, req, res, next) => {
    // Set default status code to 500 if not specified
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Send the error response
    res.status(statusCode).json({
      error: message,
      // In development, show the stack trace for better debugging
      stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
  };
  