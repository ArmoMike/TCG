import React, { useState, useEffect } from "react";
import "../CSS/StatsBar.css";

const StatsBar = ({
  HPValue,
  currentHealth,
  currentMana,
  manaPool,
  isPlayer,
  armor,
}) => {
  const [initialHealth, setInitialHealth] = useState(null);

  useEffect(() => {
    if (HPValue !== null && initialHealth === null) {
      // console.log("Setting initial health:", HPValue);
      setInitialHealth(HPValue);
    }
  }, [HPValue]); // Add keyForRemount to the dependency array

  if (initialHealth === null) {
    return <p>Chargement...</p>;
  }

  const percentageRemaining = (currentHealth / HPValue) * 100;

  let greenWidth = percentageRemaining;
  let redWidth = 0;

  if (percentageRemaining <= 30) {
    greenWidth = 0;
    redWidth = percentageRemaining;
  }

  return (
    <div className="hp-bar">
      <div
        className="hp-fill hp-green"
        style={{ width: `${greenWidth}%` }}
      ></div>
      <div className="hp-fill hp-red" style={{ width: `${redWidth}%` }}></div>
      <p className="hp-number">
        {currentHealth}/{HPValue}
      </p>
      {isPlayer ? (
        <div className="manadisplay">
          {currentMana}/{manaPool}
        </div>
      ) : null}
      {armor > 0 && (
        <div
          className="armordisplay"
          style={{ width: "30px", height: "30px", marginTop: "30px" }}
        >
          <img src="/assets/shield.png" alt="Armor icon" />
          <span className="armor-text">{armor}</span>
        </div>
      )}
    </div>
  );
};

export default StatsBar;
