const express = require("express");
const router = express.Router();
const Level = require("../models/levelModel"); // Import your Mongoose model
const { getLevelBackgroundImage } = require("../controllers/levelController"); // Import your level controller methods

// Add a route to fetch the background image based on the mapLevel
router.get("/:mapLevel/backgroundImage", getLevelBackgroundImage);

module.exports = router;
