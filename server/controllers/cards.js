var express = require('express');
var router = express.Router();
var port = process.env.PORT || 3000;

var User = require('../models/user.js');
var Card = require('../models/card.js');
var Deck = require('../models/deck.js');

// Create a card
router.post('/api/v1/users/:userID/decks/:deckID/cards', async function(req, res, next) {
    var userID = req.params.userID;
    var deckID = req.params.deckID;
    var card = new Card(req.body);
    try {
        var deck = await Deck.findById(deckID);
        await card.save();
        if (deck == null) {
            res.status(404).json({"message": "Deck with id provided does not exist."})
        }
        if (card == null) {
            res.status(404).json({"message": "Cannot create a null card"})
        }
        deck.cards.push(card._id);
        await deck.save();
    } catch (error) {
        return next(error);
    }
    res.status(201).json({
        "card": card,
        "_links": {
            "self": {
                "rel": "self",
                "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}/cards/${card._id}`
            },
            "edit": {
                "rel": "edit",
                "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}/cards/${card._id}`,
                "method": "PUT"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}/cards/${card._id}`,
                "method": "DELETE"
            }
        }});
});

// Get information from all cards in a specific deck
router.get('/api/v1/users/:userID/decks/:deckID/cards', async function(req, res, next) {
    var deckID = req.params.deckID;
    try {
        var deck = await Deck.findById(deckID).populate("cards").exec();
        if (!deck) {
            return res.status(404).json({ "message": "Deck with the provided ID does not exist." });
        }
    } catch (error) {
        return next(error);
    }
    //TODO This is not good, have to change it
    res.status(200).json({
            deck : {
                _id: deck._id,
                name: deck.name,
                cards: deck.cards
            }

    });
});

// Get information from a specific card in a specific deck
router.get('/api/v1/users/:userID/decks/:deckID/cards/:cardID', async function(req, res, next) {
    var userID = req.params.userID;
    var deckID = req.params.deckID;
    var cardID = req.params.cardID;
    console.log('Card ID:', cardID);
    try {
        var deck = await Deck.findById(deckID).populate("cards").exec();
        console.log('Deck:', deck);
        if (!deck) {
            return res.status(404).json({ "message": "Deck with the provided ID does not exist." });
        }
       
        var card = deck.cards.find(function(card) {
            return card._id.toString() === cardID
        });
        console.log(card);
        if (!deck) {
            return res.status(404).json({ "message": "Card with the provided ID does not exist." });
        }
    } catch (error) {
        return next(error);
    }
    res.status(200).json({
        "card": card,
        "_links": {
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/users/${userID}decks/${deckID}/cards/${cardID}`,
                "method": "DELETE"
            },
            "edit": {
                "rel": "edit",
                "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}/cards/${card._id}`,
                "method": "PUT"
            },
            "post": {
                "rel": "post",
                "href": `http://localhost:${port}/api/v1/users/${userID}decks/${deckID}/cards`,
                "method": "POST"
            }
        }});
});
// Update card of a specific deck
router.put('/api/v1/users/:userID/decks/:deckId/cards/:cardId', async function(req, res, next) {
    const userID = req.params.userID;
    const deckID = req.params.deckId;
    const cardID = req.params.cardId;

    try {
        const user = await User.findById(userID).populate("decks").exec();
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        var deck = await Deck.findById(deckID).populate("cards").exec();
        if (!deck) {
            return res.status(404).json({ "message": "Deck not found" });
        }

        var card = deck.cards.find(function(card) {
            return card._id.toString() === cardID
        });
        if (!card) {
            return res.status(404).json({ "message": "Card not found" });
        }

        // Log the request body to ensure it's correct
        console.log("Request body:", req.body);

        card.content = req.body.content || card.content;
        card.explanation = req.body.explanation || card.explanation;

        // Save the updated deck
        await deck.save()
        await card.save()
        res.status(200).json({
            "card": card,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}/cards/${cardID}`
                },
                "delete": {
                    "rel": "delete",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}/cards/${cardID}`,
                    "method": "DELETE"
                },
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/decks/${deckID}`,
                    "method": "POST"
                }
            }
        });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error for debugging
        return res.status(500).json({ "message": "Internal server error", error: err.message });
    }
});


// Delete a card in a deck
router.delete('/api/v1/users/:userID/decks/:deckID/cards/:cardID', async function(req, res, next) {
    var deckID = req.params.deckID;
    var cardID = req.params.cardID;
    console.log('Card ID:', cardID);
    try {
        var deck = await Deck.findById(deckID).populate("cards").exec();
        console.log('Deck:', deck);
        if (!deck) {
            return res.status(404).json({ "message": "Deck with the provided ID does not exist." });
        }
        var cardInfo = deck.cards.find(function(card) {
            return card._id.toString() === cardID
        });
        var card = await Card.findByIdAndDelete(req.params.cardID);
        console.log(card);
        if (!deck) {
            return res.status(404).json({ "message": "Card with the provided ID does not exist." });
        }
        res.json(card);
    } catch (error) {
        return next(error);
    }
});

// Delete all cards in a deck
router.delete('/api/v1/users/:userID/decks/:deckID/cards', async function(req, res, next) {
    var deckID = req.params.deckID;
    try {
        var deck = await Deck.findById(deckID)
        if (!deck) {
            return res.status(404).json({ "message": "Deck with the provided ID does not exist." });
        }
        
        var cardIDs = deck.cards.map(card => card._id);
        
        var deletedCards = await Card.deleteMany({ _id: { $in: cardIDs}});
        
        deck.cards = [];
        await deck.save();
        
        res.status(200).json({
            message:  "All cards have been deleted from the deck",
            deckResult: deck,
            cardResults: deletedCards
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;