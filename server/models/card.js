var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    explanation: {type: String },
    content: {type: String }
});

module.exports = mongoose.model('card', cardSchema);

