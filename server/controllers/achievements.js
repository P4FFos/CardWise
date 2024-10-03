var express = require('express');
var router = express.Router();
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json());

var User = require('../models/user.js');
var Achievement = require('../models/achievement.js');
var TestAchievement = require('../models/test_achievement.js');
var StreakAchievement = require('../models/streak_achievement.js');

// Create a new achievement
router.post('/api/v1/achievements', async function(req, res, next) {
    try {
        var { type, ...data } = req.body;
        var achievement;
        if (type === 'TestAchievement') {
            achievement = new TestAchievement(data);
        }
        if (type === 'StreakAchievement') {
            achievement = new StreakAchievement(data);
        }
        await achievement.save();
        await user.save();
        if (!achievement) {
            res.status(404).json({"message": "Cannot create a null achievement."})
        }
    } catch (error) {
        return next(error);
    }
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
        }});    
});


// Info of all achievements
router.get('/api/v1/achievements', async function(req, res, next) {
    try {
        const achievements = await Achievement.find().exec();

        if (!achievements || achievements.length === 0) {
            return res.status(404).json({ "message": "No achievements found." });
        }

        res.status(200).json({ "achievements": achievements });
    } catch (error) {
        return next(error);
    }
});

// Restarting progress through deleting achievements 
router.delete('/api/v1/users/:userID/achievements', async function(req, res, next) {
    var userID = req.params.userID;
    try {
        var user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ "message": "User with the provided ID does not exist." });
        }
        
        var testAchievementIDs = user.achievements.testAchievements.map(achievement => achievement._id);
        var streakAchievementIDs = user.achievements.streakAchievements.map(achievement => achievement._id);
        
        var deletedTestAchievements = await TestAchievement.deleteMany({ _id: { $in: testAchievementIDs}});
        var deletedStreakAchievements = await StreakAchievement.deleteMany({ _id: { $in: streakAchievementIDs}});
        
        user.achievements.testAchievements = [];
        user.achievements.streakAchievements = [];
        await user.save();

        res.status(200).json({
            message:  "All achievements have been deleted. Progress reastarted.",
            userResult: user,
            testAchievementResults: deletedTestAchievements,
            streakAchievementResults: deletedStreakAchievements,
        });
    } catch (error) {
        return next(error);
    }
});

// Delete one achievement
router.delete('/api/v1/achievements/:id', async function(req, res, next) {
    var achievementID = req.params.id;
    try {
        const achievement = await Achievement.findByIdAndDelete(achievementID);
        if (!achievement) {
            res.status(404).json({"message": "Achievement with given id not found."});
        }

        res.status(200).json({
            message: "Achievement successfully deleted.",
            achievement: achievement
        });
    } catch (error) {
        return next(error);
    }
});

// Get info from a spec achievement
router.get('/api/v1/achievements/:achievementID', async function(req, res, next) {
    var achievementID = req.params.id;
    console.log('Achievement ID:', achievementID);

    try {
        const achievement = await Achievement.findById(achievementID);

        console.log(achievement);

        if (!achievement) {
            return res.status(404).json({"message": "Achievement with given id cannot be found."});
        }

        await achievement.save();
        res.status(200).json({
            "achievement": achievement,
            "_links": {
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
            }});
    } catch (error) {
        return next(error);
    }
})

module.exports = router;