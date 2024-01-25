// on utilise User pour faire des requêtes dans la collection User, à la base de données.
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getLevelReached = async (req, res) => {
  try {
    // Extract user ID from the JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    // Fetch user data by ID
    const user = await User.findById(userId).populate("player");

    if (!user || !user.player) {
      return res.status(404).json({ message: "User or player data not found" });
    }

    const levelReached = user.player.levelReached;
    res.json({ levelReached });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginUser, signupUser, getLevelReached };
