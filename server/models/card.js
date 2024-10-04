var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    content: {type: String },
    explanation: {type: String }
});

module.exports = mongoose.model('card', cardSchema);

