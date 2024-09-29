var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String },
  registrationDate: { type: Date },
  lastLoginDate: { type: Date },
  password: { type: String },
  email: { type: String },
  achievements: {
    testAchievements: [{type: Schema.Types.ObjectId, ref: "TestAchievement"}],
    streakAchievements: [{type: Schema.Types.ObjectId, ref: "StreakAchievement"}]
  },
  decks: [{type: Schema.Types.ObjectId, ref: "deck"}]
});

module.exports = mongoose.model('user', userSchema);