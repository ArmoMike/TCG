import React from "react";
import "../CSS/AttackInfo.css";

const AttackInfo = ({ attacker, type, value }) => {
  const isPlayer = attacker === "player";

  return (
    <div className={`attack-info ${isPlayer ? "player" : "monster"}`}>
      {isPlayer ? (
        <>
          {type === "playerArmor" && `Le joueur reçoit ${value} d'armure`}
          {type === "playerDamage" &&
            `Le joueur attaque pour ${value} de dégâts!`}
          {type === "playerVulnerability" &&
            `Player inflicts vulnerability with ${value} damage!`}
        </>
      ) : (
        <>
          {type === "monsterArmor" &&
            `Le monstre augmente son armure de ${value}!`}
          {type === "monsterDamage" &&
            `Le monstre attaque pour ${value} de dégâts!`}
        </>
      )}
    </div>
  );
};

export default AttackInfo;
