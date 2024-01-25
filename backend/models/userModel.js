const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const Player = require("./playerModel");
const Card = require("./cardModel");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
  },
});

// custom static function to signup a user
// je ne peux pas utiliser "this" dans une fonction fléchée
userSchema.statics.signup = async function (email, password) {
  // validation. Put first cause if it fails, we don't need to execute the rest of the code
  if (!email || !password) {
    throw Error("Tous les champs doivent être remplis  ");
  }
  // .isEmail() is a validator method from validator package
  if (!validator.isEmail(email)) {
    throw Error("L'adresse e-mail n'est pas valide");
  }
  // .isStrongPassword() is a validator method from validator package
  if (!validator.isStrongPassword(password)) {
    throw Error("Le mot de passe n'est pas assez fort");
  }
  // check if user exists. "this" refers to the model
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("L'utilisateur existe déjà");
  }
  // hash the password. using "await" because bcrypt is async. Takes time to generate salt and hash
  // async function returns a promise. await waits for the promise to resolve
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  // création du joueur
  try {
    // Create a player for the user with emailUser set to the user's email
    const player = await Player.create({
      emailUser: user.email,
      DeckOfCards: await initializePlayerDeck(),
    });

    // Associate the player with the user
    user.player = player._id;
    // Save the user with the reference to the player
    await user.save();

    return user;
  } catch (error) {
    // Handle the error during player creation
    console.error("Error creating player:", error);
    // Rollback user creation if player creation fails
    await user.remove();
    throw error;
  }
};
const initializePlayerDeck = async () => {
  try {
    const card1 = await Card.findOne({ name: "Frappe" });
    const card2 = await Card.findOne({ name: "Défense" });
    const card3 = await Card.findOne({ name: "Heurt" });
    console.log("card1:", card1);
    console.log("card2:", card2);
    console.log("card3:", card3);
    // Retourne un tableau avec les identifiants des cartes
    return [
      { card: card1.toObject(), quantity: 5 },
      { card: card2.toObject(), quantity: 4 },
      { card: card3.toObject(), quantity: 1 },
    ];
  } catch (error) {
    console.error("Error initializing player deck:", error);
    throw error;
  }
};
// static login method
userSchema.statics.login = async function (email, password) {
  // check if fields are filled. We don't even wanna try to login if we don't have email/password
  if (!email || !password) {
    throw Error("Tous les champs doivent être remplis");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("L'utilisateur n'existe pas. Adresse e-mail incorrecte");
  }
  // compare passwords
  // password = plain text one
  // user.password = hashed one
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Mot de passe incorrect");
  }

  await user.populate("player");

  console.log("User logged in successfully" + user.player);

  return user;
};

module.exports = mongoose.model("User", userSchema);
