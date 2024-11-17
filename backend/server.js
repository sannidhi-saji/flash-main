const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/flashcardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Flashcard schema
const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: String,
  nextReviewDate: Date, // For spaced repetition
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

// Routes
app.get("/flashcards", async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.status(200).json(flashcards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

app.post("/flashcards", async (req, res) => {
  try {
    const flashcard = new Flashcard({ ...req.body, nextReviewDate: new Date() });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (err) {
    res.status(500).json({ error: "Failed to create flashcard" });
  }
});

app.put("/flashcards/:id", async (req, res) => {
  try {
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedFlashcard);
  } catch (err) {
    res.status(500).json({ error: "Failed to update flashcard" });
  }
});

app.delete("/flashcards/:id", async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.status(200).send("Flashcard deleted");
  } catch (err) {
    res.status(500).json({ error: "Failed to delete flashcard" });
  }
});

// Spaced repetition endpoint (Mark a flashcard as reviewed)
app.post("/flashcards/review/:id", async (req, res) => {
  try {
    const { correct } = req.body;
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) return res.status(404).send("Flashcard not found");

    const currentDate = new Date();
    flashcard.nextReviewDate = correct
      ? new Date(currentDate.setDate(currentDate.getDate() + 3)) // Push review 3 days forward
      : new Date(currentDate.setDate(currentDate.getDate() + 1)); // Push review 1 day forward

    await flashcard.save();
    res.status(200).json(flashcard);
  } catch (err) {
    res.status(500).json({ error: "Failed to review flashcard" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
