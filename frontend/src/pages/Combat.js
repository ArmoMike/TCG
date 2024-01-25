import { useParams, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import React from "react";
import Player from "../components/Player";
import CardBoard from "../components/CardBoard";
import Monster from "../components/Monster";
import HandleTurn from "../components/HandleTurn"; // Importez le nouveau composant
import "../CSS/Combat.css";
import "../CSS/Positions.css";
import "../CSS/Card.css";
import { connect, useSelector } from "react-redux";

//redux imports

const Combat = () => {
  const { user } = useAuthContext();
  const { mapLevel } = useParams();
  const player = useSelector((state) => state.player.playerInfo);

  // Empêche l'utilisateur d'accéder par l'url à un niveau de carte > à son levelReached
  const userLevelReached = user ? player.levelReached : 1;
  const parsedMapLevel = parseInt(mapLevel, 10);
  if (!user || parsedMapLevel > player.levelReached) {
    // Redirect to the appropriate map level or login page
    return (
      <Navigate to={user ? `/combat/${userLevelReached}` : "/cantcheat"} />
    );
  }

  return (
    <div
      className="combat-container"
      style={{
        backgroundImage: `url(https://tcg-backend.onrender.com/api/levels/${mapLevel}/backgroundImage)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        zIndex: 1,
      }}
    >
      {/* Composant CardBoard */}
      <div className="cardboard-container">
        <div className="cardboard">
          <CardBoard />
        </div>
      </div>

      {/* Composants Player and Monster */}
      <div className="container-player-monster">
        <Player />
        <Monster />
      </div>
      <HandleTurn />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    player: state.player,
    enflammerActivated: state.player.enflammerActivated,
    combustionActivated: state.player.combustionActivated,
  };
};
export default connect(mapStateToProps)(Combat);
