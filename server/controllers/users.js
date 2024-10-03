var express = require('express');
var router = express.Router();
var port = process.env.PORT || 3000;

var User = require('../models/user.js');

// create specific user
router.post('/api/v1/users', async function (req, res, next) {
    try {
        // Check if the user already exists
        var existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ "message": "User already exists" });
        }

        var user = new User(req.body);
        if (!user) {
            res.status(404).json({"message": "Cannot create a null user"})
        }
        await user.save();

        res.status(201).json({
            "user": user,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/users/${user._id}`
                },
                "update user information": {
                    "rel": "update",
                    "href": `http://localhost:${port}/api/v1/users/${user._id}`,
                    "method": "PUT"
                },
                "update": {
                    "rel": "update",
                    "href": `http://localhost:${port}/api/v1/users/${user._id}/username`,
                    "method": "PATCH"
                },
                "delete": {
                    "rel": "delete",
                    "href": `http://localhost:${port}/api/v1/users/${user._id}`,
                    "method": "DELETE"
                }
            }
        });
    } catch (error) {
        return next(error);
    }
});

// get all users
router.get('/api/v1/users', async function (req, res, next) {
    var users;
    try {
        users = await User.find();
        if (!users) {
            return res.status(404).json({ "message": "Users do not exist" });
        }
    } catch (error) {
        return next(error);
    }
    res.json(users);
});

// Show a specific user
router.get('/api/v1/users/:userID', async function(req, res, next) {
    var userID = req.params.userID;
    try {
        var user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({"message": "User with given id cannot be found"});
        }
        res.status(200).json({
            "user": user,
            "_links": {
                "update": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}`,
                    "method": "PUT"
                },
                "update username": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}`,
                    "method": "PATCH"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/decks`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/users`,
                    "method": "POST"
                }
            }});
    } catch (error) {
        return next(error);
    }
})

// update user information
router.put('/api/v1/users/:id', async function (req, res, next) {
    var userId = req.params.id;
    var updateData = req.body;

    var updatedUser;
    try {
        updatedUser = await User.findById(userId);
        if (updatedUser == null) {
            return res.status(404).json({message: 'User not found'});
        }
        updatedUser.set(updateData);
        await updatedUser.save();
    } catch (error) {
        return next(error);
    }

    res.status(200).json({
        "user": updatedUser,
        "_links": {
            "self": {
                "rel": "self",
                "href": `http://localhost:${port}/api/v1/users/${userId}`
            },
            "update": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/users/${userId}/username`,
                "method": "PATCH"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/users/${userId}`,
                "method": "DELETE"
            }, 
            "post": {
                "rel": "post",
                "href": `http://localhost:${port}/api/v1/users`,
                "method": "POST"
            }
        }});
});

// update username
router.patch('/api/v1/users/:id/username', async function (req, res, next) {
    var userId = req.params.id;
    var newUsername = req.body.username;

    var updatedUser;
    try {
        updatedUser = await User.findById(userId);
        if (updatedUser == null) {
            return res.status(404).json({message: 'User not found'});
        }
        updatedUser.username = newUsername;
        await updatedUser.save();
    } catch (error) {
        return next(error);
    }

    res.status(200).json({
        "user": updatedUser,
        "_links": {
            "self": {
                "rel": "self",
                "href": `http://localhost:${port}/api/v1/users/${userId}`
            },
            "update user information": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/users/${userId}`,
                "method": "PUT"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/users/${userId}`,
                "method": "DELETE"
            }, 
            "post": {
                "rel": "post",
                "href": `http://localhost:${port}/api/v1/users`,
                "method": "POST"
            }
        }});
});

// delete user
router.delete('/api/v1/users/:id', async function (req, res, next) {
    var userId = req.params.id;

    try {
        var deletedUser = await User.findById(userId);
        if (!deletedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        await User.deleteOne({ _id: userId });
    } catch (error) {
        return next(error);
    }

    res.json({message: 'User account deleted successfully'});
});

// delete all users
router.delete('/api/v1/users', async function (req, res, next) {
    try {
        await User.deleteMany({});
        res.json({message: 'All user accounts deleted successfully'});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
