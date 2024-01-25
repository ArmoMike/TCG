import React, { useState, useEffect } from "react";

const CardForm = () => {
  const [successfulMessage, setSuccessfulMessage] = useState("");

  // représente le modèle de carte
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rarity: "Commune", // correspond à la valeur par défaut, voir le form
    type: "Attack",
    value: 0,
    cost: 0,
    imageURL: "",
    upgradedValue: 0,
    upgradedImageURL: "",
  });

  //passe la valeur à l'input lorsqu'il est modifié
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Ce qu'il se passe quand on clique sur "submit": envoi à la BDD
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    fetch("https://tcg-backend.onrender.com/api/card-form/createcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error creating card", data.error);
        } else {
          console.log("Card created successfully", data);
          setSuccessfulMessage("Card created successfully");
          // Optionally reset the form or perform other actions
        }
      })
      .catch((error) => {
        console.error("Error creating card", error);
      });
  };

  // GetAllCards
  const [cards, setCards] = useState([]); // Initialize cards as an empty array
  const [skillCount, setSkillCount] = useState(0);
  const [attackCount, setAttackCount] = useState(0);
  const [powerCount, setPowerCount] = useState(0);

  useEffect(() => {
    // Fetch existing cards and update the 'cards' state
    fetch("https://tcg-backend.onrender.com/api/card-form/getcards")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching cards", data.error);
        } else {
          setCards(data.cards); // Update the 'cards' state with the fetched data
          setSkillCount(data.skillCount);
          setAttackCount(data.attackCount);
          setPowerCount(data.powerCount);
        }
      })
      .catch((error) => {
        console.error("Error fetching cards", error);
      });
  }, []); // The empty dependency array ensures this effect runs once on component mount
  const inputStyle = {
    color: "darkblue",
    /* Autres styles nécessaires */
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom (required):</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="description">Description (required):</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="type">Type (required):</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: "250px", height: "30px" }}
          >
            <option value="Attack" defaultValue>
              Attack
            </option>
            <option value="Skill">Skill</option>
            <option value="Power">Power</option>
          </select>
        </div>

        <div>
          <label htmlFor="rarity">Rareté (required):</label>
          <select
            id="rarity"
            name="rarity"
            value={formData.rarity}
            onChange={handleChange}
            style={{ width: "250px", height: "30px" }}
          >
            <option value="Commune" defaultValue>
              Commune
            </option>
            <option value="Départ">Départ</option>
            <option value="Rare">Rare</option>
          </select>
        </div>

        <div>
          <label htmlFor="value">Valeur (required):</label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="cost">Coût (required):</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="imageURL">Image URL:</label>
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="upgradedValue">Valeur après amélioration:</label>
          <input
            type="number"
            id="upgradedValue"
            name="upgradedValue"
            value={formData.upgradedValue}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="upgradedImageURL">
            {" "}
            Image URL après amélioration:
          </label>
          <input
            type="text"
            id="upgradedImageURL"
            name="upgradedImageURL"
            value={formData.upgradedImageURL}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <button type="submit">Enregistrer dans BDD</button>
        <p>{successfulMessage}</p>
      </form>

      {/* Existing cards */}
      <div>
        <div>
          {/* Display the counts */}
          <div>Skill Cards: {skillCount}</div>
          <div>Attack Cards: {attackCount}</div>
          <div>Power Cards: {powerCount}</div>
        </div>
        <h2>Existing Cards:</h2>
        <ul>
          {cards.map((card) => (
            <li
              key={card._id}
              style={{
                color:
                  card.type.toLowerCase() === "attack"
                    ? "red"
                    : card.type.toLowerCase() === "skill"
                    ? "blue"
                    : "green",
              }}
            >
              {card.name} / Coût: {card.cost} / {card.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CardForm;
