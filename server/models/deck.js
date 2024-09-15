var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var deckSchema = new Schema({
    name: {type: String },
    cards: [
        {
            content: {type: String, required: false},
            explanation: {type: String, required: false}
        }]
});

module.exports = mongoose.model('deck', deckSchema);

