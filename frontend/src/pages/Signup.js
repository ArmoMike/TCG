import React from "react";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import HoverButton from "../components/HoverButton";
import { FaInfoCircle, FaKey } from "react-icons/fa"; // Importation d'icônes

import "../CSS/User.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };

  return (
    <div className="signuplogin-bg">
      <form onSubmit={handleSubmit} className="signup">
        <h3>Nouveau jeu</h3>
        <label>Email</label>
        {/* e.target.value :
    e est l'event. target est l'input. value est la valeur de ce qui est rentré par l'user */}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label>Password</label>
        {/* e.target.value :
    e est l'event. target est l'input. value est la valeur de ce qui est rentré par l'user */}
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="hoverbutton-container">
          {/* Icône pour le message sur le mot de passe */}
          <HoverButton
            icon={<FaKey size={20} />}
            hoverMessage="Le mot de passe doit contenir : 1 caractère en majuscule, 3 caractères en minuscules, 3 chiffres et un caractère spécial. Ex: Abcd123!"
          />

          {/* Icône pour le message sur l'authentification */}
          <HoverButton
            icon={<FaInfoCircle size={20} />}
            hoverMessage="Le serveur backend pourrait être inactif si inutilisé longtemps. Si l'authentification ne fait rien, recommencez dans une vingtaine de secondes après votre premier essai. Promis, ça va marcher !"
          />
        </div>
        {/* disabled={isLoading} parce qu'on ne veut pas envoyer de nouvelle requête tant qu'il y a le chargement d'une autre */}
        <button disabled={isLoading}>Commencer à jouer</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
