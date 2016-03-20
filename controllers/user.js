var User = require('../models/user');

module.exports = {
  index: function(req, res, next) {
    res.send('respond with a resource');
  },

  signup: function(req, res, next) {
    // Get the submitted email and password.
    var email = req.body.email;
    var password = req.body.password;

    // Test for existing user.
    User.register({email: email, password: password}, function(err, user, reason) {
      if (err) return next(err);

      if (user) {
        return res
          .status(200)
          .json({
            success: true,
            user: user
          })
        ;
      }

      return res
        .status(422)
        .json({
          success: false,
          error: reason
        })
      ;
    });
  }
};
