var express = require('express');
var router = express.Router();
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json());

var User = require('../models/user.js');
var Deck = require('../models/deck.js');

// Create a new deck
router.post('/api/v1/users/:userID/decks', async function(req, res, next) {
    var userID = req.params.userID;
    var user = await User.findById(userID);
    var deck = new Deck(req.body);
    console.log(deck._id);
    try {
        if (!deck) {
            res.status(404).json({"message": "Cannot create a null deck."})
        }
        user.decks.push(deck._id);
        await deck.save();
        await user.save();
    } catch (error) {
        return next(error);
    }
    res.status(201).json({
        "deck": deck,
        "_links": {
            "self": {
                "rel": "self",
                "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deck._id}`
            },
            "update": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deck._id}`,
                "method": "PUT"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deck._id}`,
                "method": "DELETE"
            }, 
            "post": {
                "rel": "post",
                "href": `http://localhost:${port}/api/v1/users/${userID}/decks`,
                "method": "POST"
            }
        }});
});

// Show all decks
router.get('/api/v1/users/:userID/decks', async function(req, res, next) {
    var userID = req.params.userID;
    try {
        user = await User.findById(userID).populate("decks").exec();
        if (!user) {
            return res.status(404).json({ "message": "Decks do not exist." });
        }
    } catch (error) {
        return next(error);
    }
    res.json({"decks": user.decks});
});

// Sort decks by the number of cards in it or by name
router.get('/api/v1/users/:userID/decks/sort', async function(req, res, next) {
    let sortField; // define type of sorting
    if (req.query.field === 'name') {
        sortField = 'name';
    } else {
        sortField = 'cardAmount';
    }
    if (!sortField) {
        return res.status(404).json({ "message": "Sort field was not defined." });
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
router.get('/api/v1/users/:userID/decks/:id', async function(req, res, next) {
    var userID = req.params.userID;
    var deckID = req.params.id;
    console.log('Deck ID:', deckID);
    try {
        var user = await User.findById(userID).populate("decks").exec();
        var deck = await user.decks.find(function(deck) {
            return deck._id.toString() === deckID;
        });
        if (!deck) {
            return res.status(404).json({"message": "Deck with given id cannot be found."});
        }
        res.status(200).json({
            "deck": deck,
            "_links": {
                "update": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "PUT"
                },
                "update deck name": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "PATCH"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks`,
                    "method": "POST"
                }
            }});
    } catch (error) {
        return next(error);
    }
})

// Update a specific deck
router.put('/api/v1/users/:userID/decks/:id', async function(req, res, next) {
    var userID = req.params.userID;
    var deckID = req.params.id;
    console.log('Deck ID:', deckID);
    try {
        var user = await User.findById(userID).populate("decks").exec();
        var deck = await user.decks.find(d => d._id.toString() === deckID);
        if (!deck) {
            return res.status(404).json({"message": "Deck not found"});
        }
        deck.name = req.body.name;
        deck.cards = req.body.cards;

        await deck.save();
        res.status(200).json({
            "deck": deck,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`
                },
                "update deck name": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "PATCH"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks`,
                    "method": "POST"
                }
            }});
    } catch (err) { 
        return next(err); 
    }
});

// Update some part of a specific deck
router.patch('/api/v1/users/:userID/decks/:id', async function(req, res, next) {
    var userID = req.params.userID;
    var deckID = req.params.id;
    console.log('Deck ID:', deckID);
    try {
        var user = await User.findById(userID).populate("decks").exec();
        var deck = await user.decks.find(d => d._id.toString() === deckID);
        if (!deck) {
            return res.status(404).json({"message": "Deck not found"});
        }
        deck.name = req.body.name || deck.name;
        deck.cards = req.body.cards || deck.cards;

        await deck.save();
        res.status(200).json({
            "deck": deck,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`
                },
                "update": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "PUT"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks`,
                    "method": "POST"
                }
            }});
    } catch (err) { 
        return next(err); 
    }
});

// Delete all decks
router.delete('/api/v1/users/:userID/decks', async function(req, res, next) {
    var userID = req.params.userID;
    try {
        var user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ "message": "User with the provided ID does not exist." });
        }
        var deckIDs = user.decks.map(deck => deck._id);
        var deletedDecks = await Deck.deleteMany({ _id: { $in: deckIDs}});
        
        user.decks = [];
        await user.save();

        res.status(200).json({
            message: deletedDecks.deletedCount + " deck(s) deleted.",
            userResult: user,
            deckResults: deletedDecks,
        });
    } catch (error) {
        return next(error);
    }
});

// Delete specific deck
router.delete('/api/v1/users/:userID/decks/:id', async function(req, res, next) {
    var deckID = req.params.id;
    try {
        const deck = await Deck.findByIdAndDelete(deckID);
        if (!deck) {
            res.status(404).json({"message": "Deck with given id not found."});
        }
        res.json(deck);
    } catch (error) {
        return next(error);
    }
})

module.exports = router;