import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { connect } from "react-redux";

// Actions redux
import { handleDefeat, resetVictory } from "../redux/actions/game.action";
import {
  fetchPlayer,
  fetch5CardsFromPioche,
  initializeCurrentMana,
  initializeCurrentTurn,
  initializePlayerPioche,
  initializeCurrentPlayerHP,
  updateArmor,
  initializeCombustionCount,
} from "../redux/actions/player.action";
//composant StatsBar
import StatsBar from "./StatsBar";
// import d'icones et CSS
import flameIcon from "../assets/icons/flame-icon.png";
import combustionIcon from "../assets/icons/combustion-icon.png";
import buffIcon from "../assets/buff.gif";
import faiblesseIcon from "../assets/icons/faiblesse-icon.png";
import vulnerabiliteIcon from "../assets/icons/vulnerabilite-icon.png";
import image from "../assets/mainIdle.gif";
import attackImage from "../assets/mainAttack.gif";
import "../CSS/Positions.css";

// Composant Player
const Player = ({
  player,
  dispatch,
  enflammerActivated,
  combustionActivated,
  isCardAnimationActive,
  isBuffAnimationActive,
}) => {
  // importer le contexte d'authentification
  const { user } = useAuthContext();
  const { mapLevel } = useParams();
  const navigate = useNavigate();
  // gère l'affichage des animations de buff et d'attaque

  useEffect(() => {
    if (user) {
      const userEmail = user.email;
      // chargement des infos du joueur (début du combat)
      dispatch(fetchPlayer(userEmail))
        .then((result) => {
          dispatch(initializeCurrentMana(result.manaPool));
          dispatch(initializeCurrentTurn(result.currentTurn));
          dispatch(initializePlayerPioche(result.DeckOfCards));
          dispatch(initializeCurrentPlayerHP(result.HP));
          // si le joueur avait de l'armure au combat précédent, on ajoute le même nombre mais en négatif pour avoir 0.
          dispatch(updateArmor(-player.armor));
          dispatch(initializeCombustionCount());
          dispatch(fetch5CardsFromPioche());
        })
        .catch((error) => {
          console.error("Fetch player failed:", error);
        });
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (player.playerInfo && player.currentPlayerHealth <= 0) {
      dispatch(handleDefeat());
      dispatch(resetVictory());
      window.alert("Game Over...");
      navigate("/");
      window.location.href = "/";
    }
  }, [player.playerInfo, player.currentPlayerHealth, dispatch, navigate]);

  const playerLevelClassName = `player-level${mapLevel} ${
    isBuffAnimationActive
      ? "buff-animation idle-animation"
      : isCardAnimationActive
      ? "attack-animation"
      : "idle-animation"
  }`;

  return (
    <div>
      {player.playerInfo ? (
        <div>
          <img
            src={
              isCardAnimationActive && !isBuffAnimationActive
                ? attackImage
                : image
            }
            alt="copie"
            className={`player ${playerLevelClassName}`}
          />

          <div className="hp-bar-container-player">
            <StatsBar
              HPValue={player.playerInfo.HP}
              currentHealth={player.currentPlayerHealth}
              currentMana={player.currentMana}
              manaPool={player.playerInfo.manaPool}
              armor={player.armor}
              isPlayer={true}
            />
            <div className="power-icons">
              {enflammerActivated ? (
                <img
                  src={flameIcon}
                  alt="flame-icon"
                  style={{ width: "30px", height: "30px", marginTop: "60px" }}
                />
              ) : null}

              {combustionActivated ? (
                <img
                  src={combustionIcon}
                  alt="combustion-icon"
                  style={{ width: "30px", height: "30px", marginTop: "60px" }}
                />
              ) : null}

              {isBuffAnimationActive ? (
                <img
                  className="buff"
                  style={{
                    position: "fixed",
                    top: 120,
                    left: 230,
                    height: "150px",
                    width: "150px",
                  }}
                  src={buffIcon}
                  alt="buff-icon"
                />
              ) : null}
            </div>
            {player.playerFaiblesseActivated ||
            player.playerVulnerabiliteActivated ? (
              <div style={{ display: "flex" }}>
                {player.playerFaiblesseActivated ? (
                  <div style={{ marginRight: "10px", marginTop: "30px" }}>
                    <img
                      src={faiblesseIcon}
                      alt="faiblesse-icon"
                      style={{ width: "30px", height: "30px" }}
                    />
                    {player.playerFaiblesseCount > 0 ? (
                      <div style={{ color: "green" }}>
                        {player.playerFaiblesseCount}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {player.playerVulnerabiliteActivated ? (
                  <div style={{ marginRight: "10px", marginTop: "30px" }}>
                    <img
                      src={vulnerabiliteIcon}
                      alt="vulnerabilite-icon"
                      style={{ width: "30px", height: "30px" }}
                    />
                    {player.playerVulnerabiliteCount > 0 ? (
                      <div style={{ color: "green" }}>
                        {player.playerVulnerabiliteCount}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
      {/* <div className="card-stacks">
        pioche: {player.pioche.length}
        <br />
        main: {player.main.length}
        <br />
        defausse: {player.defausse.length}
      </div> */}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    player: state.player,
    enflammerActivated: state.player.enflammerActivated,
    combustionActivated: state.player.combustionActivated,
    isCardAnimationActive: state.player.cardAnimationActive,
    isBuffAnimationActive: state.player.buffAnimationActive,
  };
};
export default connect(mapStateToProps)(Player);
