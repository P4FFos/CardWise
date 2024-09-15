var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String },
  registrationDate: { type: Date },
  lastLoginDate: { type: Date },
  password: { type: String },
});

// convert date strings to Date objects before saving
userSchema.pre('save', function(next) {
  if (typeof this.registrationDate === 'string') {
    this.registrationDate = new Date(this.registrationDate);
  }
  if (typeof this.lastLoginDate === 'string') {
    this.lastLoginDate = new Date(this.lastLoginDate);
  }
  next();
});

module.exports = mongoose.model('user', userSchema);