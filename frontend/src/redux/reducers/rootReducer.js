import { combineReducers } from "redux";
// Import your reducers here
import monsterReducer from "./monsterReducer";
import playerReducer from "./playerReducer";
import cardReducer from "./cardReducer";
import gameReducer from "./gameReducer";

const rootReducer = combineReducers({
  monster: monsterReducer,
  player: playerReducer,
  card: cardReducer,
  game: gameReducer,
});

export default rootReducer;
