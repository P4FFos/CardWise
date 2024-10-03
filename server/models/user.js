var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userAchievementSchema = new Schema({
  achievement: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
  completed: { type: Boolean, default: false }      
});

var userSchema = new Schema({
  username: { type: String },
  registrationDate: { type: Date },
  lastLoginDate: { type: Date },
  password: { type: String },
  email: { type: String },
  achievements: [userAchievementSchema],
  decks: [{type: Schema.Types.ObjectId, ref: "deck"}]
});

module.exports = mongoose.model('user', userSchema);