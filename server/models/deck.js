var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/animalDevelopmentDB");

var deckSchema = new Schema({
    name: {type: String },
    cards: [
        {
            content: {type: String, required: false},
            explanation: {type: String, required: false}
        }]
});

module.exports = mongoose.model('decks', deckSchema);

