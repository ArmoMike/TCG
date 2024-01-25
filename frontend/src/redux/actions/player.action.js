// import unique id generator
import { v4 as uuidv4 } from "uuid";

// fetches
export const FETCH_PLAYER_INFO_SUCCESS = "FETCH_PLAYER_INFO_SUCCESS";
export const FETCH_PLAYER_INFO_FAILURE = "FETCH_PLAYER_INFO_FAILURE";
// mana, défense et dégats infligés par le monstre
export const MANA_COST = "MANA_COST";
export const MONSTER_ATTACK = "MONSTER_ATTACK";
export const UPDATE_ARMOR = "UPDATE_ARMOR";
export const RESET_ARMOR = "RESET_ARMOR";
export const CHECK_AND_FETCH_CARDS = "CHECK_AND_FETCH_CARDS";
// initialisation
export const INITIALIZE_CURRENT_MANA = "INITIALIZE_CURRENT_MANA";
export const INITIALIZE_CURRENT_PLAYER_HP = "INITIALIZE_CURRENT_PLAYER_HP";
export const INITIALIZE_CURRENT_TURN = "INIZIALIZE_CURRENT_TURN";
export const INITIALIZE_PLAYER_PIOCHE = "INITIALIZE_PLAYER_PIOCHE";
export const INITIALIZE_COMBUSTION_COUNT = "INITIALIZE_COMBUSTION_COUNT";
// carte Enflammer et Combustion
export const ACTIVATE_ENFLAMMER = "ACTIVATE_ENFLAMMER";
export const DEACTIVATE_ENFLAMMER = "DEACTIVATE_ENFLAMMER";
export const ACTIVATE_COMBUSTION = "ACTIVATE_COMBUSTION";
export const DEACTIVATE_COMBUSTION = "DEACTIVATE_COMBUSTION";
export const INCREASE_COMBUSTION_COUNT = "INCREASE_COMBUSTION_COUNT";
// Etats Vulnerabilite et Faiblesse
export const ACTIVATE_VULNERABILITE_FOR_PLAYER =
  "ACTIVATE_VULNERABILITE_FOR_PLAYER";
export const DEACTIVATE_VULNERABILITE_FOR_PLAYER =
  "DEACTIVATE_VULNERABILITE_FOR_PLAYER";
export const ACTIVATE_FAIBLESSE_FOR_PLAYER = "ACTIVATE_FAIBLESSE_FOR_PLAYER";
export const DEACTIVATE_FAIBLESSE_FOR_PLAYER =
  "DEACTIVATE_FAIBLESSE_FOR_PLAYER";
export const HANDLE_FAIBLESSE_VULNERABILITE_PLAYER =
  "HANDLE_FAIBLESSE_VULNERABILITE_PLAYER";
// carte Colère
export const ADD_COLERE_COPY = "ADD_COLERE_COPY";
//carte Hébétement
export const ADD_CARTE_HEBETEMENT = "ADD_CARTE_HEBETEMENT";
export const FETCH_CARTE_HEBETEMENT_SUCCESS = "FETCH_CARTE_HEBETEMENT_SUCCESS";
// fin de tour
export const END_PLAYER_TURN = "END_PLAYER_TURN";
export const END_MONSTER_TURN = "END_MONSTER_TURN";
// carte dans la défausse
export const ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_PIOCHE =
  "ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_PIOCHE";
// carte dans la défausse
export const ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_MAIN =
  "ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_MAIN";
// enlever une carte dans la main
export const REMOVE_CARD_FROM_MAIN = "REMOVE_CARD_FROM_MAIN";
// cartes de la main vont dans la défausse
export const MOVE_CARDS_TO_DEFAUSSE = "MOVE_CARDS_TO_DEFAUSSE";
// carte de la pioche vers la main
export const FETCH_5CARDS_FROM_PIOCHE = "FETCH_5CARDS_FROM_PIOCHE";
// carte de la pioche vers la main (1 seule)
export const PIOCHER_UNE_CARTE = "PIOCHER_UNE_CARTE";
// animation
export const SET_CARD_ANIMATION_ACTIVE = "SET_CARD_ANIMATION_ACTIVE";
export const SET_BUFF_ANIMATION_ACTIVE = "SET_BUFF_ANIMATION_ACTIVE";

