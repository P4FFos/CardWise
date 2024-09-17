var express = require('express');
var router = express.Router();
var app = express();

app.use(express.json());

var Achievement = require('../models/streak_achievement.js');

// Create a new achievement
router.post('/api/achievements', async function(req, res, next) {
    var achievement = new Achievement(req.body);
    try {
        await achievement.save();
        if (achievement == null) {
            res.status(404).json({"message": "Cannot create a null achievement."})
        }
    } catch (error) {
        return next(error);
    }
    res.status(201).json(achievement);    
});

// Info of all achievements
router.get('/api/achievements', async function(req, res, next) {
    var achievements;
    try {
        achievements = await Achievement.find();
    } catch (error) {
        return next(error);
    }
    res.json({"achievements": achievements});
});

// Restarting progress through deleting achievements 
router.delete('/api/achievements', async function(req, res, next) {
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
router.get('/api/achievements/:id', async function(req, res, next) {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (achievement == null) {
            return res.status(404).json({"message": "Achievement with given id cannot be found."});
        }
        res.json(achievement);
    } catch (error) {
        return next(error);
    }
})

// Put info into spec achievement
router.put('/api/achievements/:id', async function(req, res, next) {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (achievement == null) {
            return res.status(404).json({"message": "Achievement not found"});
        }
        achievement.name = req.body.name;
        achievement.type = req.body.type;

        await achievement.save();
        res.json(achievement);
    } catch (err) { 
        return next(err); 
    }
});


module.exports = router;