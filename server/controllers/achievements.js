var express = require('express');
var router = express.Router();
var app = express();

app.use(express.json());

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
        if (achievement == null) {
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
                "href": `http://localhost:${port}/api/v1/achievements/${req.params.id}`
            },
            "update achievement information": {
                "rel": "update",
                "href":`http://localhost:${port}/api/v1/achievements/${req.params.id}`,
                "method": "PUT"
            },
            "delete": {
                "rel": "delete",
                "href":`http://localhost:${port}/api/v1/achievements/${req.params.id}`,
                "method": "DELETE"
            }, 
            "post": {
                "rel": "post",
                "href": `http://localhost:${port}/api/v1/achievements`,
                "method": "POST"
            }
        }});    
});

// Info of all achievements
router.get('/api/v1/achievements', async function(req, res, next) {
    var achievements;
    try {
        achievements = await Achievement.find();
    } catch (error) {
        return next(error);
    }
    res.json({"achievements": achievements});
});

// Restarting progress through deleting achievements 
router.delete('/api/v1/achievements', async function(req, res, next) {
    try {
        const result = await Achievement.deleteMany({});
        res.status(200).json({
            message: result.deletedCount + " " + "Achievement(s) deleted. Progress reastarted.",
            result: result
        });
    } catch (error) {
        return next(error);
    }
});

// Get info from a spec achievement
router.get('/api/v1/achievements/:id', async function(req, res, next) {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (achievement == null) {
            return res.status(404).json({"message": "Achievement with given id cannot be found."});
        }
        res.json({
            "achievement": achievement,
            "_links": {
                "update achievement information": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/achievements/${req.params.id}`,
                    "method": "PUT"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/achievements/${req.params.id}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/achievements`,
                    "method": "POST"
                }
            }});
    } catch (error) {
        return next(error);
    }
})

// Put info into spec achievement
router.put('/api/v1/achievements/:id', async function(req, res, next) {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (achievement == null) {
            return res.status(404).json({"message": "Achievement not found"});
        }
        achievement.name = req.body.name;
        if (achievement.type == 'TestAchievement') {
            achievement.condition = req.body.condition;
        }
        if (achievement.type == 'StreakAchievement') {
            achievement.streakCounter = req.body.streakCounter;
        }

        await achievement.save();
        res.json({
            "achievement": achievement,
            "_links": {
                "self": {
                    "rel": "self",
                    "href": `http://localhost:${port}/api/v1/achievements/${req.params.id}`
                },
                "update achievement information": {
                    "rel": "update",
                    "href":`http://localhost:${port}/api/v1/achievements/${req.params.id}`,
                    "method": "PUT"
                },
                "delete": {
                    "rel": "delete",
                    "href":`http://localhost:${port}/api/v1/achievements/${req.params.id}`,
                    "method": "DELETE"
                }, 
                "post": {
                    "rel": "post",
                    "href": `http://localhost:${port}/api/v1/achievements`,
                    "method": "POST"
                }
            }});
    } catch (err) { 
        return next(err); 
    }
});

module.exports = router;