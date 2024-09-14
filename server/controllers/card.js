var express = require('express');
var router = express.Router();
var app = express();

//var Card = require('../models/card.js');

var cards = [];

app.use(express.json());

// Create a card
app.post('/cards', function(req, res) {
    console.log(req.body);
    var new_card = {
        "_id": cards.length,
        "content": req.body.content,
        "explanation": req.body.explanation
    };    
    cards.push(new_card);
    res.status(201).json(new_card);
});

// Get information from a specific card
app.get('/cards/:id', function(req, res) {
    res.json(cards[req.params.id]);
});

// Get information from all cards
app.get('/cards', function(req, res) {
    res.json({"cards": cards});
});

app.listen(3000, function() {
    console.log('Server running on port 3000');
});

//TODO: add endpoints from req list for cards

module.exports = app;