var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var achievementSchema = new Schema({
  name: { type: String },
  type: { type: String },
  id: { type: String },
});

module.exports = mongoose.model('achievement', achievementSchema);