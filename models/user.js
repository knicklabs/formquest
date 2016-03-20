var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    index: { unique: true }
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [8, 'Password must be at least 8 characters.'],
    maxlength: [128, 'Password must be less than 128 characters.']
  }
});

UserSchema.pre('save', function(next) {
  var user = this;

  // Do not hash the password unless it has been modified.
  if (!user.isModified('password')) return next();

  // Generate a salt.
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // Hash the password using generated salt.
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // Replace the plain text password with a hash
      user.password = hash;
      next();
    });
  });
});

UserSchema.statics.register = function(userParams, cb) {
  var User = this;

  // Check for an existing user.
  User.findOne({email: userParams.email}, function(err, result) {
    if (err) return cb(err);

    if (result) {
      // Found existing user.
      return cb(null, null, 'That email address is already in use.');
    }

    // Create a new user.
    User.create(userParams, function(err, result) {
      if (err) {
        return (err.errors) ? cb(null, null, err.errors) : cb(err);
      }

      var user = result.toObject();
      delete user.password; // Filter password out.

      return cb(null, user);
    });
  });
}

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  var user = this;

  bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
