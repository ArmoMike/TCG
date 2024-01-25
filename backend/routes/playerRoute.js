const express = require("express");
const router = express.Router();
const {
  updateLevelReached,
  getPlayerData,
  addToDeck,
} = require("../controllers/playerController");

// Assuming you have a parameter named userId in your route
router.get("/profile/:userEmail", getPlayerData);
router.post("/update-level", updateLevelReached);
router.post("/add-to-deck", addToDeck);

module.exports = router;
