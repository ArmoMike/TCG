import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDispatch } from "react-redux";
import {
  fetchPlayer,
  initializePlayerPioche,
} from "../redux/actions/player.action";

import "../CSS/Map.css";
import Navbar from "../components/Navbar";

const Map = () => {
  // Using the useAuthContext hook to get the user information
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  // State to store the level reached by the user and loading state
  const [levelReached, setLevelReached] = useState(1);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch player data when the component mounts or when the user changes
  useEffect(() => {
    // Check if a user is available
    if (user) {
      const userEmail = user.email;
      // Dispatch the action to fetch player data from the API using Redux
      dispatch(fetchPlayer(userEmail))
        .then((data) => {
          // Log the received player data and update the state
          setLevelReached(data.levelReached);
          setLoading(false);
          // rajout de cette ligne pour réinitialiser la pioche et la défausse après un combat (lors du retour au map)
          dispatch(initializePlayerPioche([])); // initialise la défausse à un tableau vide également
          console.log("map.js useEffect data: ", data);
        })
        .catch((error) => {
          // Log an error if fetching data fails and set loading to false
          console.error("Error fetching player data:", error);
          setLoading(false);
        });
    }
  }, [dispatch, user]); // Include dispatch in the dependency array to avoid lint warnings

  // Function to determine if a map button is clickable based on the level reached
  const isButtonClickable = (buttonLevel) => {
    return buttonLevel <= levelReached;
  };

  // Render the map buttons using an array of levels
  return (
    <div className="mapStyle">
      <Navbar />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((buttonLevel) => (
        <React.Fragment key={buttonLevel}>
          {isButtonClickable(buttonLevel) ? (
            // Render a clickable link if the button is clickable
            <Link
              to={`/combat/${buttonLevel}`}
              className={`map-button button-${buttonLevel} clickable ${
                buttonLevel === 10 ? "level-10" : ""
              }`}
            >
              {buttonLevel === 10 ? (
                // Include the dragon icon for level 10
                <i className="fa fa-brands fa-phoenix-framework"></i>
              ) : (
                // Include a flag icon for other levels
                <i className="fa fa-flag"></i>
              )}
            </Link>
          ) : (
            <div style={{ display: "none" }}>
              <i className="fa fa-lock"></i>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Map;
