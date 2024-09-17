var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testAchievementSchema = new Schema({
  name: { type: String },
  isTriggered: false,
  condition: { type: String },
});

module.exports = mongoose.model('testAchievement', achievementSchema);