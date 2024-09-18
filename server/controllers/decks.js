var express = require('express');
var router = express.Router();
var app = express();

app.use(express.json());
var Decks = require('../models/deck.js');

// Create a new deck
router.post('/api/v1/decks', async function(req, res, next) {
    var deck = new Decks(req.body);
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
router.get('/api/v1/decks', async function(req, res, next) {
    var decks;
    try {
        decks = await Decks.find();
    } catch (error) {
        return next(error);
    }
    res.json({"decks": decks});
});

// Sort decks by the number of cards in it or by name
router.get('/api/v1/decks/sort', async function(req, res, next) {
    let sortField; // define type of sorting
    if (req.query.field === 'name') {
        sortField = 'name';
    } else {
        sortField = 'cardAmount';
    }

    let sortOrder;
    if (req.query.order === 'asc') {
        sortOrder = 1; // ascending
    } else {
        sortOrder = -1; // descending
    }

    try {
        let decks;
        if (sortField === 'cardAmount') {
            decks = await Decks.aggregate([
                { $addFields: { cardAmount: { $size: "$cards" } } },
                { $sort: { cardAmount: sortOrder } }
            ]);
        } else {
            decks = await Decks.aggregate([
                { $addFields: { lowerName: { $toLower: "$name" } } },
                { $sort: { lowerName: sortOrder } }
            ]);
        }

        if (decks.length === 0) {
            return res.status(404).json({ "message": "No decks found." });
        }
        res.json(decks);
    } catch (error) {
        return next(error);
    }
});

// Show a specific deck
router.get('/api/v1/decks/:id', async function(req, res, next) {
    var id = req.params.id;
    try {
        const deck = await Decks.findById(id);
        if (deck == null) {
            return res.status(404).json({"message": "Decks with given id cannot be found."});
        }
        res.json(deck);
    } catch (error) {
        return next(error);
    }
})

// Update a specific deck
router.put('/api/v1/decks/:id', async function(req, res, next) {
    try {
        const deck = await Decks.findById(req.params.id);
        if (deck == null) {
            return res.status(404).json({"message": "Decks not found"});
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
router.patch('/api/v1/decks/:id', async function(req, res, next) {
    try {
        var deck = await Decks.findById(req.params.id);
        if (deck == null) {
            return res.status(404).json({"message": "Decks not found"});
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
router.delete('/api/v1/decks', async function(req, res, next) {
    try {
        const result = await Decks.deleteMany({});
        res.status(200).json({
            message: result.deletedCount + " " + "deck(s) deleted.",
            result: result
        });
    } catch (error) {
        return next(error);
    }
});

// Delete specific deck
router.delete('/api/v1/decks/:id', async function(req, res, next) {
    try {
        const deck = await Decks.findByIdAndDelete(req.params.id);
        if (deck == null) {
            res.status(404).json({"message": "Decks with given id not found."});
        }
        res.json(deck);
    } catch (error) {
        return next(error);
    }
})

module.exports = router;