export const FETCH_MONSTER_INFO_SUCCESS = "FETCH_MONSTER_INFO_SUCCESS";
export const FETCH_MONSTER_INFO_FAILURE = "FETCH_MONSTER_INFO_FAILURE";
export const DEGATS_SUBIS = "DEGATS_SUBIS";
export const INITIALIZE_CURRENT_HP = "INITIALIZE_CURRENT_HP";
export const UPDATE_MONSTER_ARMOR = "UPDATE_MONSTER_ARMOR";
export const RESET_MONSTER_ARMOR = "RESET_MONSTER_ARMOR";
export const TOGGLE_ATTACK_ANIMATION = "TOGGLE_ATTACK_ANIMATION";
// Etats Vulnerabilite et Faiblesse
export const ACTIVATE_VULNERABILITE_FOR_MONSTER =
  "ACTIVATE_VULNERABILITE_FOR_MONSTER";
export const DEACTIVATE_VULNERABILITE_FOR_MONSTER =
  "DEACTIVATE_VULNERABILITE_FOR_MONSTER";
export const ACTIVATE_FAIBLESSE_FOR_MONSTER = "ACTIVATE_FAIBLESSE_FOR_MONSTER";
export const DEACTIVATE_FAIBLESSE_FOR_MONSTER =
  "DEACTIVATE_FAIBLESSE_FOR_MONSTER";
export const HANDLE_FAIBLESSE_VULNERABILITE_MONSTER =
  "HANDLE_FAIBLESSE_VULNERABILITE_MONSTER";

export const fetchMonsterInfoSuccess = (monsterInfo) => ({
  type: FETCH_MONSTER_INFO_SUCCESS,
  payload: monsterInfo,
});

export const fetchMonsterInfoFailure = (error) => ({
  type: FETCH_MONSTER_INFO_FAILURE,
  payload: error,
});
export const toggleAttackAnimation = (isVisible) => {
  return {
    type: TOGGLE_ATTACK_ANIMATION,
    payload: isVisible,
  };
};

export const fetchMonster = (mapLevel) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://tcg-backend.onrender.com/api/monsters/${mapLevel}`
    );
    if (!response.ok) {
      throw new Error("La requête a échoué");
    }
    const monsterInfo = await response.json();
    dispatch(fetchMonsterInfoSuccess(monsterInfo));
    dispatch(InitializeMonsterHP(monsterInfo.health));
  } catch (error) {
    dispatch(fetchMonsterInfoFailure(error.message));
    throw error;
  }
};

// Action pour infliger les dégâts
export const DegatsSubis = (damageValue) => {
  return {
    type: DEGATS_SUBIS,
    payload: {
      damageValue,
    },
  };
};

export const InitializeMonsterHP = (health) => {
  return {
    type: INITIALIZE_CURRENT_HP,
    payload: {
      health,
    },
  };
};

export const updateMonsterArmor = (armorValue) => ({
  type: UPDATE_MONSTER_ARMOR,
  payload: { armorValue },
});

export const resetMonsterArmor = () => ({
  type: RESET_MONSTER_ARMOR,
});
// Etats Vulnerabilite et Faiblesse
export const activateVulnerabiliteForMonster = () => ({
  type: ACTIVATE_VULNERABILITE_FOR_MONSTER,
});
export const deactivateVulnerabiliteForMonster = () => ({
  type: DEACTIVATE_VULNERABILITE_FOR_MONSTER,
});
export const activateFaiblesseForMonster = () => ({
  type: ACTIVATE_FAIBLESSE_FOR_MONSTER,
});
export const deactivateFaiblesseForMonster = () => ({
  type: DEACTIVATE_FAIBLESSE_FOR_MONSTER,
});
export const handleFaiblesseVulnerabiliteForMonster = () => ({
  type: HANDLE_FAIBLESSE_VULNERABILITE_MONSTER,
});
