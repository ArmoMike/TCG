import {
  FETCH_REWARD_CARDS_SUCCESS,
  OPEN_MODAL,
  CLOSE_MODAL,
  CARD_ADDED_TO_DECK,
  SELECT_REWARD_CARD,
} from "../actions/card.action"; // Importez l'action type

// État initial de votre reducer
const initialState = {
  rewardCards: [],
  selectedRewardCard: null,
  modalIsOpen: false,
};

const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REWARD_CARDS_SUCCESS:
      return {
        ...state,
        rewardCards: action.payload,
      };
    case SELECT_REWARD_CARD:
      return {
        ...state,
        selectedRewardCard: action.payload,
      };
    case OPEN_MODAL:
      return {
        ...state,
        modalIsOpen: true,
        rewardCards: action.payload.rewardCards,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modalIsOpen: false,
        rewardCards: [],
      };
    case CARD_ADDED_TO_DECK:
      return {
        ...state,
        rewardCards: [],
      };
    default:
      return state;
  }
};

export default cardReducer;
