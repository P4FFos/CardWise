const testAchievementSchema = new Schema({
  isTriggered: { type: Boolean, default: false },
  condition: { type: String, required: true }
});

const TestAchievement = Achievement.discriminator('TestAchievement', testAchievementSchema);

module.exports = TestAchievement;
  