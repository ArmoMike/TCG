import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  switchTurn,
  MonsterAttack,
  initializeCurrentMana,
  resetArmor,
  moveCardsToDefausse,
  fetch5CardsFromPioche,
  checkAndFetchCards,
  activateFaiblesseForPlayer,
  activateVulnerabiliteForPlayer,
  handleFaiblesseVulnerabiliteForPlayer,
} from "../redux/actions/player.action";
import { toggleAttackAnimation } from "../redux/actions/monster.action";
import "../CSS/Positions.css"; // Remove after fixing

import enemyAttackArmor from "../assets/buff.gif";
import AttackInfo from "./AttackInfo";

import enemyAttack1 from "../assets/enemy1-attack.gif";
import enemyAttack2 from "../assets/enemy2-attack.gif";
import enemyAttack3 from "../assets/enemy3-attack.gif";
import enemyAttack4 from "../assets/enemy4-attack.gif";
import enemyAttack5 from "../assets/enemy5-attack.gif";
import enemyAttack6 from "../assets/enemy6-attack.gif";
import enemyAttack7 from "../assets/enemy7-attack.gif";
import enemyAttack8 from "../assets/enemy8-attack.gif";
import enemyAttack9 from "../assets/enemy9-attack.gif";
import enemyAttack10 from "../assets/enemy10-attack.gif";

import {
  DegatsSubis,
  updateMonsterArmor,
  resetMonsterArmor,
  handleFaiblesseVulnerabiliteForMonster,
} from "../redux/actions/monster.action";

const HandleTurn = () => {
  // redux
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const currentTurn = useSelector((state) => state.player.currentTurn);
  const monsterInfo = useSelector((state) => state.monster.monsterInfo);
  //animations
  const [showMonsterImage, setShowMonsterImage] = useState(false);
  const [isArmorAttackAnimation, setIsArmorAttackAnimation] = useState(false);
  const [attackDetails, setAttackDetails] = useState(null);

  const attackAnimations = [
    enemyAttack1,
    enemyAttack2,
    enemyAttack3,
    enemyAttack4,
    enemyAttack5,
    enemyAttack6,
    enemyAttack7,
    enemyAttack8,
    enemyAttack9,
    enemyAttack10,
  ];
  const mapLevel = monsterInfo ? monsterInfo.mapLevel : null;

  const monsterAttackAnimation = attackAnimations[mapLevel - 1]; // Adjust for array indexing
  const monsterAttackAnimationClassName = `enemy-attack${mapLevel}`;

  // méthode de gestion du tour du joueur
  const handlePlayerTurn = () => {
    // le joueur pioche 5 cartes
    dispatch(fetch5CardsFromPioche());
    // le joueur récupère son mana pool.
    dispatch(initializeCurrentMana(player.playerInfo.manaPool));
    // le joueur perd son armure
    dispatch(resetArmor());
    // vérifier s'il y a encore assez de cartes dans la pioche, sinon transvaser les cartes de la défausse dans la pioche
    dispatch(checkAndFetchCards());
    // fetch de nouvelles cartes depuis la pioche
    // le reste des cartes de la main du joueur sont défaussées
    // ajustement des stats de faiblesse et vulnérabilité du monstre
    dispatch(handleFaiblesseVulnerabiliteForMonster());
    // ajustement des stats de faiblesse et vulnérabilité du joueur
    dispatch(handleFaiblesseVulnerabiliteForPlayer());
    // Si combustionActivated est true (carte Combustion jouée), le joueur subit 1 dégât et le monstre subit 5 dégâts
    if (player.combustionActivated) {
      const combustionDamageToPlayer = player.combustionPlayedCount * 1;
      const combustionDamageToMonster = player.combustionPlayedCount * 5;
      dispatch(MonsterAttack(combustionDamageToPlayer));
      dispatch(DegatsSubis(combustionDamageToMonster));
    }
  };

  // méthode de gestion du tour du monstre
  const handleEnemyTurn = () => {
    dispatch(switchTurn("player"));
    dispatch(moveCardsToDefausse(player.main));
    dispatch(resetMonsterArmor());
    const numberOfAttacks = monsterInfo.attacks.length;
    const randomAttackIndex = Math.floor(Math.random() * numberOfAttacks);

    const selectedAttack = monsterInfo.attacks[randomAttackIndex];
    const isArmorAttack = selectedAttack.hasOwnProperty("armor"); // Check if it's an armor attack

    let monsterAttackValue;

    setTimeout(() => {
      setShowMonsterImage(true);

      if (isArmorAttack) {
        // If it's an armor attack, get the armor value
        monsterAttackValue = selectedAttack.armor;
        // active l'animation de l'armure
        setIsArmorAttackAnimation(true);
        // met à jour le state de l'armure du monstre
        dispatch(updateMonsterArmor(monsterAttackValue));
        // active les stats de faiblesse et vulnérabilité du joueur
        dispatch(activateFaiblesseForPlayer());
        dispatch(activateVulnerabiliteForPlayer());
        console.log(
          `Monster increases its defense by ${selectedAttack.armor}!`
        );
      } else {
        dispatch(toggleAttackAnimation(true));
        monsterAttackValue = selectedAttack.damage;
        setAttackDetails({
          type: isArmorAttack ? "monsterArmor" : "monsterDamage",
          value: monsterAttackValue,
        });
        dispatch(MonsterAttack(selectedAttack.damage));
        //console.log(`Monster attacks with ${selectedAttack.damage} damage!`);
      }
      setTimeout(() => {
        setShowMonsterImage(false);
        setIsArmorAttackAnimation(false); // désactive l'animation d'armure
        dispatch(toggleAttackAnimation(false));

        setTimeout(() => {
          // This block will be executed after the animation and other logic is completed
          setAttackDetails(null); // Réinitialiser les détails de l'attaque
          dispatch(switchTurn("monster"));
          handlePlayerTurn();
        }, 0); // Using 0ms timeout to schedule the code at the end of the current event loop
      }, 2000); // Attack animation time
    }, 650); // Time before attack (after clicking "fin tour")
  };

  return (
    <div>
      {currentTurn === "player" && (
        <button className="fintourbtn" onClick={handleEnemyTurn}>
          Fin Tour
        </button>
      )}
      {/* Permet d'afficher le type et le nombre de dégâts */}
      {attackDetails && (
        <AttackInfo
          type={attackDetails.type}
          attacker="monster"
          value={attackDetails.value}
        />
      )}
      {showMonsterImage && (
        <div>
          <img
            className={
              isArmorAttackAnimation
                ? "armor-attack"
                : monsterAttackAnimationClassName
            }
            style={
              isArmorAttackAnimation
                ? {
                    position: "fixed",
                    top: 120,
                    right: 230,
                    height: "150px",
                    width: "150px",
                  }
                : {}
            }
            src={
              isArmorAttackAnimation ? enemyAttackArmor : monsterAttackAnimation
            }
            alt="Monster Attack"
          />
        </div>
      )}
    </div>
  );
};

export default HandleTurn;
