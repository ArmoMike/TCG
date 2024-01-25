const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const cardFormRoutes = require("./routes/cardFormRoute");
const levelRoute = require("./routes/levelRoute");
const monsterRoute = require("./routes/monsterRoute");
const playerRoute = require("./routes/playerRoute");
const levelController = require("./controllers/levelController");
const monsterController = require("./controllers/monsterController");
const path = require("path");

//express app
const app = express();

// middleware
app.use(express.static(path.join(__dirname, "frontend", "src", "assets")));
app.use(express.json());
require("dotenv").config({ path: "./config.env" });
app.use(cors());
// ejs
app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/user", userRoutes);
app.use("/api/card-form", cardFormRoutes);
app.use("/api/levels", levelRoute);
app.use("/api/monsters", monsterRoute);
app.use("/api/player", playerRoute);

app.get(
  "/api/levels/:mapLevel/backgroundImage",
  levelController.getLevelBackgroundImage
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });

app.on("error", (err) => {
  console.error("Express server error:", err);
});
