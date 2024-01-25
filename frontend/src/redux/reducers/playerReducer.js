import {
  FETCH_PLAYER_INFO_FAILURE,
  FETCH_PLAYER_INFO_SUCCESS,
  MANA_COST,
  MONSTER_ATTACK,
  INITIALIZE_CURRENT_MANA,
  INITIALIZE_CURRENT_TURN,
  INITIALIZE_PLAYER_PIOCHE,
  ACTIVATE_ENFLAMMER,
  DEACTIVATE_ENFLAMMER,
  ACTIVATE_COMBUSTION,
  DEACTIVATE_COMBUSTION,
  INCREASE_COMBUSTION_COUNT,
  INITIALIZE_COMBUSTION_COUNT,
  ACTIVATE_VULNERABILITE_FOR_PLAYER,
  DEACTIVATE_VULNERABILITE_FOR_PLAYER,
  ACTIVATE_FAIBLESSE_FOR_PLAYER,
  DEACTIVATE_FAIBLESSE_FOR_PLAYER,
  HANDLE_FAIBLESSE_VULNERABILITE_PLAYER,
  END_PLAYER_TURN,
  END_MONSTER_TURN,
  INITIALIZE_CURRENT_PLAYER_HP,
  ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_PIOCHE,
  ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_MAIN,
  REMOVE_CARD_FROM_MAIN,
  MOVE_CARDS_TO_DEFAUSSE,
  SET_CARD_ANIMATION_ACTIVE,
  SET_BUFF_ANIMATION_ACTIVE,
  UPDATE_ARMOR,
  RESET_ARMOR,
  ADD_COLERE_COPY,
  ADD_CARTE_HEBETEMENT,
  FETCH_5CARDS_FROM_PIOCHE,
  CHECK_AND_FETCH_CARDS,
  PIOCHER_UNE_CARTE,
} from "../actions/player.action";
import { v4 as uuidv4 } from "uuid";
const initialState = {
  // stats
  playerInfo: null,
  currentMana: 0,
  currentPlayerHealth: 100,
  armor: 0,
  currentTurn: "player",
  // pouvoirs
  enflammerActivated: false,
  combustionActivated: false,
  combustionPlayedCount: 0, // Nombre de fois que la carte "Combustion" a été jouée
  // temp states
  playerFaiblesseActivated: false,
  playerVulnerabiliteActivated: false,
  playerFaiblesseCount: 0,
  playerVulnerabiliteCount: 0,
  // cartes
  pioche: [],
  main: [],
  defausse: [],
  //animation
  cardAnimationActive: false,
  buffAnimationActive: false,
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Initialisation du tour et gestion de fins de tour
    case INITIALIZE_CURRENT_TURN:
      return {
        ...state,
        currentTurn: "player",
      };
    case END_PLAYER_TURN:
      return {
        ...state,
        currentTurn: "monster",
      };
    case END_MONSTER_TURN:
      return { ...state, currentTurn: "player" };

    // carte Combustion
    case ACTIVATE_COMBUSTION:
      return {
        ...state,
        combustionActivated: true,
      };
    case DEACTIVATE_COMBUSTION:
      return {
        ...state,
        combustionActivated: false,
      };
    case INCREASE_COMBUSTION_COUNT:
      console.log("combustionPlayedCount:", state.combustionPlayedCount);
      return {
        ...state,
        combustionPlayedCount: state.combustionPlayedCount + 1,
      };
    // carte Enflammer
    case ACTIVATE_ENFLAMMER:
      return {
        ...state,
        enflammerActivated: true,
      };
    case DEACTIVATE_ENFLAMMER:
      return {
        ...state,
        enflammerActivated: false,
      };
    // Etats Vulnerabilite et Faiblesse
    case ACTIVATE_VULNERABILITE_FOR_PLAYER:
      return {
        ...state,
        playerVulnerabiliteActivated: true,
        playerVulnerabiliteCount: state.playerVulnerabiliteCount + 1,
      };
    case DEACTIVATE_VULNERABILITE_FOR_PLAYER:
      return {
        ...state,
        playerVulnerabiliteActivated: false,
      };
    case ACTIVATE_FAIBLESSE_FOR_PLAYER:
      return {
        ...state,
        playerFaiblesseActivated: true,
        playerFaiblesseCount: state.playerFaiblesseCount + 1,
      };
    case DEACTIVATE_FAIBLESSE_FOR_PLAYER:
      return {
        ...state,
        playerFaiblesseActivated: false,
      };
    case HANDLE_FAIBLESSE_VULNERABILITE_PLAYER:
      if (state.playerFaiblesseActivated) {
        return {
          ...state,
          playerFaiblesseCount:
            state.playerFaiblesseCount > 0 ? state.playerFaiblesseCount - 1 : 0,
          playerFaiblesseActivated: state.playerFaiblesseCount > 1, // Set to false when count reaches 0
        };
      } else if (state.playerVulnerabiliteActivated) {
        return {
          ...state,
          playerVulnerabiliteCount:
            state.playerVulnerabiliteCount > 0
              ? state.playerVulnerabiliteCount - 1
              : 0,
          playerVulnerabiliteActivated: state.playerVulnerabiliteCount > 1, // Set to false when count reaches 0
        };
      }
      return state;
    // carte Colère
    case ADD_COLERE_COPY:
      const clickedCardId = action.payload.id;
      //  console.log("Reducer - ADD_COLERE_COPY - clickedCardId:", clickedCardId);

      const existingColereCard = state.main.find(
        (card) => card.card.name === "Colère" && card.id === clickedCardId
      );

      if (existingColereCard) {
        const newColereCopy = {
          ...existingColereCard,
          id: uuidv4(), // Utilisez uuid pour générer un nouvel id unique
          quantity: 1,
        };

        // console.log(
        //   `Adding a copy of Colère with new id ${newColereCopy.id} to Defausse.`
        // );

        return {
          ...state,
          defausse: [...state.defausse, newColereCopy],
        };
      }

      // Si la carte "Colère" n'est pas trouvée:
      // console.log("Colère not found in Pioche. No update needed.");

      // Renvoie simplement l'état actuel car aucune modification n'est nécessaire
      return state;

    // carte Hébétement
    case ADD_CARTE_HEBETEMENT:
      return {
        ...state,
        pioche: [...state.pioche, action.payload],
      };
    // fetch des infos du joueur
    case FETCH_PLAYER_INFO_SUCCESS:
      return {
        ...state,
        playerInfo: action.payload,
      };
    case FETCH_PLAYER_INFO_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    // Coûts en mana et initialisation de la manaPool
    case INITIALIZE_CURRENT_MANA:
      return {
        ...state,
        currentMana: action.payload.manaPool,
      };
    case INITIALIZE_PLAYER_PIOCHE:
      return {
        ...state,
        pioche: action.payload.pioche,
        defausse: [],
        main: [],
      };
    case INITIALIZE_CURRENT_PLAYER_HP:
      return {
        ...state,
        currentPlayerHealth: action.payload.HP,
      };
    case INITIALIZE_COMBUSTION_COUNT:
      return {
        ...state,
        combustionPlayedCount: 0,
      };
    case MANA_COST:
      return {
        ...state,
        currentMana: state.currentMana - action.payload.mana,
      };
    // attaque du monstre et calcul des dégâts en tenant compte de l'armure
    case MONSTER_ATTACK:
      // Vérifier s'il y a de l'armure
      if (state.armor > 0) {
        // S'il y a de l'armure, réduire d'abord l'armure
        const remainingArmor = state.armor - action.payload.damageValue;

        // Si l'armure ne suffit pas à absorber toute l'attaque
        if (remainingArmor < 0) {
          const remainingHealth = state.currentPlayerHealth + remainingArmor;
          return {
            ...state,
            armor: 0,
            // ternaire qui permet de ne pas avoir de points de vie négatifs
            currentPlayerHealth: remainingHealth < 0 ? 0 : remainingHealth,
          };
        } else {
          // Si l'armure suffit à absorber l'attaque, mettre à jour l'armure
          return {
            ...state,
            armor: remainingArmor,
          };
        }
      } else {
        // S'il n'y a pas d'armure, réduire directement les points de vie
        const remainingHealth =
          state.currentPlayerHealth - action.payload.damageValue;
        return {
          ...state,
          currentPlayerHealth: remainingHealth < 0 ? 0 : remainingHealth,
          currentArmor: 0,
        };
      }
    // gestion de l'armure
    case RESET_ARMOR:
      return {
        ...state,
        armor: 0,
      };
    case UPDATE_ARMOR:
      return {
        ...state,
        armor: state.armor + action.payload.armorValue,
      };

    // gestion des cartes
    // Ajout d'une carte à la défausse et suppression de la carte de la pioche
    case ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_PIOCHE:
      const updatedPioche = state.pioche.map((piocheItem) => {
        if (piocheItem.id === action.payload.id) {
          //   console.log("Updating piocheItem:", piocheItem);
          return { ...piocheItem, quantity: piocheItem.quantity - 1 };
        }
        return piocheItem;
      });
      return {
        ...state,
        defausse: [
          ...state.defausse,
          { card: action.payload.card, id: action.payload.id, quantity: 1 },
        ],
        pioche: updatedPioche.filter((piocheItem) => piocheItem.quantity !== 0),
      };
    // Ajout d'une carte à la défausse et suppression de la carte de la pioche
    case ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_MAIN:
      const updatedMain = state.main.map((mainItem) => {
        if (mainItem.id === action.payload.id) {
          return { ...mainItem, quantity: mainItem.quantity - 1 };
        }
        return mainItem;
      });
      return {
        ...state,
        defausse: [
          ...state.defausse,
          { card: action.payload.card, id: action.payload.id, quantity: 1 },
        ],
        main: updatedMain.filter((mainItem) => mainItem.quantity !== 0),
      };
    // Enlève une carte de la main
    case REMOVE_CARD_FROM_MAIN:
      return {
        ...state,
        main: state.main.filter((mainItem) => mainItem.id !== action.payload),
      };
    // fin du tour, les cartes de la main vont dans la défausse
    case MOVE_CARDS_TO_DEFAUSSE:
      return {
        ...state,
        defausse: [...state.defausse, ...state.main],
        main: [],
      };
    // vérifier s'il y a assez de cartes dans la pioche, sinon ramener la défausse dans la pioche
    case CHECK_AND_FETCH_CARDS:
      if (state.pioche.length < 5) {
        // Si la pioche n'a pas assez de cartes, déplacez toutes les cartes de la défausse vers la pioche
        const updatedPioche = [...state.pioche, ...state.defausse];
        const updatedDefausse = [];

        return {
          ...state,
          pioche: updatedPioche,
          defausse: updatedDefausse,
        };
      }
      // Sinon, la pioche a suffisamment de cartes, ne faites rien de spécial
      return state;
    // Ajout de 5 cartes au hasard à la main depuis la pioche
    case FETCH_5CARDS_FROM_PIOCHE:
      const { pioche } = state;
      const numberOfCardsToDraw = 5;

      // Vérifiez si la pioche a suffisamment de cartes pour piocher
      if (pioche.length >= numberOfCardsToDraw) {
        const piocheCopy = [...pioche]; // Créez une copie de la pioche
        const drawnCards = [];

        // Algorithme Fisher-Yates pour piocher les cartes au hasard
        for (
          let i = piocheCopy.length - 1;
          i >= 0 && drawnCards.length < numberOfCardsToDraw;
          i--
        ) {
          const randomIndex = Math.floor(Math.random() * (i + 1));
          [piocheCopy[i], piocheCopy[randomIndex]] = [
            piocheCopy[randomIndex],
            piocheCopy[i],
          ]; // Échange les éléments pour le mélange
          drawnCards.push(piocheCopy.pop()); // Pioche la carte au hasard et l'ajoute aux cartes piochées
        }

        // Mettez à jour la pioche dans le state avec la copie sans les cartes piochées
        const updatedPioche = pioche.filter(
          (card) => !drawnCards.includes(card)
        );

        // Mettez à jour l'état en ajoutant les cartes piochées à la main et en modifiant la pioche
        return {
          ...state,
          main: [...state.main, ...drawnCards],
          pioche: updatedPioche,
        };
      }

      // Si la pioche n'a pas suffisamment de cartes, renvoyez simplement l'état actuel
      return state;

    case PIOCHER_UNE_CARTE:
      // Vérifiez si la pioche n'est pas vide
      if (state && state.pioche && state.pioche.length > 0) {
        // Créez une copie de la pioche
        const piocheCopy = [...state.pioche];

        // Piochez la carte du dessus (premier élément) et créez une copie de la carte
        const cartePiochee = { ...piocheCopy[0] };

        // Supprimez la carte piochée du dessus de la pile dans la copie
        piocheCopy.shift();

        // Mettez à jour le state avec la nouvelle pioche (copie) et ajoutez la carte à la main
        return {
          ...state,
          pioche: piocheCopy,
          main: [...state.main, cartePiochee],
        };
      }

      // Si la pioche est vide, retournez simplement l'état actuel
      return state;

    case SET_CARD_ANIMATION_ACTIVE:
      return {
        ...state,
        cardAnimationActive: action.payload,
      };

    case SET_BUFF_ANIMATION_ACTIVE:
      return {
        ...state,
        buffAnimationActive: action.payload,
      };
    default:
      return state;
  }
};

export default playerReducer;
