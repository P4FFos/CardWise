var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var deckSchema = new Schema({
    name: {type: String },
    cards: [{type: Schema.Types.ObjectId, ref: "card"}]
});

module.exports = mongoose.model('deck', deckSchema);

