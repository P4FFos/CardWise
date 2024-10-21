var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userAchievementSchema = new Schema({
  achievement: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

var userSchema = new Schema({
  username: { type: String },
  registrationDate: { type: Date },
  lastLoginDate: { type: Date },
  lastStreakDate: { type: Date },
  streak: { type: Number, default: 0 },
  password: { type: String },
  email: { type: String },
  emailSettings: {
    notifications: { type: [String], enum: ['reminder', 'emptyDeck', 'noDecks', 'none'], default: 'none'},
    reminderInterval: { type: Number, default: 1},
    lastReminderSent: { type: Date},
    timesPerDay: { type: Number, default: 1}
  },
  achievements: [userAchievementSchema],
  decks: [{type: Schema.Types.ObjectId, ref: "deck"}]
});

userSchema.virtual('deckAmount').get(function() {
  return this.decks ? this.decks.length: 0;
});

userSchema.set('id' , false);

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', userSchema);
