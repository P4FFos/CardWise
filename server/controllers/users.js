var express = require('express');
var router = express.Router();
var port = process.env.PORT || 3000;

var User = require('../models/user.js');

// create specific user
router.post('/api/v1/users', async function (req, res, next) {
    var user = new User(req.body);
    try {
        if (!user) {
            res.status(404).json({"message": "Cannot create a null user."})
        }
        await user.save();
    } catch (error) {
        return next(error);
    }
    res.status(201).json({
        "user": user,
        "_links": {
            "self": {
                "rel": "self",
                "href": `http://localhost:${port}/api/v1/users/${user._id}`
            },
            "update user information": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/users/${user._id}`,
                "method": "PUT"
            },
            "update": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/users/${user._id}/username`,
                "method": "PATCH"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/users/${user._id}`,
                "method": "DELETE"
            }
        }});
});

// get all users
router.get('/api/v1/users', async function (req, res, next) {
    var users;
    try {
        users = await User.find();
        if (!users) {
            return res.status(404).json({ "message": "Users do not exist." });
        }
    } catch (error) {
        return next(error);
    }
    res.json(users);
});

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
    } catch (error) {
        return next(error);
    }

    res.json({
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
    } catch (error) {
        return next(error);
    }

    res.json({
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

    var deletedUser;
    try {
        deletedUser = await User.findById(userId);
        if (!deletedUser) {
            return res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        return next(error);
    }

    res.json({message: 'User account deleted successfully'});
});

module.exports = router;
