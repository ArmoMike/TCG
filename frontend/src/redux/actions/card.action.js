// Fetch des cartes
export const FETCH_REWARD_CARDS_SUCCESS = "FETCH_REWARD_CARDS_SUCCESS";
export const FETCH_ALL_CARDS_SUCCESS = "FETCH_ALL_CARDS_SUCCESS";
export const CREATE_CARD = "CREATE_CARD";
export const FETCH_CARDS = "FETCH_CARDS";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const CARD_ADDED_TO_DECK = "CARD_ADDED_TO_DECK";
export const SELECT_REWARD_CARD = "SELECT_REWARD_CARD";

//Action creator for CardForm
export const createCard = (formData) => {
  return {
    type: CREATE_CARD,
    payload: formData,
  };
};
// Action creator for fetching cards
export const fetchCards = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://tcg-backend.onrender.com/api/card-form/getcards"
      );
      if (!response.ok) {
        throw new Error("La requête a échoué (cards introuvables)");
      }

      const data = await response.json();
      dispatch({ type: FETCH_CARDS, payload: data.cards });
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes:", error);
    }
  };
};

export const fetchAllCardsSuccess = (cards) => ({
  type: FETCH_ALL_CARDS_SUCCESS,
  payload: cards,
});

export const selectRewardCard = (selectedCard) => ({
  type: SELECT_REWARD_CARD,
  payload: selectedCard,
});

export const fetchRewardCards = (level) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        `https://tcg-backend.onrender.com/api/card-form/getRewardCards/${level}`
      );
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: FETCH_REWARD_CARDS_SUCCESS, payload: data });
        const { card } = getState();
        // console.log("card State dans REWARD PLAYER", card);
        // Accéder aux données des cartes depuis le state après avoir dispatché fetchRewardCards
        const rewardCards = card.rewardCards;
        // Dispatch l'action pour ouvrir la modal avec les cartes
        // console.log("Dispatching openModal with rewardCards:", rewardCards);
        dispatch(openModal(rewardCards));
      } else {
        // Handle the error, dispatch an error action, etc.
      }
    } catch (error) {
      // Handle the error, dispatch an error action, etc.
    }
  };
};
export const openModal = (rewardCards) => ({
  type: OPEN_MODAL,
  payload: { rewardCards },
});

export const closeModal = () => {
  // Ajoutez votre redirection ici
  window.location.href = "/";
  return {
    type: CLOSE_MODAL,
  };
};

// Thunk action to fetch all cards
export const fetchAllCards = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://tcg-backend.onrender.com/api/card-form/getAllCards"
      );
      const data = await response.json();
      dispatch(fetchAllCardsSuccess(data.cards));
    } catch (error) {
      // Handle the error, dispatch an error action, etc.
    }
  };
};
export const addToDeck = (userEmail, selectedCard) => async (dispatch) => {
  try {
    console.log(
      "Adding card to deck (addtodeck, card action):",
      userEmail,
      selectedCard
    );

    const response = await fetch(
      `https://tcg-backend.onrender.com/api/player/add-to-deck`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, selectedCard }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add card to deck");
    }
    const data = await response.json();

    //console.log("Data after adding card to deck:", data);

    // Dispatcher une action pour mettre à jour le state Redux si nécessaire
    dispatch(cardAddedToDeck(selectedCard));
  } catch (error) {
    console.error("Error adding card to deck:", error);
    // Gérer l'erreur selon vos besoins
  }
};

export const cardAddedToDeck = (selectedCard) => ({
  type: CARD_ADDED_TO_DECK,
  payload: { selectedCard },
});
