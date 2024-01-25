// HomeStart.jsx
import React from "react";
import "../CSS/HomeStart.css";
import { Link } from "react-router-dom";
import stslogo from "../assets/stslogo.png";
import { NavLink } from "react-router-dom";

const HomeStart = () => {
  return (
    <div className="homestart background-image">
      <NavLink className="navbar-brand" to="/">
        <img src={stslogo} alt="logo slay the spire"></img>
      </NavLink>
      <header className="homestart-header">
        <h1>TCG</h1>
        <div className="homestart-buttons-container">
          <Link to="/signup" className="homestart-button">
            Nouveau jeu
          </Link>
          <Link to="/login" className="homestart-button">
            Continuer
          </Link>
          <Link to="/rules" className="homestart-button">
            Règles du jeu
          </Link>
        </div>
      </header>
    </div>
  );
};

export default HomeStart;
