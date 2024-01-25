import ReactModal from "react-modal";
import { connect, useDispatch, useSelector } from "react-redux";
import { addToDeck, closeModal } from "../redux/actions/card.action";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Ajoutez ceci

const Modal = ({ modalIsOpen, closeModal, addToDeck }) => {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const rewardCards = useSelector((state) => state.card.rewardCards);
  const playerInfo = useSelector((state) => state.player.playerInfo);
  const { mapLevel } = useParams();

  const handleRewardSelection = async (selectedCard) => {
    const userEmail = user.email;

    try {
      // Vous pouvez accéder directement à playerInfo dans le state avec useSelector
      if (mapLevel && mapLevel <= playerInfo.levelReached) {
        await dispatch(addToDeck(userEmail, selectedCard));
        closeModal();
      } else {
        console.log("Niveau insuffisant pour la récompense.");
        // Vous pouvez également choisir de ne pas fermer la modal dans ce cas
      }
    } catch (error) {
      console.error("Error in handleRewardSelection:", error);
      // Gérez l'erreur selon vos besoins
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker semi-transparent background
      zIndex: 1000,
    },
    content: {
      width: "750px", // Adjusted width
      height: "550px", // Adjusted height
      margin: "auto",
      borderRadius: "10px", // Rounded corners
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Drop shadow
      background: "linear-gradient(to bottom, #1a1a1a, #333333)", // Gradient background
      border: "2px solid #fff", // White border
      color: "#fff", // Text color
      fontFamily: "Arial, sans-serif", // Font family
    },
  };

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={customStyles}
    >
      <div
        // style du texte "Félicitations ! Vous avez remporté la victoire ! Choisissez une récompense."
        style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "80px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {mapLevel && mapLevel >= playerInfo.levelReached ? (
          <p>
            Félicitations ! Vous avez remporté la victoire ! Choisissez une
            récompense. Map level: {mapLevel}
          </p>
        ) : (
          <p>
            Vous avez déjà terminé ce niveau précédemment. Aucune récompense
            obtenue.
          </p>
        )}
      </div>

      {mapLevel && mapLevel >= playerInfo.levelReached ? (
        <div className="card-align-modal">
          {rewardCards.map((card) => (
            <div
              className="card-container-modal"
              key={card._id}
              onClick={() => handleRewardSelection(card)}
            >
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <img
                  src={card.imageURL}
                  alt={card.name}
                  style={{ padding: "20px" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div>
        <div
          // position du bouton "fermer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            style={{
              border: "none",
              color: "#ffffff",
              padding: "15px 30px",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "18px",
              backgroundColor: "#3498db",
              borderRadius: "30px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              position: "fixed",
              marginTop: " 80px",
            }}
            onClick={closeModal}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2980b9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3498db";
            }}
          >
            Fermer
          </button>
        </div>{" "}
      </div>
    </ReactModal>
  );
};

const mapStateToProps = (state) => ({
  modalIsOpen: state.card.modalIsOpen,
  rewardCards: state.card.rewardCards,
});
const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  addToDeck: (userEmail, selectedCard) =>
    dispatch(addToDeck(userEmail, selectedCard)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
