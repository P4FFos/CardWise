var express = require('express');
var router = express.Router();
var axios = require('axios');
var mailer = require('../NodeMailer.js')
var port = process.env.PORT || 3000;

var User = require('../models/user.js');
const globalAchievements = require('../config/achievements_data.js');

// create specific user
router.post('/api/v1/users', async function (req, res, next) {
    try {
        // Check if the user already exists by email or username
        var existingUserEmail = await User.findOne({ email: req.body.email })
        var existingUsername = await User.findOne({ username: req.body.username })

        if (existingUsername && existingUserEmail) {
            return res.status(409).json({ "message": "User with this email and username already exists" });
        }

        if (existingUserEmail) {
            return res.status(409).json({ "message": "User with this email already exists" });
        }

        if (existingUsername) {
            return res.status(409).json({ "message": "User with this username already exists" });
        }

        var user = new User(req.body);
        if (!user) {
            res.status(404).json({"message": "Cannot create a null user"})
        }
        await user.save();

        //create user-specific achievements for progress tracking
        const achievementRequests = globalAchievements.map(async (achievement) => {
            try {
                await axios.post(`http://localhost:3000/api/v1/users/${user._id}/achievements/${achievement.id}`);
                console.log(`Achievement ${achievement.name} added to user ${user._id}`);
            } catch (error) {
                console.error(`Failed to add achievement ${achievement.name}: `, error.message);
            }
        });

        await Promise.all(achievementRequests);

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
                "update email config": {
                    "rel": "update",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/email-settings`,
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

        if (updateData.lastLoginDate) {
            updatedUser.lastLoginDate = updateData.lastLoginDate;
        }
        if (updateData.streak) {
            updatedUser.streak = updateData.streak;
        }
        if (updateData.lastStreakDate) {
            updatedUser.lastStreakDate = updateData.lastStreakDate;
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
            "update email config": {
                "rel": "update",
                "href": `http://localhost:${port}/api/v1/users/${userID}/email-settings`,
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
router.patch('/api/v1/users/:id/', async function (req, res, next) {
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
            "update email config": {
                "rel": "update",
                "href": `http://localhost:${port}/api/v1/users/${userID}/email-settings`,
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

router.patch('/api/v1/users/:id/email-settings', async function (req, res, next) {
    const userId = req.params.id;
    const notifications = req.body.notifications
    const reminderInterval = req.body.reminderInterval

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message: 'User cannot be found'})
        }

        user.emailSettings.notifications = notifications || user.emailSettings.notifications
        user.emailSettings.reminderInterval = reminderInterval || user.emailSettings.reminderInterval

        await user.save()

        res.status(200).json({
            user: user,
            message: 'Email configurations successfully updated'
        })
    } catch (error) {
        return next(error)
    }

})

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
