const Monster = require("../models/monsterModel");

// Function to get monsters by mapLevel
const getMonstersByMapLevel = async (req, res) => {
  const mapLevel = req.params.mapLevel;
  try {
    // Query the "Monster" collection based on the selected map level
    const monsters = await Monster.findOne({ mapLevel });
    // Return the monsters as JSON
    res.json(monsters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMonsters = async (req, res) => {
  try {
    const monsters = await Monster.find(); // Retrieve all documents from the 'Monster' collection
    const response = {
      monsters,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const getMonsterInfo = async (req, res) => {
  const { monsterName } = req.params; // Récupérez le nom du monstre depuis les paramètres de l'URL

  try {
    // Utilisez Mongoose pour rechercher le monstre par son nom dans la collection "monsters"
    const monster = await Monster.findOne({ name: monsterName });

    if (monster) {
      // Si le monstre existe, renvoyez ses informations
      res.json(monster);
    } else {
      // Si le monstre n'existe pas, renvoyez une réponse d'erreur
      res.status(404).json({ error: "Monstre introuvable" });
    }
  } catch (error) {
    // Gérez les erreurs d'accès à la base de données
    console.error(
      "Erreur lors de la récupération des informations du monstre:",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
module.exports = {
  getMonstersByMapLevel,
  getAllMonsters,
  getMonsterInfo,
};
