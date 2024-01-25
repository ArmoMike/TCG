const express = require("express");
const router = express.Router();
const { getMonstersByMapLevel } = require("../controllers/monsterController");
const { getMonsterInfo } = require("../controllers/monsterController");

// route pour récupérer les informations du monstre par son nom
router.get("/info/:mapLevel", getMonsterInfo);
// Define a route to fetch monsters based on the selected mapLevel
router.get("/:mapLevel", getMonstersByMapLevel);

module.exports = router;
