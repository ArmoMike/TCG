import React, { useEffect, useState } from "react";
// redux imports
import { useDispatch } from "react-redux"; // Import useDispatch from react-redux
import {
  addCardToDefausseAndRemoveFromMain,
  ManaCost,
  activateEnflammer,
  deactivateEnflammer,
  activateCombustion,
  deactivateCombustion,
  increaseCombustionCount,
  setCardAnimationActive,
  setBuffAnimationActive,
  updateArmor,
  addColereCopy,
  addCardHebetement,
  removeCardFromMain,
  fetchCardFromPioche,
} from "../redux/actions/player.action";
import { connect } from "react-redux";
import {
  DegatsSubis,
  activateVulnerabiliteForMonster,
  activateFaiblesseForMonster,
} from "../redux/actions/monster.action";
import AttackInfo from "./AttackInfo";
const Card = ({
  player,
  monster,
  enflammerActivated,
  playerFaiblesseActivated,
  monsterVulnerabiliteActivated,
}) => {
  const dispatch = useDispatch(); // Initialize the useDispatch hook
  const [playerAttackDetails, setPlayerAttackDetails] = useState(null);
  const [showAttackDetails, setShowAttackDetails] = useState(false);
  const [isCardClickDisabled, setIsCardClickDisabled] = useState(false);

  // Au clic sur la carte :

  const handleCardClick = (clickedCard) => {
    if (isCardClickDisabled) {
      return;
    }
    // Disable card clicking for 1 second after using a card
    setIsCardClickDisabled(true);
    setTimeout(() => {
      setIsCardClickDisabled(false);
    }, 2000);
    // Check if the monster's health is zero or less
    if (monster.currentHealth <= 0) {
      // If the monster is defeated, do nothing when the card is clicked
      return;
    }

    // Vérifie si le joueur a assez de mana pour jouer la carte
    if (player.currentMana >= clickedCard.card.cost) {
      // Check if the clicked card is "Défense" or "Même pas mal"
      const isBuffCard = ["Défense", "Même pas mal"].includes(
        clickedCard.card.name
      );

      if (!isBuffCard) {
        // If it's not a buff card, set card animation active
        dispatch(setCardAnimationActive(true));
        // Set a timeout to reset cardAnimationActive to false after 1000 milliseconds (1 second)
        setTimeout(() => {
          dispatch(setCardAnimationActive(false));
        }, 1500);
      }

      switch (clickedCard.card.name) {
        case "Frappe":
          // inflige les dégâts
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          break;

        case "Conflit": // 0 - Jouable si vous n'avez que des Attaque en main. Infligez 14 dégâts
          //vérifie si toutes les cartes sont de type Attaque, condition pour jouer la carte Conflit
          const allAttackCards = player.main.every(
            (card) => card.card.type === "Attack"
          );
          if (allAttackCards) {
            // console.log("Toutes les cartes sont des cartes d'attaque");
            // inflige les dégâts (monster action/reducer)
            dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
            // Autres actions spécifiques à la carte "Conflit" si nécessaire
          }
          if (!allAttackCards) {
            // If the condition for playing "Conflit" is not met, do not remove the card from the hand
            window.alert(
              "Impossible de jouer la carte Conflit. Toutes les cartes ne sont pas de type Attaque "
            );
            //console.log(
            //"Impossible de jouer la carte Conflit. Toutes les cartes ne sont pas de type Attaque "
            // );
            return;
          }
          break;
        case "Frappe double":
          // inflige les dégâts
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          break;

        case "Coup de tonnerre": // Infligez 4 dégâts et appliquez 1 de Vulnérabilité à tous les ennemis
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          dispatch(activateVulnerabiliteForMonster());
          break;

        case "Enflammer": // 1 - Gagnez 2 de force.
          dispatch(activateEnflammer());
          break;

        case "Combustion": // 1 - Perdez 1HP et infligez 5 de dégâts à tous les ennemis à la fin de votre tour.
          // met à jour le compteur de Combustion
          dispatch(increaseCombustionCount());
          // active l'effet Combustion
          dispatch(activateCombustion());
          break;
        case "Colère":
          // inflige les dégâts
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          // add colere copy to pioche
          dispatch(addColereCopy(clickedCard.id));
          break;
        case "Défense": // 1 - Gagnez 5 de blocage.
          dispatch(updateArmor(clickedCard.card.value));
          dispatch(setBuffAnimationActive(true));
          // Set a timeout to reset cardAnimationActive to false after 1000 milliseconds (1 second)
          setTimeout(() => {
            dispatch(setBuffAnimationActive(false));
          }, 850);
          // détails de l'attaque à afficher
          setPlayerAttackDetails({
            type: "playerArmor",
            value: clickedCard.card.value,
          });
          // test de rajout pour affichage armure
          setShowAttackDetails(true);
          setTimeout(() => {
            setShowAttackDetails(false);
          }, 3000);
          break;
        case "Même pas mal": // 1 - 8 d'armure + piocher une carte
          dispatch(updateArmor(clickedCard.card.value));
          dispatch(setBuffAnimationActive(true));
          // Set a timeout to reset cardAnimationActive to false after 1000 milliseconds (1 second)
          setTimeout(() => {
            dispatch(setBuffAnimationActive(false));
          }, 850);
          // méthode pour piocher une carte
          dispatch(fetchCardFromPioche());
          // détails de l'attaque à afficher
          setPlayerAttackDetails({
            type: "playerArmor",
            value: clickedCard.card.value,
          });
          setShowAttackDetails(true);
          setTimeout(() => {
            setShowAttackDetails(false);
          }, 3000);
          break;
        case "Charge imprudente": // 1 - Infligez 7 dégâts. Ajoutez un Hébétement à votre pioche
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          dispatch(addCardHebetement("Hébétement"));
          break;
        case "Hébétement":
          // carte sans effet. Occupe une place dans la main. cliquez pour la faire disparaître
          //dispatch(removeCardFromMain(clickedCard.id));
          window.alert(
            "Cette carte n'a pas d'effet. Elle vous empêche potentiellement de jouer d'autres cartes..."
          );
          setPlayerAttackDetails(null);
          return;
        case "Heurt":
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          dispatch(activateVulnerabiliteForMonster());
          dispatch(activateVulnerabiliteForMonster());
          break;
        case "Uppercut":
          dispatch(DegatsSubis(calculateExtraDMG(clickedCard.card.value)));
          dispatch(activateVulnerabiliteForMonster());
          dispatch(activateFaiblesseForMonster());
          break;
        default:
          // Gérer le cas par défaut si le nom de la carte n'est pas reconnu
          console.log("Carte non codée encore : ", clickedCard.card.name);
          break;
      }

      // Déduit le mana une fois que la vérification est faite, sinon
      dispatch(ManaCost(clickedCard.card.cost));
      // Ajoute la carte à la défausse et la retire de la main
      dispatch(
        addCardToDefausseAndRemoveFromMain(clickedCard.card, clickedCard.id)
      );
      // Affiche temporairement les détails de l'attaque du joueur
      setShowAttackDetails(true);
      setTimeout(() => {
        setShowAttackDetails(false);
      }, 2000); // 2000 milliseconds (2 seconds), ajustez le délai selon vos besoins
    } else {
      // Sinon, on obtient une alerte
      alert("Pas assez de mana pour jouer cette carte");
    }
  };

  useEffect(() => {
    // Désactive l'effet Enflammer à la fin du combat
    dispatch(deactivateEnflammer());
    dispatch(deactivateCombustion());
  }, [dispatch]);

  // Fonction pour calculer les dégâts du PLAYER avec les effets spéciaux (faiblesse, vulnérabilité, cartes pouvoir)
  const calculateExtraDMG = (baseDamage, actionType) => {
    let modifiedDamage = baseDamage;
    // Si l'effet Enflammer est activé, ajoute +2 aux dégâts
    if (enflammerActivated) {
      modifiedDamage += 2;
    }
    // Si l'effet Faiblesse est activé (sur le joueur), réduit les dégâts de 30% (arrondi à l'entier supérieur)
    if (playerFaiblesseActivated) {
      const weaknessReduction = Math.ceil(baseDamage * 0.3);
      modifiedDamage -= weaknessReduction;
    }
    // Si l'effet Vulnérabilité est activé (sur le monstre), ajoute 30% aux dégâts
    if (monsterVulnerabiliteActivated) {
      const vulnerabilityBonus = Math.ceil(baseDamage * 0.3);
      modifiedDamage += vulnerabilityBonus;
    }
    // Set player attack details
    setPlayerAttackDetails({
      type: actionType || "playerDamage",
      value: modifiedDamage,
    });
    return modifiedDamage;
  };

  return (
    <div>
      {showAttackDetails && playerAttackDetails && (
        <div className="AttackInfo-container">
          <div className="AttackInfo">
            <AttackInfo
              type={playerAttackDetails.type}
              value={playerAttackDetails.value}
              attacker="player"
            />
          </div>
        </div>
      )}

      <div>
        {player.main.map((mainItem, index) => (
          <div className="card-align" key={index}>
            <div
              className={`card-container card-${mainItem.card.type.toLowerCase()} ${
                isCardClickDisabled ? "disabled-card" : ""
              }`}
              onClick={() => handleCardClick(mainItem)}
            >
              <img
                src={mainItem.card.imageURL}
                alt={mainItem.card.name}
                className="card-image"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    player: state.player,
    monster: state.monster,
    enflammerActivated: state.player.enflammerActivated,
    combustionActivated: state.player.combustionActivated,
    // player faiblesse et vulnérabilité
    playerVulnerabiliteActivated: state.player.playerVulnerabiliteActivated,
    playerFaiblesseActivated: state.player.playerFaiblesseActivated,
    // monster faiblesse et vulnérabilité
    monsterVulnerabiliteActivated: state.monster.monsterVulnerabiliteActivated,
    monsterFaiblesseActivated: state.monster.monsterFaiblesseActivated,
  };
};
export default connect(mapStateToProps)(Card);
