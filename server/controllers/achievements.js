var express = require('express');
var router = express.Router();
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json());

var User = require('../models/user.js');
const globalAchievements = require('../config/achievements_data.js');

// Add an achievement to user's profile
router.post('/api/v1/users/:userID/achievements/:achievementID', async function(req, res, next) {
    const userID = req.params.userID;
    const achievementID = req.params.achievementID;

    const achievement = globalAchievements.find(a => a.id === achievementID);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found.' });
    }

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ "message": "User not found." });
        }

        user.achievements.push({ achievement: achievementID, completed: false });
        await user.save();

        res.status(201).json({
            "achievement": achievement,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/achievements/${achievement._id}`
                },
                "update achievement information": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/achievements/${achievement._id}`,
                    "method": "PUT"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/users/${userID}/achievements/${achievement._id}`,
                    "method": "DELETE"
                },
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/users/${userID}/achievements`,
                    "method": "POST"
                }
            }
        });
    } catch (error) {
        return next(error);
    }
});

// Update user's achievement progress (e.g., mark as completed)
router.put('/api/v1/users/:userID/achievements/:achievementID', async function(req, res, next) {
    const userID = req.params.userID;
    const achievementID = req.params.achievementID;
    console.log('achievementID: ', achievementID);

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ "message": "User not found." });
        }

        const userAchievement = user.achievements.find(a => a.achievement === achievementID);

        if (!userAchievement) {
            return res.status(404).json({ "message": "User-specific achievement not found." });
        }

        if (req.body.completed !== undefined) {
            userAchievement.completed = req.body.completed;
        }
        await user.save();
        return res.status(200).json({ message: "Achievement updated successfully." });

    } catch (error) {
        return next(error);
    }
});

// Get all user-specific achievements
router.get('/api/v1/users/:userID/achievements', async function(req, res, next) {
    const userID = req.params.userID;  // Get userID from route params

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ "message": "User not found." });
        }

        const userAchievements = globalAchievements.map((achievement) => {
            const userProgress = user.achievements.find(a => a.achievement === achievement.id);
            return {
                ...achievement,
                completed: userProgress ? userProgress.completed : false
            };
        });

        res.status(200).json({ "achievements": userAchievements });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
