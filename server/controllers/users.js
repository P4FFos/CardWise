var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

// create specific user
router.post('/api/v1/users', async function (req, res, next) {
    var user = new User(req.body);
    try {
        await user.save();
    } catch (error) {
        return next(error);
    }
    res.status(201).json(user);
});

// get all users
router.get('/api/v1/users', async function (req, res, next) {
    var users;
    try {
        users = await User.find();
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

    res.json(updatedUser);
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

    res.json(updatedUser);
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
