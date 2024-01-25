const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const levelSchema = new Schema({
  mapLevel: {
    type: Number, // Data type for mapLevel (you can change this to match your data)
    required: true, // Map level is required for each level
  },
  backgroundImage: {
    type: String, // Data type for backgroundImage (assuming it's a URL or file path)
    required: true, // Background image is required for each level
  },
  // Other fields specific to your levels can be added here
});

// Create a model using the schema
module.exports = mongoose.model("Level", levelSchema, "levels");
