var express = require('express');
var router = express.Router();
var app = express();

app.use(express.json());
var Deck = require('../models/deck.js');

//TODO: add endpoints from req list for decks
// Create a new deck
router.post('/api/decks', async function(req, res, next) {
    var deck = new Deck(req.body);
    try {
        await deck.save();
        if (deck == null) {
            res.status(404).json({"message": "Cannot create a null deck."})
        }
    } catch (error) {
        return next(error);
    }
    res.status(201).json(deck);
});

// Show all decks
router.get('/api/decks', async function(req, res, next) {
    var decks;
    try {
        decks = await Deck.find();
    } catch (error) {
        return next(error);
    }
    res.json({"decks": decks});
});

// Show a specific deck
router.get('/api/decks/:id', async function(req, res, next) {
    var id = req.params.id;
    try {
        const deck = await Deck.findById(id);
        if (deck == null) {
            return res.status(404).json({"message": "Deck with given id cannot be found."});
        }
        res.json(deck);
    } catch (error) {
        return next(error);
    }
})

// Update a specific deck
router.put('/api/decks/:id', async function(req, res, next) {
    try {
        const deck = await Deck.findById(req.params.id);
        if (deck == null) {
            return res.status(404).json({"message": "Deck not found"});
        }
        deck.name = req.body.name;
        deck.cards = req.body.cards;

        await deck.save();
        res.json(deck);
    } catch (err) { 
        return next(err); 
    }
});

// Update some part of a specific deck
router.patch('/api/decks/:id', async function(req, res, next) {
    try {
        var deck = await Deck.findById(req.params.id);
        if (deck == null) {
            return res.status(404).json({"message": "Deck not found"});
        }
        deck.name = req.body.name || deck.name;
        deck.cards = req.body.cards || deck.cards;

        await deck.save();
        res.json(deck);
    } catch (err) { 
        return next(err); 
    }
});

// Delete all decks
router.delete('/api/decks', async function(req, res, next) {
    try {
        const result = await Deck.deleteMany({});
        res.status(204).json({
            message: result.deletedCount + " " + "deck(s) deleted.",
            result: result
        });
    } catch (error) {
        return next(error);
    }
});

// Delete specific deck
router.delete('/api/decks/:id', async function(req, res, next) {
    try {
        const deck = await Deck.findByIdAndDelete(req.params.id);
        if (deck == null) {
            res.status(404).json({"message": "Deck with given id not found."});
        }
        res.json(deck);
    } catch (error) {
        return next(error);
    }
})

module.exports = router;