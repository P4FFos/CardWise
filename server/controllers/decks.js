var express = require('express');
var router = express.Router();
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json());
var Deck = require('../models/deck.js');


// Create a new deck
router.post('/api/v1/decks', async function(req, res, next) {
    var deck = new Deck(req.body);
    console.log(deck._id);
    try {
        if (deck == null) {
            res.status(404).json({"message": "Cannot create a null deck."})
        }
        await deck.save();
    } catch (error) {
        return next(error);
    }
    res.status(201).json({
        "deck": deck,
        "_links": {
            "self": {
                "rel": "self",
                "href": `http://localhost:${port}/api/v1/decks/${deck._id}`
            },
            "update": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/decks/${deck._id}`,
                "method": "PUT"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/decks/${deck._id}`,
                "method": "DELETE"
            }, 
            "post": {
                "rel": "post",
                "href": `http://localhost:${port}/api/v1/decks`,
                "method": "POST"
            }
        }});
});

// Show all decks
router.get('/api/v1/decks', async function(req, res, next) {
    var decks;
    try {
        decks = await Deck.find();
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
            decks = await Deck.aggregate([
                { $addFields: { cardAmount: { $size: "$cards" } } },
                { $sort: { cardAmount: sortOrder } }
            ]);
        } else {
            decks = await Deck.aggregate([
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
    console.log(id)
    try {
        var deck = await Deck.findById(id);
        if (deck == null) {
            return res.status(404).json({"message": "Deck with given id cannot be found."});
        }
        res.json({
            "deck": deck,
            "_links": {
                "update": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/decks/${id}`,
                    "method": "PUT"
                },
                "update deck name": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/decks/${id}`,
                    "method": "PATCH"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/decks/${id}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/decks`,
                    "method": "POST"
                }
            }});
    } catch (error) {
        return next(error);
    }
})

// Update a specific deck
router.put('/api/v1/decks/:id', async function(req, res, next) {
    try {
        const deck = await Deck.findById(req.params.id);
        if (deck == null) {
            return res.status(404).json({"message": "Deck not found"});
        }
        deck.name = req.body.name;
        deck.cards = req.body.cards;

        await deck.save();
        res.json({
            "deck": deck,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/decks/${deck._id}`
                },
                "update deck name": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/decks/${deck._id}`,
                    "method": "PATCH"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/decks/${deck._id}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/decks`,
                    "method": "POST"
                }
            }});
    } catch (err) { 
        return next(err); 
    }
});

// Update some part of a specific deck
router.patch('/api/v1/decks/:id', async function(req, res, next) {
    try {
        var deck = await Deck.findById(req.params.id);
        if (deck == null) {
            return res.status(404).json({"message": "Deck not found"});
        }
        deck.name = req.body.name || deck.name;
        deck.cards = req.body.cards || deck.cards;

        await deck.save();
        res.json({
            "deck": deck,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/decks/${deck._id}`
                },
                "update": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/decks/${deck._id}`,
                    "method": "PUT"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/decks/${deck._id}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/decks`,
                    "method": "POST"
                }
            }});
    } catch (err) { 
        return next(err); 
    }
});

// Delete all decks
router.delete('/api/v1/decks', async function(req, res, next) {
    try {
        const result = await Deck.deleteMany({});
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