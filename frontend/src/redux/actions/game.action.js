import { fetchPlayer } from "./player.action";

export const VICTORY = "VICTORY";
export const DEFEAT = "DEFEAT";
export const RESET_VICTORY = "RESET_VICTORY";
export const victory = () => ({
  type: VICTORY,
});

export const defeat = () => ({
  type: DEFEAT,
});

export const resetVictory = () => ({
  type: RESET_VICTORY,
});

export const handleVictory =
  (userEmail, mapLevel) => async (dispatch, getState) => {
    try {
      // Check if a user is available
      if (userEmail) {
        // Dispatch the action to fetch player data from the API using Redux
        const playerData = await dispatch(fetchPlayer(userEmail));

        // Check if the player's already beaten the level, if true, don't increment
        if (playerData.levelReached <= parseInt(mapLevel, 10)) {
          const newLevelReached = playerData.levelReached + 1;

          // Make a server request to update the levelReached
          const response = await fetch(
            `https://tcg-backend.onrender.com/api/player/update-level`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userEmail, newLevelReached }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update levelReached");
          }
        }

        // console.log("VICTORY action dispatched");
        // Log the updated state
        //console.log("Updated state:", getState());
        dispatch(victory());
      }
    } catch (error) {
      console.error("Error handling victory:", error);
      // Handle error as needed
    }
  };

export const handleDefeat = () => (dispatch) => {
  try {
    // Dispatch the DEFEAT action
    dispatch(defeat());
  } catch (error) {
    console.error("Error handling defeat:", error);
    // Handle error as needed
  }
};
