// HoverButton.js
import React, { useState } from "react";
const HoverButton = ({ icon, hoverMessage }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="hover-message"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <div className="info-icon">{icon}</div>
      <div className="info-message-container">
        {isHovered &&
          hoverMessage
            .split("\n")
            .map((line, index) => <span key={index}>{line}</span>)}
      </div>
    </div>
  );
};

export default HoverButton;
