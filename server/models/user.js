var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String },
  registrationDate: { type: Date },
  lastLoginDate: { type: Date },
  password: { type: String },
});

module.exports = mongoose.model('user', userSchema);