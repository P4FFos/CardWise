const mongoose = require('mongoose');
const { Schema } = mongoose;

var Achievement = require('./achievement.js');

const testAchievementSchema = new Schema({
  condition: { type: String, required: true }
});

const TestAchievement = Achievement.discriminator('TestAchievement', testAchievementSchema);

module.exports = TestAchievement;