export const switchTurn = (currentTurn) => (dispatch) => {
  if (currentTurn === "player") {
    dispatch(endPlayerTurn());
  } else if (currentTurn === "monster") {
    dispatch(endMonsterTurn());
  }
};

// gestion des tours
export const endPlayerTurn = () => ({
  type: END_PLAYER_TURN,
});
export const endMonsterTurn = () => ({
  type: END_MONSTER_TURN,
});

// fetch des infos du joueur
export const fetchPlayerInfoSuccess = (playerInfo) => ({
  type: FETCH_PLAYER_INFO_SUCCESS,
  payload: playerInfo,
});
export const fetchPlayerInfoFailure = (error) => ({
  type: FETCH_PLAYER_INFO_FAILURE,
  payload: error,
});

export const fetchPlayer = (userEmail) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://tcg-backend.onrender.com/api/player/profile/${userEmail}`
    );
    if (!response.ok) {
      throw new Error("La requête a échoué (fetchPlayer, Redux)");
    }
    const playerInfo = await response.json();

    // Mettez à jour pour inclure le traitement des cartes du deck
    dispatch(fetchPlayerInfoSuccess(playerInfo));
    return playerInfo;
  } catch (error) {
    dispatch(fetchPlayerInfoFailure(error.message));
    throw error;
  }
};

// cartes Pouvoir
export const activateCombustion = () => ({
  type: ACTIVATE_COMBUSTION,
});
export const deactivateCombustion = () => ({
  type: DEACTIVATE_COMBUSTION,
});
export const activateEnflammer = () => ({
  type: ACTIVATE_ENFLAMMER,
});
export const deactivateEnflammer = () => ({
  type: DEACTIVATE_ENFLAMMER,
});
export const increaseCombustionCount = (combustionPlayedCount) => {
  return {
    type: INCREASE_COMBUSTION_COUNT,
    payload: { combustionPlayedCount },
  };
};
// Etats Vulnerabilite et Faiblesse
export const activateVulnerabiliteForPlayer = () => ({
  type: ACTIVATE_VULNERABILITE_FOR_PLAYER,
});
export const deactivateVulnerabiliteForPlayer = () => ({
  type: DEACTIVATE_VULNERABILITE_FOR_PLAYER,
});
export const activateFaiblesseForPlayer = () => ({
  type: ACTIVATE_FAIBLESSE_FOR_PLAYER,
});
export const deactivateFaiblesseForPlayer = () => ({
  type: DEACTIVATE_FAIBLESSE_FOR_PLAYER,
});
export const handleFaiblesseVulnerabiliteForPlayer = () => ({
  type: HANDLE_FAIBLESSE_VULNERABILITE_PLAYER,
});
// carte Colère (création d'une copie)
export const addColereCopy = (id) => ({
  type: ADD_COLERE_COPY,
  payload: { id },
});
// carte Hébétement
export const fetchCarteHebetementSuccess = (carteHebetement) => ({
  type: FETCH_CARTE_HEBETEMENT_SUCCESS,
  payload: carteHebetement,
});

