var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("'mongodb://localhost:27017/animalDevelopmentDB");

var cardSchema = new Schema({
    explanation: {type: String },
    content: {type: String }
});

module.exports = mongoose.model('cards', cardSchema);

