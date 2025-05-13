const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('Error:', error.message, error.stack);

      res.status(500).json({ error: 'Internal Server Error' });
    });
  };
  
  module.exports = asyncHandler;