import React, { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./components/Flashcard";
import FlashcardForm from "./components/FlashcardForm";
import "./App.css";

const App = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [theme, setTheme] = useState("light");

  // Fetch flashcards from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/flashcards")
      .then((response) => setFlashcards(response.data))
      .catch((error) => console.error("Error fetching flashcards:", error));
  }, []);

  // Add a new flashcard
  const addFlashcard = (newFlashcard) => {
    axios
      .post("http://localhost:5000/flashcards", newFlashcard)
      .then((response) => setFlashcards([...flashcards, response.data]))
      .catch((error) => console.error("Error adding flashcard:", error));
  };

  // Delete a flashcard
  const deleteFlashcard = (id) => {
    axios
      .delete(`http://localhost:5000/flashcards/${id}`)
      .then(() => setFlashcards(flashcards.filter((f) => f._id !== id)))
      .catch((error) => console.error("Error deleting flashcard:", error));
  };

  // Edit a flashcard
  const editFlashcard = (id, updatedData) => {
    axios
      .put(`http://localhost:5000/flashcards/${id}`, updatedData)
      .then((response) => {
        setFlashcards(
          flashcards.map((f) =>
            f._id === id ? { ...f, ...response.data } : f
          )
        );
      })
      .catch((error) => console.error("Error editing flashcard:", error));
  };

  // Filter flashcards
  const filteredFlashcards = flashcards.filter(
    (flashcard) =>
      flashcard.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!categoryFilter || flashcard.category === categoryFilter)
  );

  // Toggle dark mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.body.className = theme === "light" ? "dark" : "light";
  };

  return (
    <div className={`App ${theme}`}>
      <h1>Flashcard App</h1>
      <button onClick={toggleTheme}>Toggle {theme === "light" ? "Dark" : "Light"} Mode</button>
      <input
        type="text"
        placeholder="Search flashcards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Math">Math</option>
        <option value="Science">Science</option>
        <option value="Languages">Languages</option>
      </select>
      <FlashcardForm onAddFlashcard={addFlashcard} />
      <div className="flashcard-list">
        {filteredFlashcards.map((flashcard) => (
          <Flashcard
            key={flashcard._id}
            flashcard={flashcard}
            onDelete={deleteFlashcard}
            onEdit={editFlashcard}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
