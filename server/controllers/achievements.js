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
router.post('/api/v1/users/:userID/achievements', async function(req, res, next) {
    try {
        var userID = req.params.userID;
        var { type, ...data } = req.body;
        var user = await User.findById(userID);
        var achievement;
        if (type === 'TestAchievement') {
            achievement = new TestAchievement(data);
            user.achievements.testAchievements.push(achievement._id);
        }
        if (type === 'StreakAchievement') {
            achievement = new StreakAchievement(data);
            user.achievements.streakAchievements.push(achievement._id);
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
router.get('/api/v1/users/:userID/achievements', async function(req, res, next) {
    var userID = req.params.userID;
    var achievements;
    try {
        achievements = await User.findById(userID).populate("achievements").exec();
        if (!achievements) {
            return res.status(404).json({ "message": "Achievements do not exist." });
        }
    } catch (error) {
        return next(error);
    }
    res.status(200).json({"achievements": achievements});
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

// Get info from a spec achievement
router.get('/api/v1/users/:userID/achievements/:id', async function(req, res, next) {
    var userID = req.params.userID;
    var achievementID = req.params.id;
    console.log('Achievement ID:', achievementID);

    try {
        var user = await User.findById(userID)
            .populate("achievements.testAchievements")
            .populate("achievements.streakAchievements")
            .exec();

        var achievement = user.achievements.testAchievements.find(function(achievement) {
            return achievement._id.toString() === achievementID;
        }) || user.achievements.streakAchievements.find(function(achievement) {
            return achievement._id.toString() === achievementID;
        });

        console.log(achievement);

        if (!achievement) {
            return res.status(404).json({"message": "Achievement with given id cannot be found."});
        }

        res.json({
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

// Put info into spec achievement
router.put('/api/v1/users/:userID/achievements/:id', async function(req, res, next) {
    var userID = req.params.userID;
    var achievementID = req.params.id;
    console.log('Achievement ID:', achievementID);

    try {
        var user = await User.findById(userID)
            .populate("achievements.testAchievements")
            .populate("achievements.streakAchievements")
            .exec();

        var achievement = user.achievements.testAchievements.find(a => a._id.toString() === achievementID) ||
        user.achievements.streakAchievements.find(a => a._id.toString() === achievementID);
        if (!achievement) {
            return res.status(404).json({"message": "Achievement with given id cannot be found."});
        }
        achievement.name = req.body.name;

        if (achievement instanceof TestAchievement) {
            achievement.condition = req.body.condition;
        } else if (achievement instanceof StreakAchievement) {
            achievement.streakCounter = req.body.streakCounter;
        }

        await achievement.save();
        res.json({
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
    } catch (err) { 
        return next(err); 
    }
});

module.exports = router;