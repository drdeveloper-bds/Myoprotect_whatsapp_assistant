const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    console.log("Message:", message);

    // Dummy AI response (replace later with Groq)
    const reply = `You said: ${message}`;

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});