import React, { useState, useEffect } from "react";
import stslogo from "../assets/stslogo.png";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import "../CSS/Navbar.css";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleClick = () => {
    logout();
    setMenuVisible(false); // Close the menu after logout
    window.location.href = "/"; // Redirect to home page
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Close the menu if clicked outside of it
      if (menuVisible && !event.target.closest(".menu-container")) {
        setMenuVisible(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuVisible]);
  const isInCombatComponent = location.pathname.includes("/combat");

  return (
    <div className="menu-container">
      <div className="menu-icon" onClick={toggleMenu}>
        <span>&#9776;</span>
      </div>

      <nav className={`menu ${menuVisible ? "open" : ""}`}>
        <Link to="/map" onClick={() => setMenuVisible(false)}>
          <img src={stslogo} alt="oui" className="logo-img" />
        </Link>
        {user ? (
          <>
            <div className="UserEmail">{user.email}</div>
            <div>
              <Link to="/rules" onClick={() => setMenuVisible(false)}>
                Règles du jeu
              </Link>
            </div>
            {isInCombatComponent && (
              <div>
                <Link to="/map" onClick={() => setMenuVisible(false)}>
                  Retourner à la carte
                </Link>
              </div>
            )}
            <div>
              <button onClick={handleClick}>Déconnexion</button>
            </div>
          </>
        ) : (
          <div>
            <Link to="/login" onClick={() => setMenuVisible(false)}>
              Continuer
            </Link>
            <br />
            <Link to="/signup" onClick={() => setMenuVisible(false)}>
              Nouveau jeu
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