// Action creator pour ajouter la carte à la pioche
export const addCardHebetement = (cardName) => {
  return async (dispatch) => {
    try {
      // Faire la requête à l'API pour récupérer la carte par son nom
      const response = await fetch(
        `https://tcg-backend.onrender.com/api/card-form/findCardByName/${cardName}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      // Assurez-vous de traiter la réponse en tant que JSON
      const responseData = await response.json();

      // La réponse a une structure comme { name, description, value, cost, rarity, type }
      const carteHebetement = {
        card: {
          name: responseData.name,
          description: responseData.description,
          value: responseData.value,
          cost: responseData.cost,
          rarity: responseData.rarity,
          type: responseData.type,
          imageURL: responseData.imageURL,
        },
        id: uuidv4(), // Utilisation d'uuid pour générer un identifiant unique
        quantity: 1,
      };
      // Dispatch l'action pour indiquer que la carte a été récupérée avec succès
      dispatch(fetchCarteHebetementSuccess(carteHebetement));

      // Dispatch l'action pour ajouter la carte à la pioche
      dispatch({
        type: ADD_CARTE_HEBETEMENT,
        payload: carteHebetement,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la carte:", error);
      // Vous pouvez gérer l'erreur ici, par exemple, en dispatchant une action d'échec
    }
  };
};
// Action pour réduire le coût du mana selon la carte jouée
export const ManaCost = (mana) => {
  return {
    type: MANA_COST,
    payload: {
      mana,
    },
  };
};
// Action pour infliger les dégâts
export const MonsterAttack = (damageValue) => {
  return {
    type: MONSTER_ATTACK,
    payload: {
      damageValue,
    },
  };
};
// Action pour mettre à jour l'armure
export const updateArmor = (armorValue) => {
  console.log("Action dispatched with payload:", armorValue);

  return {
    type: UPDATE_ARMOR,
    payload: { armorValue },
  };
};
export const resetArmor = () => {
  return {
    type: RESET_ARMOR,
  };
};
// Initialisations (tour, mana, pioche, HP, Combustion)
export const initializeCurrentTurn = (currentTurn) => {
  return {
    type: INITIALIZE_CURRENT_TURN,
    payload: {
      currentTurn,
    },
  };
};
export const initializeCurrentMana = (manaPool) => {
  return {
    type: INITIALIZE_CURRENT_MANA,
    payload: {
      manaPool,
    },
  };
};

export const initializeCurrentPlayerHP = (HP) => {
  return {
    type: INITIALIZE_CURRENT_PLAYER_HP,
    payload: {
      HP,
    },
  };
};
export const initializeCombustionCount = (count) => {
  return {
    type: INITIALIZE_COMBUSTION_COUNT,
    payload: {
      count,
    },
  };
};

export const initializePlayerPioche = (pioche) => {
  // Initialise la pioche en ajoutant un identifiant unique à chaque carte au moment de l'initialisation
  const piocheWithUniqueId = pioche.map((piocheItem) => ({
    ...piocheItem,
    id: uuidv4(), // Utilisez un identifiant unique pour chaque carte dans la pioche
  }));

  // Prend en compte la quantité de chaque carte
  const piocheWithQuantity = piocheWithUniqueId.reduce((acc, card) => {
    for (let i = 0; i < card.quantity; i++) {
      acc.push({ card: card.card, id: uuidv4(), quantity: 1 });
    }
    return acc;
  }, []);

  return {
    type: INITIALIZE_PLAYER_PIOCHE,
    payload: { pioche: piocheWithQuantity },
  };
};

// Action pour ajouter une carte à la défausse et la retirer de la pioche
export const addCardToDefausseAndRemoveFromPioche = (card, id) => ({
  type: ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_PIOCHE,
  payload: { card, id, quantity: 1 },
});
// Action pour ajouter une carte à la défausse et la retirer de la main
export const addCardToDefausseAndRemoveFromMain = (card, id) => ({
  type: ADD_CARD_TO_DEFAUSSE_AND_REMOVE_FROM_MAIN,
  payload: { card, id, quantity: 1 },
});
//Action pour enlever une carte de la main
export const removeCardFromMain = (cardId) => ({
  type: REMOVE_CARD_FROM_MAIN,
  payload: cardId,
});
// Fin du tour, les cartes de la main non jouées vont dans la défausse
export const moveCardsToDefausse = () => ({
  type: MOVE_CARDS_TO_DEFAUSSE,
});
// Action pour fetch 5 cartes depuis la pioche
export const fetch5CardsFromPioche = () => ({
  type: FETCH_5CARDS_FROM_PIOCHE,
});
// Action pour fetch une carte depuis la pioche
export const fetchCardFromPioche = () => ({
  type: PIOCHER_UNE_CARTE,
});
export const checkAndFetchCards = () => ({
  type: CHECK_AND_FETCH_CARDS,
});
export const setCardAnimationActive = (isActive) => ({
  type: SET_CARD_ANIMATION_ACTIVE,
  payload: isActive,
});
export const setBuffAnimationActive = (isActive) => ({
  type: SET_BUFF_ANIMATION_ACTIVE,
  payload: isActive,
});
