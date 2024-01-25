// react & router dom
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { fetchMonster } from "../redux/actions/monster.action";
import { handleVictory, resetVictory } from "../redux/actions/game.action";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import StatsBar from "./StatsBar";
import Modal from "./Modal";
import { fetchRewardCards } from "../redux/actions/card.action";
import faiblesseIcon from "../assets/icons/faiblesse-icon.jpg";
import vulnerabiliteIcon from "../assets/icons/vulnerabilite-icon.png";

const Monster = ({ monster, dispatch }) => {
  // useParams permet de récupérer les paramètres de l'URL

  const { mapLevel } = useParams();
  const { user } = useAuthContext();
  // Utilisez useSelector pour extraire isOpen et cards du Redux store
  const modalIsOpen = useSelector((state) => state.card.modalIsOpen);
  const modalCards = useSelector((state) => state.card.rewardCards);
  const isVictory = useSelector((state) => state.game.isVictory);
  const armor = useSelector((state) => state.monster.armor);
  const attackAnimationVisible = useSelector(
    (state) => state.monster.attackAnimationVisible
  );

  useEffect(() => {
    // Appelez l'action pour fetch les données du monstre et les mettre dans Redux
    dispatch(fetchMonster(mapLevel))
      .then((result) => {
        //  console.log("Fetch monster result:", result);
      })
      .catch((error) => {
        console.error("Fetch monster failed:", error);
      });
  }, [mapLevel, dispatch]);

  // console.log("Monster state:", monster.monsterInfo);

  useEffect(() => {
    if (monster.monsterInfo && monster.currentHealth <= 0 && !isVictory) {
      console.log("Entering handleVictory effect");
      const userEmail = user.email;
      dispatch(fetchRewardCards(mapLevel));
      dispatch(handleVictory(userEmail, mapLevel));
      dispatch(resetVictory());
    }
  }, [
    dispatch,
    user.email,
    monster.monsterInfo,
    monster.currentHealth,
    isVictory,
    mapLevel,
  ]);

  const levelClassName = `level${mapLevel}`;
  const enemyLevelClassName = `enemy-level${mapLevel}`;

  return (
    <div>
      {monster.monsterInfo ? (
        <div>
          <div className="hp-bar-container-enemy">
            <StatsBar
              HPValue={monster.monsterInfo.health}
              currentHealth={monster.currentHealth}
              armor={armor}
            />
            {monster.monsterFaiblesseActivated ||
            monster.monsterVulnerabiliteActivated ? (
              <div style={{ display: "flex" }}>
                {monster.monsterFaiblesseActivated ? (
                  <div style={{ marginRight: "10px", marginTop: "30px" }}>
                    <img
                      src={faiblesseIcon}
                      alt="faiblesse-icon"
                      style={{ width: "30px", height: "30px" }}
                    />
                    {monster.monsterFaiblesseCount > 0 ? (
                      <div style={{ color: "green" }}>
                        {monster.monsterFaiblesseCount}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {monster.monsterVulnerabiliteActivated ? (
                  <div>
                    <img
                      src={vulnerabiliteIcon}
                      alt="vulnerabilite-icon"
                      style={{ width: "30px", height: "30px" }}
                    />
                    {monster.monsterVulnerabiliteCount > 0 ? (
                      <div style={{ color: "green" }}>
                        {monster.monsterVulnerabiliteCount}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            {!attackAnimationVisible && (
              <img
                src={`/assets/${monster.monsterInfo.image}`}
                alt={monster.monsterInfo.name}
                className={`enemy ${levelClassName} ${enemyLevelClassName}`}
              />
            )}
          </div>
          {isVictory && <Modal isOpen={modalIsOpen} cards={modalCards} />}
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

const mapStateToProps = ({ monster, card }) => ({
  monster,
  modalIsOpen: card.modalIsOpen,
  modalCards: card.rewardCards,
});

export default connect(mapStateToProps)(Monster);
