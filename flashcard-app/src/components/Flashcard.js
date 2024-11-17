import React from "react";
import "./Flashcard.css";

const Flashcard = ({ flashcard, onDelete }) => {
  return (
    <div className="flashcard">
      <div className="flashcard-content">
        <h3>{flashcard.question}</h3>
        <p>{flashcard.answer}</p>
      </div>
      <button
        className="delete-button"
        onClick={() => onDelete(flashcard._id)} // Ensure this calls the passed onDelete function
      >
        Delete
      </button>
    </div>
  );
};

export default Flashcard;
