const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({message: err.message || 'Server Error'});
};

module.exports = errorHandler;