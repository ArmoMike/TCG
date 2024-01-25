import {
  FETCH_MONSTER_INFO_SUCCESS,
  FETCH_MONSTER_INFO_FAILURE,
  DEGATS_SUBIS,
  INITIALIZE_CURRENT_HP,
  UPDATE_MONSTER_ARMOR,
  RESET_MONSTER_ARMOR,
  HANDLE_FAIBLESSE_VULNERABILITE_MONSTER,
  ACTIVATE_VULNERABILITE_FOR_MONSTER,
  DEACTIVATE_VULNERABILITE_FOR_MONSTER,
  ACTIVATE_FAIBLESSE_FOR_MONSTER,
  DEACTIVATE_FAIBLESSE_FOR_MONSTER,
  TOGGLE_ATTACK_ANIMATION,
} from "../actions/monster.action";

const initialState = {
  monsterInfo: null, // Informations du monstre
  monsterFaiblesseActivated: false,
  monsterVulnerabiliteActivated: false,
  monsterFaiblesseCount: 0,
  monsterVulnerabiliteCount: 0,
  currentHealth: 0,
  armor: 0,
  attackAnimationVisible: false,
};

const monsterReducer = (state = initialState, action) => {
  switch (action.type) {
    // fetch des infos du monstre
    case FETCH_MONSTER_INFO_SUCCESS:
      //console.log("Monster Info received:", action.payload);
      return {
        ...state,
        monsterInfo: action.payload,
      };

    case FETCH_MONSTER_INFO_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case INITIALIZE_CURRENT_HP:
      return {
        ...state,
        currentHealth: action.payload.health,
      };

    case UPDATE_MONSTER_ARMOR:
      return {
        ...state,
        armor: Math.max(state.armor + action.payload.armorValue, 0),
      };

    case RESET_MONSTER_ARMOR:
      //console.log("Resetting monster armor to 0");
      return {
        ...state,
        armor: 0,
      };

    case DEGATS_SUBIS:
      // Ensure damageValue and armor are valid numbers
      const damageValue = Number(action.payload.damageValue);
      const armor = Number(state.armor);

      //  console.log("Converted Damage value:", damageValue);
      //  console.log("Converted Armor:", armor);

      if (isNaN(damageValue) || isNaN(armor)) {
        console.error("Invalid damageValue or armor:", damageValue, armor);
        return state;
      }

      // S'il y a de l'armure
      if (armor > 0) {
        // Réduire d'abord l'armure
        const remainingArmor = armor - damageValue;

        // Si l'armure ne suffit pas à absorber toute l'attaque
        if (remainingArmor < 0) {
          const remainingHealth = state.currentHealth + remainingArmor;
          return {
            ...state,
            armor: 0,
            // Ternaire qui permet de ne pas avoir de points de vie négatifs
            currentHealth: remainingHealth < 0 ? 0 : remainingHealth,
          };
        } else {
          // Si l'armure suffit à absorber l'attaque, mettre à jour l'armure
          return {
            ...state,
            armor: remainingArmor,
          };
        }
      } else {
        // S'il n'y a pas d'armure, réduire directement les points de vie
        const newHP = Math.max(state.currentHealth - damageValue, 0);
        // console.log("HP after dmg", newHP);

        return {
          ...state,
          currentHealth: newHP,
        };
      }

    case TOGGLE_ATTACK_ANIMATION:
      return {
        ...state,
        attackAnimationVisible: action.payload, // directly use the payload value
      };

    // Etats Vulnerabilite et Faiblesse
    case ACTIVATE_VULNERABILITE_FOR_MONSTER:
      return {
        ...state,
        monsterVulnerabiliteActivated: true,
        monsterVulnerabiliteCount: state.monsterVulnerabiliteCount + 1,
      };
    case DEACTIVATE_VULNERABILITE_FOR_MONSTER:
      return {
        ...state,
        monsterVulnerabiliteActivated: false,
      };
    case ACTIVATE_FAIBLESSE_FOR_MONSTER:
      return {
        ...state,
        monsterFaiblesseActivated: true,
        monsterFaiblesseCount: state.monsterFaiblesseCount + 1,
      };
    case DEACTIVATE_FAIBLESSE_FOR_MONSTER:
      return {
        ...state,
        monsterFaiblesseActivated: false,
      };
    case HANDLE_FAIBLESSE_VULNERABILITE_MONSTER:
      if (state.monsterFaiblesseActivated) {
        return {
          ...state,
          monsterFaiblesseCount:
            state.monsterFaiblesseCount > 0
              ? state.monsterFaiblesseCount - 1
              : 0,
          monsterFaiblesseActivated: state.monsterFaiblesseCount > 1, // Set to false when count reaches 0
        };
      } else if (state.monsterVulnerabiliteActivated) {
        return {
          ...state,
          monsterVulnerabiliteCount:
            state.monsterVulnerabiliteCount > 0
              ? state.monsterVulnerabiliteCount - 1
              : 0,
          monsterVulnerabiliteActivated: state.monsterVulnerabiliteCount > 1, // Set to false when count reaches 0
        };
      }
      return state;
    default:
      return state;
  }
};

export default monsterReducer;
