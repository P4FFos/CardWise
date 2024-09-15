var express = require('express');
var router = express.Router();

var Card = require('../models/card.js');
var Deck = require('../models/deck.js');
var cards = [];

// Create a card
router.post('/api/decks/:deckID/cards', function(req, res) {
    console.log(req.body);
    var new_card = {
        "_id": cards.length,
        "content": req.body.content,
        "explanation": req.body.explanation
    };    
    cards.push(new_card);
    res.status(201).json(new_card);
});

// Get information from all cards in a specific deck
router.get('/api/decks/deckIDcards', function(req, res) {
    res.json({"cards": cards});
});

// Get information from a specific card in a specific deck
router.get('/api/decks/:deckID/cards/:cardID', function(req, res) {
    res.json(cards[req.params.id]);
});


//TODO: add endpoints from req list for cards

module.exports = router;