const mongoose = require('mongoose');
const { Schema } = mongoose;

var Achievement = require('./achievement.js');

const streakAchievementSchema = new Schema({
  streakCounter: { type: Number, required: true }
});

const StreakAchievement = Achievement.discriminator('StreakAchievement', streakAchievementSchema);

module.exports = StreakAchievement;