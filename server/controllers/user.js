var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

// create specific user
router.post('/api/user', async function (req, res, next) {
    var user = new User(req.body);
    try {
        await user.save();
    } catch (error) {
        return next(error);
    }
    res.status(201).json(newUser);
});

// update user information
router.put('/api/user/:id', async function (req, res, next) {
    var userId = req.params.id;
    var updateData = req.body;

    var updatedUser;
    try {
        updatedUser = await User.find(userId, updateData, {new: true});
    } catch (error) {
        return next(error);
    }

    if (!updatedUser) {
        return res.status(404).json({message: 'User not found'});
    }

    res.json(updatedUser);
});

// update username
router.put('/api/user/:id/username', async function (req, res, next) {
    var userId = req.params.id;
    var newUsername = req.body.username;

    var updatedUser;
    try {
        updatedUser = await User.findByIdAndUpdate(userId, {username: newUsername}, {new: true});
    } catch (error) {
        return next(error);
    }

    if (!updatedUser) {
        return res.status(404).json({message: 'User not found'});
    }

    res.json(updatedUser);
});

// delete user
router.delete('/api/user/:id', async function (req, res, next) {
    var userId = req.params.id;

    var deletedUser;
    try {
        deletedUser = await User.findByIdAndDelete(userId);
    } catch (error) {
        return next(error);
    }

    if (!deletedUser) {
        return res.status(404).json({message: 'User not found'});
    }

    res.json({message: 'User account deleted successfully'});
});

module.exports = router;