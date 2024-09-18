const mongoose = require('mongoose');
const { Schema } = mongoose;

const achievementSchema = new Schema({
  name: { type: String },
  type: { type: String, required: true }
}, {
  discriminatorKey: 'type',
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;