module.exports = function(env) {
  if (env === 'development') {
    // Return development error handler.
    // Will print stacktrace.
    return function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  }

  // Return production error handler.
  // Will not leak stacktrace to user.
  return function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {} // No stacktrace!
    });
  }
};