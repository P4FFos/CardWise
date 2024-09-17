var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var streakAchievementSchema = new Schema({
  name: { type: String },
  streakCounter: { type: Number, required: true},
});

module.exports = mongoose.model('streakAchievement', achievementSchema);