var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deckSchema = new Schema({
  name: { type: String },
  cardAmount: { type: Number },
  id: { type: String },
});

module.exports = mongoose.model('deck', deckSchema);