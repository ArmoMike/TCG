const User = require("../models/userModel");
const Player = require("../models/playerModel"); // Import Player model
const Card = require("../models/cardModel"); // Import Card model

// Récupère les infos du Player
const getPlayerData = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;

    console.log(`Fetching player data for user with email: ${userEmail}`);

    const user = await User.findOne({ email: userEmail }).populate({
      path: "player",
      populate: {
        path: "DeckOfCards.card",
        model: "Card",
      },
    });

    if (!user || !user.player) {
      return res.status(404).json({ message: "Player not found for the user" });
    }
    console.log("DeckOfCards before conversion:", user.player.DeckOfCards);

    const playerData = user.player.toObject();
    res.json(playerData);
  } catch (error) {
    console.error("Error fetching player data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller method for updating the levelReached field
const updateLevelReached = async (req, res) => {
  const { userEmail, newLevelReached } = req.body;

  console.log("Received request to update level for user:", userEmail);

  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { emailUser: userEmail },
      { $set: { levelReached: newLevelReached } },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({
      message: "LevelReached updated successfully",
      player: updatedPlayer,
    });
  } catch (error) {
    console.error("Error updating levelReached:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addToDeck = async (req, res) => {
  try {
    const { userEmail, selectedCard } = req.body;

    console.log(`Adding card to deck for user with email: ${userEmail}`);
    // Récupérer l'utilisateur avec son deck
    const user = await User.findOne({ email: userEmail }).populate({
      path: "player",
      populate: {
        path: "DeckOfCards.card",
        model: "Card",
      },
    });

    console.log("Selected Card dans playercontroller:", selectedCard);

    // Vérifier si la carte sélectionnée existe
    const cardToAdd = await Card.findById(selectedCard._id);

    console.log("User:", user);
    console.log("Card to Add:", cardToAdd);

    if (!user || !user.player) {
      console.log("User not found or player not present:", user);

      return res.status(404).json({ message: "Player not found for the user" });
    }

    if (!cardToAdd) {
      console.log("Card not found:", selectedCard._id);
      return res.status(404).json({ message: "Card not found" });
    }

    // Ajouter la carte au deck s'il n'est pas déjà présent
    if (
      !user.player.DeckOfCards.some((deckCard) =>
        deckCard.card.equals(cardToAdd._id)
      )
    ) {
      user.player.DeckOfCards.push({ card: cardToAdd._id, quantity: 1 });
    } else {
      // Mettre à jour la quantité si la carte est déjà présente
      const existingCard = user.player.DeckOfCards.find((deckCard) =>
        deckCard.card.equals(cardToAdd._id)
      );
      existingCard.quantity += 1;
    }

    // Sauvegarder les modifications
    await user.player.save();

    // Répondre avec les données mises à jour du joueur
    res.json(user.player.toObject());
  } catch (error) {
    console.error("Error adding card to deck:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateLevelReached,
  getPlayerData,
  addToDeck,
};
