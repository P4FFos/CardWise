var express = require('express');
var router = express.Router();
var Admin = require('../models/admin.js');

// create specific admin
router.post('/api/v1/admins', async function (req, res, next) {
    try {
        // Check if the admin already exists
        var existingAdmin = await Admin.findOne({ username: req.body.username });
        if (existingAdmin) {
            return res.status(409).json({ "message": "Admin already exists" });
        }

        var admin = new Admin(req.body);
        if (!admin) {
            return res.status(404).json({"message": "Cannot create a null admin"})
        }
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        return next(error);
    }
});

// get all admins
router.get('/api/v1/admins', async function (req, res, next) {
    var admins;
    try {
        admins = await Admin.find();
        if (!admins) {
            return res.status(404).json({ "message": "Admins do not exist" });
        }
    } catch (error) {
        return next(error);
    }
    res.json(admins);
});

// Show a specific admin
router.get('/api/v1/admins/:adminID', async function(req, res, next) {
    var adminID = req.params.adminID;
    if (!adminID) {
        return res.status(400).json({"message": "Admin ID is required"});
    }
    try {
        var admin = await Admin.findById(adminID);
        if (!admin) {
            return res.status(404).json({"message": "Admin with given id cannot be found"});
        }
        res.status(200).json(admin);
    } catch (error) {
        return next(error);
    }
});

// delete admin
router.delete('/api/v1/admins/:adminId', async function (req, res, next) {
    var adminId = req.params.adminId;

    try {
        var deletedAdmin = await Admin.findById(adminId);
        if (!deletedAdmin) {
            return res.status(404).json({message: 'Admin not found'});
        }
        await Admin.deleteOne({ _id: adminId });
    } catch (error) {
        return next(error);
    }

    res.json({message: 'Admin account deleted successfully'});
});
module.exports = router;
