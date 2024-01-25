const Level = require("../models/levelModel");
const path = require("path");

// Function to fetch level background image
const getLevelBackgroundImage = async (req, res) => {
  const mapLevel = req.params.mapLevel;

  try {
    const level = await Level.findOne({ mapLevel });

    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    const backgroundImagePath = level.backgroundImage;

    // Read the image file and send it as a response
    const fs = require("fs");
    const pathToImage = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "src",
      "assets",
      backgroundImagePath
    );

    fs.readFile(pathToImage, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.setHeader("Content-Type", "image/png"); // Adjust the content type based on your image type
      res.end(data);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getLevelBackgroundImage,
};
