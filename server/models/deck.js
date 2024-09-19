var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var deckSchema = new Schema({
    name: {type: String },
    cards: [{type: Schema.Types.ObjectId, ref: "card"}]
});

// Create derived attribute cardAmount
deckSchema.virtual('cardAmount').get(function() {
    return this.cards ? this.cards.length: 0;
});

// disable second auto-generated id attribute
deckSchema.set('id' , false);

// Make it visible in using GET
deckSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('deck', deckSchema);

