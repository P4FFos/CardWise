var express = require('express');
var router = express.Router();
var app = express();
var port = process.env.PORT || 3000;

app.use(express.json());

var User = require('../models/user.js');
var Achievement = require('../models/achievement.js');
var TestAchievement = require('../models/test_achievement.js');
var StreakAchievement = require('../models/streak_achievement.js');

// global achievements
const globalAchievements = [
    { id: 's1', name: 'High five!', description: 'Log in for 5 consecutive days' },
    { id: 's2', name: 'Crystal Anniversary', description: 'Log in for 15 consecutive days' },
    { id: 's3', name: 'Bromin sounds cool…', description: 'Log in for 35 consecutive days' },
    { id: 's4', name: 'United Streak of America', description: 'Log in for 50 consecutive days' },
    { id: 's5', name: 'Wow! You are consistent', description: 'Log in for 75 consecutive days' },
    { id: 's6', name: 'Century', description: 'Log in for 100 consecutive days' },

    { id: 't1', name: 'The Creator', description: 'By the way great movie! Create 10 decks in total.' },
    { id: 't2', name: 'The answer to life the universe and everything', description: 'At least one deck should have 42 cards.' },
    { id: 't3', name: 'Book Worm', description: 'Practice some deck for more than 5 times.' },
    { id: 't4', name: 'Now I am become death the destroyer of worlds', description: 'Delete all of your decks.' },
    { id: 't5', name: 'Mad scientist', description: 'Edit at least one card.' }
];

// // Create a new achievement
// router.post('/api/v1/achievements', async function(req, res, next) {
//     try {
//         var { type, ...data } = req.body;
//         var achievement;
//         if (type === 'TestAchievement') {
//             achievement = new TestAchievement(data);
//         }
//         if (type === 'StreakAchievement') {
//             achievement = new StreakAchievement(data);
//         }
//         await achievement.save();
//         if (!achievement) {
//             res.status(404).json({"message": "Cannot create a null achievement."})
//         }
//     } catch (error) {
//         return next(error);
//     }
//     res.status(201).json({
//         "achievement": achievement,
//         "_links": {
//             "self": {
//                 "rel": "self",
//                 "href": `http://localhost:${port}/api/v1/achievements/${achievement._id}`
//             },
//             "update achievement information": {
//                 "rel": "update",
//                 "href":`http://localhost:${port}/api/v1/achievements/${achievement._id}`,
//                 "method": "PUT"
//             },
//             "delete": {
//                 "rel": "delete",
//                 "href":`http://localhost:${port}/api/v1/achievements/${achievement._id}`,
//                 "method": "DELETE"
//             },
//             "post": {
//                 "rel": "post",
//                 "href": `http://localhost:${port}/api/v1/achievements`,
//                 "method": "POST"
//             }
//         }});
// });


// // Info of all achievements
// router.get('/api/v1/achievements', async function(req, res, next) {
//     try {
//         const achievements = await Achievement.find().exec();

//         if (!achievements || achievements.length === 0) {
//             return res.status(404).json({ "message": "No achievements found." });
//         }

//         res.status(200).json({ "achievements": achievements });
//     } catch (error) {
//         return next(error);
//     }
// });

// // Delete one achievement
// router.delete('/api/v1/achievements/:id', async function(req, res, next) {
//     var achievementID = req.params.id;
//     try {
//         const achievement = await Achievement.findByIdAndDelete(achievementID);
//         if (!achievement) {
//             res.status(404).json({"message": "Achievement with given id not found."});
//         }

//         res.status(200).json({
//             message: "Achievement successfully deleted.",
//             achievement: achievement
//         });
//     } catch (error) {
//         return next(error);
//     }
// });

// // Get info from a spec achievement
// router.get('/api/v1/achievements/:achievementID', async function(req, res, next) {
//     var achievementID = req.params.achievementID;
//     console.log('Achievement ID:', achievementID);

//     try {
//         const achievement = await Achievement.findById(achievementID);

//         console.log(achievement);

//         if (!achievement) {
//             return res.status(404).json({"message": "Achievement with given id cannot be found."});
//         }

//         await achievement.save();
//         res.status(200).json({
//             "achievement": achievement,
//             "_links": {
//                 "update achievement information": {
//                     "rel": "update",
//                     "href":`http://localhost:${port}/api/v1/achievements/${achievement._id}`,
//                     "method": "PUT"
//                 },
//                 "delete": {
//                     "rel": "delete",
//                     "href":`http://localhost:${port}/api/v1/achievements/${achievement._id}`,
//                     "method": "DELETE"
//                 },
//                 "post": {
//                     "rel": "post",
//                     "href": `http://localhost:${port}/api/v1/achievements`,
//                     "method": "POST"
//                 }
//             }});
//     } catch (error) {
//         return next(error);
//     }
// })

// // Add an achievement to user's profile
// router.post('/api/v1/users/:userID/achievements/:achievementID', async function(req, res, next) {
//     const userID = req.params.userID;
//     const achievementID = req.params.achievementID;

//     try {
//         const user = await User.findById(userID);
//         if (!user) {
//             return res.status(404).json({ "message": "User not found." });
//         }

//         const achievement = await Achievement.findById(achievementID).exec();
//         if (!achievement) {
//             return res.status(404).json({ "message": "Achievement not found." });
//         }

//         user.achievements.push({ achievement: achievement, completed: false });
//         await user.save();

//         res.status(201).json({
//             "achievement": achievement,
//             "_links": {
//                 "self": {
//                     "rel": "self",
//                     "href": `http://localhost:${port}/api/v1/users/${userID}/achievements/${achievement._id}`
//                 },
//                 "update achievement information": {
//                     "rel": "update",
//                     "href":`http://localhost:${port}/api/v1/users/${userID}/achievements/${achievement._id}`,
//                     "method": "PUT"
//                 },
//                 "delete": {
//                     "rel": "delete",
//                     "href":`http://localhost:${port}/api/v1/users/${userID}/achievements/${achievement._id}`,
//                     "method": "DELETE"
//                 },
//                 "post": {
//                     "rel": "post",
//                     "href": `http://localhost:${port}/api/v1/users/${userID}/achievements`,
//                     "method": "POST"
//                 }
//             }
//         });
//     } catch (error) {
//         return next(error);
//     }
// });

// Update user's achievement progress (e.g., mark as completed)
router.put('/api/v1/users/:userID/achievements/:achievementID', async function(req, res, next) {
    const userID = req.params.userID;
    const achievementID = req.params.achievementID;

    console.log('User ID:', userID);

    try {
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ "message": "User not found." });
        }

        const userAchievement = user.achievements.find(a => a._id.toString() === achievementID);
        if (!userAchievement) {
            return res.status(404).json({ "message": "User-specific achievement not found." });
        }

        if (req.body.completed !== undefined) {
            userAchievement.completed = req.body.completed;
        }

        await user.save();
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

// Delete one user-specific achievement
router.delete('/api/v1/users/:userID/achievements/:achievementID', async function(req, res, next) {
    const userID = req.params.userID;
    var achievementID = req.params.achievementID;
    try {
        var user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ "message": "User with the provided ID does not exist." });
        }
        const achievement = await Achievement.findByIdAndDelete(achievementID);
        if (!achievement) {
            res.status(404).json({"message": "Achievement with given id not found."});
        }
        user.achievements = user.achievements.filter(a => a.achievement.toString() !== achievementID);

        await user.save();
        res.status(200).json({
            message: "Achievement successfully deleted.",
            achievement: achievement
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
