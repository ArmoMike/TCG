// game.reducer.js
import { VICTORY, DEFEAT, RESET_VICTORY } from "../actions/game.action";

const initialState = {
  isVictory: false,
  isDefeat: false,
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case VICTORY:
      return {
        ...state,
        isVictory: true,
        isDefeat: false, // Reset defeat status
      };
    case DEFEAT:
      return {
        ...state,
        isVictory: false, // Reset victory status
        isDefeat: true,
      };
    case RESET_VICTORY:
      return {
        ...state,
        isVictory: false,
        isDefeat: false,
      };
    default:
      return state;
  }
};

export default gameReducer;
