const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth"); // Import your JWT middleware

const {
  signupUser,
  loginUser,
  getLevelReached,
} = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// level Reached route
router.get("/levelReached", requireAuth, getLevelReached);

module.exports = router;
